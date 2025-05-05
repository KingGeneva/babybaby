
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Lottie from 'lottie-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Award } from 'lucide-react';

// Import des animations Lottie
import babyCribAnimation from '@/assets/lottie/baby_crib.json';
import babyToyAnimation from '@/assets/lottie/baby_toy.json';
import babyBottleAnimation from '@/assets/lottie/baby_bottle.json';

// Données des produits premium
const premiumProducts = [
  {
    id: 1,
    title: "Poussette légère pliable Summer Infant",
    description: "Poussette ultra-légère et compacte idéale pour les déplacements quotidiens, avec un pliage facile et rapide. Conception premium et finitions luxueuses.",
    price: 249.99,
    originalPrice: 329.99,
    image: "/lovable-uploads/d50b4331-6d8b-45e6-9e58-e8fc2d198a37.png",
    animation: babyCribAnimation,
    badge: "Exclusif",
    partner: "Summer Infant",
    link: "https://a.co/d/81ZhfsY"
  },
  {
    id: 2,
    title: "Ensemble grenouillère et chaussettes pour bébé M&M'S®",
    description: "Collection exclusive M&M'S® fabriquée avec du coton biologique de la plus haute qualité. Confort exceptionnel et design unique pour votre bébé.",
    price: 59.99,
    originalPrice: 79.99,
    image: "/lovable-uploads/af7cb1bb-a9c3-4487-9f11-9c050013463d.png",
    animation: babyToyAnimation,
    badge: "Édition limitée",
    partner: "M&M'S®",
    link: "https://www.tkqlhce.com/click-101432391-15872736?url=https%3A%2F%2Fwww.mms.com%2Fen-us%2Fmms-apparel%2Fheritage-mms-onesie%2Fct2291-p.html%3Fcolor%3Dyellow%26size%3D12MO&cjsku=3000881311002"
  },
  {
    id: 3,
    title: "Collection automne-hiver Deux par Deux",
    description: "Vêtements haut de gamme pour enfants de la nouvelle collection Deux par Deux. Matières nobles, coupes parfaites et designs exclusifs.",
    price: 149.99,
    originalPrice: 189.99,
    image: "/lovable-uploads/55b1f730-647d-463b-8db9-2e33309e02c1.png",
    animation: babyBottleAnimation,
    badge: "Nouvelle collection",
    partner: "Deux par Deux",
    link: "https://www.anrdoezrs.net/click-101432391-15735100"
  }
];

const PremiumProductsSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    // Nettoyage du timeout à la destruction du composant
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (id: number) => {
    setActiveProduct(id);
  };

  const handleMouseLeave = () => {
    // Petit délai avant de désactiver l'animation
    timeoutRef.current = setTimeout(() => {
      setActiveProduct(null);
    }, 300);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          animate={controls}
          initial="hidden"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                ease: "easeOut"
              }
            }
          }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-babybaby-cosmic/10 text-babybaby-cosmic mb-3">
            <Award className="mr-1 h-4 w-4" />
            Collection Premium
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-babybaby-cosmic">
            Produits Haut de Gamme
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection exclusive de produits premium pour bébé, choisis avec soin pour leur qualité exceptionnelle et leur design raffiné.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {premiumProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.1 * index,
                    duration: 0.5
                  }
                }
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="h-full"
              onMouseEnter={() => handleMouseEnter(product.id)}
              onMouseLeave={handleMouseLeave}
            >
              <Card className="overflow-hidden h-full flex flex-col border-2 border-gray-100 hover:border-babybaby-cosmic/30 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  {/* Badge premium */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-babybaby-cosmic text-white">
                      {product.badge}
                    </span>
                  </div>
                  
                  {/* Image ou animation */}
                  <div className="h-64 w-full relative overflow-hidden bg-gradient-to-b from-sky-50 to-white p-4">
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${activeProduct === product.id ? 'opacity-0' : 'opacity-100'}`}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full object-contain"
                      />
                    </div>
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${activeProduct === product.id ? 'opacity-100' : 'opacity-0'}`}>
                      <Lottie
                        animationData={product.animation}
                        loop={true}
                        className="w-48 h-48"
                      />
                    </div>
                  </div>
                </div>

                <CardContent className="pt-6 flex-grow">
                  <div className="text-sm font-medium text-babybaby-cosmic mb-2">
                    {product.partner}
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                </CardContent>

                <CardFooter className="flex flex-col items-start space-y-3 pt-0 pb-6 px-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-babybaby-cosmic">${product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 mt-4"
                    onClick={() => window.open(product.link, '_blank')}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Découvrir
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumProductsSection;
