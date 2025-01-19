import React, { useState } from "react";
import logo from "../../assets/images/logo.jpg";
import { useLocation } from "react-router-dom";
import { FaTshirt, FaDumbbell, FaHome, FaUsers, FaTags, FaTrademark, FaBoxOpen, FaClipboardList } from "react-icons/fa";

const Sidebar = () => {
  const [showSubMenu, setShowSubMenu] = useState(false); // State to toggle subcategories
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: <FaHome /> },
    { label: "Users", path: "/admin/users", icon: <FaUsers /> },
    { label: "Categories", path: "/admin/categories", icon: <FaTags /> },
    { label: "Brands", path: "/admin/brands", icon: <FaTrademark /> },
    {
      label: "Clothing & Accessories",
      icon: <FaTshirt />,
      subMenu: [
        { label: "Clothes", path: "/admin/clothes", icon: <FaTshirt /> },
        { label: "Accessories", path: "/admin/accessories", icon: <FaDumbbell /> },
      ],
    },
    { label: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
    { label: "Orders", path: "/admin/orders", icon: <FaClipboardList /> },
  ];

  // Function to determine if the current item or submenu is active
  const isActive = (path) => location.pathname === path;

  // Check if any submenu item is active
  const isSubMenuActive = (subMenu) =>
    subMenu?.some((subItem) => isActive(subItem.path));

  return (
    <div className="w-64 bg-customDark text-white flex flex-col items-center justify-start h-screen sticky top-0 p-4">
      {/* Logo */}
      <a href="/">
        <img
          src={logo}
          alt="YODA Logo"
          className="h-32 w-32 rounded-full object-cover border-4 border-black"
        />
      </a>

      {/* Menu Items */}
      <ul className="flex flex-col space-y-4 mt-4 w-full">
        {menuItems.map((item, index) => (
          <li key={index} className="w-full">
            {item.subMenu ? (
              <>
                <div
                  className={`block p-2 rounded cursor-pointer flex items-center ${
                    isSubMenuActive(item.subMenu) || showSubMenu
                      ? "bg-customBlue text-white font-bold"
                      : "hover:bg-customBlue"
                  }`}
                  onClick={() => setShowSubMenu(!showSubMenu)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </div>
                {(showSubMenu || isSubMenuActive(item.subMenu)) && (
                  <ul className="pl-6 mt-2">
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex} className="w-full">
                        <a
                          href={subItem.path}
                          className={`flex items-center p-2 rounded ${
                            isActive(subItem.path)
                              ? "bg-customBlue text-white font-bold"
                              : "hover:bg-customBlue"
                          }`}
                        >
                          <span className="mr-2">{subItem.icon}</span>
                          {subItem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <a
                href={item.path}
                className={`block p-2 rounded flex items-center ${
                  isActive(item.path) ? "bg-customBlue text-white font-bold" : "hover:bg-customBlue"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
