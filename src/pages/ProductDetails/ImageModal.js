import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, currentImage, images, onImageChange }) => {
  if (!isOpen) return null;

  const currentIndex = images.findIndex(img => img === currentImage);

  const handlePrevious = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onImageChange(images[currentIndex - 1]);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIndex < images.length - 1) {
      onImageChange(images[currentIndex + 1]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative max-w-4xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <button 
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 text-white"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        {currentIndex > 0 && (
          <button 
            className="absolute left-4 p-2 bg-black/50 rounded-full hover:bg-black/70 text-white"
            onClick={handlePrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {currentIndex < images.length - 1 && (
          <button 
            className="absolute right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 text-white"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <img 
          src={currentImage} 
          alt="Modal content"
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
      </div>
    </div>
  );
};

export default ImageModal;