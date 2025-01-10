import React from "react";
import "./ProductCard.css";

function ProductCard({ product }) {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button>Add to Cart</button>
        </div>
    );
}

export default ProductCard;
