import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Heart, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg">
      {/* Top Bar */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@ecommercepro.com</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span>Free shipping on orders over $75!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold text-red-600">E-Commerce Pro</h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-4 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-red-600 text-white rounded-r-lg hover:bg-red-700 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-red-600 transition-colors relative">
              <Heart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
            <button className="p-2 text-gray-700 hover:text-red-600 transition-colors">
              <User className="w-6 h-6" />
            </button>
            <button className="p-2 text-gray-700 hover:text-red-600 transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                5
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-red-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex border-t border-gray-200 py-4">
          <div className="flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-red-600">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-red-600">
              Products
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-red-600">
              Categories
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-red-600">
              Deals
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-red-600">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-red-600">
              Contact
            </a>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full pl-4 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button className="absolute right-0 top-0 h-full px-4 bg-red-600 text-white rounded-r-lg">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
                Products
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
                Categories
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
                Deals
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;