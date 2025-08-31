import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, User } from 'lucide-react';

const RoleSwitcher: React.FC = () => {
  const { isAdminRoute } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isAdminRoute ? (
              <Shield className="w-4 h-4 text-red-500" />
            ) : (
              <User className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {isAdminRoute ? 'Admin Mode' : 'User Mode'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher;
