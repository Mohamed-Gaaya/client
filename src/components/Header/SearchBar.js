import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ onClose }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
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
            const response = await fetch(`http://localhost:5000/api/products?search=${searchTerm}&page=1&limit=5`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setProducts(data.products);
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

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
        onClose && onClose(); // Optional: close search modal if passed
    };

    return (
        <div ref={searchRef} className="w-full max-w-md mx-auto">
            <div className="relative">
                <input
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
                    <span className="material-symbols-outlined text-xl">
                        search
                    </span>
                </button>
            </div>

            {products.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                    ) : (
                        products.map(product => (
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