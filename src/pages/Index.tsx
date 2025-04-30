
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import LazyLoadedSections from '@/components/home/LazyLoadedSections';
import { useAuth } from '@/contexts/AuthContext';
import SEOHead from '@/components/common/SEOHead';

const Index = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Données de démonstration pour les visiteurs
  const demoGrowthData = [
    { name: '1 mois', taille: 52, poids: 4.1 },
    { name: '2 mois', taille: 56, poids: 5.2 },
    { name: '3 mois', taille: 59, poids: 6.0 },
    { name: '4 mois', taille: 62, poids: 6.7 },
    { name: '5 mois', taille: 65, poids: 7.3 },
    { name: '6 mois', taille: 67, poids: 7.8 },
  ];

  useEffect(() => {
    // Simuler un chargement pour donner l'impression de données dynamiques
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  // Website schema structured data
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BabyBaby",
    "url": "https://babybaby.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://babybaby.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Organization schema structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BabyBaby",
    "url": "https://babybaby.app",
    "logo": "https://lovable.dev/opengraph-image-p98pqg.png",
    "sameAs": [
      "https://facebook.com/babybaby",
      "https://twitter.com/babybaby_app",
      "https://instagram.com/babybaby_app"
    ]
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <SEOHead 
        title="BabyBaby - Application de suivi de bébé | Santé, Croissance, Conseil" 
        description="BabyBaby : L'application indispensable pour les parents. Suivez la croissance, la santé et le développement de votre bébé. Outils, conseils et communauté de parents."
        canonicalUrl="https://babybaby.app"
        keywords={[
          "suivi bébé", "croissance infantile", "santé bébé", "conseil parental", 
          "développement enfant", "outil parent", "application parentalité",
          "suivi croissance bébé", "carnet santé numérique", "application suivi enfant"
        ]}
      />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
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
              duration: 0.3,
              staggerChildren: 0.1
            } 
          },
        }}
      >
        <LazyLoadedSections 
          demoGrowthData={demoGrowthData}
          isLoading={loading}
          isAuthenticated={!!user}
          showDevelopmentSection={false}
        />
      </motion.div>
    </div>
  );
};

export default Index;
