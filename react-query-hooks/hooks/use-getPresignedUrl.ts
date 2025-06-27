import { useMutation } from '@tanstack/react-query';
import { createAuthenticatedFetch } from '../authenticated-api-handler';
import { useAuth } from '@clerk/nextjs';

export interface UploadUrlResponse {
  uploadURL: string;
  fileKey: string;
  bucketName: string;
  fileURL: string;
  appName: string;
}

export interface UploadUrlParams {
  fileName: string;
  fileType: string;
  appName: string; // New field to specify which app
  folder?: string; // Optional subfolder within the app bucket
}

// API functions for different actions
const runtime = 'edge';

// Get presigned URL from Lambda function
const getPresignedUrl = async ({ fileName, fileType, appName, folder }: UploadUrlParams,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<UploadUrlResponse> => {
  if (!process.env.NEXT_PUBLIC_UPLOAD_URL) {
    throw new Error('NEXT_PUBLIC_UPLOAD_URL environment variable is not defined');
  }
  
  return authenticatedFetch(`${process.env.NEXT_PUBLIC_UPLOAD_URL}/generate-upload-url`, {
    method: 'POST',
    body: JSON.stringify({
      fileName,
      fileType,
      appName,
      folder: folder || '', // Default to empty string if not provided
    })
  });
};

// React Query hook for getting presigned URL
export const useGetPresignedUrl = () => {
  const { getToken } = useAuth();
  const authenticatedFetch = createAuthenticatedFetch(getToken);
  
  return useMutation({
    mutationFn: (params: UploadUrlParams) => getPresignedUrl(params, authenticatedFetch),
    onSuccess: (data) => {
      console.log('Presigned URL generated successfully:', data.uploadURL);
    },
    onError: (error) => {
      console.error('Failed to get presigned URL:', error);
    },
  });
};


export { runtime, getPresignedUrl };