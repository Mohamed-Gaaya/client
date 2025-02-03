import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Header from '../Header/Header';
import { FaEdit, FaTrash, FaImage } from "react-icons/fa";

const ModifyPack = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [packName, setPackName] = useState('');
  const [packDescription, setPackDescription] = useState('');
  const [packPrice, setPackPrice] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [packImage, setPackImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPackImage, setCurrentPackImage] = useState('');

  const filteredProducts = availableProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchPackAndProducts = async () => {
      try {
        // Fetch pack details
        const packResponse = await axios.get(`http://localhost:5000/api/packs/${id}`);
        const pack = packResponse.data.pack;
        
        // Set pack details
        setPackName(pack.name);
        setPackDescription(pack.description || '');
        setPackPrice(pack.price.toString());
        setSelectedProducts(pack.products || []);
        setCurrentPackImage(pack.image || '');
        if (pack.image) {
          setImagePreview(`http://localhost:5000${pack.image}`);
        }

        // Fetch available products
        const productsResponse = await axios.get('http://localhost:5000/api/products');
        setAvailableProducts(productsResponse.data.products || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch pack details');
        navigate('/admin/packs');
      } finally {
        setLoading(false);
      }
    };

    fetchPackAndProducts();
  }, [id, navigate]);

  const handleProductSelect = (product) => {
    if (!selectedProducts.find(p => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p._id !== productId));
  };

  const calculateTotalPrice = () => {
    return selectedProducts.reduce((sum, product) => {
      return sum + (product.promoPrice || product.price);
    }, 0);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPackImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate inputs
      if (!packName.trim()) {
        throw new Error('Pack name is required');
      }
      
      if (!packPrice || isNaN(packPrice) || parseFloat(packPrice) < 0) {
        throw new Error('Please enter a valid price');
      }
      
      if (selectedProducts.length === 0) {
        throw new Error('Please select at least one product');
      }

      const totalValue = calculateTotalPrice();
      
      const formData = new FormData();
      formData.append('name', packName.trim());
      formData.append('description', packDescription.trim());
      formData.append('price', parseFloat(packPrice));
      formData.append('products', JSON.stringify(selectedProducts.map(p => p._id)));
      formData.append('totalValue', totalValue);
      if (packImage) {
        formData.append('image', packImage);
      }

      const response = await axios.put(`http://localhost:5000/api/packs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.pack) {
        navigate('/admin/packs');
      }
    } catch (error) {
      console.error('Error updating pack:', error);
      alert(error.response?.data?.error || error.message || 'Failed to update pack');
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Header />
          <div className="flex items-center justify-center h-full">
            <p>Loading pack details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6">Modify Pack</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pack Name</label>
              <input
                type="text"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={packDescription}
                onChange={(e) => setPackDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pack Price</label>
              <input
                type="number"
                value={packPrice}
                onChange={(e) => setPackPrice(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pack Image</label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Pack preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <FaImage className="text-gray-400 text-3xl" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="pack-image"
                />
                <label
                  htmlFor="pack-image"
                  className="bg-customBlue text-white px-4 py-2 rounded hover:bg-customPink cursor-pointer"
                >
                  Change Image
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Search Products</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Search products..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Available Products</h3>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div 
                      key={product._id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={Array.isArray(product.images) && product.images.length > 0
                            ? `http://localhost:5000${product.images[0]}`
                            : "https://via.placeholder.com/50"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            ${(product.promoPrice || product.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="bg-customBlue text-white px-3 py-1 rounded hover:bg-customPink"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductSelect(product);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Selected Products</h3>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                  {selectedProducts.map(product => (
                    <div 
                      key={product._id}
                      className="flex items-center justify-between p-2 border-b last:border-b-0"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={Array.isArray(product.images) && product.images.length > 0
                            ? `http://localhost:5000${product.images[0]}`
                            : "https://via.placeholder.com/50"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            ${(product.promoPrice || product.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveProduct(product._id)}
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  ))}
                  {selectedProducts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No products selected</p>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-right font-medium">
                    Total Value: ${calculateTotalPrice().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/packs')}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-customBlue text-white px-4 py-2 rounded hover:bg-customPink"
                disabled={selectedProducts.length === 0}
              >
                Update Pack
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifyPack;