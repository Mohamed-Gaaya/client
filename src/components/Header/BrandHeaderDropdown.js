import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Brands.css';

const BrandHeaderDropdown = ({ isOpen, onClose, isMobile }) => {
  const [brandHeader, setBrandHeader] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBrand, setActiveBrand] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrandHeader = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/brands');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setBrandHeader(data.brands);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandHeader();
  }, []);

  const handleBrandClick = (brandName) => {
    // Navigate to the products page with brand filter instead of a separate brandProduct route
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
    if (onClose) onClose();
  };

  if (loading) {
    return (
      <div className="brand-header-wrapper">
        <div className="brand-header-button">
          <span>BRANDS</span>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  const renderBrandHeader = () => {
    if (isMobile) {
      return (
        <div 
          className="brand-header-mobile-dropdown" 
          style={{ 
            maxHeight: '70vh', 
            overflowY: 'auto', 
            padding: '10px 0' 
          }}
        >
          {brandHeader.map((brand) => (
            <div 
              key={brand._id} 
              className="brand-header-mobile-item"
              style={{ 
                margin: '5px 0', 
                padding: '5px 15px' 
              }}
            >
              <button 
                className="brand-header-mobile-button"
                onClick={() => handleBrandClick(brand.name)}
                style={{ 
                  width: '100%', 
                  textAlign: 'left', 
                  padding: '8px 0' 
                }}
              >
                {brand.name}
              </button>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="brand-header-dropdown">
        <div className="categories-grid">
          {brandHeader.map((brand) => (
            <div
              key={brand._id}
              className={`brand-header-item ${activeBrand === brand._id ? 'active' : ''}`}
              onMouseEnter={() => setActiveBrand(brand._id)}
              onMouseLeave={() => setActiveBrand(null)}
              onClick={() => handleBrandClick(brand.name)}
              style={{ cursor: 'pointer' }}
            >
              <div className="brand-header-info">
                {brand.logo && (
                  <img
                    src={`/uploads/${brand.logo}`}
                    alt={brand.name}
                    className="brand-header-logo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <span className="brand-header-name">{brand.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="brand-header-wrapper">
      <a href="/brands" className="brand-header-button">
        <span>BRANDS</span>
      </a>
      {renderBrandHeader()}
    </div>
  );
};

export default BrandHeaderDropdown;