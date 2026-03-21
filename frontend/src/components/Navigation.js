import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    ...(isAuthenticated() && isAdmin() ? [{ path: '/admin', label: 'Dashboard' }] : []),
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/shop', label: 'Shop' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      data-testid="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#FDFCF8]/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" data-testid="logo-link" className="text-2xl font-serif font-semibold tracking-tight text-[#1C1917]">
            Ithateng By Ale
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
                className={`text-sm tracking-widest uppercase transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#E91E63] font-medium'
                    : 'text-[#1C1917] hover:text-[#E91E63]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated() ? (
              <>
                {!isAdmin() && (
                  <Link
                    to="/booking"
                    data-testid="nav-book-now-button"
                    className="bg-[#E91E63] text-white rounded-full px-5 py-2.5 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105 flex items-center gap-2"
                  >
                    <Calendar size={16} />
                    Book Now
                  </Link>
                )}
                <div className="relative group">
                  <button
                    data-testid="nav-profile-button"
                    className="flex items-center gap-2 text-[#1C1917] hover:text-[#E91E63] transition-colors"
                  >
                    <div className="w-9 h-9 bg-[#E91E63]/10 rounded-full flex items-center justify-center">
                      <User size={18} className="text-[#E91E63]" />
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E7E5E4] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b border-[#E7E5E4]">
                      <p className="text-sm font-medium text-[#1C1917]">{user?.name}</p>
                      <p className="text-xs text-[#78716C]">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-sm text-[#1C1917] hover:bg-[#F2F0E9]"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-[#78716C] hover:bg-[#F2F0E9] flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                data-testid="nav-login-button"
                className="bg-[#1C1917] text-white rounded-full px-6 py-2.5 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>

          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#1C1917]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            data-testid="mobile-menu"
            className="md:hidden bg-[#FDFCF8] border-t border-[#E7E5E4]"
          >
            <div className="px-6 py-8 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
                  className={`block text-lg tracking-wide ${
                    location.pathname === link.path
                      ? 'text-[#E91E63] font-medium'
                      : 'text-[#1C1917]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {isAuthenticated() ? (
                <>
                  {!isAdmin() && (
                    <Link
                      to="/booking"
                      onClick={() => setIsOpen(false)}
                      data-testid="mobile-nav-book-now"
                      className="block bg-[#E91E63] text-white rounded-full px-6 py-3 text-center text-sm font-medium tracking-widest uppercase mt-4"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Calendar size={16} />
                        Book Now
                      </span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block text-center text-[#1C1917] py-2"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="block w-full text-center text-[#78716C] py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block bg-[#1C1917] text-white rounded-full px-6 py-3 text-center text-sm font-medium tracking-widest uppercase mt-4"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
