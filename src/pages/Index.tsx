import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ArticleSection from '@/components/articles/ArticleSection';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';
import PartnersCarousel from '@/components/partners/PartnersCarousel';
import ProductsSection from '@/components/products/ProductsSection';
import EbooksSection from '@/components/ebooks/EbooksSection';
import ToolsSection from '@/components/tools/ToolsSection';
import ContactSection from '@/components/ContactSection';
import NewsletterForm from '@/components/NewsletterForm';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

// Optimized Homepage without dashboard demo for better performance and SEO
const Index = () => {
  // Initialize React hooks safely at the function component level
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  // Website schema structured data - enhanced for SEO
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BabyBaby",
    "url": "https://babybaby.app",
    "description": "Application complète pour le suivi de santé et développement de bébé. Outils, conseils et communauté pour parents.",
    "keywords": "suivi bébé, santé bébé, développement enfant, croissance bébé, conseils parents",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://babybaby.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Organization schema structured data - enhanced for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BabyBaby",
    "url": "https://babybaby.app",
    "logo": "https://lovable.dev/opengraph-image-p98pqg.png",
    "description": "Plateforme leader pour le suivi de développement et santé infantile",
    "sameAs": [
      "https://facebook.com/babybaby",
      "https://twitter.com/babybaby_app",
      "https://instagram.com/babybaby_app"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "contact@babybaby.app"
    }
  };
  
  // Product schema for rich results
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "SoftwareApplication",
    "name": "BabyBaby App",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };
  
  return (
    <div className="min-h-screen overflow-hidden">
      <SEOHead 
        title="BabyBaby - Application de suivi de bébé | Santé, Croissance et Développement" 
        description="BabyBaby : L'application complète pour les parents modernes. Suivez la croissance, la santé et le développement de votre bébé avec des outils innovants. Conseils d'experts et communauté bienveillante."
        canonicalUrl="https://babybaby.app"
        keywords={[
          "suivi bébé", "application bébé", "croissance infantile", "santé bébé", 
          "développement enfant", "conseil parental", "outils parents", 
          "carnet santé numérique", "milestones bébé", "courbe croissance"
        ]}
      />
      
      {/* Enhanced Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      
      <NavBar />
      <HeroSection />
      
      {/* Présentation des avantages clés */}
      <section className="py-16 bg-gradient-to-b from-white to-sky-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-babybaby-cosmic">
              Suivez l'évolution de votre bébé en toute simplicité
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              BabyBaby vous accompagne à chaque étape importante du développement de votre enfant avec des outils complets et personnalisés.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-babybaby-cosmic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <circle cx="12" cy="12" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Suivi de croissance</h3>
              <p className="text-gray-600 text-center">
                Enregistrez et visualisez la croissance de votre enfant avec des graphiques intuitifs et personnalisés.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-babybaby-cosmic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Carnet médical</h3>
              <p className="text-gray-600 text-center">
                Gérez les rendez-vous médicaux et suivez le calendrier de vaccination de votre enfant.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-babybaby-cosmic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Jalons de développement</h3>
              <p className="text-gray-600 text-center">
                Découvrez et suivez les étapes clés du développement de votre enfant mois par mois.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
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
        <section className="py-16 bg-gradient-to-r from-babybaby-cosmic/10 to-babybaby-cosmic/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-babybaby-cosmic">
                Commencez à suivre le développement de votre bébé dès aujourd'hui
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Rejoignez des milliers de parents qui font confiance à BabyBaby pour suivre le développement de leur enfant.
              </p>
              <Link to="/auth">
                <Button 
                  size={isMobile ? "default" : "lg"}
                  className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 button-glow text-white font-bold px-8 py-5 text-lg rounded-full"
                >
                  Créer un compte gratuit
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
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
        
        <Footer />
      </motion.div>
    </div>
  );
};

export default Index;
