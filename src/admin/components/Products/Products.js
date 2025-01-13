import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar"; // Adjust path if necessary
import Header from "../Navbar"; // Adjust path if necessary
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products"); // Adjust URL if necessary
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products); // Assuming the API returns `products` as an array
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle product edit by navigating to the edit page with product details
  const handleEdit = (product) => {
    navigate(`/admin/products/edit/${product._id}`, { state: { product } });
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
                      <td className="px-4 py-2">{product._id}</td>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-2">{product.category}</td>
                      <td className="px-4 py-2">{product.brand}</td>
                      <td className="px-4 py-2">
                        {product.hasPromo ? (
                          <div>
                            <span>Promo Price: ${product.promoPrice.toFixed(2)}</span>
                            <br />
                            <span className="line-through">
                              Original: ${product.originalPrice.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          "No Promo"
                        )}
                      </td>
                      <td className="px-4 py-2">{product.servings}</td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          {product.images.map((image, index) => {
                            const imageUrl = `http://localhost:5000/${image}`;
                            return (
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`${product.name} - ${index + 1}`}
                                className="h-16 w-16 object-cover"
                              />
                            );
                          })}
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
