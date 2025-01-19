import React, { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const ModifyCategory = ({ category, onClose, onDelete }) => {
  const [categoryName, setCategoryName] = useState(category.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSaveChanges = async () => {
    try {
      // API call to update the category
      await axios.put(`http://localhost:5000/api/categories/${category._id}`, {
        name: categoryName,
      });
      onClose();
    } catch (err) {
      console.error("Error updating category:", err);
      alert("Failed to update category. Please try again.");
    }
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(true);
  };

  const handleDelete = () => {
    onDelete(category._id);
    onClose();
  };

  return (
    <div className="p-6 relative">

      <h2 className="text-2xl font-bold mb-6">Modify Category</h2>

      {/* Editable Category Name */}
      <div className="mb-6">
        <label className="block text-sm font-bold mb-2" htmlFor="categoryName">
          Category Name
        </label>
        <input
          id="categoryName"
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onClick={handleConfirmDelete}
        >
          Delete
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="mt-6">
          <p className="text-lg mb-4">
            Are you sure you want to delete <strong>{category.name}</strong>?
          </p>
          <div className="flex justify-end">
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-2"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={handleDelete}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyCategory;
