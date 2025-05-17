
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
        <link rel="prefetch" href="/articles" />
        <link rel="prefetch" href="/about" />
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
      </div>
    </>
  );
};

export default HomePageContent;
