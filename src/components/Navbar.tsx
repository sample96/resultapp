import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleNavClick = () => setOpen(false);
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">ResultApp</span>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Results</Link>
          <Link to="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Categories</Link>
          <Link to="/add-result" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Add Result</Link>
        </div>
        <button className="md:hidden flex items-center" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-3 pt-2 flex flex-col gap-2">
          <Link to="/" onClick={handleNavClick} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Results</Link>
          <Link to="/categories" onClick={handleNavClick} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Categories</Link>
          <Link to="/add-result" onClick={handleNavClick} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Add Result</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 