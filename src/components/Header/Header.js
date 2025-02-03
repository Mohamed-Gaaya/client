import React, { useState } from "react";
import logo from "../../assets/images/YODA-LOGO-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Categories from "./Categories";
import BrandHeaderDropdown from "./BrandHeaderDropdown";
import ClothingAccessories from "./ClothingAccessories";
import SearchBar from "./SearchBar";
import Cart from "./Cart";
import LanguageSwitcher from "./LanguageSwitcher";

function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Search Bar */}
      {isSearchOpen && (
        <div className="fixed top-0 left-0 w-full bg-black z-[100] p-4 shadow-md">
          <div className="container mx-auto max-w-md relative">
            <SearchBar />
            <button
              onClick={() => setIsSearchOpen(false)}
              type="reset"
              className="absolute right-3 -translate-y-1/2 top-1/2 p-1 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      <header className="bg-black shadow-md sticky top-0 z-50 w-full">
        {/* Mobile Header */}
        <div className="container mx-auto flex justify-between items-center p-4 sm:hidden">
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Toggle */}
            <button className="text-white" onClick={() => setIsOpen(true)}>
              <svg viewBox="0 0 175 80" width={40} height={40}>
                <rect width={80} height={15} fill="white" rx={10} />
                <rect y={30} width={80} height={15} fill="white" rx={10} />
                <rect y={60} width={80} height={15} fill="white" rx={10} />
              </svg>
            </button>

            {/* Mobile Logo */}
            <a href="/">
              <img src={logo} alt="YODA Logo" className="h-12 w-auto object-contain" />
            </a>
          </div>

          {/* Mobile Icons */}
          <div
            className="flex items-center space-x-4"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-gray-300"
              title={t("common.search")}
            >
              <span className="material-symbols-outlined text-3xl">search</span>
            </button>

            <a href="/favorites" className="text-white hover:text-gray-300">
              <span className="material-symbols-outlined text-3xl">favorite</span>
            </a>
            <button onClick={() => setIsCartOpen(true)} className="text-white hover:text-gray-300">
            <span className="material-symbols-outlined text-3xl">shopping_cart</span>
          </button>
          <Cart isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          key={isCartOpen ? 'cart-open' : 'cart-closed'}/>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block">
          <div className="container mx-auto flex items-center justify-between py-4 px-6">
            {/* Left Section - Logo */}
            <div>
              <a href="/">
                <img src={logo} alt="YODA Logo" className="h-16 w-auto object-contain" />
              </a>
            </div>

            {/* Center Section - Navigation */}
            <nav className="flex flex-row justify-between space-x-6">
              <a href="/" className="text-white hover:text-gray-300 font-bold">
                HOME
              </a>
              <div className="text-white">
                <Categories />
              </div>
              <div className="text-white">
                <BrandHeaderDropdown />
              </div>
              <button onClick={() => handleNavigation('/packs')} className="text-white hover:text-gray-300 font-bold">
                PACKS
              </button>
              <div className="text-white">
                <ClothingAccessories />
              </div>
              <a href="/contact" className="text-white hover:text-gray-300 font-bold">
                CONTACT
              </a>
            </nav>

            {/* Right Section - Icons */}
            <div
              className="flex items-center space-x-6"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-gray-300"
                title={t("common.search")}
              >
                <span className="material-symbols-outlined text-3xl">search</span>
              </button>

              <a href="/favorites" className="text-white hover:text-gray-300">
                <span className="material-symbols-outlined text-3xl">favorite</span>
              </a>
              <button onClick={() => setIsCartOpen(true)} className="text-white hover:text-gray-300">
              <span className="material-symbols-outlined text-3xl">shopping_cart</span>
            </button>
            <Cart isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}key={isCartOpen ? 'cart-open' : 'cart-closed'} />
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="fixed top-0 left-0 w-64 h-full bg-black shadow-lg p-6">
              <div className="text-right">
                <button onClick={() => setIsOpen(false)} className="text-white mb-4">
                  <svg height="20px" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col space-y-4">
                <a href="/" className="text-white hover:text-white font-bold">
                  HOME
                </a>
                <Categories />
                <BrandHeaderDropdown />
                <button onClick={() => handleNavigation('/packs')} className="text-left text-white hover:text-blue-600 font-bold ">
                  PACKS
                </button>
                <ClothingAccessories />
                <a href="/contact" className="text-white hover:text-blue-600 font-bold">
                  CONTACT
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;