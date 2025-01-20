import React, { useState, useEffect } from "react";
import bg1 from "../assets/images/bg1.jpg";
import bg2 from "../assets/images/bg5.jpg";
import bg3 from "../assets/images/bg3.jpg";
import bg4 from "../assets/images/bg2.jpg";
import { FooterPage } from "../components/FooterPage";
import {
  StyledCardBestSellerWrapper,
  StyledCardWrapper,
} from "../components/style";

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
        <h2 className="text-3xl font-bold text-center mb-8">
          Trusted by Top Brands
        </h2>
        <div className="flex justify-center gap-8 flex-wrap px-4">
          {["brand1.png", "brand2.png", "brand3.png", "brand4.png"].map(
            (brand, index) => (
              <img
                key={index}
                src={`/assets/images/${brand}`}
                alt={`Brand ${index + 1}`}
                className="h-16 md:h-20 object-contain"
              />
            )
          )}
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">Best Sellers</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
          {[1, 2, 3, 4].map((product) => (
            <StyledCardWrapper>
              <div className="card" key={product}>
                <div className="img">
                  <div className="save">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 683 683"
                      height={683}
                      width={683}
                      className="svg"
                    >
                      <g clipPath="url(#clip0_993_25)">
                        <mask
                          height={683}
                          width={683}
                          y={0}
                          x={0}
                          maskUnits="userSpaceOnUse"
                          style={{ maskType: "luminance" }}
                          id="mask0_993_25"
                        >
                          <path
                            fill="white"
                            d="M0 -0.00012207H682.667V682.667H0V-0.00012207Z"
                          />
                        </mask>
                        <g mask="url(#mask0_993_25)">
                          <path
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeMiterlimit={10}
                            strokeWidth={40}
                            stroke="#CED8DE"
                            d="M148.535 19.9999C137.179 19.9999 126.256 24.5092 118.223 32.5532C110.188 40.5866 105.689 51.4799 105.689 62.8439V633.382C105.689 649.556 118.757 662.667 134.931 662.667H135.039C143.715 662.667 151.961 659.218 158.067 653.09C186.451 624.728 270.212 540.966 304.809 506.434C314.449 496.741 327.623 491.289 341.335 491.289C355.045 491.289 368.22 496.741 377.859 506.434C412.563 541.074 496.752 625.242 524.816 653.348C530.813 659.314 538.845 662.667 547.308 662.667C563.697 662.667 576.979 649.395 576.979 633.019V62.8439C576.979 51.4799 572.48 40.5866 564.447 32.5532C556.412 24.5092 545.489 19.9999 534.133 19.9999H148.535Z"
                          />
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clip0_993_25">
                          <rect fill="white" height="682.667" width="682.667" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="text">
                  <p className="h3">Product {product}</p>
                  <p className="p">$29.99</p>
                  <button class="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-customBlue rounded-md group">
                    <span class="absolute w-0 h-0 transition-all duration-200 ease-out bg-customPink rounded-full group-hover:w-56 group-hover:h-56"></span>
                    <span class="relative text-base font-semibold">
                      View Details
                    </span>
                  </button>
                </div>
              </div>
            </StyledCardWrapper>
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
                <div className="w-52 h-40  rounded-2xl">
                  <img
                    className="w-52 h-40  rounded-2xl"
                    src={bg1}
                    alt="Free Shipping"
                  />
                </div>
                <div className=""></div>
                <p className="text-title">Free Shipping</p>
                <p className="text-body">On orders over $50.</p>
              </div>
              <button className="card-button">Shop Now</button>
            </div>
          </StyledCardBestSellerWrapper>
          <StyledCardBestSellerWrapper>
            <div className="card">
              <div className="card-details">
                <div className="w-52 h-40  rounded-2xl">
                  <img
                    className="w-52 h-40  rounded-2xl"
                    src={bg2}
                    alt="Top Quality"
                  />
                </div>
                <div className=""></div>
                <p className="text-title">Top Quality</p>
                <p className="text-body">Best products guaranteed.</p>
              </div>
              <button className="card-button">Shop Now</button>
            </div>
          </StyledCardBestSellerWrapper>

          <StyledCardBestSellerWrapper>
            <div className="card">
              <div className="card-details">
                <div className="w-52 h-40  rounded-2xl">
                  <img
                    className="w-52 h-40  rounded-2xl"
                    src={bg3}
                    alt="24/7 Support"
                  />
                </div>
                <div className=""></div>
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
