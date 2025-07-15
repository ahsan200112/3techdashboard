import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Store,
  Palette,
  Archive,
  Tags,
  ChevronDown,
  ChevronUp,
  List,
  Grid
} from 'lucide-react';

const Sidebar = ({ collapsed, isRTL }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const navigationItems = [
    {
      key: 'dashboard',
      icon: Home,
      label: t('nav.dashboard'),
      path: '/'
    },
    {
      key: 'products',
      icon: Package,
      label: t('nav.products'),
      path: '/products',
      submenu: [
        { key: 'all-products', label: 'All Products', path: '/products/allproducts', icon: Grid },
        { key: 'inventory', label: t('nav.inventory'), path: '/products/inventory', icon: Archive },
        { key: 'categories', label: t('nav.categories'), path: '/products/categories', icon: Tags },
        { key: 'options', label: 'Product Options', path: '/products/options', icon: Settings }
      ]
    },
    {
      key: 'orders',
      icon: ShoppingCart,
      label: t('nav.orders'),
      path: '/orders'
    },
    {
      key: 'customers',
      icon: Users,
      label: t('nav.customers'),
      path: '/customers'
    },
    {
      key: 'stores',
      icon: Store,
      label: t('nav.stores'),
      path: '/stores',
      submenu: [
        { key: 'themes', label: t('nav.themes'), path: '/stores/themes', icon: Palette }
      ]
    },
    {
      key: 'settings',
      icon: Settings,
      label: t('nav.settings'),
      path: '/settings'
    }
  ];

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.key];

    return (
      <div key={item.key} className="mb-2">
        {hasSubmenu ? (
          <button
            onClick={() => toggleSubmenu(item.key)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${collapsed ? 'justify-center' : ''
              } ${item.submenu.some(sub => location.pathname === sub.path)
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
              } group`}
          >
            <div className="flex items-center">
              <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
              {!collapsed && (
                <span className={`${isRTL ? 'mr-3' : 'ml-3'} font-medium`}>{item.label}</span>
              )}
            </div>
            {!collapsed && (
              <div className="flex-shrink-0">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            )}
          </button>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 group ${collapsed ? 'justify-center' : ''
              } ${isActive
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            {!collapsed && (
              <span className={`${isRTL ? 'mr-3' : 'ml-3'} font-medium`}>{item.label}</span>
            )}
          </NavLink>
        )}

        {hasSubmenu && isExpanded && !collapsed && (
          <div className={`${isRTL ? 'mr-8' : 'ml-8'} mt-2 space-y-1`}>
            {item.submenu.map((subItem) => {
              const SubIcon = subItem.icon;
              return (
                <NavLink
                  key={subItem.key}
                  to={subItem.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {SubIcon && <SubIcon className="w-4 h-4 mr-3" />}
                  {subItem.label}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white/80 backdrop-blur-xl shadow-xl border-r border-white/20 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'
      } flex flex-col`}>
      {/* Logo */}
      <div className={`p-6 border-b border-slate-100 ${collapsed ? 'px-4' : ''}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                3tech
              </h1>
              <p className="text-xs text-slate-500 font-medium">Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map(renderNavItem)}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Need Help?</h3>
            <p className="text-xs text-slate-600 mb-3">Check our documentation</p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium py-2 rounded-xl hover:shadow-lg transition-all duration-200">
              Get Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;