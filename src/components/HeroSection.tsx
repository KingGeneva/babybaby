
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Lazy load P5Canvas to improve Speed Index
const P5Canvas = lazy(() => import('./P5Canvas'));

const HeroSection: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const fullText = 'L\'application complète pour les parents modernes';
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    let i = 0;
    const typingSpeed = isMobile ? 30 : 50; 
    
    setIsVisible(true);
    
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

  // Defer P5Canvas loading to improve initial paint
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCanvas(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
      role="banner"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background to-muted">
        {showCanvas && (
          <Suspense fallback={null}>
            <P5Canvas className={`w-full h-full ${isMobile ? 'opacity-20' : ''}`} />
          </Suspense>
        )}
      </div>
      <div className="container mx-auto px-4 z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <h1 
              id="hero-heading"
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-babybaby-cosmic to-blue-500 bg-clip-text text-transparent"
            >
              BabyBaby
            </h1>
          </motion.div>
          
          <motion.div variants={item}>
            <h2 className="text-xl md:text-2xl lg:text-3xl mb-6 text-gray-700 dark:text-gray-300 min-h-[2rem] md:min-h-[2.5rem] lg:min-h-[3rem] font-nunito">
              <span className="inline">{typedText}</span>
              <span className="animate-pulse-soft inline-block w-[6px]" aria-hidden="true">|</span>
            </h2>
          </motion.div>

          <motion.div variants={item}>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Suivez la <strong>croissance</strong>, le <strong>développement</strong> et la <strong>santé</strong> de votre bébé 
              avec des outils innovants, des courbes de croissance OMS et des conseils d'experts en parentalité.
            </p>
          </motion.div>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size={isMobile ? "default" : "lg"}
              className="cosmic-button px-6 py-3 sm:px-8 sm:py-5 text-base sm:text-lg hover-lift"
              onClick={() => navigate('/auth')}
              aria-label="Créer un compte gratuit sur BabyBaby"
            >
              Créer un compte gratuit
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </Button>
            
            <Button 
              variant="outline"
              size={isMobile ? "default" : "lg"}
              className="border-2 border-babybaby-cosmic text-babybaby-cosmic hover:bg-babybaby-cosmic/10 font-bold px-6 py-3 sm:px-8 sm:py-5 text-base sm:text-lg rounded-full w-full sm:w-auto hover-lift"
              onClick={() => navigate('/articles')}
              aria-label="Découvrir nos guides et articles parentaux"
            >
              Nos guides parentaux
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </Button>
          </motion.div>
          
          <motion.div 
            variants={item} 
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Plus de <strong className="font-semibold">15,000</strong> parents nous font déjà confiance
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
