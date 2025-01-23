import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Categories.css';

const Categories = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    if (isMobile) {
      setActiveCategory(activeCategory === categoryName ? null : categoryName);
      setShowSubcategories(!showSubcategories);
    }
    navigate(`/category/${encodeURIComponent(categoryName)}`);
    if (onClose) onClose();
  };

  if (loading) {
    return (
      <div className="categories-wrapper">
        <div className="categories-button">
          <span>CATEGORIES</span>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  const renderCategories = () => {
    if (isMobile) {
      return (
        <div className="mobile-categories">
          {categories.map((category) => (
            <div key={category._id} className="mobile-category-item">
              <button 
                className="mobile-category-button"
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </button>
              {activeCategory === category.name && showSubcategories && (
                <ul className="mobile-subcategories-list">
                  {category.subcategories.map((sub, index) => (
                    <li key={index}>
                      <a 
                        href={`/brand/${encodeURIComponent(sub)}`}
                        className="mobile-subcategory-link"
                        onClick={onClose}
                      >
                        {sub}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="categories-dropdown">
        <div className="categories-grid">
          {categories.map((category) => (
            <div 
              key={category._id} 
              className={`category-item ${activeCategory === category.name ? 'active' : ''}`}
              onMouseEnter={() => setActiveCategory(category.name)}
              onMouseLeave={() => setActiveCategory(null)}
              onClick={() => handleCategoryClick(category.name)}
            >
              <h3 className="category-title">{category.name}</h3>
              {category.subcategories && category.subcategories.length > 0 && (
                <ul className="subcategories-list">
                  {category.subcategories.map((sub, subIndex) => (
                    <li key={subIndex} className="subcategory-item">
                      <a
                        href={`/brand/${encodeURIComponent(sub)}`}
                        className="subcategory-link"
                      >
                        {sub}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="categories-wrapper">
      <a href="/categories" className="categories-button">
        <span>CATEGORIES</span>
      </a>
      {renderCategories()}
    </div>
  );
};

export default Categories;