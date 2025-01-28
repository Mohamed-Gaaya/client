import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Brands.css";

const BrandHeaderDropdown = ({ isOpen, onClose, isMobile }) => {
  const [brandHeader, setBrandHeader] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBrand, setActiveBrand] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrandHeader = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/brands");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setBrandHeader(data.brands);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandHeader();
  }, []);

  const handleBrandClick = (event, brandName) => {
    // Prevent any parent elements from handling the click
    event.preventDefault();
    event.stopPropagation();

    // Navigate to products page with brand parameter
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
    if (onClose) onClose();
  };

  if (loading) {
    return (
      <div className="brand-header-wrapper">
        <div>
          <span>BRANDS</span>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-header-wrapper">
      <div className="group relative">
        {/* Desktop Menu */}
        <div className="hidden md:block">
          <button className="text-gray-700 hover:text-blue-600 transition font-bold peer">
            BRANDS
          </button>
          <div className="invisible hover:visible peer-hover:visible absolute left-0 w-max bg-white shadow-lg rounded-md mt-2 py-2">
            <div className="categories-grid grid grid-cols-2 gap-4 p-4">
              {brandHeader.map((brand) => (
                <div
                  key={brand._id}
                  className={`brand-header-item ${
                    activeBrand === brand._id ? "active" : ""
                  }`}
                  onMouseEnter={() => setActiveBrand(brand._id)}
                  onMouseLeave={() => setActiveBrand(null)}
                  onClick={(e) => handleBrandClick(e, brand.name)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="brand-header-info">
                    {brand.logo && (
                      <img
                        src={`/uploads/${brand.logo}`}
                        alt={brand.name}
                        className="brand-header-logo"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <span className="brand-header-name">{brand.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="block md:hidden">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                BRANDS
              </span>
            </summary>
            <div className="p-2">
              {brandHeader.map((brand) => (
                <div
                  key={brand._id}
                  className={`brand-header-item ${
                    activeBrand === brand._id ? "active" : ""
                  }`}
                  onMouseEnter={() => setActiveBrand(brand._id)}
                  onMouseLeave={() => setActiveBrand(null)}
                  onClick={(e) => handleBrandClick(e, brand.name)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="brand-header-info">
                    {brand.logo && (
                      <img
                        src={`/uploads/${brand.logo}`}
                        alt={brand.name}
                        className="brand-header-logo"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <span className="brand-header-name">{brand.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
      {isMobile && renderBrandHeader()}
    </div>
  );
};

export default BrandHeaderDropdown;
