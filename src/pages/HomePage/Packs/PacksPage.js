import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import FilterSidebarPacks from "./FilterSidebarPacks";
import { debounce } from 'lodash';

const PackCard = ({ pack, onClick }) => {
  // Transform the image URLs to handle both array of images and single image
  const displayImage = pack.images 
    ? `http://localhost:5000/uploads/${pack.images[0].split('/').pop()}`
    : pack.image
    ? `http://localhost:5000/uploads/${pack.image.split('/').pop()}`
    : '/placeholder.jpg';

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative pb-[100%]">
        <img
          src={displayImage}
          alt={pack.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{pack.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold">${pack.price.toFixed(2)}</span>
          <span className="text-gray-500 text-sm">
            {pack.products?.length || 0} products
          </span>
        </div>
        {pack.totalValue && (
          <div className="mt-2 text-gray-500 text-sm">
            Value: ${pack.totalValue.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

const PacksPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to parse search params into filters
  const getFiltersFromSearchParams = (params) => ({
    brands: params.get("brands")?.split(",").filter(Boolean) || [],
    priceRange: [
      Number(params.get("minPrice")) || 0,
      Number(params.get("maxPrice")) || 1000
    ]
  });
  
  // Initialize filters from URL and update when URL changes
  const [activeFilters, setActiveFilters] = useState(getFiltersFromSearchParams(searchParams));
  
  useEffect(() => {
    const newFilters = getFiltersFromSearchParams(searchParams);
    setActiveFilters(newFilters);
  }, [searchParams]);

  // Handle filter changes
  const handleFiltersChange = debounce((newFilters) => {
    const newParams = new URLSearchParams();
    
    if (newFilters.brands?.length > 0) {
      newParams.set("brands", newFilters.brands.join(","));
    } else {
      newParams.delete("brands");
    }
    
    if (newFilters.priceRange) {
      const [min, max] = newFilters.priceRange;
      if (min > 0) {
        newParams.set("minPrice", min.toString());
      } else {
        newParams.delete("minPrice");
      }
      if (max < 1000) {
        newParams.set("maxPrice", max.toString());
      } else {
        newParams.delete("maxPrice");
      }
    }
  
    const currentParams = searchParams.toString();
    const nextParams = newParams.toString();
  
    if (currentParams !== nextParams) {
      setSearchParams(newParams);
    }
  }, 300); 

  // Fetch packs when filters change
  useEffect(() => {
    const fetchPacks = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        
        if (activeFilters.brands.length > 0) {
          queryParams.set("brands", activeFilters.brands.join(","));
        }
        if (activeFilters.priceRange[0] > 0) {
          queryParams.set("minPrice", activeFilters.priceRange[0].toString());
        }
        if (activeFilters.priceRange[1] < 1000) {
          queryParams.set("maxPrice", activeFilters.priceRange[1].toString());
        }
    
        // Add cache-busting parameter
        queryParams.set("_t", Date.now());
    
        const response = await fetch(
          `http://localhost:5000/api/packs?${queryParams.toString()}`
        );
    
        // Handle navigation cancellation
        if (!response.ok) throw new Error("Failed to fetch packs");
        
        const data = await response.json();
        setPacks(data.packs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, [activeFilters]);

  const handlePackClick = (packId) => {
    navigate(`/packs/${packId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FilterSidebarPacks 
        onFiltersChange={handleFiltersChange}
        initialFilters={activeFilters}
      />

      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {activeFilters.brands?.length === 1 
            ? `${activeFilters.brands[0]} Packs` 
            : "All Packs"}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">Error: {error}</div>
        ) : packs.length === 0 ? (
          <div className="text-center text-gray-600">No packs found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {packs.map((pack) => (
              <PackCard
                key={pack._id}
                pack={pack}
                onClick={() => handlePackClick(pack._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PacksPage;