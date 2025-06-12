import { useMutation } from '@tanstack/react-query';

interface UploadUrlResponse {
  uploadURL: string;
  fileKey: string;
  bucketName: string;
  fileURL: string;
}

interface UploadUrlParams {
  fileName: string;
  fileType: string;
}

// API functions for different actions
const runtime = 'edge';

// Get presigned URL from Lambda function
const getPresignedUrl = async ({ fileName, fileType }: UploadUrlParams): Promise<UploadUrlResponse> => {
  if (!process.env.NEXT_PUBLIC_UPLOAD_URL) {
    throw new Error('NEXT_PUBLIC_UPLOAD_URL environment variable is not defined');
  }
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_URL}/generate-upload-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName,
      fileType
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get upload URL: ${response.statusText}`);
  }
  
  return await response.json() as UploadUrlResponse;
};

// React Query hook for getting presigned URL
export const useGetPresignedUrl = () => {  
  return useMutation({
    mutationFn: getPresignedUrl,
    onSuccess: (data) => {
      // Optionally invalidate related queries or update cache
      // queryClient.invalidateQueries({ queryKey: ['uploads'] });
      console.log('Presigned URL generated successfully:', data.uploadURL);
    },
    onError: (error) => {
      console.error('Failed to get presigned URL:', error);
    },
  });
};

export { runtime, getPresignedUrl };