import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Navbar";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(""); // "add" or "modify"
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandName, setBrandName] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState(null);
  const [newBrandLogo, setNewBrandLogo] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/brands");
        setBrands(response.data.brands);
      } catch (err) {
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleOpenDrawer = (type, brand = null) => {
    setDrawerType(type);
    setSelectedBrand(brand);
    setBrandName(brand ? brand.name : "");
    setBrandLogo(brand ? brand.logo : null);
    setNewBrandName("");
    setNewBrandLogo(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedBrand(null);
    setShowDeleteConfirm(false);
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      setError("Brand name cannot be empty.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", newBrandName.trim());
    if (newBrandLogo) {
      formData.append("image", newBrandLogo);
    }
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/brands/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setBrands([...brands, response.data.brand]);
      setNewBrandName("");
      handleCloseDrawer();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const handleUpdateBrand = async () => {
    const formData = new FormData();
    formData.append("name", brandName);
    if (newBrandLogo) {
      formData.append("image", newBrandLogo);
    }
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/brands/${selectedBrand._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setBrands((prevBrands) =>
        prevBrands.map((brand) =>
          brand._id === response.data.brand._id ? response.data.brand : brand
        )
      );
      handleCloseDrawer();
    } catch (err) {
      console.error("Error updating brand:", err);
    }
  };
  
  

  const handleDeleteBrand = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/brands/${selectedBrand._id}`);
      setBrands(brands.filter((brand) => brand._id !== selectedBrand._id));
      handleCloseDrawer();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Error deleting brand:", err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Brand Management</h2>
            <button
              className="bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink"
              onClick={() => handleOpenDrawer("add")}
            >
              Add Brand
            </button>
          </div>

          {loading ? (
            <div className="text-center text-xl">Loading brands...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="border rounded-lg shadow-md p-4 bg-white cursor-pointer hover:shadow-lg transition"
                  onClick={() => handleOpenDrawer("modify", brand)}
                >
                  <h3 className="text-lg font-bold mb-2 text-center">{brand.name}</h3>
                  {brand.logo && (
                    <img
                      src={`http://localhost:5000/uploads/${brand.logo}`}
                      alt={`${brand.name} logo`}
                      className="w-full h-32 object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer for Add Brand */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform ${
          drawerOpen && drawerType === "add" ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-50`}
      > 
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Add Brand</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={handleCloseDrawer}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-6">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <input
            type="text"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            placeholder="Brand Name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
          />
          <input
            type="file"
            onChange={(e) => setNewBrandLogo(e.target.files[0])}
            className="w-full mb-4"
          />
          {/* Display image preview if a logo is selected */}
          {newBrandLogo && (
            <div className="mb-4 text-center">
              <img
                src={URL.createObjectURL(newBrandLogo)}
                alt="New Logo Preview"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
              />
            </div>
          )}
          <div className="flex justify-between">
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={handleCloseDrawer}
            >
              Cancel
            </button>
            <button
              className={`bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink ${
                isSubmitting ? "cursor-not-allowed bg-gray-400" : ""
              }`}
              onClick={handleAddBrand}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Brand"}
            </button>
          </div>
        </div>
      </div>


      {/* Drawer for Modify Brand */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform ${
          drawerOpen && drawerType === "modify" ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Modify Brand</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={handleCloseDrawer}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-bold mb-2">Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
          />
          {/* Show the current logo or the new logo preview */}
          {newBrandLogo ? (
            <img
              src={URL.createObjectURL(newBrandLogo)}
              alt="New Logo Preview"
              className="w-full h-32 object-contain mb-4"
            />
          ) : (
            brandLogo && (
              <img
                src={`http://localhost:5000/uploads/${brandLogo}`}
                alt="Current Logo"
                className="w-full h-32 object-contain mb-4"
              />
            )
          )}
          {/* Input for uploading a new logo */}
          <input
            type="file"
            onChange={(e) => setNewBrandLogo(e.target.files[0])}
            className="w-full mb-4"
          />
          <div className="mt-4 flex justify-between">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </button>
            <button
              className="bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink"
              onClick={handleUpdateBrand}
            >
              Update
            </button>
          </div>
        </div>
      </div>



      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete "{brandName}" ?</h3>
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={() => setShowDeleteConfirm(false)}
              >
                No
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={handleDeleteBrand}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
