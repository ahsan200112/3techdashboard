import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/latestApi';
import storeService from '../../services/storeService';
import {
  Palette,
  Eye,
  Check,
  Star,
  Download,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  Loader2,
  Crown,
  Zap,
  Heart
} from 'lucide-react';

const ThemesPage = () => {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [notification, setNotification] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);

  const themes = [
    {
      id: 'theme1',
      name: 'Modern Minimalist',
      description: 'Clean and elegant design perfect for fashion and lifestyle brands',
      category: 'Fashion',
      price: 'Free',
      rating: 4.8,
      reviews: 1247,
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Mobile First'],
      colors: ['#2563eb', '#7c3aed', '#059669'],
      isPremium: false,
      isPopular: true
    },
    {
      id: 'theme2',
      name: 'E-commerce Pro',
      description: 'Professional theme designed for high-converting online stores',
      category: 'E-commerce',
      price: '$49',
      rating: 4.9,
      reviews: 892,
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Advanced Cart', 'Product Filters', 'Wishlist', 'Quick View'],
      colors: ['#dc2626', '#ea580c', '#ca8a04'],
      isPremium: true,
      isPopular: false
    },
    {
      id: 'theme3',
      name: 'Creative Portfolio',
      description: 'Showcase your work with this stunning portfolio theme',
      category: 'Portfolio',
      price: '$29',
      rating: 4.7,
      reviews: 634,
      image: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Gallery Layouts', 'Animation Effects', 'Contact Forms', 'Blog Ready'],
      colors: ['#7c2d12', '#be185d', '#1e40af'],
      isPremium: true,
      isPopular: false
    }
  ];

  // Load store info and current theme on component mount
  useEffect(() => {
    loadStoreInfo();
  }, []);

  const loadStoreInfo = async () => {
    try {
      setInitialLoading(true);
      const response = await storeService.getStoreInfo();
      if (response?.data) {
        setStoreInfo(response.data);
        
        // Set current selected theme from store data
        const currentTheme = response.data?.themeId;
        if (currentTheme) {
          setSelectedTheme(currentTheme);
        }
      }
    } catch (error) {
      console.error('Error loading store info:', error);
      showNotification('Failed to load store information', 'error');
    } finally {
      setInitialLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSelectTheme = async (themeId) => {
    setLoading(true);
    try {
      // Use the store service to select theme
      await storeService.selectTheme(themeId);
      setSelectedTheme(themeId);
      
      // Update store info to reflect the change
      await loadStoreInfo();
      
      showNotification(`Theme "${themes.find(t => t.id === themeId)?.name}" selected successfully!`);
    } catch (error) {
      console.error('Theme selection error:', error);
      showNotification(error.message || 'Failed to select theme', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewTheme = (themeId) => {
    // Open theme preview in new window
    const previewUrl = `/theme-preview/${themeId}`;
    window.open(previewUrl, '_blank', 'width=1200,height=800');
  };

  return (
    <div className="space-y-8">
      {/* Initial Loading */}
      {initialLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading store information...</p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-lg border ${
          notification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-green-50 border-green-200 text-green-700'
        } flex items-center space-x-3 animate-in slide-in-from-right duration-300`}>
          {notification.type === 'error' ? (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          ) : (
            <Check className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Store Themes</h1>
              <p className="text-purple-100 text-lg">
                Choose the perfect theme for your online store
              </p>
              <div className="mt-4 flex items-center space-x-6 text-purple-100">
                <div className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span className="text-sm">{themes.length} Themes Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span className="text-sm">Premium & Free Options</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <h3 className="text-lg font-semibold mb-1">Current Theme</h3>
                <p className="text-purple-100">
                  {themes.find(t => t.id === selectedTheme)?.name || 'None Selected'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Theme Categories Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <div className="flex flex-wrap gap-4">
          {['All', 'Fashion', 'E-commerce', 'Portfolio', 'Business'].map((category) => (
            <button
              key={category}
              className="px-6 py-3 rounded-2xl font-medium transition-all duration-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {themes.map((theme) => (
          <div key={theme.id} className="group relative">
            <div className="bg-white rounded-3xl border border-slate-200/60 hover:border-slate-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transform hover:-translate-y-1">
              {/* Theme Preview Image */}
              <div className="relative h-64 bg-slate-100 overflow-hidden">
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {theme.isPopular && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Popular
                    </span>
                  )}
                  {theme.isPremium && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Premium
                    </span>
                  )}
                </div>

                {/* Selected Badge */}
                {selectedTheme === theme.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Color Palette */}
                <div className="absolute bottom-4 left-4 flex space-x-1">
                  {theme.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Theme Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {theme.name}
                    </h3>
                    <p className="text-sm text-slate-500">{theme.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">{theme.price}</div>
                    <div className="flex items-center text-sm text-slate-500">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {theme.rating} ({theme.reviews})
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {theme.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {theme.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg"
                      >
                        {feature}
                      </span>
                    ))}
                    {theme.features.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg">
                        +{theme.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePreviewTheme(theme.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-200 text-slate-700 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  
                  <button
                    onClick={() => handleSelectTheme(theme.id)}
                    disabled={loading || selectedTheme === theme.id}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200 font-medium ${
                      selectedTheme === theme.id
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : selectedTheme === theme.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Select
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Theme Customization Section */}
      {selectedTheme && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Customize Your Theme
              </h2>
              <p className="text-slate-600">
                Fine-tune your selected theme to match your brand
              </p>
              {storeInfo && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Store:</strong> {storeInfo.name} | 
                    <strong> Domain:</strong> {storeInfo.domain}
                  </p>
                </div>
              )}
            </div>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Customize Theme
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Colors & Fonts</h3>
              <p className="text-sm text-slate-600">Customize colors, typography, and branding</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Layout Options</h3>
              <p className="text-sm text-slate-600">Adjust layouts, sections, and page structure</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Advanced Settings</h3>
              <p className="text-sm text-slate-600">Configure SEO, analytics, and integrations</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemesPage;