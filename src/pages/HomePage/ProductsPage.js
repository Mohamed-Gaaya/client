import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import FilterSidebar from "./FilterSidebar";

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to parse search params into filters
  const getFiltersFromSearchParams = (params) => ({
    brands: params.get("brand")?.split(",") || [],
    categories: params.get("category")?.split(",") || [],
    sizes: params.get("sizes")?.split(",") || [],
    flavors: params.get("flavors")?.split(",") || [],
    priceRange: params.get("priceRange")?.split(",").map(Number) || [0, 1000]
  });
  
  // Initialize filters from URL and update when URL changes
  const [activeFilters, setActiveFilters] = useState(getFiltersFromSearchParams(searchParams));
  
  // Update filters when URL changes
  useEffect(() => {
    const newFilters = getFiltersFromSearchParams(searchParams);
    setActiveFilters(newFilters);
  }, [searchParams]);

  // Handle filter changes from sidebar
  const handleFiltersChange = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    
    // Update brand parameter
    if (newFilters.brands.length > 0) {
      params.set("brand", newFilters.brands.join(","));
    } else {
      params.delete("brand");
    }
    
    // Update category parameter
    if (newFilters.categories.length > 0) {
      params.set("category", newFilters.categories.join(","));
    } else {
      params.delete("category");
    }
    
    // Update sizes parameter
    if (newFilters.sizes.length > 0) {
      params.set("sizes", newFilters.sizes.join(","));
    } else {
      params.delete("sizes");
    }
    
    // Update flavors parameter
    if (newFilters.flavors.length > 0) {
      params.set("flavors", newFilters.flavors.join(","));
    } else {
      params.delete("flavors");
    }
    
    // Update price range parameter
    if (newFilters.priceRange[0] !== 0 || newFilters.priceRange[1] !== 1000) {
      params.set("priceRange", newFilters.priceRange.join(","));
    } else {
      params.delete("priceRange");
    }

    // Update URL
    navigate({
      pathname: '/products',
      search: params.toString()
    });
  };

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (activeFilters.brands.length > 0) {
          queryParams.set("brand", activeFilters.brands.join(","));
        }
        if (activeFilters.categories.length > 0) {
          queryParams.set("category", activeFilters.categories.join(","));
        }
        if (activeFilters.sizes.length > 0) {
          queryParams.set("sizes", activeFilters.sizes.join(","));
        }
        if (activeFilters.flavors.length > 0) {
          queryParams.set("flavors", activeFilters.flavors.join(","));
        }
        if (activeFilters.priceRange[0] !== 0 || activeFilters.priceRange[1] !== 1000) {
          queryParams.set("priceRange", activeFilters.priceRange.join(","));
        }

        const response = await fetch(
          `http://localhost:5000/api/products?${queryParams.toString()}`
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
  }, [activeFilters]);

  return (
    <div className="flex">
      <FilterSidebar 
        onFiltersChange={handleFiltersChange}
        initialFilters={activeFilters}
      />

      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
        {activeFilters.brands.length === 1 ? `${activeFilters.brands[0]} Products` :
        activeFilters.categories.length === 1 ? `${activeFilters.categories[0]} Products` :
        "All Products"}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-lg">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">Error: {error}</div>
        ) : products.length === 0 ? (
          <div className="text-center">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="cursor-pointer"
              >
                <ProductCard
                  product={{
                    name: product.name,
                    price: product.price,
                    image: `http://localhost:5000${product.images[0]}`,
                    brand: product.brand,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;