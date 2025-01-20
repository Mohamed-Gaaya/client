import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Navbar";
import axios from "axios";
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";

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
  const [flavour, setFlavour] = useState("");
  const [size, setSize] = useState("");
  const [stock, setStock] = useState(""); // Added stock state
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandLogo, setBrandLogo] = useState("");
  const [errors, setErrors] = useState({});
  const [flavourList, setFlavourList] = useState([""]);
  const [productSubCategory, setProductSubCategory] = useState("");
  const [Clothes, setClothes] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [sizeList, setSizeList] = useState([""]);

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

  useEffect(() => {
    const fetchsubCategories = async () => {
      try {
        const clothesResponse = await axios.get("http://localhost:5000/api/clothes");
        const accessoriesResponse = await axios.get("http://localhost:5000/api/accessories");
        setClothes(clothesResponse.data.clothes || []);
        setAccessories(accessoriesResponse.data.accessories || []);
      } catch (err) {
        setError("Failed to fetch categories.");
      } finally {
        setLoadingCategories(false);
      }
    };
  
    fetchsubCategories();
  }, []);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Validation failed", errors);
      return;
    }

    const formData = new FormData();
    
    // Required fields - these must match the backend expectations
    formData.append("name", productName.trim());
    formData.append("price", productPrice);
    formData.append("category", productCategory);
    formData.append("brand", productBrand);
    formData.append("shortDescription", shortDescription.trim());
    formData.append("stock", stock);
    
    // The backend expects 'size' as an array, not 'sizes'
    if (sizeList.length > 0) {
      sizeList.filter(sizes => sizes.trim()).forEach(size => {
        formData.append("sizes[]", size); // Use 'sizes[]' to indicate an array
      });
    }
    
    // Optional fields
    if (longDescription) {
      formData.append("longdescription", longDescription.trim()); // Note: matches backend casing
    }
    
    if (flavourList.length > 0) {
      formData.append("flavours", JSON.stringify(flavourList.filter(flavour => flavour.trim())));
    }

    if (servings) {
      formData.append("servings", servings);
    }
    
    // Promo information - match backend expectations
    formData.append("hasPromo", String(hasPromo));
    if (hasPromo) {
      formData.append("originalPrice", originalPrice);
      formData.append("promoPrice", promoPrice);
    }

    // Subcategory if applicable
    if (productSubCategory) {
      formData.append("subCategory", productSubCategory);
    }

    // Handle image uploads - backend expects "image", not "productImages" or "images"
    if (productImages && productImages.length > 0) {
      productImages.forEach((file) => {
        formData.append("image", file);
      });
    }

    // Log form data for debugging
    console.log("Sending form data:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status === 201) { // Backend returns 201 for successful creation
        navigate("/admin/products");
      }
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.data?.error) {
        alert(`Error: ${err.response.data.error}`);
      } else if (err.response?.data?.details) {
        alert(`Error: ${err.response.data.details}`);
      } else {
        alert("Error adding product. Please try again.");
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Match backend validation requirements
    if (!productName.trim()) newErrors.productName = "Product name is required.";
    if (!productPrice || isNaN(productPrice) || productPrice <= 0) {
      newErrors.productPrice = "Valid product price is required.";
    }
    if (!productCategory) newErrors.productCategory = "Category is required.";
    if (!productBrand) newErrors.productBrand = "Brand is required.";
    if (!shortDescription.trim()) newErrors.shortDescription = "Short description is required.";
    if (!stock || isNaN(stock) || stock < 0) {
      newErrors.stock = "Valid stock quantity is required.";
    }
    
    // Size validation - backend requires array and max 5 sizes
    const validSizes = sizeList.filter(size => size.trim());
    if (validSizes.length === 0) {
      newErrors.size = "At least one size is required.";
    }
    if (validSizes.length > 5) {
      newErrors.size = "Maximum 5 sizes allowed.";
    }

    // Flavour validation - backend allows max 10 flavours
    const validFlavours = flavourList.filter(flavour => flavour.trim());
    if (validFlavours.length > 10) {
      newErrors.flavour = "Maximum 10 flavours allowed.";
    }

    // Promo validation
    if (hasPromo) {
      if (!originalPrice || isNaN(originalPrice) || originalPrice <= 0) {
        newErrors.originalPrice = "Valid original price is required for promo items.";
      }
      if (!promoPrice || isNaN(promoPrice) || promoPrice <= 0) {
        newErrors.promoPrice = "Valid promo price is required for promo items.";
      }
      if (parseFloat(promoPrice) >= parseFloat(originalPrice)) {
        newErrors.promoPrice = "Promo price must be less than original price.";
      }
    }

    // Image validation - backend allows up to 5 images
    if (!productImages || productImages.length === 0) {
      newErrors.images = "At least one product image is required.";
    }
    if (productImages && productImages.length > 5) {
      newErrors.images = "Maximum 5 images allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
             {/* Stock Quantity */}
              <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
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
                value={productCategory}
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
                            src={`http://localhost:5000/uploads/${brand.logo}`}
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
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.servings ? "border-red-600" : "focus:ring-blue-600"}`}
                required
              />
              {errors.servings && <p className="text-red-600 text-sm">{errors.servings}</p>}
            </div>

            {/* Short Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Short Description</label>
              <textarea
                value={shortDescription}
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
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                rows="6"
                className={`w-full px-4 py-2 border rounded ${errors.longDescription ? "border-red-600" : ""}`}
                required
              />
              {errors.longDescription && <p className="text-red-600 text-sm">{errors.longDescription}</p>}
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
