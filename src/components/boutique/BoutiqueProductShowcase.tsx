
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AutoScroll } from '@/components/boutique/AutoScroll';
import ProductLottieCard from '@/components/boutique/ProductLottieCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  animation: 'crib' | 'bottle' | 'toy' | 'monitor';
  tags: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: "Berceau intelligent",
    description: "Berceau avec système de balancement automatique et moniteur de sommeil intégré",
    price: 499.99,
    animation: 'crib',
    tags: ['Sommeil', 'Technologie', 'Sécurité']
  },
  {
    id: 2,
    name: "Biberon auto-chauffant",
    description: "Maintient le lait à la température idéale pendant toute la tétée",
    price: 59.99,
    animation: 'bottle',
    tags: ['Alimentation', 'Innovation', 'Pratique']
  },
  {
    id: 3,
    name: "Jouet d'éveil multisensoriel",
    description: "Stimule tous les sens de bébé avec des lumières, sons et textures",
    price: 39.99,
    animation: 'toy',
    tags: ['Éveil', 'Développement', 'Jeu']
  },
  {
    id: 4,
    name: "Moniteur de respiration",
    description: "Suit les mouvements respiratoires de bébé pendant son sommeil",
    price: 149.99,
    animation: 'monitor',
    tags: ['Sécurité', 'Sommeil', 'Technologie']
  },
  {
    id: 5,
    name: "Veilleuse intelligente",
    description: "S'adapte au cycle de sommeil de bébé avec des couleurs et intensités variables",
    price: 79.99,
    animation: 'crib',
    tags: ['Sommeil', 'Luminaire', 'Design']
  },
  {
    id: 6,
    name: "Mobile musical connecté",
    description: "Personnalisez les mélodies et suivez les habitudes de sommeil",
    price: 89.99,
    animation: 'toy',
    tags: ['Sommeil', 'Musique', 'Technologie']
  },
];

const BoutiqueProductShowcase: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full py-10 overflow-hidden bg-gradient-to-b from-babybaby-lightblue/30 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-babybaby-cosmic">Nos produits vedettes</h2>
          <p className="text-gray-600 mt-2">Une sélection de produits innovants pour accompagner votre parentalité</p>
        </motion.div>
      </div>
      
      {isVisible && (
        <AutoScroll speed={0.5} direction="left" className="py-6">
          <div className="flex">
            {products.map((product) => (
              <div key={product.id} className="w-[280px] flex-shrink-0 px-3">
                <ProductLottieCard product={product} />
              </div>
            ))}
          </div>
        </AutoScroll>
      )}
    </div>
  );
};

export default BoutiqueProductShowcase;
