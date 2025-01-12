import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar"; 
import Header from "../Navbar"; 
import axios from "axios"; // Import axios for HTTP requests

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send the POST request to the backend
      const response = await axios.post("http://localhost:5000/api/categories/add", {
        name: categoryName,
      });

      // If successful, navigate to the Categories page
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
          <h2 className="text-2xl font-bold mb-6 text-center">Add New Category</h2>
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
              {loading ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
