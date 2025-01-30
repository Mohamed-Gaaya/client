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
      <div> {/* Removed the anchor tag wrapper */}
        <ul>
          <li>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700 hover:text-blue-600 transition text-lg font-bold">
                  BRANDS
                </span>
              </summary>
              <ul>
                <li>
                  <div className="block md:hidden">
                    {/* Mobile view */}
                    <div className="block px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                      <div className="brand-header-container">
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
                              <span className="brand-header-name">
                                {brand.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    {/* Desktop view */}
                    <div className="brand-header-dropdown">
                      <div className="categories-grid">
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
                              <span className="brand-header-name">
                                {brand.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      {isMobile && renderBrandHeader()}
    </div>
  );
};

export default BrandHeaderDropdown;