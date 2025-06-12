import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getPresignedUrl } from './use-getPresignedUrl';

// Types
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  phase: 'initializing' | 'getting-url' | 'uploading' | 'complete' | 'error';
}

export interface UploadToS3Params {
  presignedUrl: string;
  file: File;
  onProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
}

export interface UploadFileParams {
  file: File;
  onProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
}

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

// File validation utility
const validateFile = (file: File, options: FileValidationOptions = {}): void => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    allowedExtensions = []
  } = options;

  // Size validation
  if (file.size > maxSize) {
    throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(maxSize / 1024 / 1024).toFixed(2)}MB)`);
  }

  // Type validation
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    throw new Error(`File type "${file.type}" is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Extension validation
  if (allowedExtensions.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw new Error(`File extension "${fileExtension}" is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`);
    }
  }
};

// Upload file directly to S3 using presigned URL with progress tracking
const uploadToS3 = async ({ 
  presignedUrl, 
  file, 
  onProgress,
  signal 
}: UploadToS3Params): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Set up progress tracking
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage,
            phase: 'uploading'
          });
        }
      });
    }

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.({
          loaded: file.size,
          total: file.size,
          percentage: 100,
          phase: 'complete'
        });
        resolve();
      } else {
        const error = new Error(`Failed to upload to S3: ${xhr.status} ${xhr.statusText}`);
        onProgress?.({
          loaded: 0,
          total: file.size,
          percentage: 0,
          phase: 'error'
        });
        reject(error);
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      const error = new Error('Network error during S3 upload');
      onProgress?.({
        loaded: 0,
        total: file.size,
        percentage: 0,
        phase: 'error'
      });
      reject(error);
    });

    // Handle abort
    xhr.addEventListener('abort', () => {
      const error = new Error('Upload was cancelled');
      onProgress?.({
        loaded: 0,
        total: file.size,
        percentage: 0,
        phase: 'error'
      });
      reject(error);
    });

    // Handle abort signal
    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
      });
    }

    // Configure and send request
    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    
    // Send the file
    xhr.send(file);
  });
};

// Main function to upload file with comprehensive error handling
const uploadFileToS3 = async ({ 
  file, 
  onProgress, 
  signal 
}: UploadFileParams): Promise<string> => {
  try {
    // Phase 1: Initialize
    onProgress?.({
      loaded: 0,
      total: file.size,
      percentage: 0,
      phase: 'initializing'
    });

    // Phase 2: Get presigned URL
    onProgress?.({
      loaded: 0,
      total: file.size,
      percentage: 5,
      phase: 'getting-url'
    });

    const presignedUrlData = await getPresignedUrl({
      fileName: file.name,
      fileType: file.type
    });

    console.log('Presigned URL Data:', {
      fileKey: presignedUrlData.fileKey,
      bucketName: presignedUrlData.bucketName,
      // Don't log the actual URL for security
      hasUploadURL: !!presignedUrlData.uploadURL
    });

    // Phase 3: Upload to S3 with progress tracking
    await uploadToS3({
      presignedUrl: presignedUrlData.uploadURL,
      file,
      onProgress: (uploadProgress) => {
        // Map upload progress to overall progress (10% - 95%)
        const overallPercentage = 10 + (uploadProgress.percentage * 0.85);
        onProgress?.({
          loaded: uploadProgress.loaded,
          total: uploadProgress.total,
          percentage: overallPercentage,
          phase: uploadProgress.phase
        });
      },
      signal
    });

    // Phase 4: Complete
    onProgress?.({
      loaded: file.size,
      total: file.size,
      percentage: 100,
      phase: 'complete'
    });

    return presignedUrlData.fileURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    
    onProgress?.({
      loaded: 0,
      total: file.size,
      percentage: 0,
      phase: 'error'
    });

    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Upload failed for "${file.name}": ${error.message}`);
    }
    throw new Error(`Upload failed for "${file.name}": Unknown error`);
  }
};

// React Query hook for single file upload
const useUploadFile = (validationOptions?: FileValidationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ file, onProgress, signal }: UploadFileParams & { signal?: AbortSignal }) => {
      // Validate file before upload
      if (validationOptions) {
        validateFile(file, validationOptions);
      }
      
      return uploadFileToS3({ file, onProgress, signal });
    },
    onSuccess: (fileURL, variables) => {
      console.log('File uploaded successfully:', fileURL, variables);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      
      // You can also add the new file to existing cache
      queryClient.setQueryData(['recent-uploads'], (oldData: string[] | undefined) => 
        oldData ? [fileURL, ...oldData.slice(0, 9)] : [fileURL] // Keep last 10 uploads
      );
    },
    onError: (error, variables) => {
      console.error('Upload failed:', {
        fileName: variables.file.name,
        fileSize: variables.file.size,
        fileType: variables.file.type,
        error: error.message
      });
    },
  });
};

// React Query hook for multiple file uploads with queue management
const useUploadMultipleFiles = (validationOptions?: FileValidationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      files, 
      onProgress,
      concurrency = 3 // Upload 3 files at a time
    }: { 
      files: File[];
      onProgress?: (fileIndex: number, fileName: string, progress: UploadProgress, completedCount: number, totalCount: number) => void;
      concurrency?: number;
    }) => {
      const results: string[] = [];
      const errors: Array<{ file: File; error: Error }> = [];
      
      // Process files in batches
      for (let i = 0; i < files.length; i += concurrency) {
        const batch = files.slice(i, i + concurrency);
        
        const batchPromises = batch.map(async (file, batchIndex) => {
          const fileIndex = i + batchIndex;
          
          try {
            if (validationOptions) {
              validateFile(file, validationOptions);
            }
            
            const fileURL = await uploadFileToS3({
              file,
              onProgress: (progress) => {
                onProgress?.(fileIndex, file.name, progress, results.length, files.length);
              }
            });
            
            results.push(fileURL);
            return { success: true, fileURL, file };
          } catch (error) {
            const uploadError = error instanceof Error ? error : new Error('Unknown error');
            errors.push({ file, error: uploadError });
            return { success: false, error: uploadError, file };
          }
        });
        
        await Promise.allSettled(batchPromises);
      }
      
      if (errors.length > 0) {
        console.warn(`${errors.length} files failed to upload:`, errors);
      }
      
      return {
        successful: results,
        failed: errors,
        totalUploaded: results.length,
        totalFailed: errors.length
      };
    },
    onSuccess: (result) => {
      console.log(`Upload complete: ${result.totalUploaded} successful, ${result.totalFailed} failed`);
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

// Utility hook for cancellable uploads
const useCancellableUpload = (validationOptions?: FileValidationOptions) => {
  const uploadMutation = useUploadFile(validationOptions);
  
  const uploadWithCancellation = (file: File, onProgress?: (progress: UploadProgress) => void) => {
    const abortController = new AbortController();
    
    const uploadPromise = uploadMutation.mutateAsync({
      file,
      onProgress,
      signal: abortController.signal
    });
    
    return {
      promise: uploadPromise,
      cancel: () => abortController.abort(),
      isLoading: uploadMutation.isPending
    };
  };
  
  return {
    upload: uploadWithCancellation,
    ...uploadMutation
  };
};

export { uploadFileToS3, uploadToS3, useCancellableUpload, useUploadFile, useUploadMultipleFiles, validateFile };