import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import Sidebar from "../Sidebar"; 
import Header from "../Navbar"; 
import axios from "axios";

const ModifyBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [logo, setLogo] = useState(null); // Logo file
  const [previewLogo, setPreviewLogo] = useState(""); // Logo preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const brand = state?.brand;
  
   

  useEffect(() => {
    if (brand) {
      setBrandName(brand.name); // Pre-fill with existing name
      setPreviewLogo(brand.logo); // Show existing logo
    }
  }, [brand]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLogo(file);
      setPreviewLogo(objectUrl);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", brandName);
    if (logo) {
      formData.append("image", logo); // Append logo file if updated
    }

    try {
      // Send PUT request to update the brand
      const response = await axios.put(
        `http://localhost:5000/api/brands/${brand._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(response.data.message);
      navigate("/admin/brands");
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
          <h2 className="text-2xl font-bold mb-6 text-center">Modify Brand</h2>
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
            <label className="block text-gray-700 font-medium mb-2">Brand Logo</label>
            <input
              type="file" 
              onChange={handleLogoChange}
              className="w-full px-4 py-2 border rounded focus:outline-none"
              accept="image/*"
            />
            {logo ? ( // If new image is selected
              <img
                src={previewLogo}
                name="image"
                alt="New Logo Preview"
                className="mt-4 max-h-40 rounded shadow"
              />
            ) : ( // Show existing logo if no new image is selected
              <img
                src={`http://localhost:5000/uploads/${brand.logo}`}
                alt="Current Logo"
                className="mt-4 max-h-40 rounded shadow"
              />
            )}
          </div>


            <button
              type="submit"
              className="w-full bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Brand"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifyBrand;
