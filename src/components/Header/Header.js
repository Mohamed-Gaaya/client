import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.jpg";
import { StyledWrapper } from "../../pages/HomePage/style";
import { useTranslation } from "react-i18next";
import Categories from "./Categories";
import BrandHeaderDropdown from "./BrandHeaderDropdown"; 
import Packs from "./Packs";
import ClothingAccessories from "./ClothingAccessories";
import Contact from "./Contact";
import Profile from "./Profile";
import Favourites from "./Favourites";
import Cart from "./Cart";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchBar from "./SearchBar";

function Header() {
  const { t, i18n } = useTranslation();
  const switchLanguage = () => {
    const languageOrder = ["en", "fr", "ar"];
    const currentIndex = languageOrder.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % languageOrder.length;
    const nextLanguage = languageOrder[nextIndex];
    i18n.changeLanguage(nextLanguage);
  };
  const getLanguageName = (code) => {
    const names = {
      en: t("English"),
      fr: t("Français"),
      ar: t("العربية"),
    };
    return names[code] || code;
  };
  const [isOpen, setIsOpen] = useState(false);
  const categories = [
    {
      label: "Proteins",
      subcategories: [
        "Casein",
        "Slow-Release Proteins",
        "Egg Proteins",
        "Whey Protein",
        "Whey Protein Blend",
        "Whey Protein Concentrates",
        "Hydrolyzed Proteins",
        "Whey Protein Isolates",
      ],
    },
    {
      label: "Amino Acids",
      subcategories: [
        "L-Arginine",
        "Amino Acid Blend",
        "BCAA's (Branched-Chain Amino Acids)",
        "Meat-Based Amino Acids",
        "Glutamine",
        "BCAA's + Glutamine",
      ],
    },
    {
      label: "Carbohydrates",
      subcategories: [
        "High Glycemic Index",
        "Sequential Blend of Carbohydrates",
      ],
    },
    {
      label: "Creatine",
      subcategories: ["Creatine Monohydrate"],
    },
    {
      label: "Fatty Acids",
      subcategories: ["Omega 3", "Omega 3-6-9"],
    },
    {
      label: "Gainers (Weight Gain)",
      subcategories: ["Gainer 10% to 30%", "50/50 Gainer"],
    },
    {
      label: "Natural Anabolics",
      subcategories: [
        "Growth Hormone Pro-Hormone (GH)",
        "Pro-Testosterone",
        "ZMA",
        "Multi-Action",
      ],
    },
    {
      label: "Sports Drinks",
      subcategories: [
        "Ready-to-Drink Sports Drinks",
        "Pre-Workout",
        "Intra-Workout",
        "Post-Workout & Recovery",
      ],
    },
    {
      label: "Fat Burners",
      subcategories: [
        "L-Carnitine",
        "CLA",
        "Fat Burners",
        "Diuretics",
        "Thermogenics",
      ],
    },
    {
      label: "Vitamins & Minerals",
      subcategories: ["Minerals", "Multivitamins", "Joint Health"],
    },
    {
      label: "Bars",
      subcategories: ["Protein Bars", "Energy Bars"],
    },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      {/* Top Section */}
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* -------------------------------- MOBILE INTERFACE -------------------------------- */}
        <div className="flex sm:hidden">
          <StyledWrapper>
            <div className="relative">
              {/* Navbar Container */}
              <div className="container">
                {/* Toggle Button */}
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

              {/* Drawer (conditionally rendered with Tailwind) */}
              <div
                className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-transform duration-300 ${
                  isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                {/* Drawer Content */}
                <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6">
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
                  <nav className="flex flex-col space-y-4">
                    <a
                      href="/"
                      className="text-gray-700 hover:text-blue-600 transition text-lg font-bold"
                    >
                      HOME
                    </a>
                    <div className="relative group">
                      <a
                        href="/categories"
                        className="text-gray-700 hover:text-blue-600 transition text-lg font-bold"
                      >
                        CATEGORIES
                      </a>
                      <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg top-full left-0 w-[80vw] px-6 py-4">
                        <div className="grid grid-cols-3 gap-4 max-w-screen-lg mx-auto">
                          {categories.map((category, index) => (
                            <div key={index} className="mb-2">
                              <h3 className="font-semibold text-gray-700 mb-2">
                                {category.label}
                              </h3>
                              <ul className="space-y-1">
                                {category.subcategories.map((sub, subIndex) => (
                                  <li key={subIndex}>
                                    <a
                                      href={`/shop/${sub
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                      className="block text-sm text-gray-700 hover:bg-blue-100 px-2 py-1 rounded"
                                    >
                                      {sub}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <a
                      href="/brands"
                      className="text-gray-700 hover:text-blue-600 transition text-lg font-bold"
                    >
                      BRANDS
                    </a>
                    <a
                      href="/packs"
                      className="text-gray-700 hover:text-blue-600 transition text-lg font-bold"
                    >
                      PACKS
                    </a>
                    <a
                      href="/clothing-accessories"
                      className="text-gray-700 hover:text-blue-600 transition text-lg font-bold"
                    >
                      CLOTHING AND ACCESSORIES
                    </a>
                    <a
                      href="/contact"
                      className="text-gray-700 hover:text-blue-600 transition text-lg font-bold"
                    >
                      CONTACT
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </StyledWrapper>
        </div>
        {/* Logo */}
        <div className="hidden sm:block">
          <a href="/">
            <img
              src={logo}
              alt="YODA Logo"
              className="h-20 w-22 rounded-full object-cover border-2 border-black"
            />
          </a>
        </div>
        <div className="flex sm:hidden mx-8">
          <a href="/">
            <img
              src={logo}
              alt="YODA Logo"
              className="h-10 w-10 rounded-full object-cover border-1 border-black"
            />
          </a>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-center mx-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                className="absolute bg-customBlue inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600"
                aria-label="Search"
              >
                <span className="material-symbols-outlined text-xl text-white">
                  search
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex sm:hidden">
          <div className="flex items-center justify-center">
            <div class="p-2 overflow-hidden w-[40px] h-[40px] hover:w-[270px] bg-[white] rounded-full flex group items-center hover:duration-300 duration-300">
              <div class="flex items-center justify-center fill-gray-700 bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Isolation_Mode"
                  data-name="Isolation Mode"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                >
                  <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"></path>
                </svg>
              </div>
              <input
                type="text"
                class="outline-none text-[20px] bg-transparent w-full text-white font-normal px-4"
              />
            </div>
          </div>
        </div>

        {/* Icons: Profile, Favorites, Cart */}
        <div
          className="flex items-center space-x-4 "
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <button
            onClick={switchLanguage}
            className="text-gray-700 hover:text-blue-600 flex items-center"
            title={t("common.switchLanguage")}
          >
            <span className="material-symbols-outlined text-3xl">language</span>
            <span className="ml-1 text-sm">
              {getLanguageName(i18n.language)}
            </span>
          </button>
          {/* Profile Icon */}
          <a
            href="/profile"
            className="text-gray-700 hover:text-blue-600 flex items-center"
          >
            <span className="material-symbols-outlined text-3xl">
              account_circle
            </span>
          </a>
          {/* Favorites Icon */}
          <a
            href="/favorites"
            className="text-gray-700 hover:text-blue-600 flex items-center"
          >
            <span className="material-symbols-outlined text-3xl">favorite</span>
          </a>

          {/* Cart Icon */}
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

      {/* Bottom Section */}
      <div className="bg-white-100 py-2">
          <nav className="mx-auto flex max-w-6xl items-center justify-between p-6 lg:px-6" aria-label="Global">
          {/*-------------------------------- WEB INTERFACE -------------------------------- */}
          <div className="hidden sm:block">
              <div className="flex lg:px-8 items-center justify-between space-x-6">
                <a href="/" className="text-gray-700 hover:text-blue-600 transition text-xl font-bold">
                  HOME
                </a>
                <Categories  />
                <BrandHeaderDropdown />
              <a
                href="/packs"
                className="text-gray-700 hover:text-blue-600 transition text-xl font-bold"
              >
                PACKS
              </a>
              <a
                href="/clothing-accessories"
                className="text-gray-700 hover:text-blue-600 transition text-xl font-bold"
              >
                CLOTHING AND ACCESSORIES
              </a>
              <a
                href="/contact"
                className="text-gray-700 hover:text-blue-600 transition text-xl font-bold"
              >
                CONTACT
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;