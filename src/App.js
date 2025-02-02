import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import BrandPage from "./pages/BrandPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminRoutes from "./admin/AdminRoutes";
import BrandsSection from "./pages/HomePage/BrandsSection";
import ProductDetails from './pages/ProductDetails/ProductDetailsPage';
import ProductsPage from './pages/HomePage/ProductsPage';
import PacksPage from './pages/HomePage/Packs/PacksPage';
import PacksDetailsPage from './pages/HomePage/Packs/PacksDetails/PacksDetailsPage';

// Conditional Header component that hides the header on /admin routes
const AppHeader = () => {
  const location = useLocation();
  

  // Do not render the Header if the path starts with "/admin"
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return <Header />;
};



function App() {
  return (
    <Router>
      <AppHeader /> {/* This will conditionally render the header */}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<BrandsSection />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/packs" element={<PacksPage />} />
        <Route path="/packs/:id" element={<PacksDetailsPage />} />
      </Routes>
      
      <AdminRoutes /> {/* Admin-specific routes */}
    </Router>
  );
}

export default App;
