
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import P5Canvas from './P5Canvas';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'L\'application complète pour les parents modernes';
  
  // Animation d'écriture
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, []);

  // Variantes d'animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Fond animé P5.js */}
      <div className="absolute inset-0 z-0">
        <P5Canvas className="w-full h-full" />
      </div>
      
      {/* Contenu du Hero */}
      <div className="container mx-auto px-4 z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Titre et sous-titre */}
          <motion.div variants={itemVariants}>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-babybaby-cosmic"
              animate={{ 
                textShadow: [
                  "0 0 5px rgba(14, 165, 233, 0)",
                  "0 0 15px rgba(14, 165, 233, 0.5)",
                  "0 0 5px rgba(14, 165, 233, 0)"
                ] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut"
              }}
            >
              BabyBaby
            </motion.h1>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.h2 
              className="text-xl md:text-2xl mb-8 text-gray-700 min-h-[3rem] font-nunito"
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
          
          {/* CTA */}
          <motion.div variants={itemVariants}>
            <motion.div 
              className="inline-block"
              whileHover={{ 
                scale: 1.05,
              }}
            >
              <Button 
                size="lg" 
                className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 button-glow text-white font-bold px-8 py-6 text-lg rounded-full"
              >
                Commencer maintenant
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
