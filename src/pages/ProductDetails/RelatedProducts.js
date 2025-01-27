import React from 'react';
import { Star } from 'lucide-react';

const RelatedProducts = ({ products, onProductClick, currentSlide, onNext, onPrev }) => {
  if (!products.length) return null;

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        
        <div className="relative">
          {products.length > 4 && (
            <>
              <button
                onClick={onPrev}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full ${
                  currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                disabled={currentSlide === 0}
              >
                ←
              </button>
              <button
                onClick={onNext}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full ${
                  currentSlide >= products.length - 4 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                disabled={currentSlide >= products.length - 4}
              >
                →
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ 
                transform: `translateX(-${currentSlide * 25}%)`,
                width: `${products.length * 25}%`
              }}
            >
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className="w-1/4 p-2 cursor-pointer"
                  onClick={() => onProductClick(product._id)}
                >
                  <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <img 
                      src={product.images[0] || '/placeholder.jpg'} 
                      alt={product.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              fill={i < 4 ? '#fbbf24' : 'none'}
                            />
                          ))}
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

export default RelatedProducts;