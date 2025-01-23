import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BrandProductsPage = () => {
  const { brandName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products?brand=${encodeURIComponent(brandName)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandName]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{brandName} Products</h1>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-lg">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">Error: {error}</div>
      ) : products.length === 0 ? (
        <div className="text-center">No products found for this brand.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product._id} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col h-full"
            >
              <div className="relative pt-[100%]">
                <img
                  src={`http://localhost:5000${product.images[0]}`}
                  alt={product.name}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                />
              </div>
              
              <div className="p-4 flex-grow">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                    {brandName}
                  </span>
                  <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="p-4 pt-0">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandProductsPage;