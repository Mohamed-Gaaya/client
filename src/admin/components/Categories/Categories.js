import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar"; // Adjust path if necessary
import Header from "../Navbar"; // Adjust path if necessary
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios"; // Import axios for HTTP requests

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from the backend when the component mounts
  useEffect(() => {
    // Function to fetch categories
    const fetchCategories = async () => {
      try {
        // Make a GET request to fetch categories
        const response = await axios.get("http://localhost:5000/api/categories");

        // Update state with fetched categories
        setCategories(response.data.categories); // Assuming your backend returns categories in `response.data.categories`
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array to run only once on mount

  const handleEdit = (id) => {
    console.log(`Edit Category with id: ${id}`);
    // Implement editing logic (navigate to an edit page or open a modal)
  };

  const handleDelete = async (id) => {
    console.log(`Delete Category with id: ${id}`);
    try {
      // Make a DELETE request to delete the category
      await axios.delete(`http://localhost:5000/api/categories/${id}`);

      // Remove the category from the state after successful deletion
      setCategories(categories.filter((category) => category._id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <Header />

        {/* Card Container */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Category Management</h2>
            {/* Add Category Button with redirection */}
            <Link
              to="/admin/categories/add" // Link to the add category page
              className="bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink transition"
            >
              Add Category
            </Link>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="text-center text-xl">Loading categories...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left border">ID</th>
                    <th className="px-4 py-2 text-left border">Name</th>
                    <th className="px-4 py-2 text-left border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id} className="border-b">
                      <td className="px-4 py-2">{category._id}</td>
                      <td className="px-4 py-2">{category.name}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-blue-600 text-white p-2 rounded mr-2"
                          onClick={() => handleEdit(category._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white p-2 rounded"
                          onClick={() => handleDelete(category._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories; // Ensure the export matches the component name
