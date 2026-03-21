import { motion } from 'framer-motion';
import { ShoppingBag, Package } from 'lucide-react';
import { toast } from 'sonner';

const ShopPage = () => {
  // Static products for the shop
  const shopProducts = [
    {
      id: 'prod-1',
      name: 'Melting Band',
      description: 'Professional quality melting band for flawless wig application',
      price: 30,
      image: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/4vk086ml_Melting%20Band.jpeg',
      category: 'Accessories'
    },
    {
      id: 'prod-2',
      name: 'Square Coaster',
      description: 'Beautiful branded square coaster - perfect gift',
      price: 50,
      image: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/tx2f9ml1_Square%20Coaster.jpeg',
      category: 'Home Decor'
    },
    {
      id: 'prod-3',
      name: 'Round Coaster',
      description: 'Elegant branded round coaster - perfect gift',
      price: 50,
      image: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/vztuefn4_Round%20Coaster.jpeg',
      category: 'Home Decor'
    },
    {
      id: 'prod-4',
      name: 'Lace Glue',
      description: 'Strong hold lace glue for secure wig application',
      price: 80,
      image: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/djda4b04_Lace%20Glue.jpeg',
      category: 'Wig Essentials'
    },
    {
      id: 'prod-5',
      name: 'Lace Glue Remover Spray',
      description: 'Gentle formula to safely remove lace glue',
      price: 90,
      image: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/m0ecxvc7_Lace%20Glue%20Remove%20Spray.jpeg',
      category: 'Wig Essentials'
    },
    {
      id: 'prod-6',
      name: 'Wax Stick',
      description: 'For the perfect crown look - tames flyaways',
      price: 60,
      image: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/l3597ve1_Wax%20Stick.jpeg',
      category: 'Hair Styling'
    },
    {
      id: 'prod-7',
      name: 'Lace Melting Spray',
      description: 'Professional melting spray for seamless lace application',
      price: 80,
      image: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/gi96h9mm_Lace%20Melting%20Spray.jpeg',
      category: 'Wig Essentials'
    },
    {
      id: 'prod-8',
      name: 'Lace Glue Spray',
      description: 'Ultimate extra hold spray for long-lasting wear',
      price: 130,
      image: 'https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/erf8ogka_Lace%20Glue%20Spray.jpeg',
      category: 'Wig Essentials'
    },
  ];

  const handleOrder = (product) => {
    // Open WhatsApp with pre-filled message
    const message = encodeURIComponent(`Hi! I'd like to order: ${product.name} (R${product.price})`);
    window.open(`https://wa.me/27659839403?text=${message}`, '_blank');
    toast.success('Redirecting to WhatsApp to complete your order');
  };

  return (
    <div data-testid="shop-page" className="min-h-screen pt-20">
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
              <span className="italic text-[#E91E63]">Shop</span>
            </h1>
            <p className="text-lg text-[#78716C] max-w-2xl mx-auto">
              Shop our curated selection of beauty accessories and wig essentials
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                data-testid={`product-card-${product.id}`}
                className="bg-white border border-[#E7E5E4]/40 rounded-xl overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs text-[#E91E63] font-medium tracking-wider uppercase">
                    {product.category}
                  </span>
                  <h3 className="font-serif text-lg mt-1 mb-1 tracking-tight text-[#1C1917]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#78716C] mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-medium text-[#E91E63]">
                      R{product.price}
                    </span>
                    <button
                      onClick={() => handleOrder(product)}
                      data-testid={`order-button-${product.id}`}
                      className="bg-[#1C1917] text-[#FDFCF8] rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <ShoppingBag size={14} />
                      Order
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-[#F2F0E9] p-8 md:p-12 rounded-xl text-center"
          >
            <Package size={48} className="text-[#E91E63] mx-auto mb-4" />
            <h3 className="font-serif text-2xl mb-4 tracking-tight text-[#1C1917]">
              How to Order
            </h3>
            <p className="text-[#78716C] max-w-2xl mx-auto">
              Click the "Order" button on any product to be redirected to WhatsApp where you can 
              complete your order directly with us. We'll confirm availability and arrange payment and delivery.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
