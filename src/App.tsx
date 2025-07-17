import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ResultManager from './components/ResultManager';
import { Routes, Route } from 'react-router-dom';
import ResultForm from './components/ResultForm';

const Categories = () => (
  <div className="bg-white rounded-md shadow p-6 text-center text-gray-700 font-medium">Categories page coming soon.</div>
);
// const Profile = () => (
//   <div className="bg-white rounded-md shadow p-6 text-center text-gray-700 font-medium">Profile page coming soon.</div>
// );

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Event Result Manager</h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">Manage and generate professional event results with individual and group categories</p>
        </div>
      </section>
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        <Routes>
          <Route path="/" element={<ResultManager />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/add-result" element={<ResultForm onSuccess={() => console.log('Form submitted successfully!')} />} />
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
  );
}

export default App;