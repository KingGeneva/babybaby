
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-5 md:px-8">
        <div className="max-w-4xl" data-reveal>
          <p className="section-kicker text-accent">Votre espace BabyBaby</p>
          <h2 className="font-display text-4xl md:text-7xl leading-[1.02] mb-6">
            Commencez à suivre le développement de votre bébé dès aujourd'hui
          </h2>
          <p className="text-lg text-primary-foreground/75 mb-8 max-w-2xl">
            Créez un compte gratuit pour suivre le développement de votre enfant et retrouver vos guides favoris.
          </p>
          <Link to="/auth">
            <Button 
              size={isMobile ? "default" : "lg"}
              variant="secondary"
              className="font-semibold px-8 py-5 text-lg rounded-full min-h-12"
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
