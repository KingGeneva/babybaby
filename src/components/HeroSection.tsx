
import React, { useEffect, useState } from 'react';
import P5Canvas from './P5Canvas';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <P5Canvas className={`w-full h-full ${isMobile ? 'opacity-20' : ''}`} />
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} 
               style={{ transitionDelay: '100ms' }}>
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-babybaby-cosmic"
              style={{ 
                animation: 'textGlow 4s ease-in-out infinite'
              }}
            >
              BabyBaby
            </h1>
          </div>
          
          <div className={`transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
               style={{ transitionDelay: '300ms' }}>
            <h2 
              className="text-xl md:text-2xl lg:text-3xl mb-6 text-gray-700 min-h-[2rem] font-nunito"
            >
              {typedText}
              <span 
                className="animate-pulse-soft"
              >
                |
              </span>
            </h2>
          </div>

          <div className={`transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
               style={{ transitionDelay: '500ms' }}>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Suivez la croissance, le développement et la santé de votre bébé avec des outils innovants et des conseils d'experts.
            </p>
          </div>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
               style={{ transitionDelay: '700ms' }}>
            <div 
              className="inline-block transition-transform duration-200 hover:scale-103"
            >
              <Button 
                size={isMobile ? "default" : "lg"}
                className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 button-glow text-white font-bold px-6 py-3 sm:px-8 sm:py-5 text-base sm:text-lg rounded-full w-full sm:w-auto"
                onClick={() => navigate('/auth')}
              >
                Créer un compte gratuit
                <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            
            <div 
              className="inline-block transition-transform duration-200 hover:scale-103"
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
            </div>
          </div>
          
          <div 
            className={`mt-8 text-center transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '900ms' }}
          >
            <p className="text-sm text-gray-500">
              Plus de <span className="font-semibold">15,000</span> parents nous font déjà confiance
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(14, 165, 233, 0);
          }
          50% {
            text-shadow: 0 0 10px rgba(14, 165, 233, 0.4);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
