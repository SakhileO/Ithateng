import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/booking', label: 'Book Now' },
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

          <div className="hidden md:flex items-center gap-8">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;