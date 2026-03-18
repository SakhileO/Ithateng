import { motion } from 'framer-motion';

const ServiceCard = ({ service, onBook }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      data-testid={`service-card-${service.service_id}`}
      className="bg-white border border-[#E7E5E4]/40 p-8 rounded-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group"
    >
      {service.image_url && (
        <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6">
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
        </div>
      )}
      <h3 className="font-serif text-xl mb-2 tracking-tight text-[#1C1917]">{service.name}</h3>
      <p className="text-sm text-[#78716C] mb-4 leading-relaxed">{service.description}</p>
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl font-medium text-[#E91E63]">R{service.price.toFixed(0)}</span>
        <span className="text-sm text-[#78716C]">{service.duration} min</span>
      </div>
      {onBook && (
        <button
          onClick={() => onBook(service)}
          data-testid={`book-service-${service.service_id}`}
          className="w-full bg-[#1C1917] text-[#FDFCF8] rounded-full px-8 py-4 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105 active:scale-95"
        >
          Book Now
        </button>
      )}
    </motion.div>
  );
};

export default ServiceCard;