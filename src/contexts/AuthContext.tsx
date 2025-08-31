import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type UserRole = 'user' | 'admin';

interface AuthContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
  isUser: boolean;
  isAdminRoute: boolean;
  isUserRoute: boolean;
  currentRoute: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const location = useLocation();

  // Load user role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole && (savedRole === 'user' || savedRole === 'admin')) {
      setUserRole(savedRole);
    }
  }, []);

  // Save user role to localStorage when it changes
  const handleSetUserRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  // Route-based authorization logic
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = location.pathname.startsWith('/user') || location.pathname === '/';
  const currentRoute = location.pathname;

  const value: AuthContextType = {
    userRole,
    setUserRole: handleSetUserRole,
    isAdmin: userRole === 'admin',
    isUser: userRole === 'user',
    isAdminRoute,
    isUserRoute,
    currentRoute,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
