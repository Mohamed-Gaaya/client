import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header/Header";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const Clothes = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(""); // "add" or "modify"
  const [selectedClothes, setSelectedClothes] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Confirmation modal state

  const itemsPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedClothes = clothes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(clothes.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clothes");
        setClothes(response.data.clothes);
      } catch (err) {
        console.error("Error fetching clothes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, []);

  const handleOpenDrawer = (type, clothes = null) => {
    setDrawerType(type);
    setSelectedClothes(clothes);
    setInputValue(clothes ? clothes.name : "");
    setError(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedClothes(null);
    setShowDeleteConfirm(false);
    setInputValue("");
  };

  const handleAddClothes = async () => {
    if (!inputValue.trim()) {
      setError("Clothes name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/clothes/add", {
        name: inputValue.trim(),
      });
      setClothes([...clothes, response.data.clothes]);
      handleCloseDrawer();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleUpdateClothes = async () => {
    if (!inputValue.trim()) {
      setError("Clothes name cannot be empty.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/clothes/${selectedClothes._id}`,
        { name: inputValue.trim() }
      );
      setClothes((prevClothes) =>
        prevClothes.map((clothes) =>
          clothes._id === response.data.clothes._id ? response.data.clothes : clothes
        )
      );
      handleCloseDrawer();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleDeleteClothes = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/clothes/${selectedClothes._id}`);
      setClothes((prevClothes) =>
        prevClothes.filter((clothes) => clothes._id !== selectedClothes._id)
      );
      setShowDeleteConfirm(false); // Close the delete confirmation modal
      handleCloseDrawer();
    } catch (err) {
      console.error("Error deleting clothes:", err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Clothes Categories Management</h2>
            <button
              className="bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink"
              onClick={() => handleOpenDrawer("add")}
            >
              Add Clothes
            </button>
          </div>

          {loading ? (
            <div className="text-center text-xl">Loading clothes...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedClothes.map((clothes) => (
                  <div
                    key={clothes._id}
                    className="border rounded-lg shadow-md p-4 bg-white cursor-pointer hover:shadow-lg transition"
                    onClick={() => handleOpenDrawer("modify", clothes)}
                  >
                    <h3 className="text-lg font-bold mb-2">{clothes.name}</h3>
                    <p className="text-sm text-gray-500">
                      Uploaded: {new Date(clothes.createdAt).toLocaleString()}
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
                Showing {startIndex + 1}-{Math.min(endIndex, clothes.length)} of {clothes.length} clothes categories
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
              {drawerType === "add" ? "Add Clothes Category" : "Modify Clothes"}
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
              placeholder="Enter clothes name"
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
                onClick={drawerType === "add" ? handleAddClothes : handleUpdateClothes}
              >
                {drawerType === "add" ? "Add Clothes" : "Update"}
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to delete "{selectedClothes?.name}"?
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
                  onClick={handleDeleteClothes}
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

export default Clothes;
