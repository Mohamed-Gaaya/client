import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Minus, Plus } from 'lucide-react';
import ImageModal from './ImageModal';
import RelatedProducts from './RelatedProducts';
import ProductImageGallery from './ProductImageGallery';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Add these functions
  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const handleBrandClick = (brandName) => {
    navigate(`/brandProduct/${brandName}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

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
          const brandResponse = await fetch(`http://localhost:5000/api/brands/${encodeURIComponent(productData.product.brand)}`);
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
    navigate(`/product/${productId}`);
    window.scrollTo(0, 0);
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  if (!product) return <div className="text-center text-xl mt-10">No product found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Product Images */}
        <div className="h-full">
          <ProductImageGallery 
            images={product.images}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            onOpenModal={openModal}
          />
        </div>

        {/* Right Column - Single Product Details Card */}
        <div className="h-full">
          <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
            {/* Header: Title and Brand */}
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
              {brand && (
                <div 
                  className="inline-flex items-center hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleBrandClick(brand.name)}
                >
                  <div className="flex items-center space-x-3">
                    {brand.logoUrl && (
                      <img 
                        src={brand.logoUrl} 
                        alt={brand.name} 
                        className="h-8 w-8 object-contain" 
                      />
                    )}
                    <span className="text-gray-700 text-sm font-medium hover:text-blue-600 transition-colors duration-200">
                      {brand.name}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto space-y-6 my-6 pr-2">
              {/* Short Description */}
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">{product.shortDescription}</p>
              </div>

              {/* Reviews */}
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

              {/* Price Section */}
              <div className="space-y-2">
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
                {product.servings && (
                  <div className="text-gray-600">
                    {product.servings} servings
                  </div>
                )}
              </div>

              {/* Options Section */}
              {product.flavours?.length > 0 && (
                <div>
                  <label className="block mb-2 font-semibold">Flavour</label>
                  <div className="flex flex-wrap gap-2">
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
                  <div className="flex flex-wrap gap-2">
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

              {/* Quantity Section */}
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
            </div>

            {/* Add to Cart Button - Fixed at Bottom */}
            <button 
              className="w-full py-3 bg-blue-600 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-blue-700 disabled:bg-gray-400 mt-auto"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
        <h2 className="text-xl font-bold mb-4">Detailed Description</h2>
        <p className="text-gray-600">{product.longDescription}</p>
      </div>

      <ImageModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        currentImage={modalImage}
        images={product?.images}
        onImageChange={setModalImage}
      />

      <RelatedProducts 
        products={relatedProducts}
        onProductClick={handleProductClick}
        currentSlide={currentSlide}
        onNext={handleSlideNext}
        onPrev={handleSlidePrev}
      />
    </div>
  );
};

export default ProductDetails;