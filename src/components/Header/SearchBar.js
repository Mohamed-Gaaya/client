import React, { useState, useEffect, useRef } from 'react';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products?search=${searchTerm}&page=1&limit=5`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data.products);
      setShowDropdown(true);
    } catch (err) {
      console.error('Search error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products..."
          className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-600"
          onFocus={() => products.length > 0 && setShowDropdown(true)}
        />
        <button
          className="absolute bg-customBlue inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600"
          aria-label="Search"
        >
          <span className="material-symbols-outlined text-xl text-white">
            search
          </span>
        </button>
      </div>

      {showDropdown && products.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : (
            products.map(product => (
              <div 
                key={product._id}
                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => window.location.href = `/product/${product._id}`}
              >
                {product.images && product.images.length > 0 && (
                <img 
                    src={`http://localhost:5000${product.images[0]}`} 
                    alt={product.name} 
                    className="w-12 h-12 object-cover mr-3 rounded"
                />
                )}
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-blue-600 font-semibold">
                    {product.hasPromo 
                        ? `$${product.promoPrice} `
                        : `$${product.price}`}
                    {product.hasPromo && (
                        <span className="ml-1 line-through text-gray-400">
                        ${product.originalPrice}
                        </span>
                    )}
                    </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;