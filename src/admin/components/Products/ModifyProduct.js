import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Navbar";
import axios from "axios";

const ModifyProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [hasPromo, setHasPromo] = useState(false);
  const [originalPrice, setOriginalPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [servings, setServings] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandLogo, setBrandLogo] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/brands");
        setBrands(response.data.brands);
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };
    fetchBrands();
  }, []);

  // Fetch Product Details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        const product = response.data.product;

        setProductName(product.name);
        setProductPrice(product.price);
        setProductCategory(product.category);
        setProductBrand(product.brand);
        setProductImages(product.images || []);
        setHasPromo(product.hasPromo);
        setOriginalPrice(product.originalPrice || "");
        setPromoPrice(product.promoPrice || "");
        setServings(product.servings);
        setDescription(product.description);
        if (product.brandLogo) setBrandLogo(product.brandLogo);
      } catch (err) {
        console.error("Error fetching product details:", err);
        alert("Failed to load product details.");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, navigate]);

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files); // Store the actual files, not URLs
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!productName.trim()) newErrors.productName = "Product name is required.";
    if (!productPrice || productPrice <= 0) newErrors.productPrice = "Enter a valid price.";
    if (!productCategory) newErrors.productCategory = "Please select a category.";
    if (!productBrand.trim()) newErrors.productBrand = "Brand name is required.";
    if (hasPromo) {
      if (!originalPrice || originalPrice <= 0) newErrors.originalPrice = "Enter a valid original price.";
      if (!promoPrice || promoPrice <= 0) newErrors.promoPrice = "Enter a valid promo price.";
      if (parseFloat(promoPrice) >= parseFloat(originalPrice)) {
        newErrors.promoPrice = "Promo price must be less than the original price.";
      }
    }
    if (!servings || servings <= 0) newErrors.servings = "Enter valid servings.";
    if (!description.trim()) newErrors.description = "Description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("category", productCategory);
    formData.append("brand", productBrand);

    // Append actual image files, not URLs
    productImages.forEach((image) => formData.append("images", image));

    formData.append("hasPromo", hasPromo);
    if (hasPromo) {
      formData.append("originalPrice", originalPrice);
      formData.append("promoPrice", promoPrice);
    }
    formData.append("servings", servings);
    formData.append("description", description);

    try {
      const response = await axios.put(`http://localhost:5000/api/products/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        navigate("/admin/products");
      } else {
        alert(response.data.message || "Failed to update product.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      alert(err.response?.data?.message || "Error updating product. Please try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header />
        <div className="bg-white p-8 rounded shadow-md max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Modify Product</h2>
          <form onSubmit={handleSubmit}>
            {/* Similar form fields as AddProduct with pre-populated values */}
            {/* ... */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifyProduct;
