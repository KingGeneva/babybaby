
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import P5Canvas from './P5Canvas';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'L\'application complète pour les parents modernes';
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    let i = 0;
    const typingSpeed = isMobile ? 30 : 50; 
    
    const typingInterval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed); 
    
    return () => clearInterval(typingInterval);
  }, [isMobile]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 16
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <P5Canvas className={`w-full h-full ${isMobile ? 'opacity-20' : ''}`} />
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <motion.div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants}>
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-babybaby-cosmic"
              animate={{ 
                textShadow: [
                  "0 0 5px rgba(14, 165, 233, 0)",
                  "0 0 10px rgba(14, 165, 233, 0.4)",
                  "0 0 5px rgba(14, 165, 233, 0)"
                ] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut"
              }}
            >
              BabyBaby
            </motion.h1>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.h2 
              className="text-xl md:text-2xl lg:text-3xl mb-6 text-gray-700 min-h-[2rem] font-nunito"
            >
              {typedText}
              <motion.span 
                animate={{ opacity: [1, 0, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
              >
                |
              </motion.span>
            </motion.h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Suivez la croissance, le développement et la santé de votre bébé avec des outils innovants et des conseils d'experts.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div 
              className="inline-block"
              whileHover={{ scale: 1.03 }}
            >
              <Button 
                size={isMobile ? "default" : "lg"}
                className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 button-glow text-white font-bold px-6 py-3 sm:px-8 sm:py-5 text-base sm:text-lg rounded-full w-full sm:w-auto"
                onClick={() => navigate('/auth')}
              >
                Créer un compte gratuit
                <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
            
            <motion.div 
              className="inline-block"
              whileHover={{ scale: 1.03 }}
            >
              <Button 
                variant="outline"
                size={isMobile ? "default" : "lg"}
                className="border-babybaby-cosmic text-babybaby-cosmic hover:bg-babybaby-cosmic/10 font-bold px-6 py-3 sm:px-8 sm:py-5 text-base sm:text-lg rounded-full w-full sm:w-auto"
                onClick={() => navigate('/articles')}
              >
                Nos guides parentaux
                <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500">
              Plus de <span className="font-semibold">15,000</span> parents nous font déjà confiance
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
