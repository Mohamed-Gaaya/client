import React, { useState, useEffect } from "react";

const ProductCard = ({ product, onAddToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFlavour, setSelectedFlavour] = useState(null);
  const [flavours, setFlavours] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${product._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        if (data.product.flavours?.length) {
          setFlavours(data.product.flavours);
          setSelectedFlavour(data.product.flavours[0]);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (product._id && (!product.flavours || !product.flavours.length)) {
      fetchProductDetails();
    } else if (product.flavours?.length) {
      setFlavours(product.flavours);
      setSelectedFlavour(product.flavours[0]);
    }
  }, [product]);

  const discountPercentage = product.promoPrice && product.originalPrice
    ? Math.round(((product.originalPrice - product.promoPrice) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({ 
        ...product, 
        flavour: selectedFlavour // Include selected flavour in cart item
      });
    }
  };

  const handleFlavourChange = (e) => {
    e.stopPropagation();
    setSelectedFlavour(e.target.value);
  };

  const displayPrice = product.promoPrice || product.price;

  return (
    <div 
      className="group relative bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        )}
        
        {product.promoPrice && discountPercentage > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      <div className="p-5">
        {product.brand && (
          <div className="mb-2">
            <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {product.brand}
            </span>
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        <div className="space-y-1 mb-4">
          {product.category && (
            <p className="text-sm text-gray-600">
              {product.category}
            </p>
          )}
          {product.servings && (
            <p className="text-sm text-gray-600">
              {product.servings} Servings
            </p>
          )}
        </div>

        {flavours.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Flavour
            </label>
            <select
              value={selectedFlavour || ''}
              onChange={handleFlavourChange}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                transition-all duration-200 bg-white"
            >
              {flavours.map((flavour) => (
                <option key={flavour} value={flavour}>
                  {flavour}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1 mb-4">
          {product.promoPrice ? (
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">
                {product.promoPrice.toFixed(2)} TND
              </p>
              <p className="text-sm text-gray-500 line-through">
                {product.originalPrice.toFixed(2)} TND
              </p>
              <p className="text-sm text-red-500 font-medium">
                Save {discountPercentage}%
              </p>
            </div>
          ) : (
            <p className="text-2xl font-bold text-blue-600">
              {displayPrice.toFixed(2)} TND
            </p>
          )}
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
            transition-all duration-300 hover:bg-blue-700 transform 
            hover:scale-[1.02] active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;