import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Navbar";
import axios from "axios";

const AddBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [logo, setLogo] = useState(null); // New state for logo
  const [logoPreview, setLogoPreview] = useState(null); // State for image preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    
    // Create a preview URL for the selected image
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare form data for logo upload
    const formData = new FormData();
    formData.append("name", brandName);
    if (logo) {
      formData.append("image", logo);
    }

    try {
      // Send the POST request to the backend
      const response = await axios.post("http://localhost:5000/api/brands/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // If successful, navigate to the Brands page
      console.log(response.data.message);
      navigate("/admin/brands");
    } catch (err) {
      setError(err.response ? err.response.data.error : "An error occurred");
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
          <h2 className="text-2xl font-bold mb-6 text-center">Add New Brand</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Logo</label>
              <input
                type="file"
                onChange={handleLogoChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                accept="image/*"
              />
              {logoPreview && (
                <div className="mt-4">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className=" object-cover border rounded"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Brand"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBrand;
