import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer data-testid="footer" className="bg-[#1C1917] text-[#FDFCF8] pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="font-serif text-2xl mb-6 tracking-tight">Ithateng By Ale</h3>
            <p className="text-[#F2F0E9] text-sm leading-relaxed">
              Enhancing confidence and beauty for all your special occasions.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com/ithatengbyale"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-instagram-link"
                className="w-10 h-10 rounded-full bg-[#E91E63] flex items-center justify-center text-[#1C1917] hover:scale-110 transition-transform"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 tracking-tight">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/services" data-testid="footer-link-services" className="text-[#F2F0E9] hover:text-[#E91E63] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/booking" data-testid="footer-link-booking" className="text-[#F2F0E9] hover:text-[#E91E63] transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/gallery" data-testid="footer-link-gallery" className="text-[#F2F0E9] hover:text-[#E91E63] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" data-testid="footer-link-contact" className="text-[#F2F0E9] hover:text-[#E91E63] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 tracking-tight">Business Hours</h4>
            <div className="space-y-3 text-sm text-[#F2F0E9]">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#E91E63]" />
                <span>Mon - Fri: 9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#E91E63]" />
                <span>Saturday: 9:00 AM - 3:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#E91E63]" />
                <span>Sunday: Closed</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 tracking-tight">Contact</h4>
            <div className="space-y-3 text-sm text-[#F2F0E9]">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#E91E63]" />
                <a href="tel:0659839403" className="hover:text-[#E91E63] transition-colors">
                  065 983 9403
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#E91E63]" />
                <span>Instagram DM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#78716C]/30 pt-8 text-center text-sm text-[#F2F0E9]">
          <p>&copy; {new Date().getFullYear()} Ithateng By Ale. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;