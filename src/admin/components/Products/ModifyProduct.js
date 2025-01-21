import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Navbar";
import axios from "axios";
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";

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
  const handleSizeChange = (e, index) => {
    const newSizeList = [...sizeList];
    newSizeList[index] = e.target.value;
    setSizeList(newSizeList);
  };
  
  const addSize = () => {
    if (sizeList.length < 5
    ) {
      setSizeList([...sizeList, ""]);
    }
  };
  
  const removeSize = (index) => {
    const newSizeList = sizeList.filter((_, i) => i !== index);
    setSizeList(newSizeList);
  };
  
  
  
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    size:"",
    brand: "",
    images: [],
    hasPromo: false,
    originalPrice: "",
    promoPrice: "",
    servings: "",
    longDescription: "", 
    shortDescription:"",
  });
  
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandLogo, setBrandLogo] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sizeList, setSizeList] = useState([""]);
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setlongDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [flavourList, setFlavourList] = useState([""]);
  const handleFlavourChange = (e, index) => {
    const newFlavourList = [...flavourList];
    newFlavourList[index] = e.target.value;
    setFlavourList(newFlavourList);
  };
  
  const addFlavour = () => {
    if (flavourList.length < 10) {
      setFlavourList([...flavourList, ""]);
    }
  };
  
  const removeFlavour = (index) => {
    const newFlavourList = flavourList.filter((_, i) => i !== index);
    setFlavourList(newFlavourList);
  };

  // Size validation - backend requires array and max 5 sizes
    const validSizes = sizeList.filter(size => size.trim());
    const newErrors = {};
    if (validSizes.length === 0) {
      newErrors.size = "At least one size is required.";
    }
    if (validSizes.length > 5) {
      newErrors.size = "Maximum 5 sizes allowed.";
    }

  // Fetch Product Data
// Update the useEffect fetch logic
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
      
      console.log("Fetched product:", product);

      // Set main product data
      setProductData({
        name: product.name || "",
        price: product.price || "",
        category: product.category || "",
        stock: product.stock || "",
        brand: product.brand || "",
        images: product.images || [],
        hasPromo: product.hasPromo || false,
        originalPrice: product.originalPrice || "",
        promoPrice: product.promoPrice || "",
        servings: product.servings || "",
        shortDescription: product.shortDescription || "",
        longDescription: product.longdescription || "", // Note: backend uses 'longdescription'
      });

      // Handle sizes - use the 'sizes' array from backend
      setSizeList(product.sizes || ['']);
      
      // Handle flavours - use the 'flavours' array from backend
      setFlavourList(product.flavours || ['']);
      
      // Set descriptions
      setShortDescription(product.shortDescription || '');
      setlongDescription(product.longdescription || ''); // Note: backend uses 'longdescription'
      
      // Set category and subcategory
      setProductCategory(product.category || '');
      setProductSubCategory(product.subCategory || '');
      
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
    if (!productData.stock || isNaN(productData.stock) || productData.stock < 0) {
      newErrors.stock = "Valid stock quantity is required.";
    }
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const formData = new FormData();
    
    // Use the correct property names for backend
    formData.append('sizes', JSON.stringify(sizeList.filter(size => size.trim())));
    formData.append('flavours', JSON.stringify(flavourList.filter(flavour => flavour.trim())));
    formData.append('shortDescription', shortDescription);
    formData.append('longdescription', longDescription); // Note: backend uses 'longdescription'
    formData.append('subCategory', productSubCategory);
      
    // Find the complete brand object from the brands array
    const selectedBrand = brands.find(brand => brand.name === productData.brand);
    
    // Append all product data except images
    Object.keys(productData).forEach(key => {
      if (key === 'brand') {
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
            {/* Stock Quantity */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Stock Quantity</label>
              <input
                type="number"
                name="stock" 
                value={productData.stock}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.stock ? "border-red-600" : "focus:ring-blue-600"}`}
                required
              />
              {errors.stock && <p className="text-red-600 text-sm">{errors.stock}</p>}
            </div>
            {/* Sizes */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Sizes</label>
              <div className="flex flex-wrap gap-2">
                {sizeList.map((size, index) => (
                  <div key={index} className="flex items-center mb-2 space-x-2">
                    <input
                        type="text"
                        value={size}
                        onChange={(e) => handleSizeChange(e, index)}
                        className={`w-40 px-4 py-2 border rounded ${errors.size ? "border-red-600" : ""}`}
                        placeholder={`Size ${index + 1}`}
                        required
                      />
                    <button 
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <FaTrashAlt size={20} /> {/* Trash icon */}
                    </button>
                  </div>
                ))}
              </div>

              {/* Add size button */}
              {sizeList.length < 5 && (
                <button
                  type="button"
                  onClick={addSize}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none flex items-center gap-2"
                >
                  <FaPlusCircle size={18} /> {/* Add icon */}
                  Add Size
                </button>
              )}

              {errors.size && <p className="text-red-600 text-sm">{errors.size}</p>}
            </div>


            {/* Product Category */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <select
                value={productData.category}
                onChange={(e) => {
                  setProductCategory(e.target.value);
                  // Clear the subcategory when a new category is selected
                  setProductSubCategory('');
                }}
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

            {/* Subcategory (shown if "Clothes" or "Accessories" is selected) */}
            {(productCategory === "Clothes" || productCategory === "Accessories") && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Subcategory</label>
                <select
                  value={productSubCategory}
                  onChange={(e) => setProductSubCategory(e.target.value)}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                    errors.productSubCategory ? "border-red-600" : "focus:ring-blue-600"
                  }`}
                  required
                >
                  <option value="">Select a Subcategory</option>
                  {loadingCategories ? (
                    <option>Loading...</option>
                  ) : productCategory === "Clothes" ? (
                    Clothes.map((clothes) => (
                      <option key={clothes._id} value={clothes.name}>
                        {clothes.name}
                      </option>
                    ))
                  ) : (
                    accessories.map((accessory) => (
                      <option key={accessory._id} value={accessory.name}>
                        {accessory.name}
                      </option>
                    ))
                  )}
                </select>
                {errors.productSubCategory && (
                  <p className="text-red-600 text-sm">{errors.productSubCategory}</p>
                )}
              </div>
            )}

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
            {/* Flavour */}
                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Flavours</label>
                            <div className="flex flex-wrap gap-2">
                              {flavourList.map((flavour, index) => (
                                <div key={index} className="flex items-center mb-2 space-x-2">
                                  <input
                                    type="text"
                                    value={flavour}
                                    onChange={(e) => handleFlavourChange(e, index)}
                                    className={`w-40 px-4 py-2 border rounded ${errors.flavour ? "border-red-600" : ""}`}
                                    placeholder={`Flavour ${index + 1}`}
                                    required
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeFlavour(index)}
                                    className="text-red-600 hover:text-red-800 focus:outline-none"
                                  >
                                    <FaTrashAlt size={20} /> {/* Trash icon */}
                                  </button>
                                </div>
                              ))}
                            </div>
            
                            {/* Add flavour button */}
                            {flavourList.length < 10 && (
                              <button
                                type="button"
                                onClick={addFlavour}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none flex items-center gap-2"
                              >
                                <FaPlusCircle size={18} /> {/* Add icon */}
                                Add Flavour
                              </button>
                            )}
            
                            {errors.flavour && <p className="text-red-600 text-sm">{errors.flavour}</p>}
                          </div>

            

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

            {/* Short Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Short Description</label>
              <textarea
                value={productData.shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows="2"
                className={`w-full px-4 py-2 border rounded ${errors.shortDescription ? "border-red-600" : ""}`}
                required
              />
              {errors.shortDescription && <p className="text-red-600 text-sm">{errors.shortDescription}</p>}
            </div>

            {/* Long Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Long Description</label>
              <textarea
                value={productData.longDescription}
                onChange={(e) => setlongDescription(e.target.value)}
                rows="6"
                className={`w-full px-4 py-2 border rounded ${errors.longDescription ? "border-red-600" : ""}`}
              />
              {errors.longDescription && <p className="text-red-600 text-sm">{errors.longDescription}</p>}
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