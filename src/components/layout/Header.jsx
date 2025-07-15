import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import storeService from '../../services/storeService';
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  CreditCard,
  LogOut,
  Globe,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onToggleSidebar, isRTL }) => {
  const { t, i18n } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [storeInfo, setStoreInfo] = useState(null);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current && !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
      if (
        notificationsRef.current && !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load store info on component mount
  useEffect(() => {
    loadStoreInfo();
  }, []);

  const loadStoreInfo = async () => {
    try {
      const response = await storeService.getStoreInfo();
      if (response?.data) {
        setStoreInfo(response.data);
      }
    } catch (error) {
      console.error('Error loading store info:', error);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const { setStoreData, setUserData } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem('token');
    setStoreData(null);
    setUserData(null);
    navigate('/login');
  };

  const handleMyWebsite = () => {
    if (storeInfo) {
      storeService.openStoreWebsite(storeInfo);
    } else {
      // Fallback: try to get domain from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const fallbackDomain = `${userData.email?.split('@')[0] || 'store'}.lvh.me`;
      window.open(`http://${fallbackDomain}`, '_blank');
    }
  };

  const notifications = [
    { id: 1, message: 'New order received', time: '5 min ago', unread: true },
    { id: 2, message: 'Product stock low', time: '1 hour ago', unread: true },
    { id: 3, message: 'Customer review submitted', time: '2 hours ago', unread: false },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20 sticky top-0 z-40">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 ${isRTL ? 'right-4' : 'left-4'
              }`} />
            <input
              type="text"
              placeholder={t('header.search')}
              className={`w-80 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 ${isRTL ? 'text-right pr-12 pl-4' : 'text-left pl-12 pr-4'
                }`}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
              className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200"
              title="Switch Language"
            >
              <Globe className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200 relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => n.unread) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 z-50`}>
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900">{t('header.notifications')}</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className="text-sm text-slate-900 font-medium">{notification.message}</p>
                          <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all duration-200"
            >
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>

            {showUserMenu && (
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-3 w-56 bg-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 z-50`}>
                <div className="py-2">
                  <button className="flex items-center w-full px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-xl mx-2">
                    <Settings className="w-4 h-4 mr-3" />
                    {t('header.userMenu.profile')}
                  </button>
                  <button
                    onClick={handleMyWebsite}
                    className="flex items-center w-full px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-xl mx-2"
                  >
                    <ExternalLink className="w-4 h-4 mr-3" />
                    My Website
                  </button>
                  <button className="flex items-center w-full px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-xl mx-2">
                    <CreditCard className="w-4 h-4 mr-3" />
                    {t('header.userMenu.subscription')}
                  </button>
                  <button className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-xl mx-2" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-3" />
                    {t('header.userMenu.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;