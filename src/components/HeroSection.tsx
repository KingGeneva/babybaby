import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-[88svh] flex items-center justify-center overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      {/* Decorative gradient blobs */}
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
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-border bg-card shadow-sm">
            <div className="flex -space-x-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              4.9 / 5 · plus de 15 000 parents
            </span>
          </div>

          <h1
            id="hero-heading"
            className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[1.05] mb-6"
          >
            Vos premiers <em className="text-primary not-italic">1000 jours</em>,
            <br className="hidden md:block" /> sereinement.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Suivez la croissance, le sommeil et le développement de votre bébé.
            Conseils d'experts, outils OMS, communauté bienveillante — gratuit.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={() => navigate('/auth')}
            >
              Commencer gratuitement
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="rounded-full px-6 h-12 text-base text-foreground hover:bg-muted"
              onClick={() => navigate('/articles')}
            >
              Lire nos guides
            </Button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground uppercase tracking-widest">
            Sans publicité · Sans carte bancaire · Données chiffrées
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
