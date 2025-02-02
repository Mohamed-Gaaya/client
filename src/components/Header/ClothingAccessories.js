import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ClothingAccessories = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [clothesData, setClothesData] = useState([]);
  const [accessoriesData, setAccessoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    const fetchClothingAndAccessories = async () => {
      try {
        const clothesResponse = await fetch("http://localhost:5000/api/clothes");
        const accessoriesResponse = await fetch("http://localhost:5000/api/accessories");

        if (!clothesResponse.ok) throw new Error(`HTTP error! status: ${clothesResponse.status}`);
        if (!accessoriesResponse.ok) throw new Error(`HTTP error! status: ${accessoriesResponse.status}`);

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
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("brand");
    newParams.delete("sizes");
    newParams.delete("flavors");
    newParams.set("category", type.toLowerCase());
    newParams.set("brand", itemName);

    navigate({
      pathname: "/products",
      search: newParams.toString(),
    });

    if (onClose) onClose();
  };

  if (loading) {
    return (
      <div className="categories-wrapper">
        <div>
          <span className="text-white transition font-bold">
            CLOTHING & ACCESSORIES
          </span>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="block md:hidden">
        {/* Mobile View */}
        <div className="categories-wrapper">
          <ul>
            <li>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                    CLOTHING & ACCESSORIES
                  </span>
                </summary>
                <ul className="bg-white">
                  <li>
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer px-6 py-3">
                        <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                          Clothes
                        </span>
                      </summary>
                      <ul className="bg-white">
                        {clothesData.map((item) => (
                          <li key={item._id}>
                            <button
                              className="block w-full px-8 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                              onClick={() => handleItemClick("Clothes", item.name)}
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer px-6 py-3">
                        <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                          Accessories
                        </span>
                      </summary>
                      <ul className="bg-white">
                        {accessoriesData.map((item) => (
                          <li key={item._id}>
                            <button
                              className="block w-full px-8 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                              onClick={() => handleItemClick("Accessories", item.name)}
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>

      <div className="hidden md:block">
        {/* Desktop View */}
        <div className="categories-wrapper">
          <div className="dropdown dropdown-hover">
            <span className="text-white transition font-bold cursor-pointer">
              CLOTHING & ACCESSORIES
            </span>
            <ul>
              <li>
                <div className="categories-dropdown">
                  <div className="grid grid-cols-2 gap-2 p-2">
                    <div className="p-1 rounded-md">
                      <h3 className="category-title">Clothes</h3>
                      <ul className="subcategories-list">
                        {clothesData.map((item) => (
                          <li key={item._id} className="subcategory-item">
                            <button
                              className="subcategory-link"
                              onClick={() => handleItemClick("Clothes", item.name)}
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-1 rounded-md">
                      <h3 className="category-title">Accessories</h3>
                      <ul className="subcategories-list">
                        {accessoriesData.map((item) => (
                          <li key={item._id} className="subcategory-item">
                            <button
                              className="subcategory-link"
                              onClick={() => handleItemClick("Accessories", item.name)}
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClothingAccessories;