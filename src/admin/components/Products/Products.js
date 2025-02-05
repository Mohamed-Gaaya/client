import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header/Header";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]); // For all categories
  const [clothesCategories, setClothesCategories] = useState([]); // For Clothes category
  const [accessoriesCategories, setAccessoriesCategories] = useState([]); // For Accessories category
  const [loading, setLoading] = useState(true);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false); 

  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [clothesAndAccessories, setClothesAndAccessories] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get("http://localhost:5000/api/products", {
          params: { 
            timestamp: new Date().getTime(),
            limit: 1000,  // Move this inside params object
            sort: "createdAt",  // Add sorting parameter
            sortOrder: "asc"   // Sort in descending order
          }
        });
        console.log("Total products received:", productsResponse.data.products.length);
        console.log(productsResponse.data);
  
        const sortedProducts = productsResponse.data.products || [];
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setProducts(sortedProducts);
  
        const brandsResponse = await axios.get("http://localhost:5000/api/brands");
        setBrands(brandsResponse.data.brands || []);
        
        const categoriesResponse = await axios.get("http://localhost:5000/api/categories");
        setCategories(categoriesResponse.data || []);
        
        const clothesCategoriesResponse = await axios.get("http://localhost:5000/api/clothes");
        const accessoriesCategoriesResponse = await axios.get("http://localhost:5000/api/accessories");
  
        setClothesCategories(clothesCategoriesResponse.data || []);
        setAccessoriesCategories(accessoriesCategoriesResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [refreshTrigger]); 
  const handleAddProduct = async (newProductData) => {
    try {
      await axios.post("http://localhost:5000/api/products", newProductData);
      setRefreshTrigger((prev) => !prev); // Toggle refreshTrigger to re-fetch data
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      const brandDropdown = event.target.closest(".brand-dropdown");
      const categoryDropdown = event.target.closest(".category-dropdown");
      
      if (brandDropdownOpen && !brandDropdown) {
        setBrandDropdownOpen(false);
      }
      if (categoryDropdownOpen && !categoryDropdown) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [brandDropdownOpen, categoryDropdownOpen]);

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

  const filteredProducts = products.filter((product) => {
    if (selectedBrand !== "All" && product.brand !== selectedBrand) return false;
    if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
    if (clothesAndAccessories) {
      return product.category === "Clothes" || product.category === "Accessories";
    }
    return true;
  });

  const itemsPerPage = 8;
  const totalFilteredProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalFilteredProducts / itemsPerPage);
  const validCurrentPage = Math.min(currentPage, totalPages || 1);
  if (currentPage !== validCurrentPage) setCurrentPage(validCurrentPage);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedProducts = filteredProducts.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
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
            <div className="relative inline-block brand-dropdown">
              <button
                type="button"
                onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                className="border rounded px-4 py-2 bg-white flex items-center min-w-[200px]"
              >
                {selectedBrand === "All" ? (
                  <span>All Brands</span>
                ) : (
                  <div className="flex items-center gap-2">
                    {brands.find((b) => b.name === selectedBrand)?.logo && (
                      <img
                        src={`http://localhost:5000/uploads/${brands.find((b) => b.name === selectedBrand).logo}`}
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
                <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
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
              {clothesAndAccessories && (
                <>
                  <option value="Clothes">Clothes</option>
                  <option value="Accessories">Accessories</option>
                </>
              )}
            </select>

            
            

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={clothesAndAccessories}
                onChange={(e) => setClothesAndAccessories(e.target.checked)}
              />
              <span>Clothes & Accessories</span>
            </label>

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

          {/* Product Cards */}
          {loading ? (
            <div className="text-center text-xl">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-xl">No products match your filters</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
                >
                  <img
                    src={
                      Array.isArray(product.images) && product.images.length > 0
                        ? `http://localhost:5000${product.images[0]}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={product.name || "Product"}
                    className="h-40 w-full object-cover rounded-md mb-4"
                  />
                  <h3 className="font-bold text-lg mb-2">{product.name || "No Name"}</h3>
                  <p className="text-gray-700 text-sm mb-2">{product.category || "No Category"}</p>

                  {product.brand && (
                    <div className="flex items-center gap-2 mb-2">
                      {brands.find((b) => b.name === product.brand)?.logo && (
                        <img
                          src={`http://localhost:5000/uploads/${brands.find((b) => b.name === product.brand).logo}`}
                          alt="Brand Logo"
                          className="h-6 w-6 object-contain"
                        />
                      )}
                      <span className="text-gray-700 text-sm">{product.brand}</span>
                    </div>
                  )}

                  {product.servings && (
                    <p className="text-gray-700 text-sm mb-2">Servings: {product.servings}</p>
                  )}

                  {product.promoPrice ? (
                    <p className="text-red-500 text-sm mb-2">Promo Price: {product.promoPrice.toFixed(2)} TND</p>
                  ) : (
                    product.price && (
                      <p className="text-gray-700 text-sm mb-2">Price: {product.price.toFixed(2)} TND</p>
                    )
                  )}

                  {product.promoPrice && product.price && (
                    <p className="line-through text-gray-500 text-sm mb-2">Original Price: ${product.price.toFixed(2)}</p>
                  )}

                  <div className="flex items-center justify-between mt-auto">
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
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Numbered Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded ${
                  currentPage === pageNum
                    ? 'bg-customBlue text-white hover:bg-customPink'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Total Items Info */}
          <div className="text-center mt-4 text-gray-600">
            Showing {Math.min(startIndex + 1, totalFilteredProducts)}-
            {Math.min(endIndex, totalFilteredProducts)} of {totalFilteredProducts} products
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
