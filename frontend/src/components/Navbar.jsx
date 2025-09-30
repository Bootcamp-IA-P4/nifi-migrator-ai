// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import nifimigratorlogo from "../assets/nifimigratorlogo-bg.png";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Hide/show navbar on scroll
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Upload XML', path: '/upload' },
    { name: 'Reports', path: '/reports' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 font-sans ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
    >
      {/* Navbar container */}
      <div className="bg-slate-50/80 backdrop-blur-md w-full relative overflow-hidden shadow-sm border-b border-slate-200/50">
        <div className="flex items-center justify-between h-20 px-4 max-w-7xl mx-auto relative z-10">
          
          {/* Brand logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={nifimigratorlogo} 
                alt="NiFi Migrator AI" 
                className="h-20 object-contain"
              />
            </Link>
          </div>

          {/* Navigation links - Desktop */}
          <div className="hidden md:flex items-center h-full ml-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`h-full flex items-center justify-center px-4 text-lg font-semibold transition-all duration-300 rounded-lg ${
                  location.pathname === item.path 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-slate-600 hover:text-indigo-500 hover:bg-indigo-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* CTA Desktop */}
            <div className="h-full flex items-center px-4">
              <Link 
                to="/upload" 
                className="border-2 border-indigo-500 text-indigo-600 px-6 py-2 rounded-full font-semibold text-lg bg-indigo-50 hover:bg-indigo-100 transition-all duration-200"
              >
                Start Migration
              </Link>
            </div>
          </div>

          {/* Mobile navigation controls */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg focus:outline-none transition-colors duration-200"
            >
              <div className="relative flex items-center justify-center w-6 h-6">
                <span 
                  className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                  }`}
                ></span>
                <span 
                  className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span 
                  className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-slate-50/90 backdrop-blur-md flex flex-col border-t border-slate-200/50">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMenu}
                className={`flex items-center justify-center h-16 text-lg font-semibold transition-all duration-200 mx-4 my-1 rounded-lg ${
                  location.pathname === item.path 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* CTA Mobile */}
            <div className="flex items-center justify-center h-20 px-4">
              <Link 
                to="/upload" 
                onClick={closeMenu}
                className="border-2 w-full border-indigo-500 text-indigo-600 px-6 py-3 rounded-full font-semibold text-lg bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 text-center"
              >
                Start Migration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
