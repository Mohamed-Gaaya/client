import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/BrandsSection.css";

function BrandsSection({ brands, loading, error }) {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000/uploads";

  // Auto-scroll logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    let interval;

    if (brands.length > 0) {
      interval = setInterval(() => {
        if (!isPaused && container) {
          const firstItemWidth = container.children[0].offsetWidth;
          container.scrollBy({ left: firstItemWidth, behavior: "smooth" });

          if (
            container.scrollLeft + container.offsetWidth >=
            container.scrollWidth
          ) {
            container.scrollTo({ left: 0, behavior: "smooth" });
          }
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isPaused, brands]);

  const handleScroll = (direction) => {
    setIsPaused(true);
    const container = scrollContainerRef.current;
    if (!container) return;

    const firstItemWidth = container.children[0].offsetWidth;
    const scrollValue = direction === "left" ? -firstItemWidth : firstItemWidth;

    container.scrollBy({ left: scrollValue, behavior: "smooth" });

    setTimeout(() => setIsPaused(false), 2000);
  };

  // Updated navigation handler to use brand name
  const handleBrandClick = (brand) => {
    // Make sure we're using the brand name, not the entire brand object
    const brandName = brand.name || brand;
    navigate(`/brandProduct/${brandName}`);
  };

  return (
    <section className="brand-section">
      <h2 className="brand-title">Trusted by Top Brands</h2>
      {loading ? (
        <div className="brand-loading">Loading brands...</div>
      ) : error ? (
        <div className="brand-error">Error: {error}</div>
      ) : brands.length === 0 ? (
        <div className="brand-empty">No brands found</div>
      ) : (
        <div className="brand-scroll-wrapper">
          <button
            className="scroll-arrow left-arrow"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
          >
            &#8249;
          </button>
          <div
            className="brand-scroll-container"
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="brand-item"
                draggable="false"
                onClick={() => handleBrandClick(brand)}
              >
                <img
                  src={`${BASE_URL}/${brand.logo}`}
                  alt={brand.name}
                  className="brand-logo"
                />
              </div>
            ))}
          </div>
          <button
            className="scroll-arrow right-arrow"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
          >
            &#8250;
          </button>
        </div>
      )}
    </section>
  );
}

export default BrandsSection;