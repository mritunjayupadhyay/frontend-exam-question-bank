import React from "react";
import {
  X,
  Download,
} from "lucide-react";

// Image Viewer Modal Component
const ImageViewer = ({ 
  isOpen, 
  imageUrl, 
  imageAlt, 
  onClose 
}: {
  isOpen: boolean;
  imageUrl: string;
  imageAlt: string;
  onClose: () => void;
}) => {
  if (!isOpen || !imageUrl) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = imageAlt || 'image';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white relative w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-[#F3F0F4] text-white rounded-t-lg">
          <span className="text-sm truncate max-w-xs text-gray-500 hover:text-gray-700">{imageAlt || 'Image'}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
              title="Download"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-gray-500 hover:bg-gray-700 rounded-full transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Image */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-w-full max-h-screen object-contain rounded-lg cursor-pointer"
          onClick={onClose}
        />

        {/* Click to close hint */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
          Click image or press ESC to close
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;