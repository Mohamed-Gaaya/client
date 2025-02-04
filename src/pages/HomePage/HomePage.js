import React, { useState, useEffect } from "react";
import bg1 from "../../assets/images/bg1.jpg";
import bg2 from "../../assets/images/bg5.jpg";
import bg3 from "../../assets/images/bg3.jpg";
import bg4 from "../../assets/images/bg2.jpg";
import bg6 from "../../assets/images/bg6.jpeg";
import bg7 from "../../assets/images/bg7.jpeg";
import { FooterPage } from "../../components/FooterPage";
import BrandsSection from "./BrandsSection";
import ScrollableHero from "./ScrollableHero";
import { StyledCardBestSellerWrapper, StyledCardWrapper } from "./style";

const images = [bg6, bg7, bg3, bg4, bg1, bg2];

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => handleNextClick(), 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/brands");
        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }
        const data = await response.json();
        setBrands(data.brands);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

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

      <ScrollableHero images={images} />

      <BrandsSection brands={brands} loading={loading} error={error} />

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">Best Sellers</h2>
        <div class="carousel-item items-center flex flex-row justify-between gap-8 p-8 space-x-4">
          {[1, 2, 3, 4].map((product) => (
            <div
              key={product.id}
              class="w-60 h-80 bg-gray-50 p-3 flex flex-col gap-1 rounded-2xl"
            >
              <div class="h-48 bg-gray-700 rounded-xl"></div>
              <div class="flex flex-col gap-4">
                <div class="flex flex-row justify-between">
                  <div class="flex flex-col">
                    <span class="text-xl font-bold">Long Chair</span>
                    <p class="text-xs text-gray-700">ID: 23432252</p>
                  </div>
                  <span class="font-bold  text-red-600">$25.99</span>
                </div>
                <button class="hover:bg-sky-700 text-gray-50 bg-sky-800 py-2 rounded-md">
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Customers Say
        </h2>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((testimonial) => (
            <div
              key={testimonial}
              className="max-w-xs overflow-hidden bg-white border border-gray-200 rounded-xl shadow-md transform transition-all duration-500 hover:shadow-lg hover:scale-105 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white opacity-0 transition-opacity duration-500 group-hover:opacity-30 blur-md"></div>
              <div className="p-6 relative z-10">
                <p className="text-xl font-semibold text-gray-800">
                  Customer {testimonial}
                </p>
                <p className="mt-2 text-gray-600">
                  "This is the best store ever! The products are amazing, and
                  the service is top-notch."
                </p>
                <div className="flex items-center mt-4 text-gray-600">
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 fill-current text-yellow-500"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                  </svg>
                  <span className="ml-2">4.8 (24 reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <StyledCardBestSellerWrapper>
            <div className="card">
              <div className="card-details">
                <div className="w-52 h-40 rounded-2xl">
                  <img
                    className="w-52 h-40 rounded-2xl"
                    src={bg6}
                    alt="Free Shipping"
                  />
                </div>
                <p className="text-title">Free Shipping</p>
                <p className="text-body">On orders over $50.</p>
              </div>
              <button className="card-button">Shop Now</button>
            </div>
          </StyledCardBestSellerWrapper>
          <StyledCardBestSellerWrapper>
            <div className="card">
              <div className="card-details">
                <div className="w-52 h-40 rounded-2xl">
                  <img
                    className="w-52 h-40 rounded-2xl"
                    src={bg7}
                    alt="Top Quality"
                  />
                </div>
                <p className="text-title">Top Quality</p>
                <p className="text-body">Best products guaranteed.</p>
              </div>
              <button className="card-button">Shop Now</button>
            </div>
          </StyledCardBestSellerWrapper>
          <StyledCardBestSellerWrapper>
            <div className="card">
              <div className="card-details">
                <div className="w-52 h-40 rounded-2xl">
                  <img
                    className="w-52 h-40 rounded-2xl"
                    src={bg2}
                    alt="24/7 Support"
                  />
                </div>
                <p className="text-title">24/7 Support</p>
                <p className="text-body">Always here to help.</p>
              </div>
              <button className="card-button">Shop Now</button>
            </div>
          </StyledCardBestSellerWrapper>
        </div>
      </section>

      {/* Footer */}
      <FooterPage />
    </div>
  );
}

export default HomePage;
