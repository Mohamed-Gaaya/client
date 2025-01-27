import React, { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const FilterSection = ({ title, options = [], selectedOptions = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleOptionToggle = (option) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((item) => item !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-lg font-semibold mb-2"
      >
        {title}
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleOptionToggle(option)}
            >
              <div
                className={`w-4 h-4 border rounded flex items-center justify-center ${
                  selectedOptions.includes(option)
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedOptions.includes(option) && <Check size={12} className="text-white" />}
              </div>
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterSidebar = ({ onFiltersChange }) => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [flavors, setFlavors] = useState([]);

  // Fetch all products and extract unique filters
  useEffect(() => {
    const fetchFilters = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            const data = await response.json();
        
            console.log("Fetched products:", data.products); // Log the data here
        
            const products = data.products || [];
        
            // Process filters
            const uniqueBrands = [...new Set(products.map((product) => product.brand))];
            const uniqueCategories = [...new Set(products.map((product) => product.category))];
            const uniqueSizes = [...new Set(products.flatMap((product) => product.sizes || []))];
            const uniqueFlavors = [...new Set(products.flatMap((product) => product.flavours || []))];
        
            setBrands(uniqueBrands);
            setCategories(uniqueCategories);
            setSizes(uniqueSizes);
            setFlavors(uniqueFlavors);
          } catch (error) {
            console.error("Error fetching product filters:", error);
          }
        };

    fetchFilters();
  }, []);

  // Notify parent component about filter changes
  useEffect(() => {
    onFiltersChange({
      brands: selectedBrands,
      categories: selectedCategories,
      sizes: selectedSizes,
      flavors: selectedFlavors,
    });
  }, [selectedBrands, selectedCategories, selectedSizes, selectedFlavors]);

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedFlavors([]);
  };

  return (
    <div className="w-64 bg-white p-4 border-r min-h-screen">
      <h2 className="text-xl font-bold mb-6">Filters</h2>

      <FilterSection
        title="Brands"
        options={brands}
        selectedOptions={selectedBrands}
        onChange={setSelectedBrands}
      />

      <FilterSection
        title="Categories"
        options={categories}
        selectedOptions={selectedCategories}
        onChange={setSelectedCategories}
      />

      <FilterSection
        title="Sizes"
        options={sizes}
        selectedOptions={selectedSizes}
        onChange={setSelectedSizes}
      />

      <FilterSection
        title="Flavors"
        options={flavors}
        selectedOptions={selectedFlavors}
        onChange={setSelectedFlavors}
      />

      <button
        onClick={clearAllFilters}
        className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
