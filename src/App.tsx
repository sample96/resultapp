import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import MobileHeader from './components/MobileHeader';
import MobileAppNavigation from './components/MobileAppNavigation';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import IndividualResultList from './components/IndividualResultList';
import GroupResultList from './components/GroupResultList';
import CategoryManager from './components/CategoryManager';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import TVResultsDisplay from './components/TVResultsDisplay';
import RoleSwitcher from './components/RoleSwitcher';

import GroupPointsView from './components/GroupPointsView';
import GroupPointsSelector from './components/GroupPointsSelector';
import GroupManager from './components/GroupManager';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const location = useLocation();
  const { isAdminRoute, isUserRoute } = useAuth();

  // Don't show navbar and sidebar on landing page or TV display
  const isLandingPage = location.pathname === '/';
  const isTVDisplay = location.pathname === '/tv';

  if (isLandingPage) {
    return (
      <>
        <LandingPage />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#2d3748',
              color: '#fff',
              borderRadius: '1rem',
              padding: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </>
    );
  }

  if (isTVDisplay) {
    return <TVResultsDisplay />;
  }

  // Navigation items - centralized for consistency
  const userNavigationItems = [
    { path: '/user', label: 'Results', icon: '🏆' },
    { path: '/user/group-points', label: 'Group Points', icon: '🏅' },
  ];

  const adminNavigationItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/individual-results', label: 'Individual Results', icon: '👤' },
  { path: '/admin/group-results', label: 'Group Results', icon: '👥' },
  { path: '/admin/categories', label: 'Categories', icon: '📂' },
  { path: '/admin/groups', label: 'Groups', icon: '🏆' },
  { path: '/admin/group-points', label: 'Group Points', icon: '🏆' },
  { path: '/admin/group-points-selector', label: 'Add Points', icon: '➕' },
];

  const navigationItems = isAdminRoute ? adminNavigationItems : userNavigationItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex transition-all duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white/95 border-r border-gray-100/50 shadow-lg min-h-screen sticky top-0 z-40 backdrop-blur-sm">
        <div className="p-6">
          {/* Sidebar Header */}
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="/logo2.jpeg" 
              alt="Madrasa Logo" 
              className="w-12 h-12 rounded-lg shadow-sm bg-black p-1"
            />
            <div className="text-2xl font-extrabold">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Madrasa Results
              </span>
            </div>
          </div>

          {/* Role Badge */}
          <div className="mb-6">
            {isAdminRoute && (
              <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                Admin Mode
              </span>
            )}
            {isUserRoute && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                User Mode
              </span>
            )}
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex flex-col gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-blue-600 bg-blue-50/50 border border-blue-200/50 shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
                {location.pathname === item.path && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p className="font-medium">IRSHADUSSWIBIYAN MADRASA</p>
              <p className="mt-1">MALANKARAVAYAL</p>
            </div>
          </div>
        </div>
      </aside>
        
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-[9999]">
          <MobileHeader />
        </div>
        
        {/* Mobile App Navigation */}
        <MobileAppNavigation />
          
        {/* Header Section - Only for User Routes */}
        {isUserRoute && (
          <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <img 
                  src="/logo2.jpeg" 
                  alt="Madrasa Logo" 
                  className="w-16 h-16 rounded-xl shadow-md bg-black p-2"
                />
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    IRSHADUSSWIBIYAN MADRASA MALANKARAVAYAL
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                    View and download your competition results and certificates
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
          
        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full lg:pb-10 pb-20">
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<CategoryManager />} />
            <Route path="/admin/groups" element={<GroupManager />} />
            <Route path="/admin/individual-results" element={<IndividualResultList />} />
            <Route path="/admin/group-results" element={<GroupResultList />} />
            <Route path="/admin/group-points-selector" element={<GroupPointsSelector />} />
            
            {/* User Routes */}
            <Route path="/user" element={<HomePage />} />
            <Route path="/user/group-points" element={<GroupPointsView />} />
            <Route path="/tv" element={<TVResultsDisplay />} />
            
            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
          
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#2d3748',
              color: '#fff',
              borderRadius: '1rem',
              padding: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
          
        {/* Role Switcher for testing */}
        {/* <RoleSwitcher /> */}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;