import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard, Shield, Truck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-red-500 mb-4">E-Commerce Pro</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your ultimate destination for premium products at unbeatable prices. 
              We're committed to providing exceptional quality and outstanding customer service.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-red-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-red-500" />
                <span>info@ecommercepro.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-red-500" />
                <span>123 Commerce Street, Business City, BC 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-red-500">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Categories</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Deals</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Best Sellers</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-red-500">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-red-500">My Account</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sign In</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Create Account</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Order History</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Wishlist</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Account Settings</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Loyalty Program</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center md:justify-start">
              <Truck className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h5 className="font-semibold">Free Shipping</h5>
                <p className="text-sm text-gray-400">On orders over $75</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Shield className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h5 className="font-semibold">Secure Payment</h5>
                <p className="text-sm text-gray-400">100% protected transactions</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <CreditCard className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h5 className="font-semibold">Easy Returns</h5>
                <p className="text-sm text-gray-400">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-2">Stay Updated</h4>
            <p className="text-gray-400 mb-6">Subscribe to get special offers, free giveaways, and exclusive deals.</p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 E-Commerce Pro. All rights reserved. | Privacy Policy | Terms of Service
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">We Accept:</span>
              <div className="flex space-x-2">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-blue-600">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-red-600">MC</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-blue-800">AMEX</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-blue-600">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;