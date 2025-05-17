
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ProductsSection from '@/components/products/ProductsSection';

const BoutiqueContent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Ensemble grenouillère et chaussettes pour bébé M&M'S®",
                "url": "https://babybaby.boutique/produits/ensemble-grenouillere-et-chaussettes"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Poussette légère pliable Summer Infant",
                "url": "https://babybaby.boutique/produits/poussette-legere-pliable"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Couffin 3 en 1 multifonction",
                "url": "https://babybaby.boutique/produits/couffin-3-en-1"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "Panier-cadeau pour garçon",
                "url": "https://babybaby.boutique/produits/panier-cadeau-garcon"
              }
            ]
          })}
        </script>
      </Helmet>

      <section className="py-20 px-4 bg-gradient-to-b from-white to-sky-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-babybaby-cosmic mb-6 font-comfortaa tracking-tight">
              Boutique BabyBaby
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Des produits soigneusement sélectionnés pour accompagner vos premiers moments avec bébé.
            </p>
          </motion.div>

          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-xl h-[60vh] md:h-[70vh]">
              <div className="absolute inset-0 bg-gradient-to-r from-babybaby-cosmic/80 to-transparent z-10"></div>
              <img 
                src="/lovable-uploads/c872500f-5877-4395-bb3c-089e296bf56b.png" 
                alt="Boutique BabyBaby" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-start z-20 p-8 md:p-16">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="max-w-lg"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Collection Premium
                  </h2>
                  <p className="text-white/90 text-lg mb-8">
                    Découvrez notre sélection exclusive de produits haut de gamme pour le confort et le bien-être de votre bébé.
                  </p>
                  <a 
                    href="https://babybaby.boutique" 
                    className="inline-flex items-center gap-2 bg-white text-babybaby-cosmic px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Explorer la boutique
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <ProductsSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-babybaby-cosmic">
              Trouvez l'inspiration
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Notre boutique en ligne propose une large gamme de produits soigneusement sélectionnés pour accompagner les premiers moments de votre enfant. De la naissance aux premiers pas, nous avons tout ce dont vous avez besoin.
            </p>
            <a 
              href="https://babybaby.boutique" 
              className="inline-flex items-center gap-2 bg-babybaby-cosmic text-white px-8 py-3 rounded-full font-medium hover:bg-babybaby-cosmic/90 transition-all duration-300"
              rel="noopener noreferrer"
              target="_blank"
            >
              Visiter la boutique complète
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BoutiqueContent;
