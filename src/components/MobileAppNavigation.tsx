import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MobileAppNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const { isAdminRoute, isUserRoute } = useAuth();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-app-menu')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const userNavigationItems = [
    { path: '/user', label: 'Results', icon: '🏆', color: 'blue', description: 'View your results' },
    { path: '/tv', label: 'TV Display', icon: '📺', color: 'purple', description: 'Live TV display' },
  ];

  const adminNavigationItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊', color: 'blue', description: 'Admin overview' },
    { path: '/admin/individual-results', label: 'Individual', icon: '👤', color: 'green', description: 'Individual results' },
    { path: '/admin/group-results', label: 'Group', icon: '👥', color: 'orange', description: 'Group results' },
    { path: '/admin/categories', label: 'Categories', icon: '📂', color: 'purple', description: 'Manage categories' },
  ];

  const navigationItems = isAdminRoute ? adminNavigationItems : userNavigationItems;

  // Find current active tab
  useEffect(() => {
    const currentIndex = navigationItems.findIndex(item => item.path === location.pathname);
    setActiveTab(currentIndex >= 0 ? currentIndex : 0);
  }, [location.pathname, navigationItems]);

  const toggleMenu = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsMenuOpen(!isMenuOpen);
    
    // Simulate haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleTabClick = (index: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveTab(index);
    
    // Simulate haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    
    setTimeout(() => setIsAnimating(false), 200);
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      orange: 'bg-orange-500 text-white',
      purple: 'bg-purple-500 text-white',
      red: 'bg-red-500 text-white',
    };
    return colorMap[color] || 'bg-gray-500 text-white';
  };

  const getGradientClasses = (color: string) => {
    const gradientMap: { [key: string]: string } = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      purple: 'from-purple-500 to-purple-600',
      red: 'from-red-500 to-red-600',
    };
    return gradientMap[color] || 'from-gray-500 to-gray-600';
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-tab transition-all duration-300 ${
                activeTab === index
                  ? 'bg-blue-50 text-blue-600 scale-110 shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
              onClick={() => handleTabClick(index)}
            >
              <span className="text-2xl mb-1 transition-transform duration-200">
                {item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
              {activeTab === index && (
                <div className="absolute -top-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              )}
            </Link>
          ))}
          
          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className={`mobile-nav-tab transition-all duration-300 ${
              isMenuOpen
                ? 'bg-purple-50 text-purple-600 scale-110 shadow-md'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'
            }`}
          >
            <span className="text-2xl mb-1 transition-transform duration-200">
              {isMenuOpen ? '✕' : '⚙️'}
            </span>
            <span className="text-xs font-medium">Menu</span>
            {isMenuOpen && (
              <div className="absolute -top-1 w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden">
        <button
          onClick={toggleMenu}
          className={`fab transition-all duration-300 ${
            isMenuOpen 
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white scale-110 shadow-xl' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg'
          }`}
        >
          <span className="text-xl transition-transform duration-200">
            {isMenuOpen ? '✕' : '➕'}
          </span>
        </button>
      </div>

      {/* Slide-up Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-up Menu */}
      <div
        className={`mobile-app-menu lg:hidden ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Menu Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Menu Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="/logo2.jpeg" 
                alt="Madrasa Logo" 
                className="w-10 h-10 rounded-xl shadow-sm bg-black p-1"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Madrasa Results</h3>
              <p className="text-sm text-gray-600">
                {isAdminRoute ? 'Admin Panel' : 'Student Portal'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {/* Quick Actions */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>⚡</span> Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all duration-200 hover:scale-105">
                <span className="text-2xl mb-2">🔍</span>
                <span className="text-sm font-medium text-blue-700">Search</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-all duration-200 hover:scale-105">
                <span className="text-2xl mb-2">📱</span>
                <span className="text-sm font-medium text-green-700">Share</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-all duration-200 hover:scale-105">
                <span className="text-2xl mb-2">⭐</span>
                <span className="text-sm font-medium text-purple-700">Favorites</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-all duration-200 hover:scale-105">
                <span className="text-2xl mb-2">📊</span>
                <span className="text-sm font-medium text-orange-700">Stats</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>🧭</span> Navigation
            </h4>
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:scale-105 ${
                    location.pathname === item.path
                      ? 'bg-blue-50 border border-blue-200 shadow-sm'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r ${getGradientClasses(item.color)} shadow-sm`}>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  {location.pathname === item.path && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Settings & Info */}
          <div className="space-y-2">
            <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 w-full">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center shadow-sm">
                <span className="text-lg">⚙️</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Settings</p>
                <p className="text-sm text-gray-500">App preferences</p>
              </div>
            </button>
            
            <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 w-full">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center shadow-sm">
                <span className="text-lg">ℹ️</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">About</p>
                <p className="text-sm text-gray-500">App information</p>
              </div>
            </button>
          </div>
        </div>

        {/* Menu Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">IRSHADUSSWIBIYAN MADRASA</p>
            <p className="text-xs text-gray-500">MALANKARAVAYAL</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safe Area Spacing for iOS */}
      <div className="h-20 lg:hidden" />
    </>
  );
};

export default MobileAppNavigation;
