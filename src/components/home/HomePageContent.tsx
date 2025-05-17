
import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ArticleSection from '@/components/articles/ArticleSection';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';
import PartnersCarousel from '@/components/partners/PartnersCarousel';
import ProductsSection from '@/components/products/ProductsSection';
import EbooksSection from '@/components/ebooks/EbooksSection';
import ToolsSection from '@/components/tools/ToolsSection';
import ContactSection from '@/components/ContactSection';
import NewsletterForm from '@/components/NewsletterForm';
import KeyFeaturesSection from './KeyFeaturesSection';
import CTASection from './CTASection';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const HomePageContent: React.FC = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });
  
  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Mise à jour de la date de dernière modification pour les moteurs de recherche
  const lastMod = new Date().toISOString();
  
  return (
    <>
      {/* SEO optimization with updated domain */}
      <Helmet>
        <meta name="last-modified" content={lastMod} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://babybaby.org/" />
        
        {/* Language alternates */}
        <link rel="alternate" href="https://babybaby.org/" hrefLang="x-default" />
        <link rel="alternate" href="https://babybaby.org/" hrefLang="fr" />
        <link rel="alternate" href="https://babybaby.org/fr/" hrefLang="fr-FR" />
        
        {/* Page resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://analytics.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://babybaby.boutique" />
        
        {/* Preload important pages */}
        <link rel="prefetch" href="/articles" />
        <link rel="prefetch" href="/about" />
        <link rel="prefetch" href="/tools" />
        
        {/* Social media meta tags */}
        <meta property="og:site_name" content="BabyBaby" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@babybaby_official" />
      </Helmet>

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
        <KeyFeaturesSection />
        
        {/* Article Section - Important for SEO with fresh content */}
        <ArticleSection />

        {/* Témoignages Section */}
        <TestimonialsCarousel />
        
        {/* Call-to-Action Section */}
        <CTASection />
        
        {/* Sections moins prioritaires */}
        <PartnersCarousel />
        <ProductsSection />
        <EbooksSection />
        <ToolsSection />
        <ContactSection />
        
        {/* Section pour le cross-domain référencement */}
        <section className="py-6 px-4 bg-sky-50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4 text-babybaby-cosmic">Découvrez notre boutique</h2>
              <p className="text-gray-700 mb-6">
                Visitez notre boutique pour découvrir des produits sélectionnés spécialement pour vous et votre bébé.
              </p>
              <div className="flex justify-center">
                <Link to="/boutique" className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80 text-white px-6 py-3 rounded-full font-medium transition-all">
                  Visiter la boutique
                </Link>
              </div>
            </div>
          </div>
        </section>
        
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

export default HomePageContent;
