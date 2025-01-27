import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImageGallery = ({ images, activeImage, setActiveImage, onOpenModal }) => {
  const handlePrev = () => {
    setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNext = () => {
    setActiveImage(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  return (
    <div className="relative">
      <div 
        className="border rounded-lg overflow-hidden cursor-pointer relative"
        onClick={() => onOpenModal(images?.[activeImage])}
      >
        <img 
          src={images?.[activeImage] || '/placeholder.jpg'} 
          alt="Product" 
          className="w-full h-[500px] object-cover"
        />
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {images && images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto mt-4">
          {images.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`Product thumbnail ${index + 1}`} 
              className={`w-16 h-16 object-cover cursor-pointer rounded-md border-2 ${
                activeImage === index ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => setActiveImage(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;