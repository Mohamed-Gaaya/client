import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

const BrandProductsPage = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
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
            <div key={product._id} onClick={() => navigate(`/product/${product._id}`)}>
              <ProductCard 
                product={{
                  name: product.name, 
                  price: product.price,
                  image: `http://localhost:5000${product.images[0]}`,
                  brand: brandName
                }} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandProductsPage;