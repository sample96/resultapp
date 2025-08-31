import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Tv, BarChart3, User, Users, FolderOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAdminRoute, isUserRoute } = useAuth();

  const userNavigationItems = [
    { path: '/user', label: 'Results', icon: Trophy },
    { path: '/tv', label: 'TV Display', icon: Tv },
  ];

  const adminNavigationItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/individual-results', label: 'Individual Results', icon: User },
    { path: '/admin/group-results', label: 'Group Results', icon: Users },
    { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
  ];

  const navigationItems = isAdminRoute ? adminNavigationItems : userNavigationItems;

  return (
    <nav className="bg-white/95 border-b border-gray-100/50 shadow-sm sticky top-0 z-[9999] backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-18">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <Link 
            to={isAdminRoute ? '/admin' : '/user'} 
            className="flex items-center gap-3"
          >
            <img 
              src="/logo2.jpeg" 
              alt="Madrasa Logo" 
              className="w-8 h-8 rounded-lg shadow-sm bg-black p-1"
            />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              Madrasa Results
            </span>
          </Link>
          
          {/* Role Badges */}
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
        
        {/* Desktop Navigation */}
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
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;