import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FilterSidebarPacks from "./FilterSidebarPacks";

const PackCard = ({ pack, onCardClick, onButtonClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Determine the display image from either an array or single image.
  const displayImage =
    pack.images && pack.images.length > 0
      ? `http://localhost:5000/uploads/${pack.images[0].split('/').pop()}`
      : pack.image
      ? `http://localhost:5000/uploads/${pack.image.split('/').pop()}`
      : '/placeholder.jpg';

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onCardClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={pack.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          } group-hover:scale-110`}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {pack.name}
        </h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-blue-600 font-bold">${pack.price.toFixed(2)}</span>
          <span className="text-gray-500 text-sm">
            {pack.products?.length || 0} products
          </span>
        </div>
        {pack.totalValue && (
          <div className="mb-4 text-gray-500 text-sm">
            Value: ${pack.totalValue.toFixed(2)}
          </div>
        )}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center space-x-2"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card's onClick.
            onButtonClick(pack);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

const PacksPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract filters from URL search parameters.
  const getFiltersFromSearchParams = (params) => ({
    brands: params.get("brands")?.split(",").filter(Boolean) || [],
    priceRange: [
      Number(params.get("minPrice")) || 0,
      Number(params.get("maxPrice")) || 1000
    ]
  });

  const [activeFilters, setActiveFilters] = useState(
    getFiltersFromSearchParams(searchParams)
  );

  // Update active filters when URL changes.
  useEffect(() => {
    setActiveFilters(getFiltersFromSearchParams(searchParams));
  }, [searchParams]);

  // Stable handler for filter changes.
  const handleFiltersChange = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams);
      if (newFilters.brands && newFilters.brands.length > 0) {
        params.set("brands", newFilters.brands.join(","));
      } else {
        params.delete("brands");
      }
      if (newFilters.priceRange) {
        const [min, max] = newFilters.priceRange;
        if (min > 0) {
          params.set("minPrice", min.toString());
        } else {
          params.delete("minPrice");
        }
        if (max < 1000) {
          params.set("maxPrice", max.toString());
        } else {
          params.delete("maxPrice");
        }
      }
      if (params.toString() !== searchParams.toString()) {
        navigate({
          pathname: "/packs",
          search: params.toString(),
        });
      }
    },
    [navigate, searchParams]
  );

  // Fetch packs from the API whenever active filters change.
  useEffect(() => {
    const fetchPacks = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeFilters.brands && activeFilters.brands.length > 0) {
          queryParams.set("brands", activeFilters.brands.join(","));
        }
        if (activeFilters.priceRange[0] > 0) {
          queryParams.set("minPrice", activeFilters.priceRange[0].toString());
        }
        if (activeFilters.priceRange[1] < 1000) {
          queryParams.set("maxPrice", activeFilters.priceRange[1].toString());
        }
        // Cache busting parameter.
        queryParams.set("_t", Date.now().toString());
        const response = await fetch(
          `http://localhost:5000/api/packs?${queryParams.toString()}`
        );
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

  // Navigate to pack details when a card is clicked.
  const handlePackClick = (packId) => {
    navigate(`/packs/${packId}`);
    window.scrollTo(0, 0);
  };

  // When clicking the button, just navigate to pack details.
  const handleViewDetails = (pack) => {
    navigate(`/packs/${pack._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex">
      <FilterSidebarPacks
        onFiltersChange={handleFiltersChange}
        initialFilters={activeFilters}
      />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {activeFilters.brands.length === 1
            ? `${activeFilters.brands[0]} Packs`
            : "All Packs"}
        </h1>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-lg">Loading...</p>
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
                onCardClick={() => handlePackClick(pack._id)}
                onButtonClick={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PacksPage;
