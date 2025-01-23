import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Brands.css';

const BrandHeaderDropdown = ({ isOpen, onClose, isMobile }) => {
  const [brandHeader, setBrandHeader] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBrand, setActiveBrand] = useState(null);
  const navigate = useNavigate(); // Add useNavigate hook

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
    navigate(`/brandProduct/${brandName}`); // Use the same route as in BrandsSection
  };

  const renderBrandHeader = () => {
    if (loading) {
      return (
        <div className="loading-spinner"></div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <p>{error}</p>
          <p className="error-subtitle">Please try again later</p>
        </div>
      );
    }

    if (brandHeader.length === 0) {
      return <div className="empty-message">No brands available</div>;
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