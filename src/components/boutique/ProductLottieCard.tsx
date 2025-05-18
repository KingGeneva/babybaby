
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import lottie animations
import babyCribAnimation from '@/assets/lottie/baby_crib.json';
import babyBottleAnimation from '@/assets/lottie/baby_bottle.json';
import babyToyAnimation from '@/assets/lottie/baby_toy.json';
import babyMonitorAnimation from '@/assets/lottie/baby_monitor.json';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  animation: 'crib' | 'bottle' | 'toy' | 'monitor';
  tags: string[];
}

interface ProductLottieCardProps {
  product: Product;
}

// Animation map for different product types
const animationMap = {
  'crib': babyCribAnimation,
  'bottle': babyBottleAnimation,
  'toy': babyToyAnimation,
  'monitor': babyMonitorAnimation
};

const ProductLottieCard: React.FC<ProductLottieCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
        <div className="pt-6 px-6 pb-2 flex justify-center items-center">
          <motion.div 
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            className="w-32 h-32"
          >
            <Lottie
              animationData={animationMap[product.animation]}
              loop={isHovered}
              autoplay={true}
              className="w-full h-full"
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice',
                progressiveLoad: true
              }}
            />
          </motion.div>
        </div>
        
        <CardContent className="pt-4">
          <h3 className="font-bold text-lg mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-babybaby-lightblue/20 hover:bg-babybaby-lightblue/30 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 px-6 flex justify-between items-center">
          <div className="text-lg font-bold text-babybaby-cosmic">{product.price.toFixed(2)} €</div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80 text-white px-3 py-1.5 rounded-full text-sm font-medium"
          >
            Voir plus
          </motion.button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductLottieCard;
