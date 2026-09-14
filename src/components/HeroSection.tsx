import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSceneFallback from '@/components/home/HeroSceneFallback';
import HeroSceneErrorBoundary from '@/components/home/HeroSceneErrorBoundary';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const HeroScene3D = lazy(() => import('@/components/home/HeroScene3D'));

const supportsWebGL2 = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [webglReady, setWebglReady] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [quality, setQuality] = useState<'low' | 'high'>('low');

  useEffect(() => {
    setWebglReady(supportsWebGL2());
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    setQuality(window.innerWidth >= 768 && memory >= 4 ? 'high' : 'low');
  }, []);

  useEffect(() => {
    const element = sceneRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setSceneVisible(entry.isIntersecting), { rootMargin: '120px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return (
    <section
      className="home-hero relative overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      <div className="hero-rule" aria-hidden />
      <div className="container mx-auto px-5 md:px-8 py-12 md:py-16 lg:py-20">
        <div className="hero-layout">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="hero-copy relative z-10"
        >
          <h1
            id="hero-heading"
            className="font-display text-[clamp(3rem,7vw,6.8rem)] text-foreground leading-[0.94] mb-7"
          >
            La ressource pour les 1000 premiers jours de <em className="text-primary not-italic">bébé</em>.
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-xl mb-9 leading-relaxed">
            Comparatifs de produits documentés, calculateurs pratiques et guides gratuits pour t'accompagner de la
            grossesse aux deux ans de bébé — sans jargon, sans commandites déguisées.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <Button
              size="lg"
              className="rounded-full px-7 min-h-12 text-base shadow-premium transition-transform hover:-translate-y-0.5"
              onClick={() => navigate('/meilleurs-produits-bebe-2026')}
            >
              Voir les meilleurs produits 2026
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 min-h-12 text-base border-foreground/20 bg-background/60"
              onClick={() => navigate('/tools')}
            >
              <Wrench className="mr-2 h-4 w-4" />
              Explorer les outils
            </Button>
          </div>

          <button onClick={() => navigate('/contests')} className="hero-contest-link">
            <Gift className="h-4 w-4" />
            Participe à notre concours
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
        <motion.div
          ref={sceneRef}
          className="hero-scene-shell"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-scene-caption" aria-hidden><span>Un petit univers</span><span>qui grandit</span></div>
          {webglReady && !reducedMotion ? (
            <HeroSceneErrorBoundary>
              <Suspense fallback={<HeroSceneFallback />}>
                <HeroScene3D quality={quality} active={sceneVisible && documentVisible} />
              </Suspense>
            </HeroSceneErrorBoundary>
          ) : <HeroSceneFallback />}
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
