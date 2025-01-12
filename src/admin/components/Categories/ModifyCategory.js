import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import Sidebar from "../Sidebar"; 
import Header from "../Navbar"; 
import axios from "axios";

const ModifyCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation(); // Access passed state
  const category = state?.category; // Get the category from state

  useEffect(() => {
    if (category) {
      setCategoryName(category.name); // Pre-fill with existing name
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send PUT request to update the category
      const response = await axios.put(`http://localhost:5000/api/categories/${category._id}`, {
        name: categoryName,
      });

      console.log(response.data.message);
      navigate("/admin/categories");
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header />
        <div className="bg-white p-8 rounded shadow-md max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Modify Category</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifyCategory;
