
import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import ArticleSection from '@/components/articles/ArticleSection';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';
import PartnersCarousel from '@/components/partners/PartnersCarousel';
import ProductsSection from '@/components/products/ProductsSection';
import EbooksSection from '@/components/ebooks/EbooksSection';
import CoursesSection from '@/components/courses/CoursesSection';
import ToolsSection from '@/components/tools/ToolsSection';
import ContactSection from '@/components/ContactSection';
import NewsletterForm from '@/components/NewsletterForm';

const HomeContent: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });
  
  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1, 
            transition: { 
              duration: 0.3,
              staggerChildren: 0.1
            } 
          },
        }}
      >
        {/* Article Section - Important for SEO with fresh content */}
        <ArticleSection />

        {/* Témoignages Section */}
        <TestimonialsCarousel />
        
        {/* Call-to-Action Section */}
        <CallToActionSection />
        
        {/* Sections moins prioritaires */}
        <PartnersCarousel />
        <ProductsSection />
        <EbooksSection />
        <ToolsSection />
        <ContactSection />
        
        {/* Newsletter avec loader minimal */}
        <section className="py-6 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default HomeContent;
