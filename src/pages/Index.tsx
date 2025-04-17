
import React, { useEffect, Suspense } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import Dashboard from '@/components/dashboard/Dashboard';
import ToolsSection from '@/components/tools/ToolsSection';
import NewsletterForm from '@/components/NewsletterForm';
import Footer from '@/components/Footer';
import ArticleSection from '@/components/articles/ArticleSection';
import ProductsSection from '@/components/products/ProductsSection';
import ContactSection from '@/components/ContactSection';

// Fallback loader pour les composants en chargement
const SectionLoader = () => (
  <div className="py-16 flex justify-center items-center">
    <div className="animate-pulse w-full max-w-4xl h-64 bg-gray-100 rounded-lg"></div>
  </div>
);

const Index = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div className="min-h-screen">
      <NavBar />
      <HeroSection />
      
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
        }}
      >
        <Suspense fallback={<SectionLoader />}>
          <Dashboard />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ArticleSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ProductsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ToolsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
        
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Index;
