import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleEdit = (brand) => {
    navigate("/admin/brands/modify", { state: { brand } });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/brands/${id}`);
      setBrands(brands.filter((brand) => brand._id !== id));
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
            <Link
              to="/admin/brands/add"
              className="bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink transition"
            >
              Add Brand
            </Link>
          </div>
          {loading ? (
            <div className="text-center text-xl">Loading brands...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left border">ID</th>
                    <th className="px-4 py-2 text-left border">Name</th>
                    <th className="px-4 py-2 text-left border">Logo</th>
                    <th className="px-4 py-2 text-left border">Uploaded At</th> {/* Add Uploaded At Column */}
                    <th className="px-4 py-2 text-left border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand._id} className="border-b">
                      <td className="px-4 py-2">{brand._id}</td>
                      <td className="px-4 py-2">{brand.name}</td>
                      <td className="px-4 py-2">
                        {brand.logo ? (
                          <img
                            src={`http://localhost:5000/uploads/${brand.logo}`}
                            alt={brand.name}
                            className="w-30 h-16 object-contain"
                          />
                        ) : (
                          <span>No Logo</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {/* Format Uploaded At Date */}
                        {brand.uploadedAt
                          ? new Date(brand.uploadedAt).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 flex space-x-4">
                        <button
                          className="text-customBlue hover:text-blue-500 transition"
                          onClick={() => handleEdit(brand)}
                          title="Edit Brand"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition"
                          onClick={() => handleDelete(brand._id)}
                          title="Delete Brand"
                        >
                          <FaTrash size={20} />
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

export default Brands;
