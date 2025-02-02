import React from 'react';

export const PackProductSelector = ({ 
  products, 
  selectedProducts, 
  setSelectedProducts 
}) => {
  const handleProductToggle = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    } else {
      setSelectedProducts(prev => [...prev, productId]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Select Products in Pack</h3>
      <div className="grid grid-cols-1 gap-4">
        {products.map(product => (
          <div 
            key={product._id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedProducts.includes(product._id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleProductToggle(product._id)}
          >
            <div className="flex items-center space-x-4">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.shortDescription}</p>
                <span className="text-blue-600">${product.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};