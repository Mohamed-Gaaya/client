import React, { useState, useEffect } from "react";
import bg1 from "../assets/images/bg1.jpg";
import bg2 from "../assets/images/bg5.jpg";
import bg3 from "../assets/images/bg3.jpg";
import bg4 from "../assets/images/bg2.jpg";

const images = [bg1, bg2, bg3, bg4];

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => handleNextClick(), 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDotClick = (index) => setCurrentIndex(index);

  return (
    <div>
      {/* Top Promotion Banner */}
      <div className="bg-customBlue text-white text-center py-2">
        <p>🚚 Free Shipping on Orders Over $50! Limited Time Only! 🚀</p>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="min-w-full h-screen relative bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center p-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Welcome to Our Store
                </h1>
                <p className="text-lg md:text-2xl mb-6">
                  Discover amazing deals and exclusive products!
                </p>
                <a
                  href="/shop"
                  className="px-6 py-3 bg-customBlue hover:bg-customPink rounded text-white text-lg"
                >
                  Shop Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 p-2 rounded-full hover:bg-gray-900"
          onClick={handlePrevClick}
        >
          &#10094;
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 p-2 rounded-full hover:bg-gray-900"
          onClick={handleNextClick}
        >
          &#10095;
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-gray-500 hover:bg-gray-300"
              }`}
              onClick={() => handleDotClick(index)}
            ></button>
          ))}
        </div>
      </section>

      {/* Brand Section */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">Trusted by Top Brands</h2>
        <div className="flex justify-center gap-8 flex-wrap px-4">
          {["brand1.png", "brand2.png", "brand3.png", "brand4.png"].map((brand, index) => (
            <img
              key={index}
              src={`/assets/images/${brand}`}
              alt={`Brand ${index + 1}`}
              className="h-16 md:h-20 object-contain"
            />
          ))}
        </div>
      </section>
      {/* Featured Products */}
<section className="py-12 bg-gray-50">
  <h2 className="text-3xl font-bold text-center mb-8">Best Sellers</h2>
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
    {[1, 2, 3, 4].map((product) => (
      <div key={product} className="border rounded-lg shadow-lg overflow-hidden">
        <img
          src={`/assets/products/product${product}.jpg`}
          alt={`Product ${product}`}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg">Product {product}</h3>
          <p className="text-gray-600 mt-2">$29.99</p>
          <a
            href={`/product/${product}`}
            className="block text-center bg-customBlue text-white mt-4 py-2 rounded hover:bg-customPink"
          >
            View Details
          </a>
        </div>
      </div>
    ))}
  </div>
</section>
{/* Testimonials */}
<section className="py-12 bg-white">
  <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
  <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3].map((testimonial) => (
      <div key={testimonial} className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <p className="italic text-gray-600">
          "This is the best store ever! The products are amazing, and the service is top-notch."
        </p>
        <div className="mt-4 flex items-center">
          <img
            src={`/assets/testimonials/customer${testimonial}.jpg`}
            alt={`Customer ${testimonial}`}
            className="h-12 w-12 rounded-full mr-4"
          />
          <div>
            <h4 className="font-bold">Customer {testimonial}</h4>
            <p className="text-sm text-gray-500">Verified Buyer</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* Features Section */}
<section className="py-12 bg-white">
  <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
    <div>
      <img src="/assets/icons/free-shipping.svg" alt="Free Shipping" className="h-16 mx-auto mb-4" />
      <h3 className="text-xl font-bold">Free Shipping</h3>
      <p className="text-gray-600">On orders over $50.</p>
    </div>
    <div>
      <img src="/assets/icons/quality.svg" alt="Top Quality" className="h-16 mx-auto mb-4" />
      <h3 className="text-xl font-bold">Top Quality</h3>
      <p className="text-gray-600">Best products guaranteed.</p>
    </div>
    <div>
      <img src="/assets/icons/support.svg" alt="24/7 Support" className="h-16 mx-auto mb-4" />
      <h3 className="text-xl font-bold">24/7 Support</h3>
      <p className="text-gray-600">Always here to help.</p>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
            <p className="text-sm">
              We are committed to providing the best products and customer experience. Join us on our journey!
            </p>
          </div>
          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="/shop" className="hover:text-blue-400">Shop</a>
              </li>
              <li>
                <a href="/about" className="hover:text-blue-400">About Us</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-400">Contact</a>
              </li>
              <li>
                <a href="/faq" className="hover:text-blue-400">FAQ</a>
              </li>
            </ul>
          </div>
          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="https://facebook.com" className="hover:text-blue-400">Facebook</a>
              </li>
              <li>
                <a href="https://instagram.com" className="hover:text-blue-400">Instagram</a>
              </li>
              <li>
                <a href="https://twitter.com" className="hover:text-blue-400">Twitter</a>
              </li>
              <li>
                <a href="https://linkedin.com" className="hover:text-blue-400">LinkedIn</a>
              </li>
            </ul>
          </div>
          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Subscribe</h3>
            <form className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded bg-gray-700 text-gray-200 border-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="px-4 py-2 bg-customBlue hover:bg-customPink rounded text-white">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="bg-gray-900 text-center py-4 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} YODA Sports Nutrition All rights reserved
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
