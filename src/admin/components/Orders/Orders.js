import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  // Status options now include an emoji with each status label.
  const statusOptions = [
    { value: "pending", label: "⏳ Pending" },
    { value: "confirmed", label: "✅ Confirmed" },
    { value: "on the way", label: "🚚 On the Way" },
    { value: "delivered", label: "📦 Delivered" }
  ];

  // Mapping for status icons for use in the order card summary.
  const statusIcons = {
    pending: "⏳",
    confirmed: "✅",
    "on the way": "🚚",
    delivered: "📦"
  };

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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleDelete = async (e, orderId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      setNotification("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      setNotification("Error deleting order");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    let fieldA, fieldB;
    switch (sortBy) {
      case "createdAt":
        fieldA = new Date(a.createdAt);
        fieldB = new Date(b.createdAt);
        break;
      case "total":
        fieldA = a.total;
        fieldB = b.total;
        break;
      case "customer":
        fieldA = (a.customerDetails.firstName + " " + a.customerDetails.lastName).toLowerCase();
        fieldB = (b.customerDetails.firstName + " " + b.customerDetails.lastName).toLowerCase();
        break;
      case "status":
        fieldA = a.status.toLowerCase();
        fieldB = b.status.toLowerCase();
        break;
      default:
        fieldA = new Date(a.createdAt);
        fieldB = new Date(b.createdAt);
        break;
    }
    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    } else if (fieldA instanceof Date && fieldB instanceof Date) {
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    } else {
      return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
    }
  });

  const itemsPerPage = 8;
  const totalOrders = sortedOrders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedOrders = sortedOrders.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const formatPrice = (price) => {
    return price % 1 === 0 ? price.toString() : price.toFixed(2);
  };

  const handleCardClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "on the way":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-3xl font-bold mb-4 md:mb-0">Orders Management</h2>
              <div className="flex items-center gap-4">
                <label className="font-medium">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="createdAt">Date</option>
                  <option value="total">Total</option>
                  <option value="customer">Customer</option>
                  <option value="status">Status</option>
                </select>
                <button
                  onClick={toggleSortOrder}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {sortOrder === "asc" ? "Asc" : "Desc"}
                </button>
              </div>
            </div>

            {notification && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                {notification}
              </div>
            )}

            {loading ? (
              <div className="text-center text-xl">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center text-xl">No orders found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedOrders.map((order) => {
                  const placedAt = new Date(order.createdAt);
                  const timeString = placedAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={order._id}
                      onClick={() => handleCardClick(order._id)}
                      className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 relative"
                    >
                      {/* Updated header: Order ID and status on the same line */}
                      <div className="mb-2">
                      <div className="mb-2 flex justify-between items-center">
                      <p className="text-lg font-bold">Order #{order._id}</p>
                      <span
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                      >
                        {statusIcons[order.status.toLowerCase()]}{" "}
                        <span>{order.status.toUpperCase()}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Placed on {placedAt.toLocaleDateString()} at {timeString}
                    </p>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold">Customer:</span>{" "}
                        {order.customerDetails.firstName} {order.customerDetails.lastName}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold">Total:</span>{" "}
                        {formatPrice(order.total)} TND
                      </p>
                      {/*
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={(e) => handleDelete(e, order._id)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition"
                        >
                          <FaTrash size={14} /> Delete
                        </button>
                      </div>
                      */}
                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                {pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white hover:bg-blue-700"
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
    </div>
  );
};

export default Orders;
