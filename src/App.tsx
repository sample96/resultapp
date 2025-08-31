import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import IndividualResultList from './components/IndividualResultList';
import GroupResultList from './components/GroupResultList';
import CategoryManager from './components/CategoryManager';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import TVResultsDisplay from './components/TVResultsDisplay';
import RoleSwitcher from './components/RoleSwitcher';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex transition-all duration-300">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:block w-64 bg-white/95 border-r border-gray-100/50 shadow-lg min-h-screen sticky top-0 z-40 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="/logo.png" 
              alt="Madrasa Logo" 
              className="w-12 h-12 rounded-lg shadow-sm bg-black p-1"
            />
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Madrasa Results</span>
            </div>
          </div>
          <nav className="flex flex-col gap-3">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium px-3 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base flex items-center gap-3 ${
                  location.pathname === item.path
                    ? 'text-blue-600 bg-blue-50/50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
         
            </nav>
          </div>
        </aside>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Navbar for mobile and tablet */}
          <div className="lg:hidden sticky top-0 z-60 bg-white/95 border-b border-gray-100/50 shadow-sm backdrop-blur-sm">
            <Navbar />
          </div>
          
          {/* Header section - only show for users */}
          {isUserRoute && (
            <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100/50">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <img 
                    src="/logo.png" 
                    alt="Madrasa Logo" 
                    className="w-16 h-16 rounded-xl shadow-md bg-black p-2"
                  />
                   <p className="text-sm sm:text-lg text-gray-500 max-w-2xl mx-auto animate-fade-in">
                  IRSHADUSSWIBIYAN MADRASA MALANKARAVAYAL - View and download your competition results and certificates
                </p>
                </div>
               
              </div>
            </section>
          )}
          
          {/* Main content */}
          <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* User Routes */}
              <Route path="/user" element={<HomePage />} />
              <Route path="/tv" element={<TVResultsDisplay />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<CategoryManager />} />
              <Route path="/admin/individual-results" element={<IndividualResultList />} />
              <Route path="/admin/group-results" element={<GroupResultList />} />
              
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
          <RoleSwitcher />
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