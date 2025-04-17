
import React, { useEffect, Suspense, lazy } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import { useIsMobile } from '@/hooks/use-mobile';

// Utilisation du lazy loading pour tous les composants majeurs
const Dashboard = lazy(() => import('@/components/dashboard/Dashboard'));
const ToolsSection = lazy(() => import('@/components/tools/ToolsSection'));
const NewsletterForm = lazy(() => import('@/components/NewsletterForm'));
const Footer = lazy(() => import('@/components/Footer'));
const ArticleSection = lazy(() => import('@/components/articles/ArticleSection'));
const ProductsSection = lazy(() => import('@/components/products/ProductsSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));

// Fallback loader pour les composants en chargement
const SectionLoader = () => (
  <div className="py-12 flex justify-center items-center">
    <div className="animate-pulse w-full max-w-4xl h-48 bg-gray-100 rounded-lg"></div>
  </div>
);

const Index = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
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
              duration: 0.5, 
              staggerChildren: isMobile ? 0.1 : 0.2 
            } 
          },
        }}
      >
        <Suspense fallback={<SectionLoader />}>
          <Dashboard />
        </Suspense>
        
        {/* Réduction de la priorité des sections moins importantes sur mobile */}
        <Suspense fallback={isMobile ? null : <SectionLoader />}>
          <ArticleSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ProductsSection />
        </Suspense>
        
        <Suspense fallback={isMobile ? null : <SectionLoader />}>
          <ToolsSection />
        </Suspense>
        
        <Suspense fallback={isMobile ? null : <SectionLoader />}>
          <ContactSection />
        </Suspense>
        
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <Suspense fallback={<div className="h-24 animate-pulse bg-gray-100 rounded-lg"></div>}>
                <NewsletterForm />
              </Suspense>
            </div>
          </div>
        </section>
      </motion.div>
      
      <Suspense fallback={<div className="h-24 bg-gray-50"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
