import React, { useState } from "react";
import logo from "../assets/images/YODA-LOGO-removebg-preview.png";
import { Facebook, Instagram, Twitter } from "lucide-react";
import GoogleMapReact from 'google-map-react';


export function FooterPage() {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <footer className="bg-black text-gray-300 py-2">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1 flex flex-col justify-start space-y-4 md:mb-0">
            <div className="w-full">
              <img
                src={logo}
                alt="YODA Logo"
                className="h-32 w-auto object-contain mb-6"
              />
              <p className="text-sm text-justify  text-gray-400">
                Découvrez une alimentation adaptée à votre performance. Notre
                équipe de spécialistes en nutrition sportive est là pour vous
                guider vers une meilleure santé et des résultats optimaux.
                Nourrissez votre passion pour le sport avec notre expertise.
              </p>
              <div className="flex-grow flex justify-start space-x-4 mt-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook size={32} color="blue" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={32} color="purple" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-1 mt-4">
            <h3 className="text-customBlue font-semibold text-lg mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/shop"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Shop All
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Nutrition Blog
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Products Column */}
          <div className="md:col-span-1 mt-4">
            <h3 className="text-customBlue font-semibold text-lg mb-6">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/category/protein"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Protein
                </a>
              </li>
              <li>
                <a
                  href="/category/pre-workout"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Creatine
                </a>
              </li>
              <li>
                <a
                  href="/category/recovery"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Mass Gainer
                </a>
              </li>
              <li>
                <a
                  href="/category/accessories"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Vitamins
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-1 mt-4">
            <h3 className="text-customBlue font-semibold text-lg mb-6">
              Connect With Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="mb-6">
                  <div
                    style={{ height: "400px", width: "100%" }}
                    className="mb-6"
                  >
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: "AIzaSyDwzSPcZdlTMDPyTqD0Gd2AEX68Lj287bY" }}
                      defaultCenter={defaultProps.center}
                      defaultZoom={defaultProps.zoom}
                    ></GoogleMapReact>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-blue-400">
                  phone
                </span>
                <a
                  href="tel:+1234567890"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-blue-400">
                  mail
                </span>
                <a
                  href="mailto:info@yodanutrition.com"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  info@yodanutrition.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 "></div>

        {/* Copyright */}

        <div>
          <p className="text-sm text-center text-gray-500 my-4">
            © {new Date().getFullYear()} YODA Sports Nutrition. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
