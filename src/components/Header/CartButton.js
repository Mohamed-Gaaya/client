import { useState,useEffect } from "react";
const CartButton = ({ onClick }) => {
    const [cartCount, setCartCount] = useState(0);
  
    useEffect(() => {
      const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
      };
  
      window.addEventListener('cart-updated', updateCartCount);
      updateCartCount();
  
      return () => {
        window.removeEventListener('cart-updated', updateCartCount);
      };
    }, []);
  
    return (
      <div className="relative">
        <button onClick={onClick} className="text-white hover:text-gray-300">
          <span className="material-symbols-outlined text-3xl">shopping_cart</span>
        </button>
        {cartCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </div>
        )}
      </div>
    );
  };
  
  export default CartButton;