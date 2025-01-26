import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Minus, Plus } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedFlavour, setSelectedFlavour] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

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
        
        // Fetch brand details
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
        
        // Fetch related products
        const relatedResponse = await fetch(`http://localhost:5000/api/products?category=${productData.product.category}&excludeId=${id}`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          const relatedWithFullUrls = relatedData.products.map(p => ({
            ...p,
            images: p.images.map(img => 
              `http://localhost:5000/uploads/${img.split('/').pop()}`
            )
          }));
          setRelatedProducts(relatedWithFullUrls);
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
    console.log('Added to cart', {
      product,
      flavour: selectedFlavour,
      size: selectedSize,
      quantity
    });
  };

  const handleSlideNext = () => {
    setCurrentSlide((prev) => 
      Math.min(prev + 1, Math.max(0, relatedProducts.length - 4))
    );
  };

  const handleSlidePrev = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    window.scrollTo(0, 0);
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  if (!product) return <div className="text-center text-xl mt-10">No product found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
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
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <button className="text-red-500 hover:text-red-600">
              <Heart size={24} />
            </button>
          </div>

          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700">{product.shortDescription}</p>
          </div>

          {brand && (
            <div className="flex items-center space-x-2 mb-2">
              {brand.logoUrl && (
                <img 
                  src={brand.logoUrl} 
                  alt={brand.name} 
                  className="h-10 w-10 object-contain"
                />
              )}
              <span className="text-gray-600 text-lg">{brand.name}</span>
            </div>
          )}

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

          {product.servings && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">{product.servings} servings</span>
            </div>
          )}

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

          <button 
            className="w-full py-3 bg-blue-600 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-blue-700 disabled:bg-gray-400"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={20} />
            <span>Add to Cart</span>
          </button>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Detailed Description</h2>
            <p className="text-gray-600 mb-2">{product.longDescription}</p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="bg-gray-50 py-8 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            
            <div className="relative">
              {relatedProducts.length > 4 && (
                <>
                  <button
                    onClick={handleSlidePrev}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full ${
                      currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                    }`}
                    disabled={currentSlide === 0}
                  >
                    ←
                  </button>
                  <button
                    onClick={handleSlideNext}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full ${
                      currentSlide >= relatedProducts.length - 4 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-100'
                    }`}
                    disabled={currentSlide >= relatedProducts.length - 4}
                  >
                    →
                  </button>
                </>
              )}

              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentSlide * 25}%)`,
                    width: `${relatedProducts.length * 25}%`
                  }}
                >
                  {relatedProducts.map((relatedProduct) => (
                    <div 
                      key={relatedProduct._id} 
                      className="w-1/4 p-2 cursor-pointer"
                      onClick={() => handleProductClick(relatedProduct._id)}
                    >
                      <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <img 
                          src={relatedProduct.images[0] || '/placeholder.jpg'} 
                          alt={relatedProduct.name} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-lg truncate">{relatedProduct.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{relatedProduct.category}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-600 font-bold">
                              ${relatedProduct.price.toFixed(2)}
                            </span>
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={16} 
                                  fill={i < 4 ? '#fbbf24' : 'none'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;