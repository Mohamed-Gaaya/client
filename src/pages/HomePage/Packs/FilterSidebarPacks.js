import React, { useState, useEffect, useCallback,useRef } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";

const PriceRangeFilter = ({ 
  priceRange, 
  onPriceChange, 
  minPrice = 0, 
  maxPrice = 1000 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(null);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [isLoading, setIsLoading] = useState(false);
  const sliderRef = useRef(null);

  const getPercentage = (value) => {
    return ((value - minPrice) / (maxPrice - minPrice)) * 100;
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !sliderRef.current) return;
  
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width * 100), 100);
    const value = Math.round(minPrice + (percentage / 100) * (maxPrice - minPrice));
  
    if (isDragging === 'min') {
      if (value < localPriceRange[1]) {
        setLocalPriceRange([value, localPriceRange[1]]);
      }
    } else {
      if (value > localPriceRange[0]) {
        setLocalPriceRange([localPriceRange[0], value]);
      }
    }
  }, [isDragging, minPrice, maxPrice, localPriceRange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleInputChange = (type, value) => {
    const newValue = Math.min(Math.max(Number(value) || minPrice, minPrice), maxPrice);
    if (type === 'min' && newValue <= localPriceRange[1]) {
      setLocalPriceRange([newValue, localPriceRange[1]]);
    } else if (type === 'max' && newValue >= localPriceRange[0]) {
      setLocalPriceRange([localPriceRange[0], newValue]);
    }
  };

  const handleApplyFilter = async () => {
    setIsLoading(true);
    try {
      onPriceChange(localPriceRange);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-lg font-semibold mb-2 text-gray-800 hover:text-gray-600 transition-colors"
      >
        Price Range
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="mt-4">
          <div className="flex justify-between mb-6">
            <div className="flex-1 mr-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={localPriceRange[0]}
                  onChange={(e) => handleInputChange('min', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={localPriceRange[1]}
                  onChange={(e) => handleInputChange('max', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="relative h-2 mt-8 mb-4" ref={sliderRef}>
            <div className="absolute w-full h-full bg-gray-200 rounded-full" />
            <div
              className="absolute h-full bg-blue-500 rounded-full"
              style={{
                left: `${getPercentage(localPriceRange[0])}%`,
                right: `${100 - getPercentage(localPriceRange[1])}%`
              }}
            />
            <div
              className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer -mt-1.5 transform -translate-x-1/2"
              style={{ left: `${getPercentage(localPriceRange[0])}%` }}
              onMouseDown={() => setIsDragging('min')}
            />
            <div
              className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer -mt-1.5 transform -translate-x-1/2"
              style={{ left: `${getPercentage(localPriceRange[1])}%` }}
              onMouseDown={() => setIsDragging('max')}
            />
          </div>

          <button
            onClick={handleApplyFilter}
            disabled={isLoading}
            className={`w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Applying...' : 'Apply Filter'}
          </button>
        </div>
      )}
    </div>
  );
};

const FilterSection = ({ title, options = [], selectedOptions = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const cleanedOptions = options.filter(option => option != null && option !== "");
  const displayedOptions = showAll ? cleanedOptions : cleanedOptions.slice(0, 5);

  const handleOptionToggle = (option) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((item) => item !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-lg font-semibold mb-2 text-gray-800 hover:text-gray-600 transition-colors"
      >
        {title} ({selectedOptions.length})
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="mt-2">
          <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-2">
              {displayedOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => handleOptionToggle(option)}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                  <div
                    className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                      selectedOptions.includes(option)
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {selectedOptions.includes(option) && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>
          {cleanedOptions.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              {showAll ? "Show Less" : `Show All (${cleanedOptions.length})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const FilterSidebarPacks = ({ onFiltersChange, initialFilters = {} }) => {
  const [selectedBrands, setSelectedBrands] = useState(initialFilters?.brands || []);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [brands, setBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch all products to get unique brands
        const productsResponse = await fetch("http://localhost:5000/api/products");
        const productsData = await productsResponse.json();
        const uniqueBrands = new Set(
          productsData.products
            .map(product => product.brand)
            .filter(Boolean)
        );
        setBrands(Array.from(uniqueBrands).sort());

        // Then fetch packs for price range
        const packsResponse = await fetch("http://localhost:5000/api/packs");
        const packsData = await packsResponse.json();
        const packs = packsData.packs || [];
        
        // Set initial price range based on packs
        const prices = packs.map(p => p.price).filter(Boolean);
        if (prices.length) {
          const maxPackPrice = Math.max(...prices);
          setMaxPrice(maxPackPrice);
          setPriceRange([0, maxPackPrice]);
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
  
    fetchData();
  }, []);

  // Rest of the component remains unchanged...
  const handleFiltersChange = useCallback(() => {
    const filters = {
      brands: selectedBrands,
      priceRange
    };
    onFiltersChange(filters);
  }, [selectedBrands, priceRange, onFiltersChange]);

  useEffect(() => {
    handleFiltersChange();
  }, [handleFiltersChange]);

  const handleRemoveFilter = (type, value) => {
    switch (type) {
      case 'brands':
        setSelectedBrands(prev => prev.filter(item => item !== value));
        break;
      case 'priceRange':
        setPriceRange([0, maxPrice]);
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
  };

  return (
    <div className="w-72 bg-gray-50 p-6 border-r min-h-screen">
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #999;
          }
        `}
      </style>
      
      <div className="sticky top-0 bg-gray-50 z-10 pb-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            Clear All
          </button>
        </div>

        {(selectedBrands.length > 0 || priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
          <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-wrap gap-2">
              {selectedBrands.map((brand) => (
                <div
                  key={brand}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span className="capitalize mr-2">{brand}</span>
                  <button
                    onClick={() => handleRemoveFilter('brands', brand)}
                    className="hover:bg-blue-200 rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
                <div
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span className="mr-2">${priceRange[0]} - ${priceRange[1]}</span>
                  <button
                    onClick={() => handleRemoveFilter('priceRange')}
                    className="hover:bg-blue-200 rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <PriceRangeFilter
          minPrice={0}
          maxPrice={maxPrice}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
        />

        <FilterSection
          title="Brands"
          options={brands}
          selectedOptions={selectedBrands}
          onChange={setSelectedBrands}
        />
      </div>
    </div>
  );
};

export default FilterSidebarPacks;