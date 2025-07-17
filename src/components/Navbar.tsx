import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './ui/Sidebar';
import Button from './ui/Button';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const handleNavClick = () => setOpen(false);
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600 tracking-tight">ResultApp</span>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className={`transition-colors font-medium ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Results</Link>
          <Link to="/individual-results" className={`transition-colors font-medium ${location.pathname === '/individual-results' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Individual Results</Link>
          <Link to="/group-results" className={`transition-colors font-medium ${location.pathname === '/group-results' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Group Results</Link>
          <Link to="/categories" className={`transition-colors font-medium ${location.pathname === '/categories' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Categories</Link>
          <Link to="/add-result" className={`transition-colors font-medium ${location.pathname === '/add-result' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Add Result</Link>
        </div>
        <Button className="md:hidden flex items-center" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>
      <Sidebar open={open} onClose={() => setOpen(false)}>
        <Link to="/" onClick={handleNavClick} className="transition-colors font-medium text-gray-700 hover:text-blue-600">Results</Link>
        <Link to="/individual-results" onClick={handleNavClick} className="transition-colors font-medium text-gray-700 hover:text-blue-600">Individual Results</Link>
        <Link to="/group-results" onClick={handleNavClick} className="transition-colors font-medium text-gray-700 hover:text-blue-600">Group Results</Link>
        <Link to="/categories" onClick={handleNavClick} className="transition-colors font-medium text-gray-700 hover:text-blue-600">Categories</Link>
        <Link to="/add-result" onClick={handleNavClick} className="transition-colors font-medium text-gray-700 hover:text-blue-600">Add Result</Link>
      </Sidebar>
    </nav>
  );
};

export default Navbar; 