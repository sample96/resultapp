import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ResultManager from './components/ResultManager';
import { Routes, Route, Link } from 'react-router-dom';
import ResultForm from './components/ResultForm';
import IndividualResultList from './components/IndividualResultList';
import GroupResultList from './components/GroupResultList';
import CategoryManager from './components/CategoryManager';

const Categories = () => (
  <div className="bg-white/80 rounded-3xl shadow-sm border border-gray-100/50 p-6 sm:p-8 text-center text-gray-700 font-medium text-lg backdrop-blur-sm">
    Categories page coming soon.
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col transition-all duration-300">
      {/* Navbar for mobile only */}
      <div className="md:hidden sticky top-0 z-60 bg-white/95 border-b border-gray-100/50 shadow-sm backdrop-blur-sm">
        <Navbar />
      </div>
      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 bg-white/95 border-r border-gray-100/50 shadow-lg min-h-screen sticky top-0 z-40 backdrop-blur-sm">
        <div className="p-6">
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-8 tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ResultApp</span>
          </div>
          <nav className="flex flex-col gap-3">
            {[
              { path: '/', label: 'Results' },
              { path: '/individual-results', label: 'Individual Results' },
              { path: '/group-results', label: 'Group Results' },
              { path: '/categories', label: 'Categories' },
              { path: '/add-result', label: 'Add Result' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50/50 transition-all duration-200 text-sm sm:text-base"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
              Event Result Manager
            </h1>
            <p className="text-sm sm:text-lg text-gray-500 max-w-2xl mx-auto animate-fade-in">
              Manage and generate professional event results with individual and group categories
            </p>
          </div>
        </section>
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
          <Routes>
            <Route path="/" element={<ResultManager />} />
            <Route path="/categories" element={<CategoryManager />} />
            <Route path="/add-result" element={<ResultForm onSuccess={() => console.log('Form submitted successfully!')} />} />
            <Route path="/individual-results" element={<IndividualResultList />} />
            <Route path="/group-results" element={<GroupResultList />} />
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
      </div>
    </div>
  );
}

export default App;