
import React from 'react';
import { motion } from 'framer-motion';

const BenefitsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-babybaby-cosmic">
            Suivez l'évolution de votre bébé en toute simplicité
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            BabyBaby vous accompagne à chaque étape importante du développement de votre enfant avec des outils complets et personnalisés.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-babybaby-cosmic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Suivi de croissance</h3>
            <p className="text-gray-600 text-center">
              Enregistrez et visualisez la croissance de votre enfant avec des graphiques intuitifs et personnalisés.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-babybaby-cosmic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Carnet médical</h3>
            <p className="text-gray-600 text-center">
              Gérez les rendez-vous médicaux et suivez le calendrier de vaccination de votre enfant.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-babybaby-cosmic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Jalons de développement</h3>
            <p className="text-gray-600 text-center">
              Découvrez et suivez les étapes clés du développement de votre enfant mois par mois.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
