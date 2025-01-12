import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import BrandPage from "./pages/BrandPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminRoutes from "./admin/AdminRoutes";

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
        <Route path="/shop" element={<BrandPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      
      <AdminRoutes /> {/* Admin-specific routes */}
    </Router>
  );
}

export default App;
