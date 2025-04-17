
import React, { useEffect, Suspense, lazy } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import { useIsMobile } from '@/hooks/use-mobile';

// Utilisation du lazy loading avec prefetch prioritaire
const Dashboard = lazy(() => import('@/components/dashboard/Dashboard'));

// Utilisation du lazy loading avec chargement différé pour les sections moins critiques
const ToolsSection = lazy(() => {
  // Retarde légèrement le chargement pour prioriser les contenus critiques
  return new Promise(resolve => {
    setTimeout(() => resolve(import('@/components/tools/ToolsSection')), 500);
  });
});

const NewsletterForm = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import('@/components/NewsletterForm')), 300);
  });
});

const Footer = lazy(() => import('@/components/Footer'));
const ArticleSection = lazy(() => import('@/components/articles/ArticleSection'));
const ProductsSection = lazy(() => import('@/components/products/ProductsSection'));
const ContactSection = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import('@/components/ContactSection')), 800);
  });
});

// Fallback loader pour les composants en chargement - plus compact
const SectionLoader = () => (
  <div className="py-6 flex justify-center items-center">
    <div className="animate-pulse w-full max-w-2xl h-24 bg-gray-100 rounded-lg"></div>
  </div>
);

const Index = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05, // Réduit le seuil pour déclencher plus tôt
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div className="min-h-screen overflow-hidden">
      <NavBar />
      <HeroSection />
      
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1, 
            transition: { 
              duration: 0.3, // Réduit la durée pour une transition plus rapide
              staggerChildren: isMobile ? 0.05 : 0.1 // Réduit le délai entre les animations
            } 
          },
        }}
      >
        {/* Section prioritaire chargée en premier */}
        <Suspense fallback={<SectionLoader />}>
          <Dashboard />
        </Suspense>
        
        {/* Sections moins prioritaires avec chargement conditionnel */}
        <Suspense fallback={<SectionLoader />}>
          <ProductsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ArticleSection />
        </Suspense>
        
        {/* Sections à faible priorité */}
        <Suspense fallback={isMobile ? null : <SectionLoader />}>
          <ToolsSection />
        </Suspense>
        
        <Suspense fallback={isMobile ? null : <SectionLoader />}>
          <ContactSection />
        </Suspense>
        
        {/* Newsletter avec loader minimal */}
        <section className="py-6 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <Suspense fallback={<div className="h-16 animate-pulse bg-gray-100 rounded-lg"></div>}>
                <NewsletterForm />
              </Suspense>
            </div>
          </div>
        </section>
      </motion.div>
      
      <Suspense fallback={<div className="h-16 bg-gray-50"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
