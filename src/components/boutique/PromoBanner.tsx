
import React from 'react';
import { motion } from 'framer-motion';

const PromoBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-babybaby-cosmic to-blue-400 text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 md:mb-0 text-center md:text-left"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Offre spéciale lancement</h3>
            <p className="text-white/90 text-lg">Profitez de -20% sur votre première commande</p>
            <div className="mt-4">
              <span className="bg-white px-4 py-2 rounded-md font-bold text-babybaby-cosmic">
                CODE: BABYBABY20
              </span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-babybaby-cosmic font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              J'en profite maintenant
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
