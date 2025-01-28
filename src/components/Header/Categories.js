import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./CSS/Categories.css";

const Categories = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    if (isMobile) {
      if (activeCategory === categoryName) {
        setShowSubcategories(!showSubcategories);
      } else {
        setActiveCategory(categoryName);
        setShowSubcategories(true);
      }
    }

    // Match the FilterSidebar behavior
    const newParams = new URLSearchParams(searchParams);

    // Clear other filters when selecting a category from header
    newParams.delete("brand");
    newParams.delete("sizes");
    newParams.delete("flavors");

    // Set the single category
    newParams.set("category", categoryName);

    navigate({
      pathname: "/products",
      search: newParams.toString(),
    });

    if (onClose) onClose();
  };

  const handleSubcategoryClick = (e, subcategory) => {
    e.stopPropagation();

    const newParams = new URLSearchParams(searchParams);
    // Clear other filters
    newParams.delete("category");
    newParams.delete("sizes");
    newParams.delete("flavors");

    // Set the brand (subcategory)
    newParams.set("brand", subcategory);

    navigate({
      pathname: "/products",
      search: newParams.toString(),
    });

    if (onClose) onClose();
    setActiveCategory(null);
    setShowSubcategories(false);
  };

  if (loading) {
    return (
      <div className="categories-wrapper">
        <div>
          <span className="text-gray-700 hover:text-blue-600 transition text-lg font-bold">
            CATEGORIES
          </span>
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
                className={`mobile-category-button ${
                  activeCategory === category.name ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </button>
              {activeCategory === category.name && showSubcategories && (
                <ul className="mobile-subcategories-list">
                  {category.subcategories.map((sub, index) => (
                    <li key={index}>
                      <button
                        className="mobile-subcategory-link"
                        onClick={(e) => handleSubcategoryClick(e, sub)}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="categories-wrapper">
      <ul>
        <li>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                CATEGORIES
              </span>
            </summary>
            <ul>
              <li>
                <div className="block md:hidden">
                  {/* This content only shows on mobile */}
                  {/* <a className="block px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"> */}
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="category-item"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <h3 className="category-title">{category.name}</h3>
                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <ul className="subcategories-list">
                            {category.subcategories.map((sub, subIndex) => (
                              <li key={subIndex} className="subcategory-item">
                                <button
                                  className="subcategory-link"
                                  onClick={(e) =>
                                    handleSubcategoryClick(e, sub)
                                  }
                                >
                                  {sub}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  ))}
                  {/* </a> */}
                </div>
                <div className="hidden md:block">
                  {/* This content only shows on desktop */}
                  <div className="categories-dropdown dropdown dropdown-hover">
                    <div className="categories-grid">
                      {categories.map((category) => (
                        <div
                          key={category._id}
                          className="category-item"
                          onClick={() => handleCategoryClick(category.name)}
                        >
                          <h3 className="category-title">{category.name}</h3>
                          {category.subcategories &&
                            category.subcategories.length > 0 && (
                              <ul className="subcategories-list">
                                {category.subcategories.map((sub, subIndex) => (
                                  <li
                                    key={subIndex}
                                    className="subcategory-item"
                                  >
                                    <button
                                      className="subcategory-link"
                                      onClick={(e) =>
                                        handleSubcategoryClick(e, sub)
                                      }
                                    >
                                      {sub}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
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

      {renderCategories()}
    </div>
  );
};

export default Categories;
