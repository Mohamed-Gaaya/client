import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '', // now only the local number (max 8 digits)
    email: '',
    address: '',
    postalCode: '',
    governorate: '',
    city: ''
  });

  const governorates = [
    { id: 'tunis', name: 'Tunis' },
    { id: 'ariana', name: 'Ariana' },
    { id: 'ben_arous', name: 'Ben Arous' },
    { id: 'mannouba', name: 'Mannouba' },
    { id: 'bizerte', name: 'Bizerte' },
    { id: 'nabeul', name: 'Nabeul' },
    { id: 'beja', name: 'Béja' },
    { id: 'jendouba', name: 'Jendouba' },
    { id: 'zaghouan', name: 'Zaghouan' },
    { id: 'siliana', name: 'Siliana' },
    { id: 'le_kef', name: 'Le Kef' },
    { id: 'sousse', name: 'Sousse' },
    { id: 'monastir', name: 'Monastir' },
    { id: 'mahdia', name: 'Mahdia' },
    { id: 'kasserine', name: 'Kasserine' },
    { id: 'sidi_bouzid', name: 'Sidi Bouzid' },
    { id: 'kairouan', name: 'Kairouan' },
    { id: 'gafsa', name: 'Gafsa' },
    { id: 'sfax', name: 'Sfax' },
    { id: 'gabes', name: 'Gabès' },
    { id: 'medenine', name: 'Médenine' },
    { id: 'tozeur', name: 'Tozeur' },
    { id: 'kebili', name: 'Kebili' },
    { id: 'tataouine', name: 'Tataouine' }
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedOrder = localStorage.getItem('pendingOrder');
    if (savedOrder) {
      setOrderDetails(JSON.parse(savedOrder));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateQuantity = (productId, flavour, size, change) => {
    setOrderDetails(prevOrder => {
      const updatedItems = prevOrder.items.map(item => {
        if (item._id === productId && item.flavour === flavour && item.size === size) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      // Recalculate totals
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = subtotal + prevOrder.deliveryFee;

      // Update localStorage
      const updatedOrder = {
        ...prevOrder,
        items: updatedItems,
        subtotal,
        total
      };
      localStorage.setItem('pendingOrder', JSON.stringify(updatedOrder));
      
      return updatedOrder;
    });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Custom phone number formatting: only digits and maximum of 8 digits
  const handlePhoneChange = (phone) => {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    // Limit to maximum of 8 digits
    cleaned = cleaned.slice(0, 8);
    
    setFormData(prev => ({ ...prev, phoneNumber: cleaned }));
  };

  // Validate that the phone number contains exactly 8 digits
  const validatePhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 8;
  };

  const validatePostalCode = (code) => {
    return /^\d{4}$/.test(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Enhanced validation
    if (!Object.values(formData).every(value => value.trim())) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError('Please enter a valid 8-digit phone number');
      setIsSubmitting(false);
      return;
    }

    if (!validatePostalCode(formData.postalCode)) {
      setError('Please enter a valid postal code (4 digits)');
      setIsSubmitting(false);
      return;
    }

    try {
      const orderData = {
        ...orderDetails,
        customerDetails: formData,
        status: 'pending'
      };

      // Send the order data to your backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      

      if (!response.ok) {
        throw new Error('Order submission failed');
      }

      // In your backend, you would:
      // 1. Save the order (e.g. notify the admin via your admin dashboard or an email).
      // 2. Send a customized email to the client confirming their order.
      //
      // For example, using Nodemailer or SendGrid on the server side.
      
      // Clear local storage and navigate to the success page
      localStorage.removeItem('cart');
      localStorage.removeItem('pendingOrder');
      navigate('/order-success');
    } catch (err) {
      setError('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderDetails) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Details Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              {/* First Name and Last Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Phone Number */}
              <div className="w-full">
                <PhoneInput
                  country={'tn'}
                  value={formData.phoneNumber}
                  autoFormat={false}
                  onChange={handlePhoneChange}
                  inputClass="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  containerClass="w-full"
                  inputStyle={{ width: '100%' }}
                  preferredCountries={['tn']}
                />
              </div>
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Governorate</option>
                  {governorates.map(gov => (
                    <option key={gov.id} value={gov.id}>
                      {gov.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  maxLength="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-200">
                <div className="flex gap-4">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.flavour && `Flavor: ${item.flavour}`}
                      {item.size && ` • Size: ${item.size}`}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.flavour, item.size, -1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <span className="material-symbols-outlined">remove</span>
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.flavour, item.size, 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                  </div>
                </div>
                <p>{(item.price * item.quantity).toFixed(2)} TND</p>
              </div>
            ))}
            
            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{orderDetails.subtotal.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{orderDetails.deliveryFee.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{orderDetails.total.toFixed(2)} TND</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Return to Shopping
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;
