
import React, { useEffect, useState } from 'react';
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
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    // Make content visible after a small delay to ensure context is properly set up
    const timer = setTimeout(() => {
      setIsInView(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mise à jour de la date de dernière modification pour les moteurs de recherche
  const lastMod = new Date().toISOString();
  
  return (
    <>
      {/* SEO optimization for cross-domain */}
      <Helmet>
        <meta name="last-modified" content={lastMod} />
        <link rel="alternate" href="https://babybaby.app/" hrefLang="x-default" />
        <link rel="alternate" href="https://babybaby.app/" hrefLang="fr" />
        <link rel="alternate" href="https://babybaby.app/" hrefLang="fr-FR" />
        <link rel="alternate" href="https://babybaby.app/" hrefLang="fr-CA" />
        <link rel="prefetch" href="/articles" />
        <link rel="prefetch" href="/ebooks" />
        <link rel="prefetch" href="/tools" />
      </Helmet>

      <div
        className={`transition-opacity duration-500 ${isInView ? 'opacity-100' : 'opacity-0'}`}
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
        
        {/* Section pour le cross-domain référencement avec SEO amélioré */}
        <section className="py-8 px-4 bg-gradient-to-br from-sky-50 to-blue-50" aria-labelledby="boutique-heading">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 id="boutique-heading" className="text-2xl md:text-3xl font-bold mb-4 text-babybaby-cosmic">
                Découvrez notre boutique de produits pour bébé
              </h2>
              <p className="text-gray-700 mb-6 text-lg">
                Visitez notre boutique pour découvrir des produits sélectionnés avec soin pour vous et votre bébé. 
                Articles de puériculture, vêtements et accessoires de qualité.
              </p>
              <div className="flex justify-center">
                <Link 
                  to="/boutique" 
                  className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80 text-white px-8 py-4 rounded-full font-medium transition-all text-lg shadow-lg hover:shadow-xl"
                  aria-label="Visiter la boutique BabyBaby"
                >
                  Visiter la boutique
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Newsletter avec loader minimal */}
        <section className="py-8 px-4" aria-labelledby="newsletter-heading">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <h2 id="newsletter-heading" className="sr-only">Inscription à la newsletter</h2>
              <NewsletterForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePageContent;
