
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-16 bg-gradient-to-r from-babybaby-cosmic/10 to-babybaby-cosmic/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-babybaby-cosmic">
            Commencez à suivre le développement de votre bébé dès aujourd'hui
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Rejoignez des milliers de parents qui font confiance à BabyBaby pour suivre le développement de leur enfant.
          </p>
          <Link to="/auth">
            <Button 
              size={isMobile ? "default" : "lg"}
              className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 button-glow text-white font-bold px-8 py-5 text-lg rounded-full"
            >
              Créer un compte gratuit
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
