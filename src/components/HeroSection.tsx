
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import P5Canvas from './P5Canvas';
import { Button } from '@/components/ui/button';
import { ChevronRight, BarChart, Settings2, Lightbulb, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'L\'application complète pour les parents modernes';
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();
  
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

  const handleCTAClick = () => {
    user ? navigate('/dashboard') : navigate('/auth');
  };

  const features = [
    {
      icon: <BarChart className="h-6 w-6 text-sky-500" />,
      title: "Suivi de Croissance",
      description: "Graphiques et analyses détaillés"
    },
    {
      icon: <Settings2 className="h-6 w-6 text-indigo-500" />,
      title: "Outils Pratiques",
      description: "Des solutions pour tous les défis du quotidien"
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
      title: "Conseils & Articles",
      description: "Des experts à votre service"
    },
    {
      icon: <Heart className="h-6 w-6 text-rose-500" />,
      title: "Suivi de Santé",
      description: "Vaccins, rendez-vous médicaux et bien plus"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <P5Canvas className={`w-full h-full ${isMobile ? 'opacity-20' : ''}`} />
      </div>
      
      <div className="container mx-auto px-4 z-10 pt-16 pb-24">
        <motion.div className="max-w-5xl mx-auto text-center mb-12">
          <motion.div variants={itemVariants}>
            <motion.h1 
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-babybaby-cosmic"
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
              className="text-lg md:text-2xl mb-8 text-gray-700 min-h-[2rem] font-nunito"
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

          {/* Description SEO optimisée */}
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 max-w-3xl mx-auto mb-10 text-base md:text-lg"
          >
            Découvrez comment suivre facilement le développement et la santé de votre bébé avec notre application intuitive. 
            Une solution complète pour les parents modernes avec des outils, des conseils et une communauté active.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <motion.div 
              className="inline-block"
              whileHover={{ scale: 1.03 }}
            >
              <Button 
                size={isMobile ? "default" : "lg"}
                className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 button-glow text-white font-bold px-6 py-3 sm:px-8 sm:py-5 text-base sm:text-lg rounded-full"
                onClick={handleCTAClick}
              >
                {user ? "Accéder à votre tableau de bord" : "Commencer maintenant"}
                <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
