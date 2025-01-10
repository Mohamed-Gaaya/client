import React from "react";
import logo from "../assets/images/logo.jpg"; // Adjust the path to your logo file

function Header() {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo Section */}
                <div className="flex items-center gap-4">
                    <a href="/">
                        <img
                            src={logo}
                            alt="YODA Logo"
                            className="h-16 w-16 rounded-full object-cover border-2 border-black"
                        />
                    </a>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center space-x-6">
                    <a href="/" className="text-gray-700 hover:text-blue-600 transition">
                        Home
                    </a>
                    <div className="relative group">
                        <a
                            href="/shop"
                            className="text-gray-700 hover:text-blue-600 transition">
                            Shop
                        </a>
                        <ul className="absolute hidden group-hover:flex flex-col bg-white shadow-lg top-full left-0 mt-2 w-40">
                            <li>
                                <a
                                    href="/shop/supplements"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white">
                                    Supplements
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/shop/gear"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white">
                                    Gear
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/shop/apparel"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white">
                                    Apparel
                                </a>
                            </li>
                        </ul>
                    </div>
                    <a href="/about" className="text-gray-700 hover:text-blue-600 transition">
                        About
                    </a>
                    <a href="/contact" className="text-gray-700 hover:text-blue-600 transition">
                        Contact
                    </a>
                </nav>

                {/* Call-to-Action Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    <a
                        href="/search"
                        className="px-4 py-2 bg-customBlue text-white rounded-lg hover:bg-customPink transition">
                        Search
                    </a>
                    <a
                        href="/cart"
                        className="px-4 py-2 bg-customBlue text-white rounded-lg hover:bg-customPink transition">
                        Cart
                    </a>
                    <a
                        href="/login"
                        className="px-4 py-2 bg-customBlue text-white rounded-lg hover:bg-customPink transition">
                        Login
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden flex items-center px-3 py-2 border rounded text-gray-700 border-gray-400 hover:text-blue-600 hover:border-blue-600">
                    <svg
                        className="fill-current h-4 w-4"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <div className="md:hidden">
                <nav className="flex flex-col items-start bg-white shadow-md p-4 space-y-2">
                    <a href="/" className="text-gray-700 hover:text-blue-600 transition">
                        Home
                    </a>
                    <div className="relative">
                        <a
                            href="/shop"
                            className="text-gray-700 hover:text-blue-600 transition">
                            Shop
                        </a>
                        <ul className="flex flex-col space-y-1 pl-4 mt-1">
                            <li>
                                <a
                                    href="/shop/supplements"
                                    className="text-gray-700 hover:text-blue-600 transition">
                                    Supplements
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/shop/gear"
                                    className="text-gray-700 hover:text-blue-600 transition">
                                    Gear
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/shop/apparel"
                                    className="text-gray-700 hover:text-blue-600 transition">
                                    Apparel
                                </a>
                            </li>
                        </ul>
                    </div>
                    <a href="/about" className="text-gray-700 hover:text-blue-600 transition">
                        About
                    </a>
                    <a href="/contact" className="text-gray-700 hover:text-blue-600 transition">
                        Contact
                    </a>
                </nav>
            </div>
        </header>
    );
}

export default Header;
