import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Loader2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GalleryPage = () => {
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');

  useEffect(() => {
    fetchInstagramFeed();
  }, []);

  const fetchInstagramFeed = async () => {
    try {
      const response = await axios.get(`${API}/instagram/feed?limit=12`);
      setInstagramPosts(response.data.data || []);
      setSource(response.data.source);
    } catch (error) {
      console.error('Error fetching Instagram feed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Your actual photography images
  const photographyImages = [
    {
      id: 'photo-1',
      media_url: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/6t7u3fh1_g10.jpeg',
      caption: 'Polaroid Photography by Ithateng By Ale',
      permalink: 'https://instagram.com/ithatengbyale'
    },
    {
      id: 'photo-2',
      media_url: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/fxkdtbet_g8.jpeg',
      caption: 'Professional Photoshoot',
      permalink: 'https://instagram.com/ithatengbyale'
    },
    {
      id: 'photo-3',
      media_url: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/t2yqylnx_g7.jpeg',
      caption: 'Polaroid Memories',
      permalink: 'https://instagram.com/ithatengbyale'
    },
    {
      id: 'photo-4',
      media_url: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/wlbvz1nd_g3.jpeg',
      caption: 'Creative Photography',
      permalink: 'https://instagram.com/ithatengbyale'
    },
    {
      id: 'photo-5',
      media_url: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/s3bw4ozs_g1.jpeg',
      caption: 'Instant Photos',
      permalink: 'https://instagram.com/ithatengbyale'
    },
  ];

  // Nail images for gallery
  const nailImages = [
    {
      id: 'nail-1',
      media_url: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/o0mz3m4e_nail_1.png',
      caption: 'Nail Art',
      permalink: 'https://instagram.com/ithatengbyale'
    },
    {
      id: 'nail-2',
      media_url: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/b09vt5oo_nail_2.png',
      caption: 'French Tips',
      permalink: 'https://instagram.com/ithatengbyale'
    },
    {
      id: 'nail-3',
      media_url: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/rabcff4u_nail_3.png',
      caption: 'Nail Design',
      permalink: 'https://instagram.com/ithatengbyale'
    },
    {
      id: 'nail-4',
      media_url: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/txlezt8p_nail_4.png',
      caption: 'Gel Nails',
      permalink: 'https://instagram.com/ithatengbyale'
    },
    {
      id: 'nail-5',
      media_url: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/cxrcq4tb_nail_5.png',
      caption: 'Acrylic Nails',
      permalink: 'https://instagram.com/ithatengbyale'
    },
  ];

  // Combine all gallery images
  const allGalleryImages = [...photographyImages, ...nailImages];

  const displayImages = instagramPosts.length > 0 ? instagramPosts : allGalleryImages;

  return (
    <div data-testid="gallery-page" className="min-h-screen pt-20">
      {/* Hero Section */}
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
              <span className="italic text-[#E91E63]">Gallery</span>
            </h1>
            <p className="text-lg text-[#78716C] max-w-2xl mx-auto mb-6">
              Explore our latest work and get inspired for your next look
            </p>
            <a
              href="https://instagram.com/ithatengbyale"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="gallery-instagram-link"
              className="inline-flex items-center gap-2 text-[#E91E63] hover:text-[#1C1917] transition-colors"
            >
              <Instagram size={20} />
              <span className="tracking-wide">Follow us on Instagram</span>
            </a>
          </motion.div>

          {/* Photo Gallery Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[#E91E63]" size={32} />
              </div>
            ) : (
              <>
                {source === 'none' && (
                  <div className="bg-[#E6D2C9]/20 border border-[#E91E63]/30 rounded-lg p-4 mb-8 text-center">
                    <p className="text-sm text-[#78716C]">
                      Showing our work gallery. Connect Instagram API for live feed.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {displayImages.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      data-testid={`gallery-item-${index}`}
                      className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    >
                      <img
                        src={post.media_url}
                        alt={post.caption || 'Gallery image'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {post.permalink && (
                        <a
                          href={post.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Instagram className="text-white" size={24} />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1C1917] text-[#FDFCF8]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
              Want to Look This Good?
            </h2>
            <p className="text-[#F2F0E9] mb-8">
              Book your appointment today and let us transform your look
            </p>
            <a
              href="/booking"
              data-testid="gallery-cta-button"
              className="inline-block bg-[#E91E63] text-white rounded-full px-8 py-4 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105"
            >
              Book Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
