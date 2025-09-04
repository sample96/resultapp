import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, ArrowRight, Monitor } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/logo.png" 
              alt="ResultApp Logo" 
              className="w-20 h-20 rounded-2xl shadow-lg bg-black p-3"
            />
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Mawlid Nabi Results
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            IRSHADUSSWIBIYAN MADRASA MALANKARAVAYAL
          </p>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mt-2">
            Muhammad Nabi Birthday Celebration Results Management System
          </p>
        </div>

        {/* Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* User Access */}
          <Link
            to="/user"
            className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-200">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">User Access</h2>
              <p className="text-gray-600 mb-6">
                View Mawlid celebration results, download certificates, and access your achievements
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                <span>Enter User Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </Link>

          {/* Admin Access */}
          <Link
            to="/admin"
            className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors duration-200">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h2>
              <p className="text-gray-600 mb-6">
                Manage Mawlid results, categories, and system administration
              </p>
              <div className="flex items-center justify-center gap-2 text-red-600 font-medium">
                <span>Enter Admin Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Choose your access level to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
