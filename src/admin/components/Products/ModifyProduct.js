import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Navbar";
import axios from "axios";

const ModifyProduct = () => {
  const { id } = useParams(); // Get product ID from URL
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
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();
  const product = state?.product;

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
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
      }
    };
    fetchBrands();
  }, []);

  // Fetch Product Details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products`);
        const product = response.data.product;

        if (!product) {
          throw new Error("Product not found");
        }

        setProductName(product.name);
        setProductPrice(product.price);
        setProductCategory(product.category);
        setProductBrand(product.brand);
        setProductImages(product.images || []);
        setHasPromo(product.hasPromo);
        setOriginalPrice(product.originalPrice || "");
        setPromoPrice(product.promoPrice || "");
        setServings(product.servings);
        setDescription(product.description);
        if (product.brandLogo) setBrandLogo(product.brandLogo);

      } catch (err) {
        console.error("Error fetching product details:", err);
        alert("Failed to load product details.");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id, navigate]);

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

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("category", productCategory);
    formData.append("brand", productBrand);

    // Append actual image files, not URLs
    productImages.forEach((image) => formData.append("images", image));

    formData.append("hasPromo", hasPromo);
    if (hasPromo) {
      formData.append("originalPrice", originalPrice);
      formData.append("promoPrice", promoPrice);
    }
    formData.append("servings", servings);
    formData.append("description", description);

    try {
      const response = await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        navigate("/admin/products");
      } else {
        alert(response.data.message || "Failed to update product.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      alert(err.response?.data?.message || "Error updating product. Please try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header />
        <div className="bg-white p-8 rounded shadow-md max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Modify Product</h2>
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

            {/* Brand */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Brand</label>
              <div className="relative">
                <div
                  className="border rounded px-4 py-2 bg-white cursor-pointer flex items-center justify-between"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {productBrand ? (
                    <div className="flex items-center gap-2">
                      {brandLogo && (
                        <img
                          src={`http://localhost:5000/uploads/${brandLogo}`}
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

                {dropdownOpen && (
                  <ul className="absolute z-10 mt-2 bg-white border rounded shadow-lg max-h-60 overflow-auto w-full">
                    {brands.map((brand) => (
                      <li
                        key={brand._id}
                        className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          setProductBrand(brand.name);
                          setBrandLogo(brand.logo || "");
                          setDropdownOpen(false);
                        }}
                      >
                        {brand.logo && (
                          <img
                            src={`http://localhost:5000/${brand.logo}`}
                            alt="Brand Logo"
                            className="w-8 h-8 object-contain"
                          />
                        )}
                        <span>{brand.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.productBrand && <p className="text-red-600 text-sm">{errors.productBrand}</p>}
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Product Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
              />
            </div>

            {/* Promo Prices */}
            {hasPromo && (
              <div>
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

                {/* {/* Promo Price */}
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
              </div>
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
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.description ? "border-red-600" : "focus:ring-blue-600"}`}
                rows="4"
                required
              ></textarea>
              {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Loading..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifyProduct;
