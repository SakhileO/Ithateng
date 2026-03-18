import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, Instagram, MapPin, Send } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page" className="min-h-screen pt-20">
      <section className="py-24 bg-[#FDFCF8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-[#1C1917] mb-4">
              Get In{' '}
              <span className="italic text-[#D4AF37]">Touch</span>
            </h1>
            <p className="text-lg text-[#78716C] max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-serif text-3xl tracking-tight text-[#1C1917] mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E6D2C9]/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1C1917] mb-1">Phone</h3>
                    <a href="tel:0659839403" className="text-[#78716C] hover:text-[#D4AF37] transition-colors">
                      065 983 9403
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E6D2C9]/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Instagram size={20} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1C1917] mb-1">Instagram</h3>
                    <a
                      href="https://instagram.com/ithatengbyale"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#78716C] hover:text-[#D4AF37] transition-colors"
                    >
                      @ithatengbyale
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E6D2C9]/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1C1917] mb-1">Booking</h3>
                    <p className="text-[#78716C]">Instagram DM or Phone</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-[#F2F0E9] p-8 rounded-xl">
                <h3 className="font-serif text-2xl tracking-tight text-[#1C1917] mb-6">
                  Business Hours
                </h3>
                <div className="space-y-3 text-[#78716C]">
                  <div className="flex items-center justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium text-[#1C1917]">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-[#1C1917]">9:00 AM - 3:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-[#1C1917]">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E4]/40 p-8 md:p-12 rounded-xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-3">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    data-testid="contact-name-input"
                    className="w-full bg-transparent border-b border-[#E7E5E4] px-0 py-4 rounded-none focus:outline-none focus:border-[#1C1917] placeholder:text-[#78716C]/50 font-serif text-lg"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    data-testid="contact-email-input"
                    className="w-full bg-transparent border-b border-[#E7E5E4] px-0 py-4 rounded-none focus:outline-none focus:border-[#1C1917] placeholder:text-[#78716C]/50 font-serif text-lg"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-3">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    data-testid="contact-phone-input"
                    className="w-full bg-transparent border-b border-[#E7E5E4] px-0 py-4 rounded-none focus:outline-none focus:border-[#1C1917] placeholder:text-[#78716C]/50 font-serif text-lg"
                    placeholder="065 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-3">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    data-testid="contact-message-input"
                    className="w-full bg-transparent border border-[#E7E5E4] px-4 py-4 rounded-lg focus:outline-none focus:border-[#1C1917] placeholder:text-[#78716C]/50 font-serif text-lg resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  data-testid="contact-submit-button"
                  className="w-full bg-[#1C1917] text-[#FDFCF8] rounded-full px-8 py-6 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;