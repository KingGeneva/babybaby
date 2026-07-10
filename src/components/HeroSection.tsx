import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-[88svh] flex items-center justify-center overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-[24rem] h-[24rem] rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-border bg-card shadow-sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Ressources indépendantes · Fait au Québec
            </span>
          </div>

          <h1
            id="hero-heading"
            className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[1.05] mb-6"
          >
            Le guide québécois <br className="hidden md:block" />
            des <em className="text-primary not-italic">1000 premiers jours</em>.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Comparatifs de produits testés, calculateurs pratiques et guides gratuits pour t'accompagner de la
            grossesse aux deux ans de bébé — sans jargon, sans commandites déguisées.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={() => navigate('/meilleurs-produits-bebe-2026')}
            >
              Voir les meilleurs produits 2026
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="rounded-full px-6 h-12 text-base text-foreground hover:bg-muted"
              onClick={() => navigate('/contests')}
            >
              <Gift className="mr-2 h-4 w-4" />
              Participe à notre concours
            </Button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground uppercase tracking-widest">
            Gratuit · Sans inscription · Contenu indépendant
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
