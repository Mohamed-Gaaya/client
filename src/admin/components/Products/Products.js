import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [clothesAndAccessories, setClothesAndAccessories] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get("http://localhost:5000/api/products");
        setProducts(productsResponse.data.products || []);

        // Fetch brands
        const brandsResponse = await axios.get("http://localhost:5000/api/brands");
        setBrands(brandsResponse.data.brands || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandDropdownOpen && !event.target.closest('.relative')) {
        setBrandDropdownOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [brandDropdownOpen]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product) => {
    navigate(`/admin/products/modify/${product._id}`);
  };

  // Filtered products
  const filteredProducts = products.filter((product) => {
    // Filter by brand
    if (selectedBrand !== "All" && product.brand !== selectedBrand) return false;

    // Filter by category
    if (selectedCategory !== "All" && product.category !== selectedCategory) return false;

    // Filter by "Clothes and Accessories"
    if (clothesAndAccessories) {
      return product.category === "Clothes" || product.category === "Accessories";
    }

    return true;
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Product Management</h2>
            <Link
              to="/admin/products/add"
              className="bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink transition"
            >
              Add Product
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-6 flex space-x-4">
            {/* Brand Filter */}
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
              className="border rounded px-4 py-2 bg-white flex items-center min-w-[200px]"
            >
              {selectedBrand === "All" ? (
                <span>All Brands</span>
              ) : (
                <div className="flex items-center gap-2">
                  {brands.find(b => b.name === selectedBrand)?.logo && (
                    <img
                      src={`http://localhost:5000/uploads/${brands.find(b => b.name === selectedBrand).logo}`}
                      alt=""
                      className="h-6 w-6 object-contain"
                    />
                  )}
                  <span>{selectedBrand}</span>
                </div>
              )}
              <span className="ml-auto">▼</span>
            </button>

            {brandDropdownOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg">
                <div
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedBrand("All");
                    setBrandDropdownOpen(false);
                  }}
                >
                  All Brands
                </div>
                {brands.map((brand) => (
                  <div
                    key={brand._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSelectedBrand(brand.name);
                      setBrandDropdownOpen(false);
                    }}
                  >
                    {brand.logo && (
                      <img
                        src={`http://localhost:5000/uploads/${brand.logo}`}
                        alt=""
                        className="h-6 w-6 object-contain"
                      />
                    )}
                    <span>{brand.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Category Filter */}
            <select
              className="border rounded px-4 py-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {Array.from(new Set(products.map((p) => p.category))).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Clothes & Accessories Filter */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={clothesAndAccessories}
                onChange={(e) => setClothesAndAccessories(e.target.checked)}
              />
              <span>Clothes & Accessories</span>
            </label>

            {/* Reset Filters */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => {
                setSelectedBrand("All");
                setSelectedCategory("All");
                setClothesAndAccessories(false);
              }}
            >
              Reset Filters
            </button>
          </div>

          {loading ? (
            <div className="text-center text-xl">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-xl">No products match your filters</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left border">ID</th>
                    <th className="px-4 py-2 text-left border">Name</th>
                    <th className="px-4 py-2 text-left border">Price</th>
                    <th className="px-4 py-2 text-left border">Category</th>
                    <th className="px-4 py-2 text-left border">Brand</th>
                    <th className="px-4 py-2 text-left border">Promo</th>
                    <th className="px-4 py-2 text-left border">Servings</th>
                    <th className="px-4 py-2 text-left border">Uploaded Date</th>
                    <th className="px-4 py-2 text-left border">Images</th>
                    <th className="px-4 py-2 text-left border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="px-4 py-2">{product._id || "N/A"}</td>
                      <td className="px-4 py-2">{product.name || "No Name"}</td>
                      <td className="px-4 py-2">
                        {product.price ? `$${product.price.toFixed(2)}` : "No Price"}
                      </td>
                      <td className="px-4 py-2">{product.category || "No Category"}</td>
                      <td className="px-4 py-2">
                      {brands.find((b) => b.name === product.brand)?.logo ? (
                        <img
                          src={`http://localhost:5000/uploads/${
                            brands.find((b) => b.name === product.brand).logo
                          }`}
                          alt={`${product.brand} logo`}
                          className="h-16 w-16 object-contain"
                        />
                      ) : (
                        "No Logo"
                      )}
                    </td>

                      <td className="px-4 py-2">
                        {product.hasPromo ? (
                          <div>
                            <span>Promo Price: ${product.promoPrice?.toFixed(2)}</span>
                            <br />
                            <span className="line-through">
                              Original: ${product.originalPrice?.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          "No Promo"
                        )}
                      </td>
                      <td className="px-4 py-2">{product.servings || "N/A"}</td>
                      <td className="px-4 py-2">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {Array.isArray(product.images) && product.images.length > 0 ? (
                          <img
                            src={`http://localhost:5000${product.images[0]}`}
                            alt={`${product.name || "Product"} - 1`}
                            className="h-16 w-16 object-cover"
                          />
                        ) : (
                          <span>No Images</span>
                        )}
                      </td>
                      <td className="px-4 py-2 flex space-x-4">
                        <button
                          className="text-customBlue hover:text-blue-500 transition"
                          onClick={() => handleEdit(product)}
                          title="Edit Product"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition"
                          onClick={() => handleDelete(product._id)}
                          title="Delete Product"
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

export default Products;
