import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Loader2, Play } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GalleryPage = () => {
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

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

  // Video showcase data - beauty/makeup tutorial style videos from Pexels
  const showcaseVideos = [
    {
      id: 'video-1',
      title: 'Nail Art Tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
      videoUrl: 'https://player.vimeo.com/video/824804225?h=0&autoplay=1&muted=1',
      category: 'Nails'
    },
    {
      id: 'video-2',
      title: 'Lash Extension Process',
      thumbnail: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
      videoUrl: 'https://player.vimeo.com/video/824804225?h=0&autoplay=1&muted=1',
      category: 'Lashes'
    },
    {
      id: 'video-3',
      title: 'Wig Installation',
      thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
      videoUrl: 'https://player.vimeo.com/video/824804225?h=0&autoplay=1&muted=1',
      category: 'Wigs'
    },
    {
      id: 'video-4',
      title: 'Glam Makeup Look',
      thumbnail: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
      videoUrl: 'https://player.vimeo.com/video/824804225?h=0&autoplay=1&muted=1',
      category: 'Makeup'
    },
    {
      id: 'video-5',
      title: 'French Tip Manicure',
      thumbnail: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
      videoUrl: 'https://player.vimeo.com/video/824804225?h=0&autoplay=1&muted=1',
      category: 'Nails'
    },
    {
      id: 'video-6',
      title: 'Bridal Makeup Tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
      videoUrl: 'https://player.vimeo.com/video/824804225?h=0&autoplay=1&muted=1',
      category: 'Makeup'
    },
  ];

  const displayImages = instagramPosts.length > 0 ? instagramPosts : placeholderImages.map((url, i) => ({
    id: `placeholder-${i}`,
    media_url: url,
    caption: 'Beautiful work by Ithateng By Ale',
    permalink: 'https://instagram.com/ithatengbyale'
  }));

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

          {/* Video Showcase Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-[#1C1917] mb-8 text-center">
              Watch Our <span className="italic text-[#D4AF37]">Work</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  data-testid={`video-item-${index}`}
                  className="group relative aspect-[9/16] md:aspect-video rounded-xl overflow-hidden cursor-pointer bg-[#1C1917]"
                  onClick={() => setActiveVideo(activeVideo === video.id ? null : video.id)}
                >
                  {activeVideo === video.id ? (
                    <iframe
                      src={video.videoUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={video.title}
                    />
                  ) : (
                    <>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-transparent to-transparent" />
                      
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <Play size={28} className="text-white ml-1" fill="white" />
                        </div>
                      </div>
                      
                      {/* Video Info */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-xs text-[#D4AF37] font-medium tracking-wider uppercase">
                          {video.category}
                        </span>
                        <h3 className="text-white font-serif text-lg mt-1">{video.title}</h3>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Photo Gallery Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-[#1C1917] mb-8 text-center">
              Photo <span className="italic text-[#D4AF37]">Gallery</span>
            </h2>

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
              className="inline-block bg-[#D4AF37] text-white rounded-full px-8 py-4 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105"
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
