import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./CSS/ScrollableHero.css";

function ScrollableHero({ images }) {
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
    <section className="scrollable-hero relative overflow-hidden">
      <div
        className="images-container flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="hero-image min-w-full h-screen relative bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="overlay absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center p-4">
              <h1 className="title text-4xl md:text-6xl font-bold mb-4">
                Welcome to Our Store
              </h1>
              <p className="subtitle text-lg md:text-2xl mb-6">
                Discover amazing deals and exclusive products!
              </p>
              <a
                href="/shop"
                className="cta px-6 py-3 bg-customBlue hover:bg-customPink rounded text-white text-lg"
              >
                Shop Now
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        className="arrow left-arrow absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 p-2 rounded-full hover:bg-gray-900"
        onClick={handlePrevClick}
      >
        &#10094;
      </button>
      <button
        className="arrow right-arrow absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 p-2 rounded-full hover:bg-gray-900"
        onClick={handleNextClick}
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="dots absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot w-3 h-3 rounded-full ${
              index === currentIndex
                ? "bg-white"
                : "bg-gray-500 hover:bg-gray-300"
            }`}
            onClick={() => handleDotClick(index)}
          ></button>
        ))}
      </div>
    </section>
  );
}

ScrollableHero.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ScrollableHero;
