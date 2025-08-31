import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './ui/Sidebar';
import Button from './ui/Button';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAdminRoute, isUserRoute } = useAuth();
  
  const handleNavClick = () => {
    setOpen(false);
  };

  const userNavigationItems = [
    { path: '/user', label: 'Results', icon: '🏆' },
    { path: '/tv', label: 'TV Display', icon: '📺' },
  ];

  const adminNavigationItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/individual-results', label: 'Individual Results', icon: '👤' },
    { path: '/admin/group-results', label: 'Group Results', icon: '👥' },
    { path: '/admin/categories', label: 'Categories', icon: '📂' },
  ];

  const navigationItems = isAdminRoute ? adminNavigationItems : userNavigationItems;

  return (
    <nav className="bg-white/95 border-b border-gray-100/50 shadow-sm sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-18">
        <div className="flex items-center gap-3">
          <Link 
            to={isAdminRoute ? '/admin' : '/user'} 
            className="flex items-center gap-3"
          >
            <img 
              src="/logo.png" 
              alt="Madrasa Logo" 
              className="w-8 h-8 rounded-lg shadow-sm bg-black p-1"
            />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight animate-fade-in-up">
              Madrasa Results
            </span>
          </Link>
          {isAdminRoute && (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              Admin
            </span>
          )}
          {isUserRoute && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              User
            </span>
          )}
        </div>
        
        <div className="hidden md:flex gap-6 items-center">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative group text-sm lg:text-base font-medium transition-all duration-200 flex items-center gap-2 ${
                location.pathname === item.path
                  ? 'text-blue-600 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-indigo-600 after:rounded-full after:scale-x-100'
                  : 'text-gray-700 hover:text-blue-600 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-indigo-600 after:rounded-full after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <Button
          className="md:hidden flex items-center p-2 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </Button>
      </div>
      
      <Sidebar open={open} onClose={() => setOpen(false)}>
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={`block py-3 px-4 text-base font-medium rounded-lg transition-all duration-200 flex items-center gap-3 ${
              location.pathname === item.path 
                ? 'text-blue-600 bg-blue-50/50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </Sidebar>
    </nav>
  );
};

export default Navbar;