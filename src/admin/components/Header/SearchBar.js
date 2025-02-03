import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar({ onClose }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/products?search=${searchTerm}&page=1&limit=5`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      console.error("Search error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose && onClose(); // Optional: close search modal if passed
  };

  return (
    <div ref={searchRef} className="w-full max-w-md mx-auto">
      <div className="relative">
        {/* <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products..."
          className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-600"
          autoFocus
        />
        <button
          className="absolute bg-customBlue inset-y-0 right-0 flex items-center px-3 text-white"
          aria-label="Search"
        >
          <span className="material-symbols-outlined text-xl">search</span>
        </button> */}

        <form className="form relative">
          <button className="absolute left-2 -translate-y-1/2 top-1/2 p-1">
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="search"
              className="w-5 h-5 text-gray-700"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                stroke-width="1.333"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input rounded-full px-8 py-3  border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md"
            placeholder="Search for products..."
            required=""
            type="text"
          />
          
        </form>
      </div>

      {products.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleProductClick(product._id)}
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
