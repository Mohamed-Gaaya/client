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
  const [activeFilters, setActiveFilters] = useState({
    brands: [],
    categories: [],
    sizes: [],
    flavors: [],
  });

  // Update filters whenever URL params change
  useEffect(() => {
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    const sizes = searchParams.get("sizes")?.split(",") || [];
    const flavors = searchParams.get("flavors")?.split(",") || [];

    // Handle both single values and arrays for categories and brands
    const categoryArray = category ? category.split(",") : [];
    const brandArray = brand ? brand.split(",") : [];

    setActiveFilters({
      brands: brandArray,
      categories: categoryArray,
      sizes,
      flavors,
    });
  }, [searchParams]); // Re-run when searchParams changes

  // Update URL when filters change
  const handleFiltersChange = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    
    // Update each filter type in the URL
    if (newFilters.brands.length > 0) {
      params.set("brand", newFilters.brands.join(","));
    } else {
      params.delete("brand");
    }
    
    if (newFilters.categories.length > 0) {
      params.set("category", newFilters.categories.join(","));
    } else {
      params.delete("category");
    }
    
    if (newFilters.sizes.length > 0) {
      params.set("sizes", newFilters.sizes.join(","));
    } else {
      params.delete("sizes");
    }
    
    if (newFilters.flavors.length > 0) {
      params.set("flavors", newFilters.flavors.join(","));
    } else {
      params.delete("flavors");
    }

    // Update URL without triggering a page reload
    navigate({
      pathname: '/products',
      search: params.toString()
    }, { replace: true });

    setActiveFilters(newFilters);
  };

  // Fetch products whenever filters change
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
          queryParams.set("flavours", activeFilters.flavors.join(","));
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
  }, [activeFilters]); // Re-run when activeFilters changes

  // Generate page title based on active filters
  const getPageTitle = () => {
    if (activeFilters.brands.length === 1) {
      return `${activeFilters.brands[0]} Products`;
    }
    if (activeFilters.categories.length === 1) {
      return `${activeFilters.categories[0]} Products`;
    }
    return "All Products";
  };

  return (
    <div className="flex">
      <FilterSidebar 
        onFiltersChange={handleFiltersChange}
        initialFilters={activeFilters}
      />

      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {getPageTitle()}
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