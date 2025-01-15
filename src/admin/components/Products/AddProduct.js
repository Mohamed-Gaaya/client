import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Navbar";
import axios from "axios";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [hasPromo, setHasPromo] = useState(false);
  const [originalPrice, setOriginalPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [servings, setServings] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandLogo, setBrandLogo] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch Categories
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

  // Fetch Brands
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

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files); // Store the actual files, not URLs
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!productName.trim()) newErrors.productName = "Product name is required.";
    if (!productPrice || productPrice <= 0) newErrors.productPrice = "Enter a valid price.";
    if (!productCategory) newErrors.productCategory = "Please select a category.";
    if (!productBrand.trim()) newErrors.productBrand = "Brand name is required.";
    if (hasPromo) {
      if (!originalPrice || originalPrice <= 0) newErrors.originalPrice = "Enter a valid original price.";
      if (!promoPrice || promoPrice <= 0) newErrors.promoPrice = "Enter a valid promo price.";
      if (parseFloat(promoPrice) >= parseFloat(originalPrice)) {
        newErrors.promoPrice = "Promo price must be less than the original price.";
      }
    }
    if (!servings || servings <= 0) newErrors.servings = "Enter valid servings.";
    if (!description.trim()) newErrors.description = "Description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("category", productCategory);
    formData.append("brand", productBrand);
  
    // Append images
    productImages.forEach((image) => formData.append("image", image));
  
    formData.append("hasPromo", hasPromo);
    if (hasPromo) {
      formData.append("originalPrice", originalPrice);
      formData.append("promoPrice", promoPrice);
    }
    formData.append("servings", servings);
    formData.append("description", description);
  
    // Debugging the payload
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        navigate("/admin/products");
      } else {
        console.error("Unexpected response:", response);
        alert(response.data.message || "Failed to add product.");
      }
    } catch (err) {
      console.error("Error adding product:", err.response || err);
      alert(err.response?.data?.message || "Error adding product. Please try again.");
    }
  };
  



  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header />
        <div className="bg-white p-8 rounded shadow-md max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.productName ? "border-red-600" : "focus:ring-blue-600"}`}
                required
              />
              {errors.productName && <p className="text-red-600 text-sm">{errors.productName}</p>}
            </div>

            {/* Product Price */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Product Price</label>
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.productPrice ? "border-red-600" : "focus:ring-blue-600"}`}
                required
              />
              {errors.productPrice && <p className="text-red-600 text-sm">{errors.productPrice}</p>}
            </div>

            {/* Product Category */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.productCategory ? "border-red-600" : "focus:ring-blue-600"}`}
                required
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.productCategory && <p className="text-red-600 text-sm">{errors.productCategory}</p>}
            </div>

              {/* Brand name and logo */}
              <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">Brand</label>
      <div className="relative">
        {/* Dropdown Header */}
        <div
          className="border rounded px-4 py-2 bg-white cursor-pointer flex items-center justify-between"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {productBrand ? (
            <div className="flex items-center gap-2">
              {brandLogo && (
                <img
                  src={`http://localhost:5000/${brandLogo}`}
                  alt="Brand Logo"
                  className="w-14 h-14 object-contain"
                />
              )}
              <span>{productBrand}</span>
            </div>
          ) : (
            <span className="text-gray-400">Select a Brand</span>
          )}
          <span className="ml-2">▼</span> {/* Downward Arrow */}
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <ul className="absolute z-10 mt-2 bg-white border rounded shadow-lg max-h-60 overflow-auto w-full">
            {brands.map((brand) => (
              <li
                key={brand._id}
                className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setProductBrand(brand.name);
                  setBrandLogo(brand.logo);
                  setDropdownOpen(false);
                }}
              >
                {brand.logo && (
                  <img
                    src={`http://localhost:5000/${brand.logo}`}
                    alt="Brand Logo"
                    className="w-14 h-14 object-contain"
                        />
                      )}
                      <span>{brand.name}</span>
                        </li>
                      ))}
                    </ul>
                      )}
                </div>
                {/* Error Message */}
                {errors.productBrand && (
                  <p className="text-red-600 text-sm">{errors.productBrand}</p>
                )}
              </div>


            {/* Product Images */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Product Images</label>
              <input
                type="file"
                name="image" 
                multiple
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex flex-wrap gap-4 mt-2">
                {productImages.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)} // Preview the image
                    alt={`Preview ${index + 1}`}
                    className=" object-cover border rounded"
                  />
                ))}
              </div>
            </div>

            {/* Promo Section */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                <input
                  type="checkbox"
                  checked={hasPromo}
                  onChange={(e) => setHasPromo(e.target.checked)}
                  className="mr-2"
                />
                Has Promo
              </label>
            </div>

            {hasPromo && (
              <>
                {/* Original Price */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Original Price</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.originalPrice ? "border-red-600" : "focus:ring-blue-600"}`}
                  />
                  {errors.originalPrice && <p className="text-red-600 text-sm">{errors.originalPrice}</p>}
                </div>

                {/* Promo Price */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Promo Price</label>
                  <input
                    type="number"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.promoPrice ? "border-red-600" : "focus:ring-blue-600"}`}
                  />
                  {errors.promoPrice && <p className="text-red-600 text-sm">{errors.promoPrice}</p>}
                </div>
              </>
            )}

            {/* Servings */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Servings</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.servings ? "border-red-600" : "focus:ring-blue-600"}`}
                required
              />
              {errors.servings && <p className="text-red-600 text-sm">{errors.servings}</p>}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.description ? "border-red-600" : "focus:ring-blue-600"}`}
                required
              />
              {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-customBlue text-white px-6 py-3 rounded hover:bg-customPi focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={loading}
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
