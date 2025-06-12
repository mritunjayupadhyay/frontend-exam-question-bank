import { useState } from 'react';
import { UploadProgress, useUploadFile } from '@/react-query-hooks/hooks/use-uploads3';

export const FileUploader = () => {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  
  const uploadMutation = useUploadFile({
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf']
  });

  const handleUpload = async (file: File) => {
    try {
      const fileURL = await uploadMutation.mutateAsync({
        file,
        onProgress: setProgress
      });
      alert(`Upload successful: ${fileURL}`);
    } catch (error: unknown) {
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setProgress(null);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
      
      {progress && (
        <div>
          <p>Phase: {progress.phase}</p>
          <progress value={progress.percentage} max="100" />
          <span>{progress.percentage}% ({(progress.loaded / 1024 / 1024).toFixed(2)}MB / {(progress.total / 1024 / 1024).toFixed(2)}MB)</span>
        </div>
      )}
    </div>
  );
};