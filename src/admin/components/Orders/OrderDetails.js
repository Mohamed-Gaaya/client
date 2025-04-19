import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header/Header';
import axios from 'axios';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  // Status options with icons for the dropdown
  const statusOptions = [
    { value: 'pending', label: '⏳ Pending' },
    { value: 'confirmed', label: '✅ Confirmed' },
    { value: 'on the way', label: '🚚 On the Way' },
    { value: 'delivered', label: '📦 Delivered' }
  ];

  // Mapping for status icons to be used in the order summary
  const statusIcons = {
    pending: '⏳',
    confirmed: '✅',
    'on the way': '🚚',
    delivered: '📦'
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
        status: newStatus
      });
      setOrder({ ...order, status: newStatus });
      setNotification('Order status updated successfully');
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      setError('Failed to update order status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this order?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      navigate('/admin/orders');
    } catch (err) {
      setError('Failed to delete order');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="p-6">
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="p-6">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="p-6">
            <p>No order details found</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'on the way':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {notification && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
              {notification}
            </div>
          )}

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Order Details</h1>
            <div className="flex gap-4 items-center">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Order
              </button>
            </div>
          </div>
          
          {/* Customer Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Customer Details</h2>
            <p>
              <strong>Name:</strong> {order.customerDetails.firstName} {order.customerDetails.lastName}
            </p>
            <p>
              <strong>Email:</strong> {order.customerDetails.email}
            </p>
            <p>
              <strong>Phone:</strong> {order.customerDetails.phoneNumber}
            </p>
            <p>
              <strong>Address:</strong> {order.customerDetails.address}, {order.customerDetails.city}, {order.customerDetails.governorate} {order.customerDetails.postalCode}
            </p>
          </div>
          
          {/* Order Summary with status icon */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <p>
              <strong>Status: </strong>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                {statusIcons[order.status.toLowerCase()]} {order.status.toUpperCase()}
              </span>
            </p>
            <p>
              <strong>Subtotal:</strong> {order.subtotal.toFixed(2)} TND
            </p>
            <p>
              <strong>Delivery Fee:</strong> {order.deliveryFee.toFixed(2)} TND
            </p>
            <p>
              <strong>Total:</strong> {order.total.toFixed(2)} TND
            </p>
          </div>
          
          {/* Products List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            {order.items.map((item, index) => {
              const productId = item.product ? item.product._id : item._id;
              const productName = item.product ? item.product.name : item.name;
              const productImage = item.product ? item.product.image : item.image;

              return (
                <div key={index} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                  <Link to={`/product/${productId}`}>
                    <img 
                      src={productImage} 
                      alt={productName} 
                      className="w-20 h-20 object-cover rounded cursor-pointer transition-transform duration-300 transform hover:scale-125 hover:opacity-80 mr-4" 
                    />
                  </Link>
                  <div>
                    <Link to={`/product/${productId}`} className="font-semibold text-blue-600 hover:underline">
                      {productName}
                    </Link>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {(item.price * item.quantity).toFixed(2)} TND</p>
                    {item.flavour && <p>Flavor: {item.flavour}</p>}
                    {item.size && <p>Size: {item.size}</p>}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Navigation Button */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/admin/orders')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
