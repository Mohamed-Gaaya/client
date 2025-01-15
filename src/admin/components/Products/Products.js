import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar"; // Adjust the path if necessary
import Header from "../Navbar"; // Adjust the path if necessary
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        console.log("Fetched products:", data);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete a product
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");

      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Edit a product
  const handleEdit = (product) => {
    navigate("/admin/products/modify", { state: { product } });
  };

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

          {loading ? (
            <div className="text-center text-xl">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-xl">No products available</div>
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
                    <th className="px-4 py-2 text-left border">Images</th>
                    <th className="px-4 py-2 text-left border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="px-4 py-2">{product._id || "N/A"}</td>
                      <td className="px-4 py-2">{product.name || "No Name"}</td>
                      <td className="px-4 py-2">
                        {product.price ? `$${product.price.toFixed(2)}` : "No Price"}
                      </td>
                      <td className="px-4 py-2">{product.category || "No Category"}</td>
                      <td className="px-4 py-2">{product.brand || "No Brand"}</td>
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
                      <div className="flex space-x-2">
                        {Array.isArray(product.images) && product.images.length > 0 ? (
                          <img
                          src={
                              `http://localhost:5000${product.images[0]}`
                          }
                          
                            alt={`${product.name || "Product"} - 1`}
                            className="h-16 w-16 object-cover"
                          />
                        ) : (
                          <span>No Images</span>
                        )}
                      </div>
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
