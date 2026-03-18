import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Nails', 'Lashes', 'Wigs', 'Makeup', 'Photography'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const handleBookService = (service) => {
    navigate('/booking', { state: { selectedService: service } });
  };

  return (
    <div data-testid="services-page" className="min-h-screen pt-20">
      <section className="py-24 bg-[#FDFCF8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-[#1C1917] mb-4">
              Our{' '}
              <span className="italic text-[#E91E63]">Services</span>
            </h1>
            <p className="text-lg text-[#78716C] max-w-2xl mx-auto">
              Professional beauty services for all your special occasions
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                data-testid={`category-filter-${category.toLowerCase()}`}
                className={`px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all ${
                  selectedCategory === category
                    ? 'bg-[#1C1917] text-[#FDFCF8]'
                    : 'bg-white border border-[#E7E5E4] text-[#1C1917] hover:border-[#E91E63]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-[#78716C]">Loading services...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.service_id}
                  service={service}
                  onBook={handleBookService}
                />
              ))}
            </div>
          )}

          {!loading && filteredServices.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#78716C]">No services found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#F2F0E9]/30">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-[#E7E5E4]/40 p-8 md:p-12 rounded-xl"
          >
            <h3 className="font-serif text-2xl mb-6 tracking-tight text-[#1C1917]">
              Important Information
            </h3>
            <ul className="space-y-3 text-[#78716C] leading-relaxed">
              <li>• Prices may vary depending on design complexity</li>
              <li>• R100 deposit required to confirm booking</li>
              <li>• Late arrivals (15+ minutes) will result in cancellation</li>
              <li>• Rebooking allowed within 7 days</li>
              <li>• Cancellation/rescheduling fees: R50-R100</li>
              <li>• Full glam makeup requires cluster lashes</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;