import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, LogIn, UserPlus, BarChart3, Info, FileText, Phone } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navigation = [
    { 
      name: 'Fonctionnalités', 
      href: '/features',
      icon: <BarChart3 className="w-5 h-5 mr-2" />
    },
    { 
      name: 'Documentation', 
      href: '/documentation',
      icon: <FileText className="w-5 h-5 mr-2" />
    },
    { 
      name: 'À propos', 
      href: '/about',
      icon: <Info className="w-5 h-5 mr-2" />
    },
    { 
      name: 'Contact', 
      href: '/contact',
      icon: <Phone className="w-5 h-5 mr-2" />
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const closeAll = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled || isMenuOpen 
          ? 'bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg' 
          : 'bg-gradient-to-r from-blue-600/95 to-blue-800/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={closeAll}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <GraduationCap className="relative w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-extrabold text-white">
              Academia Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.href
                      ? 'text-white bg-blue-500/20 backdrop-blur-sm'
                      : 'text-blue-100 hover:text-white hover:bg-blue-500/20'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 text-sm font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Accéder à l'application
            </Link>
            <Link
              to="/login"
              className="flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Connexion
            </Link>
            <Link
              to="/register"
              className="flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <UserPlus className="w-4 h-4 mr-2 text-white" />
              S'inscrire
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-blue-500/20"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-20 bg-gradient-to-b from-blue-600 to-blue-800 shadow-xl border-t border-blue-500/30 animate-fade-in">
            <div className="px-2 py-2 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      location.pathname === item.href
                        ? 'bg-blue-500/20 text-white'
                        : 'text-blue-100 hover:bg-blue-500/20 hover:text-white'
                    }`}
                    onClick={closeAll}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-blue-500/30 space-y-2">
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full px-4 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={closeAll}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center w-full px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={closeAll}
                >
                  <UserPlus className="w-5 h-5 mr-2 text-white" />
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;