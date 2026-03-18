import { motion } from 'framer-motion';
import { Heart, Award, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div data-testid="about-page" className="min-h-screen pt-20">
      <section className="py-24 bg-[#FDFCF8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-[#1C1917] mb-8">
                About{' '}
                <span className="italic text-[#E91E63]">Ithateng By Ale</span>
              </h1>
              <p className="text-lg text-[#78716C] leading-relaxed mb-6">
                Ithateng By Ale is more than just a beauty service provider—it's a celebration of confidence, 
                elegance, and professionalism. We specialize in creating stunning looks for life's most 
                memorable moments.
              </p>
              <p className="text-lg text-[#78716C] leading-relaxed mb-6">
                Whether you're preparing for a wedding, graduation, matric dance, photoshoot, or any special 
                occasion, our mission is to enhance your natural beauty and help you feel your absolute best.
              </p>
              <p className="text-lg text-[#78716C] leading-relaxed">
                With a 5.0 rating and a growing community of satisfied clients, we take pride in delivering 
                exceptional service that goes beyond expectations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-lg overflow-hidden">
                <img
                  src="https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/bmvzkc1l_about.jpeg"
                  alt="About Ithateng By Ale"
                  className="w-full h-full object-cover"
                />
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
              Our Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Passion',
                description: 'We love what we do and it shows in every service we provide. Your beauty is our passion.',
              },
              {
                icon: Award,
                title: 'Excellence',
                description: 'We maintain the highest standards of quality and professionalism in all our services.',
              },
              {
                icon: Users,
                title: 'Client-Focused',
                description: 'Your satisfaction and confidence are our top priorities. We listen and deliver.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                data-testid={`value-${value.title.toLowerCase()}`}
                className="bg-white border border-[#E7E5E4]/40 p-8 rounded-xl text-center"
              >
                <div className="w-16 h-16 bg-[#E6D2C9]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon size={28} className="text-[#E91E63]" />
                </div>
                <h3 className="font-serif text-2xl mb-4 tracking-tight text-[#1C1917]">
                  {value.title}
                </h3>
                <p className="text-[#78716C] leading-relaxed">{value.description}</p>
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
              Our Mission
            </h2>
            <p className="text-[#F2F0E9] text-lg leading-relaxed">
              To empower every client through exceptional beauty services, creating confidence and 
              unforgettable experiences for all of life's special moments. We believe that everyone 
              deserves to look and feel their absolute best.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;