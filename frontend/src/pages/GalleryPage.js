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

  const placeholderImages = [
    'https://images.unsplash.com/photo-1672815554809-37e355eddd24?crop=entropy&cs=srgb&fm=jpg&q=85',
    'https://images.unsplash.com/photo-1645735123314-d11fcfdd0000?crop=entropy&cs=srgb&fm=jpg&q=85',
    'https://images.unsplash.com/photo-1695556746240-55d9f92faf43?crop=entropy&cs=srgb&fm=jpg&q=85',
    'https://images.unsplash.com/photo-1747823490861-1fa6d0132fee?crop=entropy&cs=srgb&fm=jpg&q=85',
    'https://images.unsplash.com/photo-1560869683-f5d8bf564346?crop=entropy&cs=srgb&fm=jpg&q=85',
    'https://images.unsplash.com/photo-1765852549115-2ee9f55a1980?crop=entropy&cs=srgb&fm=jpg&q=85',
    'https://images.unsplash.com/photo-1601288717546-f26deef256d7?crop=entropy&cs=srgb&fm=jpg&q=85',
    'https://images.unsplash.com/photo-1627458805084-949391e56443?crop=entropy&cs=srgb&fm=jpg&q=85',
  ];

  const displayImages = instagramPosts.length > 0 ? instagramPosts : placeholderImages.map((url, i) => ({
    id: `placeholder-${i}`,
    media_url: url,
    caption: 'Beautiful work by Ithateng By Ale',
    permalink: 'https://instagram.com/ithatengbyale'
  }));

  return (
    <div data-testid="gallery-page" className="min-h-screen pt-20">
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
              <span className="italic text-[#D4AF37]">Gallery</span>
            </h1>
            <p className="text-lg text-[#78716C] max-w-2xl mx-auto mb-6">
              Explore our latest work and get inspired for your next look
            </p>
            <a
              href="https://instagram.com/ithatengbyale"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="gallery-instagram-link"
              className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#1C1917] transition-colors"
            >
              <Instagram size={20} />
              <span className="tracking-wide">Follow us on Instagram</span>
            </a>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
            </div>
          ) : (
            <>
              {source === 'none' && (
                <div className="bg-[#E6D2C9]/20 border border-[#D4AF37]/30 rounded-lg p-4 mb-8 text-center">
                  <p className="text-sm text-[#78716C]">
                    Showing placeholder gallery. Connect Instagram API for live feed.
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
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
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
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;