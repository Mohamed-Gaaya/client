import React, { useState, useEffect } from "react";

export function PackImageGallery({ packId, onOpenModal }) {
    const [images, setImages] = useState([]);
    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const fetchPackImages = async () => {
            setLoading(true);
            try {
              const response = await fetch(`http://localhost:5000/api/packs/${packId}`);
              if (!response.ok) {
                throw new Error('Failed to fetch images');
              }
              const data = await response.json();
              console.log('Fetched data:', data); // Log to check the structure
              // Use data.pack.image instead of data.images
              setImages([data.pack.image]); // Since it's a single image, wrap it in an array
            } catch (err) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          };
          
  
      fetchPackImages();
    }, [packId]);
  
    const handlePrev = (e) => {
      e.stopPropagation();
      setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };
  
    const handleNext = (e) => {
      e.stopPropagation();
      setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };
  
    if (loading) {
      return (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="loading-spinner"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
          <p className="text-red-500">Error: {error}</p>
        </div>
      );
    }
  
    if (!images.length) {
      return (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
          <p className="text-gray-500">No images available</p>
        </div>
      );
    }
  
    return (
      <div className="relative w-full h-64">
        <div
          className="w-full h-full bg-cover bg-center cursor-pointer rounded-lg"
          style={{ backgroundImage: `url(http://localhost:5000/uploads/${images[activeImage].split('/').pop()})` }}
          onClick={() => onOpenModal?.(images[activeImage])}
        >
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
  
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  activeImage === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
  