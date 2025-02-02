import React from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export const SimilarPacks = ({ 
  packs, 
  onPackClick, 
  currentSlide, 
  onNext, 
  onPrev 
}) => {
  if (!packs.length) return null;

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">Similar Packs</h2>
        
        <div className="relative">
          {packs.length > 4 && (
            <>
              <button
                onClick={onPrev}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full ${
                  currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                disabled={currentSlide === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={onNext}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full ${
                  currentSlide >= packs.length - 4 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                disabled={currentSlide >= packs.length - 4}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ 
                transform: `translateX(-${currentSlide * 25}%)`,
                width: `${packs.length * 25}%`
              }}
            >
              {packs.map((pack) => (
                <div 
                  key={pack._id} 
                  className="w-1/4 p-2 cursor-pointer"
                  onClick={() => onPackClick(pack._id)}
                >
                  <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <img 
                      src={pack.images[0] || '/placeholder.jpg'} 
                      alt={pack.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg truncate">{pack.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {pack.products.length} Products
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-bold">
                          ${pack.price.toFixed(2)}
                        </span>
                        <div className="flex text-yellow-500">
                          <Star size={16} fill="#fbbf24" />
                          <span className="ml-1">{pack.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
