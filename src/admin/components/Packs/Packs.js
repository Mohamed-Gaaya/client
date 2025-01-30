import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header/Header";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const Packs = () => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/packs", {
          params: {
            timestamp: new Date().getTime(),
            sort: "createdAt",
            sortOrder: "desc"
          }
        });
        
        const sortedPacks = response.data.packs || [];
        sortedPacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setPacks(sortedPacks);
      } catch (error) {
        console.error("Error fetching packs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pack?")) {
      try {
        await axios.delete(`http://localhost:5000/api/packs/${id}`);
        setPacks((prevPacks) => prevPacks.filter((pack) => pack._id !== id));
      } catch (error) {
        console.error("Error deleting pack:", error);
      }
    }
  };

  const handleEdit = (pack) => {
    navigate(`/admin/packs/modify/${pack._id}`);
  };

  const filteredPacks = packs.filter((pack) =>
    pack.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 8;
  const totalFilteredPacks = filteredPacks.length;
  const totalPages = Math.ceil(totalFilteredPacks / itemsPerPage);
  const validCurrentPage = Math.min(currentPage, totalPages || 1);
  
  if (currentPage !== validCurrentPage) setCurrentPage(validCurrentPage);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPacks = filteredPacks.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const calculateSavings = (pack) => {
    const totalValue = pack.totalValue;
    const packPrice = pack.price;
    const savings = totalValue - packPrice;
    const savingsPercentage = (savings / totalValue) * 100;
    return { savings, savingsPercentage };
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Pack Management</h2>
            <Link
              to="/admin/packs/add"
              className="bg-customBlue text-white py-2 px-4 rounded hover:bg-customPink transition"
            >
              Create New Pack
            </Link>
          </div>

          {/* Search Filter */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search packs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-4 py-2 w-full max-w-md"
            />
          </div>

          {/* Pack Cards */}
          {loading ? (
            <div className="text-center text-xl">Loading packs...</div>
          ) : filteredPacks.length === 0 ? (
            <div className="text-center text-xl">No packs found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedPacks.map((pack) => {
                const { savings, savingsPercentage } = calculateSavings(pack);
                return (
                  <div
                    key={pack._id}
                    className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
                  >
                    {/* Pack Image */}
                    {pack.image ? (
                      <img
                        src={`http://localhost:5000${pack.image}`}
                        alt={pack.name}
                        className="h-40 w-full object-cover rounded-md mb-4"
                      />
                    ) : pack.products?.[0]?.images?.[0] ? (
                      <img
                        src={`http://localhost:5000${pack.products[0].images[0]}`}
                        alt={pack.name}
                        className="h-40 w-full object-cover rounded-md mb-4"
                      />
                    ) : (
                      <div className="h-40 w-full bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                    
                    <h3 className="font-bold text-lg mb-2">{pack.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                      {pack.description}
                    </p>
                    
                    {/* Product Names */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Products in Pack:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {pack.products?.map((product) => (
                          <li key={product._id}>{product.name}</li>
                        )) || <li>No products available</li>}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-green-600 font-medium">
                        Pack Price: ${pack.price.toFixed(2)}
                      </p>
                      <p className="text-gray-500">
                        Total Value: ${pack.totalValue.toFixed(2)}
                      </p>
                      <p className="text-blue-600">
                        Save: ${savings.toFixed(2)} ({savingsPercentage.toFixed(1)}%)
                      </p>
                      <p className="text-gray-600">
                        Products: {pack.products?.length || 0}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <button
                        className="text-customBlue hover:text-blue-500 transition"
                        onClick={() => handleEdit(pack)}
                        title="Edit Pack"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition"
                        onClick={() => handleDelete(pack._id)}
                        title="Delete Pack"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded ${
                  currentPage === pageNum
                    ? 'bg-customBlue text-white hover:bg-customPink'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Total Items Info */}
          <div className="text-center mt-4 text-gray-600">
            Showing {Math.min(startIndex + 1, totalFilteredPacks)}-
            {Math.min(endIndex, totalFilteredPacks)} of {totalFilteredPacks} packs
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packs;