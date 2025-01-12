import React from "react";
import logo from "../../assets/images/logo.jpg";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Categories", path: "/admin/categories" },
    { label: "Products", path: "/admin/products" },
    { label: "Orders", path: "/admin/orders" },
  ];

  const location = useLocation();

  // Function to determine if the current item is active
  const isActive = (path) =>
    location.pathname === path ? "bg-customBlue text-white" : "hover:bg-customBlue";

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
      <ul className="flex flex-col space-y-4 mt-4">
        {menuItems.map((item, index) => (
          <li key={index}>
            <a
              href={item.path}
              className={`block p-2 rounded ${isActive(item.path)} transition text-center`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
