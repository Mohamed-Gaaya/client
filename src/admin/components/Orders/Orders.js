import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch orders on component mount or when refreshTrigger changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [refreshTrigger]);

  // Delete an order by its ID
  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Pagination logic (similar to Products.js)
  const itemsPerPage = 8;
  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedOrders = orders.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Orders Management</h2>
            {/* You can add additional buttons (e.g., for bulk actions) here if needed */}
          </div>

          {loading ? (
            <div className="text-center text-xl">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-xl">No orders found</div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {displayedOrders.map((order) => (
                <div key={order._id} className="border rounded-lg shadow p-4 flex flex-col">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order ID: {order._id}</p>
                      <p className="text-sm text-gray-600">
                        Customer: {order.customerDetails.firstName} {order.customerDetails.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {order.customerDetails.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: {order.total.toFixed(2)} TND
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: {order.status}
                      </p>
                      <p className="text-sm text-gray-600">
                        Created: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="text-customBlue hover:text-blue-500 transition"
                        title="View Order Details"
                      >
                        <FaEye size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete Order"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded ${
                    currentPage === pageNum
                      ? "bg-customBlue text-white hover:bg-customPink"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}

          <div className="text-center mt-4 text-gray-600">
            Showing {Math.min(startIndex + 1, totalOrders)}-
            {Math.min(endIndex, totalOrders)} of {totalOrders} orders
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
