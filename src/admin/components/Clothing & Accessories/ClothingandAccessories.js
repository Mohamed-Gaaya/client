import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTshirt, FaDumbbell } from "react-icons/fa"; // Import icons
import Sidebar from "../Sidebar";
import Header from "../Navbar";


const ClothingandAccessories = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="p-6 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6">Clothing and Accessories Management</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Clothes Card */}
            <div
              className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105 flex flex-col items-center"
              onClick={() => handleNavigate("/admin/clothes")}
            >
              <FaTshirt className="text-customBlue text-9xl mb-4" /> {/* Gigantic icon */}
              <h2 className="text-2xl font-bold text-center">Clothes</h2>
            </div>

            {/* Accessories Card */}
            <div
              className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105 flex flex-col items-center"
              onClick={() => handleNavigate("/admin/accessories")}
            >
              <FaDumbbell className="text-customPink text-9xl mb-4" /> {/* Gigantic icon */}
              <h2 className="text-2xl font-bold text-center">Accessories</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingandAccessories;
