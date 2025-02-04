import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const deliveryFee = 7;
  const navigate = useNavigate();

  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          setCartCount(parsedCart.length);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    handleCartUpdate();

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  const updateQuantity = (productId, flavour, size, change) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item._id === productId && item.flavour === flavour && item.size === size) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      setCartCount(updatedItems.length);
      return updatedItems;
    });
  };

  const removeItem = (productId, flavour, size) => {
    setCartItems(prevItems => {
      const filteredItems = prevItems.filter(item => 
        !(item._id === productId && item.flavour === flavour && item.size === size)
      );
      localStorage.setItem('cart', JSON.stringify(filteredItems));
      setCartCount(filteredItems.length);
      return filteredItems;
    });
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const order = {
        items: cartItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        orderDate: new Date().toISOString()
      };
      localStorage.setItem('pendingOrder', JSON.stringify(order));
      onClose();
      navigate('/checkout');
    } catch (error) {
      console.error('Error processing checkout:', error);
      alert('There was an error processing your checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + (cartItems.length > 0 ? deliveryFee : 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md z-50">
      <div className="h-full bg-white shadow-lg flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">shopping_bag</span>
            <h2 className="text-xl font-bold">Shopping Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={`${item._id}-${item.flavour}-${item.size}-${index}`} className="bg-white rounded-lg shadow p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item._id, item.flavour, item.size)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                      <p className="text-gray-600">{item.price.toFixed(2)} TND</p>
                      {item.flavour && (
                        <p className="text-sm text-gray-500">Flavor: {item.flavour}</p>
                      )}
                      {item.size && (
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                      )}
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        <div className="border-t p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} TND</span>
            </div>
            {cartItems.length > 0 && (
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee.toFixed(2)} TND</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{total.toFixed(2)} TND</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || isProcessing}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <span className="material-symbols-outlined animate-spin mr-2">sync</span>
            ) : null}
            {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;