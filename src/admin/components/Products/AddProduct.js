import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar"; // Ensure path is correct
import Header from "../Navbar"; // Ensure path is correct

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

  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    setProductImages([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate product addition logic
    console.log("Product added:", {
      productName,
      productPrice,
      productCategory,
      productBrand,
      productImages,
      hasPromo,
      originalPrice: hasPromo ? originalPrice : null,
      promoPrice: hasPromo ? promoPrice : null,
      servings,
      description,
    });

    // Redirect to the Products page
    navigate("/admin/products");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
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
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* Product Price */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Product Price</label>
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* Product Category */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Select a Category</option>
                <option value="Supplements">Supplements</option>
                <option value="Vitamins">Vitamins</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* Product Brand */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Brand</label>
              <input
                type="text"
                value={productBrand}
                onChange={(e) => setProductBrand(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* Product Images */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Product Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
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
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Original Price</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Promo Price</label>
                  <input
                    type="number"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
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
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows="4"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
