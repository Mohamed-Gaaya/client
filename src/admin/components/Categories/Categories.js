import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header/Header";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(""); // "add" or "modify"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Success state for add category
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for add category form
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Confirmation pop-up state
  const [currentPage, setCurrentPage] = useState(1);


  // Pagination Logic
  const itemsPerPage = 16;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedCategories = categories.slice(startIndex, endIndex);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Generate array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenDrawer = (type, category = null) => {
    setDrawerType(type);
    setSelectedCategory(category);
    setCategoryName(category ? category.name : "");
    setNewCategoryName(""); // Reset the new category name when opening the drawer
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedCategory(null);
    setShowDeleteConfirm(false); // Close the delete confirmation when the drawer closes
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:5000/api/categories/add", {
        name: newCategoryName.trim(),
      });
      setCategories([...categories, response.data.category]);
      setNewCategoryName("");
      handleCloseDrawer(); // Close the drawer after success
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/categories/${selectedCategory._id}`,
        { name: categoryName }
      );
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === response.data.category._id ? response.data.category : category
        )
      );
      handleCloseDrawer();
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${selectedCategory._id}`);
      setCategories(categories.filter((category) => category._id !== selectedCategory._id));
      handleCloseDrawer(); // Close the drawer after deleting
      setShowDeleteConfirm(false); // Close the delete confirmation pop-up
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Category Management</h2>
            <button
              className="bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink"
              onClick={() => handleOpenDrawer("add")}
            >
              Add Category
            </button>
          </div>
  
          {loading ? (
            <div className="text-center text-xl">Loading categories...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedCategories.map((category) => (
                  <div
                    key={category._id}
                    className="border rounded-lg shadow-md p-4 bg-white cursor-pointer hover:shadow-lg transition"
                    onClick={() => handleOpenDrawer("modify", category)}
                  >
                    <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      Uploaded: {new Date(category.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
  
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-2 mt-6">
                {pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded ${
                      currentPage === pageNum
                        ? 'bg-customBlue text-white hover:bg-customPink'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
  
              {/* Total Items Info */}
              <div className="text-center mt-4 text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, categories.length)} of {categories.length} categories
              </div>
            </>
          )}
        </div>
  
        {/* Add Category Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform ${
            drawerOpen && drawerType === "add" ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 z-50`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Add Category</h2>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={handleCloseDrawer}
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="p-6">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category Name"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
            />
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
                onClick={handleAddCategory}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Category"}
              </button>
            </div>
          </div>
        </div>
  
        {/* Modify Category Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform ${
            drawerOpen && drawerType === "modify" ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 z-50`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Modify Category</h2>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={handleCloseDrawer}
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="p-6">
            <label className="block text-sm font-bold mb-2">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
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
                onClick={handleUpdateCategory}
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
              <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete "{categoryName}"?</h3>
              <div className="flex justify-between">
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  No
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  onClick={handleDeleteCategory}
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

export default Categories;
