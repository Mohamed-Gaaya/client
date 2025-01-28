import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/ClothingAccessories.css";

const ClothingAccessories = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const [clothesData, setClothesData] = useState([]);
  const [accessoriesData, setAccessoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    const fetchClothingAndAccessories = async () => {
      try {
        const clothesResponse = await fetch(
          "http://localhost:5000/api/clothes"
        );
        const accessoriesResponse = await fetch(
          "http://localhost:5000/api/accessories"
        );

        if (!clothesResponse.ok)
          throw new Error(`HTTP error! status: ${clothesResponse.status}`);
        if (!accessoriesResponse.ok)
          throw new Error(`HTTP error! status: ${accessoriesResponse.status}`);

        const clothesData = await clothesResponse.json();
        const accessoriesData = await accessoriesResponse.json();

        setClothesData(clothesData.clothes || []);
        setAccessoriesData(accessoriesData.accessories || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching clothing and accessories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClothingAndAccessories();
  }, []);

  const handleItemClick = (type, itemName) => {
    if (isMobile) {
      setActiveCategory(activeCategory === type ? null : type);
      setShowSubcategories(!showSubcategories);
    }
    navigate(`/${type.toLowerCase()}/${encodeURIComponent(itemName)}`);
    if (onClose) onClose();
  };

  if (loading) {
    return (
      <div className="clothing-accessories-wrapper">
        <div>
          <span>CLOTHING & ACCESSORIES</span>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  const renderClothingAndAccessories = () => {
    if (isMobile) {
      return (
        <div className="mobile-clothing-accessories">
          <div className="mobile-clothes-section">
            <h3>Clothes</h3>
            {clothesData.map((item) => (
              <div key={item._id} className="mobile-item">
                <button
                  className="mobile-item-button"
                  onClick={() => handleItemClick("Clothes", item.name)}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>
          <div className="mobile-accessories-section">
            <h3>Accessories</h3>
            {accessoriesData.map((item) => (
              <div key={item._id} className="mobile-item">
                <button
                  className="mobile-item-button"
                  onClick={() => handleItemClick("Accessories", item.name)}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // return (
    //   <div className="clothing-accessories-dropdown">
    //     <div className="clothing-accessories-grid">
    //       <div className="clothes-column">
    //         <h3 className="section-title">Clothes</h3>
    //         {clothesData.map((item) => (
    //           <div
    //             key={item._id}
    //             className={`item ${
    //               activeCategory === "Clothes" ? "active" : ""
    //             }`}
    //             onMouseEnter={() => setActiveCategory("Clothes")}
    //             onMouseLeave={() => setActiveCategory(null)}
    //             onClick={() => handleItemClick("Clothes", item.name)}
    //           >
    //             <a
    //               href={`/clothes/${encodeURIComponent(item.name)}`}
    //               className="item-link"
    //             >
    //               {item.name}
    //             </a>
    //           </div>
    //         ))}
    //       </div>
    //       <div className="accessories-column">
    //         <h3 className="section-title">Accessories</h3>
    //         {accessoriesData.map((item) => (
    //           <div
    //             key={item._id}
    //             className={`item ${
    //               activeCategory === "Accessories" ? "active" : ""
    //             }`}
    //             onMouseEnter={() => setActiveCategory("Accessories")}
    //             onMouseLeave={() => setActiveCategory(null)}
    //             onClick={() => handleItemClick("Accessories", item.name)}
    //           >
    //             <a
    //               href={`/accessories/${encodeURIComponent(item.name)}`}
    //               className="item-link"
    //             >
    //               {item.name}
    //             </a>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // );
  };

  return (
    <div className="clothing-accessories-wrapper">
      <div>
        <ul>
          <li>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                  CLOTHING & ACCESSORIES
                </span>
              </summary>
              <ul>
                <li>
                  <div className="block md:hidden">
                    {/* This content only shows on mobile */}
                    <a className="block px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                      <ul>
                        <li>
                          <details className="group">
                            <summary className="flex items-center justify-between cursor-pointer">
                              <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                                Clothes
                              </span>
                            </summary>
                            <ul>
                              <li>
                                <div className="block md:hidden">
                                  {/* This content only shows on mobile */}
                                  <a className="block px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                                    {clothesData.map((item) => (
                                      <div
                                        key={item._id}
                                        className={`item ${
                                          activeCategory === "Clothes"
                                            ? "active"
                                            : ""
                                        }`}
                                        onMouseEnter={() =>
                                          setActiveCategory("Clothes")
                                        }
                                        onMouseLeave={() =>
                                          setActiveCategory(null)
                                        }
                                        onClick={() =>
                                          handleItemClick("Clothes", item.name)
                                        }
                                      >
                                        <a
                                          href={`/clothes/${encodeURIComponent(
                                            item.name
                                          )}`}
                                          className="item-link"
                                        >
                                          {item.name}
                                        </a>
                                      </div>
                                    ))}
                                  </a>
                                </div>
                                <div className="hidden md:block">
                                  {/* This content only shows on desktop */}
                                  <div></div>
                                </div>
                              </li>
                            </ul>
                          </details>
                        </li>
                      </ul>
                      <ul>
                        <li>
                          <details className="group">
                            <summary className="flex items-center justify-between cursor-pointer">
                              <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                                Accessories
                              </span>
                            </summary>
                            <ul>
                              <li>
                                <div className="block md:hidden">
                                  {/* This content only shows on mobile */}
                                  <a className="block px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                                    {accessoriesData.map((item) => (
                                      <div
                                        key={item._id}
                                        className={`item ${
                                          activeCategory === "Accessories"
                                            ? "active"
                                            : ""
                                        }`}
                                        onMouseEnter={() =>
                                          setActiveCategory("Accessories")
                                        }
                                        onMouseLeave={() =>
                                          setActiveCategory(null)
                                        }
                                        onClick={() =>
                                          handleItemClick(
                                            "Accessories",
                                            item.name
                                          )
                                        }
                                      >
                                        <a
                                          href={`/accessories/${encodeURIComponent(
                                            item.name
                                          )}`}
                                          className="item-link"
                                        >
                                          {item.name}
                                        </a>
                                      </div>
                                    ))}
                                  </a>
                                </div>
                                <div className="hidden md:block">
                                  {/* This content only shows on desktop */}
                                  <div></div>
                                </div>
                              </li>
                            </ul>
                          </details>
                        </li>
                      </ul>
                    </a>
                  </div>
                  <div className="hidden md:block">
                    {/* This content only shows on desktop */}
                    <div className="clothing-accessories-dropdown">
                      <div className="clothing-accessories-grid">
                        <div className="clothes-column">
                          <h3 className="section-title">Clothes</h3>
                          {clothesData.map((item) => (
                            <div
                              key={item._id}
                              className={`item ${
                                activeCategory === "Clothes" ? "active" : ""
                              }`}
                              onMouseEnter={() => setActiveCategory("Clothes")}
                              onMouseLeave={() => setActiveCategory(null)}
                              onClick={() =>
                                handleItemClick("Clothes", item.name)
                              }
                            >
                              <a
                                href={`/clothes/${encodeURIComponent(
                                  item.name
                                )}`}
                                className="item-link"
                              >
                                {item.name}
                              </a>
                            </div>
                          ))}
                        </div>
                        <div className="accessories-column">
                          <h3 className="section-title">Accessories</h3>
                          {accessoriesData.map((item) => (
                            <div
                              key={item._id}
                              className={`item ${
                                activeCategory === "Accessories" ? "active" : ""
                              }`}
                              onMouseEnter={() =>
                                setActiveCategory("Accessories")
                              }
                              onMouseLeave={() => setActiveCategory(null)}
                              onClick={() =>
                                handleItemClick("Accessories", item.name)
                              }
                            >
                              <a
                                href={`/accessories/${encodeURIComponent(
                                  item.name
                                )}`}
                                className="item-link"
                              >
                                {item.name}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      {renderClothingAndAccessories()}
    </div>
  );
};

export default ClothingAccessories;
