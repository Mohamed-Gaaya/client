import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar"; // Adjust path if necessary
import Header from "../Navbar"; // Adjust path if necessary
import { Link } from "react-router-dom"; // Import Link for navigation
import AddProduct from "./AddProduct";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulating an API call to fetch products
  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, name: "Protein Powder", price: "$29.99" },
        { id: 2, name: "Whey Protein", price: "$19.99" },
        { id: 3, name: "BCAA", price: "$14.99" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit product with id: ${id}`);
    // Implement editing logic (navigate to an edit page or open a modal)
  };

  const handleDelete = (id) => {
    console.log(`Delete product with id: ${id}`);
    // Implement delete logic here (simulating it)
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <Header />

        {/* Card Container */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Product Management</h2>
            {/* Add Product Button with redirection */}
            <Link
              to="/admin/products/add"// Link to the add product page
              className="bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink transition"
            >
              Add Product
            </Link>
          </div>

          {/* Loading state */}
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
                    <th className="px-4 py-2 text-left border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-2">{product.id}</td>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">{product.price}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-blue-600 text-white p-2 rounded mr-2"
                          onClick={() => handleEdit(product.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white p-2 rounded"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
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
