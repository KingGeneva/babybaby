import React from 'react';
import { motion } from 'framer-motion';

const KeyFeaturesSection: React.FC = () => {
  return (
    <section 
      className="py-16 bg-gradient-to-b from-white to-sky-50"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 
            id="features-heading" 
            className="text-3xl md:text-4xl font-bold mb-6 text-babybaby-cosmic"
          >
            Suivez l'évolution de votre bébé en toute simplicité
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            BabyBaby vous accompagne à chaque étape importante du <strong>développement</strong> de votre enfant 
            avec des outils complets, personnalisés et basés sur les recommandations des experts en pédiatrie.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12" role="list">
          <motion.article 
            className="bg-white p-6 rounded-xl shadow-md"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            role="listitem"
          >
            <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-babybaby-cosmic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Suivi de croissance OMS</h3>
            <p className="text-gray-600 text-center">
              Enregistrez et visualisez la <strong>croissance</strong> de votre enfant avec des courbes comparées aux normes <abbr title="Organisation Mondiale de la Santé">OMS</abbr>. 
              Poids, taille et périmètre crânien.
            </p>
          </motion.article>
          
          <motion.article 
            className="bg-white p-6 rounded-xl shadow-md"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            role="listitem"
          >
            <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-babybaby-cosmic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Calendrier vaccinal numérique</h3>
            <p className="text-gray-600 text-center">
              Gérez les rendez-vous médicaux et suivez le <strong>calendrier de vaccination</strong> avec des rappels automatiques 
              selon les recommandations officielles.
            </p>
          </motion.article>
          
          <motion.article 
            className="bg-white p-6 rounded-xl shadow-md"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            role="listitem"
          >
            <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-babybaby-cosmic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Jalons de développement</h3>
            <p className="text-gray-600 text-center">
              Découvrez et suivez les <strong>étapes clés du développement</strong> : motricité, langage, social. 
              De 0 à 36 mois avec conseils personnalisés.
            </p>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
