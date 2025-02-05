import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ClothingAccessories = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [clothesData, setClothesData] = useState([]);
  const [accessoriesData, setAccessoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

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

  const handleItemClick = (type) => {
    const newParams = new URLSearchParams();
    
    // Set category using the EXACT CASE from your products data
    newParams.set("category", type); // Remove .toLowerCase()
    
    // Clear other params like FilterSidebar does
    newParams.delete("page");
    newParams.delete("sort");
    newParams.delete("search");
  
    navigate({
      pathname: "/products",
      search: newParams.toString(),
    });
  
    if (onClose) onClose();
  };

  if (loading) {
    return (
      <div className="brand-header-wrapper">
        <div>
          <span className="text-white font-bold">CLOTHING & ACCESSORIES</span>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="block md:hidden">
        {/* Mobile View */}
        <div className="brand-header-wrapper">
          <ul>
            <li>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer">
                  <span className="text-white hover:text-white transition font-bold">
                    CLOTHING & ACCESSORIES
                  </span>
                </summary>
                <ul>
                  <li>
                    <div className="block px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                      <div className="brand-header-container">
                        <div className="mb-4">
                          <h3 className="text-white justify-center font-bold mb-2">Clothes</h3>
                          {clothesData.map((item) => (
                            <div
                              key={item._id}
                              className="p-1 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-600 brand-header-item"
                              onMouseEnter={() => setActiveItem(item._id)}
                              onMouseLeave={() => setActiveItem(null)}
                              onClick={() => handleItemClick("Clothes")} 
                            >
                              <div className="brand-header-info">
                                <span className="brand-header-name">{item.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <h3 className="text-white font-bold mb-2">Accessories</h3>
                          {accessoriesData.map((item) => (
                            <div
                              key={item._id}
                              className="p-1 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-600 brand-header-item"
                              onMouseEnter={() => setActiveItem(item._id)}
                              onMouseLeave={() => setActiveItem(null)}
                              onClick={() => handleItemClick("Accessories")}
                            >
                              <div className="brand-header-info">
                                <span className="brand-header-name">{item.name}</span>
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
      </div>

      <div className="hidden md:block">
        {/* Desktop View */}
        <div className="brand-header-wrapper">
          <div className="dropdown dropdown-hover">
            <span className="text-white transition font-bold cursor-pointer">
              CLOTHING & ACCESSORIES
            </span>
            <ul>
              <li>
                <div className="brand-header-dropdown">
                  <div className="grid grid-cols-2 gap-4 p-2">
                    <div>
                      <h3 className="text-white font-bold mb-2">Clothes</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {clothesData.map((item) => (
                          <div
                            key={item._id}
                            className="p-1 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-600 brand-header-item"
                            onMouseEnter={() => setActiveItem(item._id)}
                            onMouseLeave={() => setActiveItem(null)}
                            onClick={() => handleItemClick("Clothes")} 
                          >
                            <div className="brand-header-info">
                              <span className="brand-header-name">{item.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-2">Accessories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {accessoriesData.map((item) => (
                          <div
                            key={item._id}
                            className="p-1 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-600 brand-header-item"
                            onMouseEnter={() => setActiveItem(item._id)}
                            onMouseLeave={() => setActiveItem(null)}
                            onClick={() => handleItemClick("Accessories")}
                          >
                            <div className="brand-header-info">
                              <span className="brand-header-name">{item.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
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