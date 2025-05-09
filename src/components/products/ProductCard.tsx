
import React, { useState, useEffect, useRef, memo } from 'react';
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

// Utilisation de React.memo pour éviter les re-renders inutiles
const ProductCard = memo(({ product, index }: ProductCardProps) => {
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
          filter: isHovered ? 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.4))' : 'none',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.2s ease'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      viewport={{ once: true, margin: '50px' }}
      whileHover={{ y: -3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      ref={cardRef}
    >
      <Card className="overflow-hidden h-full flex flex-col border hover:border-babybaby-cosmic/50 transition-all duration-200">
        <div className="p-3 flex justify-center items-center bg-gradient-to-b from-sky-50 to-white">
          {product.image && !imageError ? (
            <div className="h-40 w-full flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.title}
                className="h-full object-contain" 
                onError={handleImageError}
              />
            </div>
          ) : (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="w-full h-40 cursor-pointer flex items-center justify-center">
                  {renderLottieAnimation()}
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <div>
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>

        <CardContent className="pt-2 flex-grow">
          <h3 className="font-bold text-lg mb-1">{product.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-0 pb-3 px-4">
          <div className="text-lg font-bold text-babybaby-cosmic">${product.id === 4 ? "338.99" : product.price.toFixed(2)}</div>
          <Button 
            size="sm" 
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80"
            onClick={() => window.open(product.link, '_blank')}
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            Voir
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
