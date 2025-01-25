import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Minus, Plus, Tag  } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [selectedFlavour, setSelectedFlavour] = useState(null);
  const [brand, setBrand] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProductAndBrand = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }
      try {
        // Fetch product details
        const productResponse = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await productResponse.json();
        
        // Transform image URLs to include full path
        const productsWithFullImageUrls = {
          ...productData.product,
          images: productData.product.images.map(img => 
            `http://localhost:5000/uploads/${img.split('/').pop()}`
          )
        };

        setProduct(productsWithFullImageUrls);
        
        // Fetch brand details if brand ID exists
        if (productData.product.brand) {
          const brandResponse = await fetch(`http://localhost:5000/api/brands/${productData.product.brand}`);
          if (brandResponse.ok) {
            const brandData = await brandResponse.json();
            const brandWithLogoUrl = {
              ...brandData.brand,
              logoUrl: brandData.brand.logo 
                ? `http://localhost:5000/uploads/${brandData.brand.logo}`
                : null
            };
            setBrand(brandWithLogoUrl);
          }
        }
        
        // Auto-select first flavour and size if available
        if (productsWithFullImageUrls.flavours?.length) {
          setSelectedFlavour(productsWithFullImageUrls.flavours[0]);
        }
        if (productsWithFullImageUrls.sizes?.length) {
          setSelectedSize(productsWithFullImageUrls.sizes[0]);
        }
        
        setLoading(false);
        
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductAndBrand();
  }, [id]);


  const handleAddToCart = () => {
    // Implement add to cart logic
    console.log('Added to cart', {
      product,
      flavour: selectedFlavour,
      size: selectedSize,
      quantity
    });
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  if (!product) return <div className="text-center text-xl mt-10">No product found</div>;

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      {/* Product Gallery */}
      <div className="space-y-4">

        {/* Product Images */}
        <div className="border rounded-lg overflow-hidden">
          <img 
            src={product.images?.[activeImage] || '/placeholder.jpg'} 
            alt={product.name} 
            className="w-full h-[500px] object-cover"
          />
        </div>
        
        {product.images && product.images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`${product.name} thumbnail ${index + 1}`} 
                className={`w-16 h-16 object-cover cursor-pointer rounded-md border-2 ${
                  activeImage === index ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        )}

        {/* Short Description */}
        <div className="mt-4 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Product Overview</h3>
          <p className="text-gray-700">{product.shortDescription}</p>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <button className="text-red-500 hover:text-red-600">
            <Heart size={24} />
          </button>
        </div>
        
        

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={20} 
                fill={i < 4 ? '#fbbf24' : 'none'}
              />
            ))}
          </div>
          <span className="text-gray-600">(4.0) | 120 Reviews</span>
        </div>
        {/* Servings */}
        <div className="flex items-center space-x-2">
        {product.servings && (
                <div className="flex items-center text-gray-600">
                  
                  <span>{product.servings} servings</span>
                </div>
              )}
          
        </div>
        
        

        {/* Pricing */}
        <div className="flex items-center space-x-4">
          {product.hasPromo ? (
            <>
              <span className="text-2xl font-bold text-blue-600">
                ${product.promoPrice.toFixed(2)}
              </span>
              <span className="line-through text-gray-500">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                {Math.round(((product.originalPrice - product.promoPrice) / product.originalPrice) * 100)}% OFF
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Flavours */}
        {product.flavours?.length > 0 && (
          <div>
            <label className="block mb-2 font-semibold">Flavour</label>
            <div className="flex space-x-2">
              {product.flavours.map((flavour, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border rounded-md ${
                    selectedFlavour === flavour 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedFlavour(flavour)}
                >
                  {flavour}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div>
            <label className="block mb-2 font-semibold">Size</label>
            <div className="flex space-x-2">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block mb-2 font-semibold">Quantity</label>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 border rounded-md hover:bg-gray-100"
            >
              <Minus size={20} />
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="p-2 border rounded-md hover:bg-gray-100"
            >
              <Plus size={20} />
            </button>
            <span className="text-gray-600">
              {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Add to Cart */}
        <button 
          className="w-full py-3 bg-blue-600 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-blue-700 disabled:bg-gray-400"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart size={20} />
          <span>Add to Cart</span>
        </button>

        {/* Description */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Detailed Description</h2>
          <p className="text-gray-600 mb-2">{product.longDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;