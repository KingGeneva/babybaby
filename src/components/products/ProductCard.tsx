
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import Lottie from 'lottie-react';

// Import des animations Lottie
import babyCribAnimation from '@/assets/lottie/baby_crib.json';
import babyBottleAnimation from '@/assets/lottie/baby_bottle.json';
import babyToyAnimation from '@/assets/lottie/baby_toy.json';
import babyMonitorAnimation from '@/assets/lottie/baby_monitor.json';

// Création d'une Map pour les animations, chargées plus efficacement
const animationMap = {
  'crib': babyCribAnimation,
  'bottle': babyBottleAnimation,
  'toy': babyToyAnimation,
  'monitor': babyMonitorAnimation
};

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  animationType: 'crib' | 'bottle' | 'toy' | 'monitor';
  link: string;
};

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Observer pour charger l'animation uniquement quand la carte est visible
  useEffect(() => {
    if (!cardRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    observer.observe(cardRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Chargement différé des animations uniquement quand la carte est visible
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      setIsAnimationLoaded(true);
    }, 100 * index);
    
    return () => clearTimeout(timer);
  }, [isVisible, index]);

  // Optimisation du rendu Lottie
  const renderLottieAnimation = () => {
    if (!isAnimationLoaded) {
      return <div className="w-24 h-24 animate-pulse bg-gray-100 rounded-full"></div>;
    }
    
    return (
      <Lottie 
        animationData={animationMap[product.animationType]} 
        loop={isHovered}
        autoplay={isVisible}
        className="w-24 h-24 object-contain"
        style={{ 
          filter: isHovered ? 'drop-shadow(0 0 8px rgba(14, 165, 233, 0.5))' : 'none',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
          progressiveLoad: true
        }}
      />
    );
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Format le prix avec séparateur de milliers et 2 décimales
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
      viewport={{ once: true, margin: '50px' }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      ref={cardRef}
    >
      <Card className="overflow-hidden h-full flex flex-col border border-gray-100 hover:border-babybaby-cosmic/40 transition-all duration-300 shadow-sm hover:shadow-lg">
        <div className="p-5 flex justify-center items-center bg-gradient-to-b from-sky-50 to-white relative h-56">
          {product.image && !imageError ? (
            <motion.div 
              className="h-full w-full flex items-center justify-center"
              initial={{ scale: 0.95 }}
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={product.image} 
                alt={product.title}
                className="h-full object-contain" 
                onError={handleImageError}
              />
            </motion.div>
          ) : (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="w-full h-full cursor-pointer flex items-center justify-center">
                  {renderLottieAnimation()}
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 p-4 shadow-lg border-babybaby-cosmic/10">
                <div>
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
          
          {isHovered && (
            <motion.div 
              className="absolute top-3 right-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                size="sm" 
                variant="outline"
                className="rounded-full w-9 h-9 p-0 bg-white/80 backdrop-blur-sm hover:bg-white border-babybaby-cosmic/20"
                onClick={() => window.open(product.link, '_blank')}
              >
                <ShoppingCart className="h-4 w-4 text-babybaby-cosmic" />
              </Button>
            </motion.div>
          )}
        </div>

        <CardContent className="pt-4 px-5 flex-grow">
          <h3 className="font-semibold text-lg mb-1.5 line-clamp-2 leading-tight">{product.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-0 pb-5 px-5">
          <div className="text-lg font-bold text-babybaby-cosmic">
            {product.id === 4 ? formatPrice(338.99) : formatPrice(product.price)}€
          </div>
          <Button 
            size="sm" 
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80 rounded-full"
            onClick={() => window.open(product.link, '_blank')}
          >
            Acheter
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
