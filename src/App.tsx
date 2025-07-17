import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ResultManager from './components/ResultManager';
import { Routes, Route } from 'react-router-dom';
import ResultForm from './components/ResultForm';
import IndividualResultList from './components/IndividualResultList';
import GroupResultList from './components/GroupResultList';
import CategoryManager from './components/CategoryManager';

const Categories = () => (
  <div className="bg-white rounded-md shadow p-6 text-center text-gray-700 font-medium">Categories page coming soon.</div>
);
// const Profile = () => (
//   <div className="bg-white rounded-md shadow p-6 text-center text-gray-700 font-medium">Profile page coming soon.</div>
// );

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col md:flex-row transition-all duration-300">
      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-100 shadow-lg min-h-screen animate-fade-in sticky top-0 z-40">
        <div className="p-6">
          <div className="text-2xl font-extrabold text-blue-600 mb-8 tracking-tight">ResultApp</div>
          <nav className="flex flex-col gap-4">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Results</a>
            <a href="/individual-results" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Individual Results</a>
            <a href="/group-results" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Group Results</a>
            <a href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Categories</a>
            <a href="/add-result" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Add Result</a>
          </nav>
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar for mobile */}
        <div className="md:hidden">
          <Navbar />
        </div>
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 animate-fade-in">Event Result Manager</h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto animate-fade-in">Manage and generate professional event results with individual and group categories</p>
          </div>
        </section>
        <main className="max-w-3xl px-4 py-6 sm:py-10 animate-fade-in">
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
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#2563eb', // blue-600
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