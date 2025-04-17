
import React, { useState, useEffect } from 'react';
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

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  animationType: 'crib' | 'bottle' | 'toy' | 'monitor';
};

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [lottieAnimData, setLottieAnimData] = useState<object | null>(null);

  // Chargement différé des animations Lottie
  useEffect(() => {
    let animData;
    switch (product.animationType) {
      case 'crib':
        animData = babyCribAnimation;
        break;
      case 'bottle':
        animData = babyBottleAnimation;
        break;
      case 'toy':
        animData = babyToyAnimation;
        break;
      case 'monitor':
        animData = babyMonitorAnimation;
        break;
      default:
        animData = babyToyAnimation;
    }
    setLottieAnimData(animData);
  }, [product.animationType]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full flex flex-col border-2 hover:border-babybaby-cosmic/50 transition-all duration-300">
        <div className="relative p-4 flex justify-center items-center h-48 bg-gradient-to-b from-sky-50 to-white">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="w-full h-full cursor-pointer flex items-center justify-center">
                {lottieAnimData && (
                  <Lottie 
                    animationData={lottieAnimData} 
                    loop={true}
                    className="w-32 h-32 object-contain"
                    style={{ 
                      filter: isHovered ? 'drop-shadow(0 0 8px rgba(14, 165, 233, 0.6))' : 'none',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s ease'
                    }}
                    rendererSettings={{
                      preserveAspectRatio: 'xMidYMid slice',
                      progressiveLoad: true
                    }}
                  />
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <CardContent className="pt-4 flex-grow">
          <h3 className="font-bold text-lg mb-2">{product.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-0 pb-4 px-6">
          <div className="text-lg font-bold text-babybaby-cosmic">{product.price.toFixed(2)} $</div>
          <Button 
            size="sm" 
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80"
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            Acheter
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
