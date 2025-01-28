import React, { useState } from "react";
import logo from "../../assets/images/logo.jpg";
import { StyledWrapper } from "../../pages/HomePage/style";
import { useTranslation } from "react-i18next";
import Categories from "./Categories";
import BrandHeaderDropdown from "./BrandHeaderDropdown";
import ClothingAccessories from "./ClothingAccessories";
import SearchBar from "./SearchBar";
import LanguageSwitcher from "./LanguageSwitcher";

function Header() {
  const { t, i18n } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Search Bar */}
      {isSearchOpen && (
        <div className="fixed top-0 left-0 w-full bg-white z-[100] p-4 shadow-md">
          <div className="container mx-auto max-w-md relative">
            <SearchBar />
            <button
              onClick={() => setIsSearchOpen(false)}
              type="reset"
              className="absolute right-3 -translate-y-1/2 top-1/2 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      <header className="bg-white shadow-md sticky top-0 z-50 w-full">
        {/* Mobile Header */}
        <div className="container mx-auto flex justify-between items-center p-4 sm:hidden">
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Toggle */}
            <StyledWrapper>
              <div className="relative">
                <div className="container">
                  <button className="btn" onClick={() => setIsOpen(true)}>
                    <span className="icon">
                      <svg viewBox="0 0 175 80" width={40} height={40}>
                        <rect width={80} height={15} fill="#040f16" rx={10} />
                        <rect
                          y={30}
                          width={80}
                          height={15}
                          fill="#040f16"
                          rx={10}
                        />
                        <rect
                          y={60}
                          width={80}
                          height={15}
                          fill="#040f16"
                          rx={10}
                        />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Mobile Drawer */}
                <div
                  className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  <div className="fixed  top-0 left-0 w-64 h-full bg-white shadow-lg p-6">
                    <div className="text-right">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-800 mb-4"
                      >
                        <svg height="20px" viewBox="0 0 384 512">
                          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                        </svg>
                      </button>
                    </div>
                    <nav className="flex flex-col justify-start space-y-4">
                      <a href="/">
                        <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                          HOME
                        </span>
                      </a>
                      <Categories />
                      <BrandHeaderDropdown />
                      <a href="/packs">
                        <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                          PACKS
                        </span>
                      </a>
                      <ClothingAccessories />
                      <a href="/contact">
                        <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                          CONTACT
                        </span>
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </StyledWrapper>

            {/* Mobile Logo */}
            <a href="/">
              <img
                src={logo}
                alt="YODA Logo"
                className="h-10 w-10 rounded-full object-cover border-1 border-black mx-10"
              />
            </a>
          </div>

          {/* Mobile Icons */}
          <div
            className="flex items-center space-x-2"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-700 hover:text-blue-600 flex items-center"
              title={t("common.search")}
            >
              <span className="material-symbols-outlined text-3xl">search</span>
            </button>

            <LanguageSwitcher />

            <a
              href="/favorites"
              className="text-gray-700 hover:text-blue-600 flex items-center"
            >
              <span className="material-symbols-outlined text-3xl">
                favorite
              </span>
            </a>
            <a
              href="/cart"
              className="text-gray-700 hover:text-blue-600 flex items-center"
            >
              <span className="material-symbols-outlined text-3xl">
                shopping_cart
              </span>
            </a>
          </div>
        </div>

        {/* Desktop Header */}

        {/* Desktop Header */}
        <div className="hidden sm:block">
          <div className="container mx-auto flex items-center justify-between py-2 px-6">
            {/* Left Section - Logo */}
            <div>
              <a href="/">
                <img
                  src={logo}
                  alt="YODA Logo"
                  className="h-16 w-16 rounded-full object-cover border-2 border-black"
                />
              </a>
            </div>

            {/* Center Section - Navigation */}
            <nav className="flex flex-row justify-between space-x-4">
              <a href="/">
                <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                  HOME
                </span>
              </a>
              <Categories />
              <BrandHeaderDropdown />
              <a href="/packs">
                <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                  PACKS
                </span>
              </a>
              <ClothingAccessories />
              <a href="/contact">
                <span className="text-gray-700 hover:text-blue-600 transition font-bold">
                  CONTACT
                </span>
              </a>
            </nav>

            {/* Right Section - Icons */}
            <div
              className="flex items-center space-x-4"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-blue-600 flex items-center"
                title={t("common.search")}
              >
                <span className="material-symbols-outlined text-3xl">
                  search
                </span>
              </button>

              <LanguageSwitcher />

              <a
                href="/profile"
                className="text-gray-700 hover:text-blue-600 flex items-center"
              >
                <span className="material-symbols-outlined text-3xl">
                  account_circle
                </span>
              </a>
              <a
                href="/favorites"
                className="text-gray-700 hover:text-blue-600 flex items-center"
              >
                <span className="material-symbols-outlined text-3xl">
                  favorite
                </span>
              </a>
              <a
                href="/cart"
                className="text-gray-700 hover:text-blue-600 flex items-center"
              >
                <span className="material-symbols-outlined text-3xl">
                  shopping_cart
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
