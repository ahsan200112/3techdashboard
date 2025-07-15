import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Monitor, Smartphone, Tablet, ExternalLink, ArrowLeft } from 'lucide-react';

// Theme Components
import Theme1Home from '../../themes/theme1/pages/Home';
import Theme1Products from '../../themes/theme1/pages/Products';
import Theme2Home from '../../themes/theme2/pages/Home';
import Theme2Products from '../../themes/theme2/pages/Products';

const ThemePreview = () => {
  const { themeId, page = 'home' } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('desktop');

  const themeComponents = {
    theme1: {
      home: Theme1Home,
      products: Theme1Products,
    },
    theme2: {
      home: Theme2Home,
      products: Theme2Products,
    }
  };

  const themeInfo = {
    theme1: {
      name: 'Modern Minimalist',
      description: 'Clean and elegant design perfect for fashion and lifestyle brands'
    },
    theme2: {
      name: 'E-commerce Pro',
      description: 'Professional theme designed for high-converting online stores'
    }
  };

  const getCurrentComponent = () => {
    const theme = themeComponents[themeId];
    if (!theme) return null;
    
    const Component = theme[page] || theme.home;
    return Component;
  };

  const Component = getCurrentComponent();
  const currentTheme = themeInfo[themeId];

  if (!Component || !currentTheme) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Theme Not Found</h1>
          <p className="text-gray-600 mb-6">The requested theme could not be loaded.</p>
          <button
            onClick={() => window.close()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    );
  }

  const getViewportStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '812px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Preview Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.close()}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-lg font-semibold text-gray-900">{currentTheme.name}</h1>
                <p className="text-sm text-gray-500">{currentTheme.description}</p>
              </div>
            </div>

            {/* Center - Page Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate(`/theme-preview/${themeId}/home`)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  page === 'home' || !page
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate(`/theme-preview/${themeId}/products`)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  page === 'products'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Products
              </button>
            </div>

            {/* Right Side - View Controls */}
            <div className="flex items-center space-x-4">
              {/* Viewport Controls */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'desktop'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('tablet')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'tablet'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'mobile'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* External Link */}
              <button
                onClick={() => window.open(`/theme-preview/${themeId}/${page}`, '_blank')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Open in New Tab"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div
          className={`bg-white shadow-2xl transition-all duration-300 ${
            viewMode === 'desktop' ? 'w-full h-full' : 'rounded-lg overflow-hidden'
          }`}
          style={getViewportStyles()}
        >
          <div className="w-full h-full overflow-auto">
            <Component />
          </div>
        </div>
      </div>

      {/* Preview Info */}
      {viewMode !== 'desktop' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
          <span className="text-sm">
            {viewMode === 'mobile' ? '375 × 812' : '768 × 1024'} - {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
          </span>
        </div>
      )}
    </div>
  );
};

export default ThemePreview;