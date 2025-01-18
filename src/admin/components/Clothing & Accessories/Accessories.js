import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Navbar";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(""); // "add" or "modify"
  const [selectedAccessories, setSelectedAccessories] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Confirmation modal state

  const itemsPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedAccessories = accessories.slice(startIndex, endIndex);
  const totalPages = Math.ceil(accessories.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/accessories");
        setAccessories(response.data.accessories);
      } catch (err) {
        console.error("Error fetching accessories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  const handleOpenDrawer = (type, accessories = null) => {
    setDrawerType(type);
    setSelectedAccessories(accessories);
    setInputValue(accessories ? accessories.name : "");
    setError(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedAccessories(null);
    setShowDeleteConfirm(false);
    setInputValue("");
  };

  const handleAddAccessories = async () => {
    if (!inputValue.trim()) {
      setError("Accessories name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/accessories/add", {
        name: inputValue.trim(),
      });
      setAccessories([...accessories, response.data.accessories]);
      handleCloseDrawer();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleUpdateAccessories = async () => {
    if (!inputValue.trim()) {
      setError("Accessories name cannot be empty.");
      return;
    }

    try {
        const response = await axios.put(
          `http://localhost:5000/api/accessories/${selectedAccessories._id}`,
          { name: inputValue.trim() }
        );
        setAccessories((prevAccessories) =>
          prevAccessories.map((accessories) =>
            accessories._id === response.data.accessories._id ? response.data.accessories : accessories
          )
        );
        handleCloseDrawer();
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred. Please try again.");
      }
    };

  const handleDeleteAccessories = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/accessories/${selectedAccessories._id}`);
      setAccessories((prevAccessories) =>
        prevAccessories.filter((accessories) => accessories._id !== selectedAccessories._id)
      );
      setShowDeleteConfirm(false); // Close the delete confirmation modal
      handleCloseDrawer();
    } catch (err) {
      console.error("Error deleting accessories:", err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Accessories Categories Management</h2>
            <button
              className="bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink"
              onClick={() => handleOpenDrawer("add")}
            >
              Add Accessories
            </button>
          </div>

          {loading ? (
            <div className="text-center text-xl">Loading Accessories...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedAccessories.map((accessories) => (
                  <div
                    key={accessories._id}
                    className="border rounded-lg shadow-md p-4 bg-white cursor-pointer hover:shadow-lg transition"
                    onClick={() => handleOpenDrawer("modify", accessories)}
                  >
                    <h3 className="text-lg font-bold mb-2">{accessories.name}</h3>
                    <p className="text-sm text-gray-500">
                      Uploaded: {new Date(accessories.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center gap-2 mt-6">
                {pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded ${
                      currentPage === pageNum
                        ? 'bg-customBlue text-white hover:bg-customPink'
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              {/* Total Items Info */}
              <div className="text-center mt-4 text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, accessories.length)} of {accessories.length} accessories categories
              </div>
            </>
          )}
        </div>

        {/* Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 z-50`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">
              {drawerType === "add" ? "Add Accessories Category" : "Modify Accessories"}
            </h2>
            <button onClick={handleCloseDrawer} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={20} />
            </button>
          </div>
          <div className="p-6">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter Accessories name"
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <div className="flex justify-between">
              {drawerType === "modify" && (
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </button>
              )}
              <button
                className={`bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink`}
                onClick={drawerType === "add" ? handleAddAccessories : handleUpdateAccessories}
              >
                {drawerType === "add" ? "Add Accessories" : "Update"}
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to delete "{selectedAccessories?.name}"?
              </h3>
              <div className="flex justify-between">
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  No
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  onClick={handleDeleteAccessories}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accessories;
