import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { PackProductSelector } from './PackProductSelector';

export const PackDetails = ({ 
  pack, 
  selectedProducts, 
  setSelectedProducts, 
  handleAddToCart 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-800">{pack.name}</h1>
        <div className="flex items-center space-x-2">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={20} 
                fill={i < pack.rating ? '#fbbf24' : 'none'}
              />
            ))}
          </div>
          <span className="text-gray-600">({pack.rating}) | {pack.reviewCount} Reviews</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 my-6 pr-2">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700">{pack.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-blue-600">
              ${pack.price.toFixed(2)}
            </span>
            {pack.originalPrice && (
              <>
                <span className="line-through text-gray-500">
                  ${pack.originalPrice.toFixed(2)}
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                  {Math.round(((pack.originalPrice - pack.price) / pack.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        <PackProductSelector 
          products={pack.products}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      </div>

      <button 
        className="w-full py-3 bg-blue-600 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-blue-700 disabled:bg-gray-400 mt-auto"
        onClick={handleAddToCart}
        disabled={selectedProducts.length === 0}
      >
        <ShoppingCart size={20} />
        <span>Add Pack to Cart</span>
      </button>
    </div>
  );
};