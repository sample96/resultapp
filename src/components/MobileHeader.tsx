import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MobileHeader: React.FC = () => {
  const { isAdminRoute, isUserRoute } = useAuth();

  return (
    <div className="lg:hidden bg-white/95 border-b border-gray-100/50 shadow-sm backdrop-blur-sm px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <Link 
          to={isAdminRoute ? '/admin' : '/user'} 
          className="flex items-center gap-3"
        >
          <img 
            src="/logo2.jpeg" 
            alt="Madrasa Logo" 
            className="w-8 h-8 rounded-lg shadow-sm bg-black p-1"
          />
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            Madrasa Results
          </span>
        </Link>
        
        {/* Role Badge */}
        <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default MobileHeader;
