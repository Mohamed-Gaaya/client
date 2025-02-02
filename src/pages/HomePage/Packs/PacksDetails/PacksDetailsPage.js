import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PackImageGallery } from './PackImageGallery';
import { PackDetails } from './PackDetails';
import { SimilarPacks } from './SimilarPacks';
import ImageModal from '../../../ProductDetails/ImageModal';

const PacksDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pack, setPack] = useState(null);
  const [similarPacks, setSimilarPacks] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const fetchPackAndSimilar = async () => {
      if (!id) {
        setError('No pack ID provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch pack details
        const packResponse = await fetch(`http://localhost:5000/api/packs/${id}`);
        if (!packResponse.ok) throw new Error('Failed to fetch pack');
        const packData = await packResponse.json();
        
        // Check if packData and packData.pack exist
        if (!packData || !packData.pack) {
          throw new Error('Invalid pack data received');
        }

        // Transform image URLs with null checks
        const packWithFullUrls = {
          ...packData.pack,
          images: Array.isArray(packData.pack.images)
            ? packData.pack.images.map(img => img ? `http://localhost:5000/uploads/${img.split('/').pop()}` : '')
            : packData.pack.images ? [`http://localhost:5000/uploads/${packData.pack.images.split('/').pop()}`] : [],
          products: (packData.pack.products || []).map(product => ({
            ...product,
            images: (product.images || []).map(img => img ? `http://localhost:5000/uploads/${img.split('/').pop()}` : '')
          }))
        };
        
        setPack(packWithFullUrls);
        
        // Only fetch similar packs if we have a category
        if (packData.pack.category) {
          // Fetch similar packs
          const similarResponse = await fetch(
            `http://localhost:5000/api/packs?category=${packData.pack.category}&excludeId=${id}`
          );
          if (similarResponse.ok) {
            const similarData = await similarResponse.json();
            // Check if similarData.packs exists
            const similarWithFullUrls = (similarData.packs || []).map(p => ({
              ...p,
              images: (p.images || []).map(img => img ? `http://localhost:5000/uploads/${img.split('/').pop()}` : '')
            }));
            setSimilarPacks(similarWithFullUrls);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPackAndSimilar();
  }, [id]);

  const handleAddToCart = () => {
    if (!pack) return;
    console.log('Added pack to cart', {
      pack,
      selectedProducts
    });
  };

  const handleSlideNext = () => {
    setCurrentSlide((prev) => 
      Math.min(prev + 1, Math.max(0, similarPacks.length - 4))
    );
  };

  const handleSlidePrev = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handlePackClick = (packId) => {
    navigate(`/pack/${packId}`);
    window.scrollTo(0, 0);
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  if (!pack) return <div className="text-center text-xl mt-10">No pack found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Pack Images */}
        <div className="h-full">
        <PackImageGallery 
        packId={id} // Pass the packId here
        images={pack.images || []}
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        onOpenModal={openModal}
        />
        </div>

        {/* Right Column - Pack Details */}
        <div className="h-full">
          <PackDetails 
            pack={pack}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            handleAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Pack Description */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
        <h2 className="text-xl font-bold mb-4">Pack Description</h2>
        <p className="text-gray-600">{pack.longDescription}</p>

        {/* Products Included Section */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Products Included in Pack</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(pack.products || []).map(product => (
              <div key={product._id} className="border rounded-lg p-4">
                <img 
                  src={product.images?.[0]} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h4 className="font-medium mb-2">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.shortDescription}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar Packs Carousel */}
      {similarPacks.length > 0 && (
        <SimilarPacks 
          packs={similarPacks}
          onPackClick={handlePackClick}
          currentSlide={currentSlide}
          onNext={handleSlideNext}
          onPrev={handleSlidePrev}
        />
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentImage={modalImage ? `http://localhost:5000${modalImage}` : null}
        images={pack?.images?.map(img => `http://localhost:5000${img}`) || []}
        onImageChange={setModalImage}
      />
    </div>
  );
};

export default PacksDetailsPage;
