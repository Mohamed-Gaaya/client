import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Navbar";
import axios from "axios";

const ModifyProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const BrandDisplay = ({ name, logo }) => (
    <div className="flex items-center gap-2">
      {logo && (
        <img
          src={logo}
          alt={`${name} logo`}
          className="w-14 h-14 object-contain"
        />
      )}
      <span>{name}</span>
    </div>
  );
  
  
  
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    images: [],
    hasPromo: false,
    originalPrice: "",
    promoPrice: "",
    servings: "",
    description: "", 
  });
  
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandLogo, setBrandLogo] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        console.error("No product ID provided");
        navigate("/admin/products");
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        const product = response.data.product;
        
        setProductData({
          name: product.name || "",
          price: product.price || "",
          category: product.category || "",
          brand: product.brand?.name || product.brand || "", // Change this line
          images: product.images || [],
          hasPromo: product.hasPromo || false,
          originalPrice: product.originalPrice || "",
          promoPrice: product.promoPrice || "",
          servings: product.servings || "",
          description: product.description || "",
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        alert("Error fetching product details");
        navigate("/admin/products");
      }
    };
  
    fetchProduct();
  }, [id, navigate]);

  // Fetch Categories and Brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/categories"),
          axios.get("http://localhost:5000/api/brands")
        ]);
        setCategories(categoriesRes.data.categories);
        setBrands(brandsRes.data.brands);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productData.name.trim()) newErrors.name = "Product name is required.";
    if (!productData.price || productData.price <= 0) newErrors.price = "Enter a valid price.";
    if (!productData.category) newErrors.category = "Please select a category.";
    if (!productData.brand.trim()) newErrors.brand = "Brand name is required.";
    if (productData.hasPromo) {
      if (!productData.originalPrice || productData.originalPrice <= 0) {
        newErrors.originalPrice = "Enter a valid original price.";
      }
      if (!productData.promoPrice || productData.promoPrice <= 0) {
        newErrors.promoPrice = "Enter a valid promo price.";
      }
      if (parseFloat(productData.promoPrice) >= parseFloat(productData.originalPrice)) {
        newErrors.promoPrice = "Promo price must be less than the original price.";
      }
    }
    if (!productData.servings || productData.servings <= 0) {
      newErrors.servings = "Enter valid servings.";
    }
    if (!productData.description.trim()) newErrors.description = "Description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const formData = new FormData();
  
  // Find the complete brand object from the brands array
  const selectedBrand = brands.find(brand => brand.name === productData.brand);
  
  // Append all product data except images
  Object.keys(productData).forEach(key => {
    if (key === 'brand') {
      // Send the brand ID instead of just the name
      formData.append('brand', selectedBrand?._id || productData.brand);
    } else if (key !== 'images') {
      formData.append(key, productData[key]);
    }
  });

  // Append new images if any
  newImages.forEach(image => {
    formData.append("image", image);
  });

  try {
    const response = await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      navigate("/admin/products");
    }
  } catch (err) {
    console.error("Error updating product:", err);
    alert(err.response?.data?.message || "Error updating product");
  }
};

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header />
        <div className="bg-white p-8 rounded shadow-md max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Edit Product</h2>
          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.name ? "border-red-600" : "focus:ring-blue-600"
                }`}
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>

            {/* Product Price */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Product Price</label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.price ? "border-red-600" : "focus:ring-blue-600"
                }`}
              />
              {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <select
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.category ? "border-red-600" : "focus:ring-blue-600"
                }`}
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
            </div>

            {/* Brand */}
            <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Brand</label>
            <div className="relative">
            {/* Selected Brand Display */}
            <div
              className="border rounded px-4 py-2 bg-white cursor-pointer flex items-center justify-between"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {productData.brand ? (
                <BrandDisplay
                  name={productData.brand}
                  logo={`http://localhost:5000/uploads/${brands.find(brand => brand.name === productData.brand)?.logo}`}
                />
              ) : (
                <span className="text-gray-400">Select a Brand</span>
              )}
              <span className="ml-2">▼</span>
            </div>
              {dropdownOpen && (
                <ul className="absolute z-10 mt-2 bg-white border rounded shadow-lg max-h-60 overflow-auto w-full">
                  {brands.map((brand) => (
                    <li
                      key={brand._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setProductData((prev) => ({
                          ...prev,
                          brand: brand.name,
                          brandLogo: brand.logo,
                        }));
                        setDropdownOpen(false);
                      }}
                    >
                      <BrandDisplay
                        name={brand.name}
                        logo={`http://localhost:5000/uploads/${brand.logo}`}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {errors.brand && <p className="text-red-600 text-sm">{errors.brand}</p>}
          </div>


            {/* Images */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Current Images</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {productData.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${image}`}
                    alt={`Product ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
              
              <label className="block text-gray-700 font-medium mb-2">Upload New Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {newImages.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-2">
                  {newImages.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`New ${index + 1}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Promo Section */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                <input
                  type="checkbox"
                  name="hasPromo"
                  checked={productData.hasPromo}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Has Promo
              </label>
            </div>

            {productData.hasPromo && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Original Price</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={productData.originalPrice}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                      errors.originalPrice ? "border-red-600" : "focus:ring-blue-600"
                    }`}
                  />
                  {errors.originalPrice && (
                    <p className="text-red-600 text-sm">{errors.originalPrice}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Promo Price</label>
                  <input
                    type="number"
                    name="promoPrice"
                    value={productData.promoPrice}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                      errors.promoPrice ? "border-red-600" : "focus:ring-blue-600"
                    }`}
                  />
                  {errors.promoPrice && (
                    <p className="text-red-600 text-sm">{errors.promoPrice}</p>
                  )}
                </div>
              </>
            )}

            {/* Servings */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Servings</label>
              <input
                type="number"
                name="servings"
                value={productData.servings}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.servings ? "border-red-600" : "focus:ring-blue-600"
                }`}
              />
              {errors.servings && <p className="text-red-600 text-sm">{errors.servings}</p>}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.description ? "border-red-600" : "focus:ring-blue-600"
                }`}
              />
              {errors.description && (
                <p className="text-red-600 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-customBlue text-white px-6 py-3 rounded hover:bg-customPink focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifyProduct;