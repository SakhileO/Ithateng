import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Instagram } from 'lucide-react';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '27659839403'; // South Africa format

  return (
    <div className="fixed bottom-6 right-6 z-50" data-testid="chat-widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 w-72 bg-white rounded-2xl shadow-xl border border-[#E7E5E4] overflow-hidden"
          >
            <div className="bg-[#1C1917] p-4 text-white">
              <h3 className="font-serif text-lg">Chat with us</h3>
              <p className="text-sm text-[#F2F0E9] mt-1">We typically reply within minutes</p>
            </div>
            
            <div className="p-4 space-y-3">
              <a
                href={`https://wa.me/${phoneNumber}?text=Hi! I'd like to book an appointment at Ithateng By Ale.`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="whatsapp-chat-link"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors group"
              >
                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#1C1917] text-sm">WhatsApp</p>
                  <p className="text-xs text-[#78716C]">Chat now</p>
                </div>
              </a>

              <a
                href="https://instagram.com/ithatengbyale"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="instagram-chat-link"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#E6D2C9]/30 hover:bg-[#E6D2C9]/50 transition-colors group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] rounded-full flex items-center justify-center">
                  <Instagram size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#1C1917] text-sm">Instagram DM</p>
                  <p className="text-xs text-[#78716C]">@ithatengbyale</p>
                </div>
              </a>

              <a
                href="tel:0659839403"
                data-testid="phone-chat-link"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#E91E63]/10 hover:bg-[#E91E63]/20 transition-colors group"
              >
                <div className="w-10 h-10 bg-[#E91E63] rounded-full flex items-center justify-center">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#1C1917] text-sm">Call Us</p>
                  <p className="text-xs text-[#78716C]">065 983 9403</p>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-testid="chat-toggle-button"
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          isOpen ? 'bg-[#1C1917]' : 'bg-[#25D366]'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;
