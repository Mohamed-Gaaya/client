import React, { useState } from "react";
import { StyledCardWrapper } from "./style";

function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <StyledCardWrapper>
      <div className="card" style={{height: '420px'}}>
        <div 
          className="img" 
          style={{
            height: '250px', 
            position: 'relative',
            backgroundColor: 'linear-gradient(#7980c5, #9198e5)',
            backgroundImage: product.image && imageLoaded 
              ? `url(${product.image})` 
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              onLoad={handleImageLoad}
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            />
          )}
          <div className="save">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 683 683"
              height={683}
              width={683}
              className="svg"
            >
              {/* SVG content remains the same */}
            </svg>
          </div>
        </div>
        <div className="text">
          <p className="h3">{product.name}</p>
          <p className="p">${product.price.toFixed(2)}</p>
          <button className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-customBlue rounded-md group">
            <span className="absolute w-0 h-0 transition-all duration-200 ease-out bg-customPink rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="relative text-base font-semibold">
              Add to Cart
            </span>
          </button>
        </div>
      </div>
    </StyledCardWrapper>
  );
}

export default ProductCard;