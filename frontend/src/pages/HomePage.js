import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Calendar, Instagram, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const fetchFeaturedServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const testimonials = [
    {
      name: 'Lerato M.',
      text: 'Absolutely stunning work! My nails looked perfect for my wedding day. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Thandi K.',
      text: 'Best lash extensions in town. Natural and long-lasting. Will be back!',
      rating: 5,
    },
    {
      name: 'Nomsa S.',
      text: 'The wig installation was flawless. Professional service from start to finish.',
      rating: 5,
    },
  ];

  return (
    <div data-testid="home-page" className="min-h-screen">
      <section className="relative min-h-screen flex items-center bg-[#FDFCF8] pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-[#E6D2C9]/30 rounded-full px-6 py-3">
                <Star size={16} className="text-[#E91E63] fill-[#E91E63]" />
                <span className="text-sm tracking-wide text-[#1C1917]">5.0 Rating • 15 Reviews</span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-[#1C1917]">
                Your Beauty,{' '}
                <span className="italic text-[#E91E63]">Our Passion</span>
              </h1>

              <p className="text-lg text-[#78716C] leading-relaxed max-w-xl">
                Professional beauty services for weddings, graduations, photoshoots, and all your special moments.
                Enhancing confidence, one service at a time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/booking')}
                  data-testid="hero-book-now-button"
                  className="bg-[#1C1917] text-[#FDFCF8] rounded-full px-8 py-6 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
                >
                  Book Now
                  <Calendar size={18} />
                </button>
                <button
                  onClick={() => navigate('/services')}
                  data-testid="hero-view-services-button"
                  className="border border-[#1C1917] text-[#1C1917] rounded-full px-8 py-6 text-sm font-medium tracking-widest uppercase transition-all hover:bg-[#E6D2C9]/20 inline-flex items-center justify-center gap-2"
                >
                  View Services
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <a
                  href="https://instagram.com/ithatengbyale"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="hero-instagram-link"
                  className="flex items-center gap-2 text-sm text-[#78716C] hover:text-[#E91E63] transition-colors"
                >
                  <Instagram size={20} />
                  <span className="tracking-wide">@ithatengbyale</span>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="lg:col-span-6"
            >
              <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-lg overflow-hidden">
                <img
                  src="https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/mmr1dd7a_head.jpeg"
                  alt="Ithateng By Ale - Beauty Services"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F2F0E9]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#1C1917] mb-4">
              Our Services
            </h2>
            <p className="text-[#78716C] max-w-2xl mx-auto">
              Professional beauty services tailored for your special occasions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Nails', icon: Sparkles, image: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/o0mz3m4e_nail_1.png' },
              { name: 'Lashes', icon: Sparkles, image: 'https://images.unsplash.com/photo-1645735123314-d11fcfdd0000?crop=entropy&cs=srgb&fm=jpg&q=85' },
              { name: 'Wigs', icon: Sparkles, image: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/9okehty4_wig.jpeg' },
              { name: 'Makeup', icon: Sparkles, image: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/b37bdic1_makeup.jpeg' },
            ].map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                data-testid={`service-category-${service.name.toLowerCase()}`}
                className="group cursor-pointer"
                onClick={() => navigate('/services')}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-serif text-2xl text-white tracking-tight">{service.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/services')}
              data-testid="view-all-services-button"
              className="bg-[#1C1917] text-[#FDFCF8] rounded-full px-8 py-6 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105 active:scale-95"
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FDFCF8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#1C1917] mb-4">
              Client Love
            </h2>
            <p className="text-[#78716C]">What our clients say about us</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                data-testid={`testimonial-${index}`}
                className="bg-white border border-[#E7E5E4]/40 p-8 rounded-xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-[#E91E63] fill-[#E91E63]" />
                  ))}
                </div>
                <p className="text-[#78716C] italic mb-4 font-serif leading-relaxed">
                  "{testimonial.text}"
                </p>
                <p className="text-[#1C1917] font-medium">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#1C1917] text-[#FDFCF8]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-6">
              Ready to Look Your Best?
            </h2>
            <p className="text-[#F2F0E9] mb-8 text-lg">
              Book your appointment today and experience professional beauty services
            </p>
            <button
              onClick={() => navigate('/booking')}
              data-testid="cta-book-now-button"
              className="bg-[#E91E63] text-white rounded-full px-8 py-6 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105 active:scale-95"
            >
              Book Your Appointment
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;