
import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import WebsiteSchema from './WebsiteSchema';
import OrganizationSchema from './OrganizationSchema';
import ProductSchema from './ProductSchema';
import { Helmet } from 'react-helmet-async';

const SEOTags: React.FC = () => {
  // URL canonique de la page d'accueil
  const homeCanonicalUrl = "https://babybaby.app/";
  
  return (
    <>
      <SEOHead 
        title="BabyBaby - Application de suivi de bébé | Santé, Croissance et Développement" 
        description="BabyBaby : L'application complète pour les parents modernes. Suivez la croissance, la santé et le développement de votre bébé avec des outils innovants. Conseils d'experts et communauté bienveillante."
        canonicalUrl={homeCanonicalUrl}
        keywords={[
          "suivi bébé", "application bébé", "croissance infantile", "santé bébé", 
          "développement enfant", "conseil parental", "outils parents", 
          "carnet santé numérique", "milestones bébé", "courbe croissance"
        ]}
      />
      
      {/* Balises meta additionnelles spécifiques à la page d'accueil */}
      <Helmet>
        {/* Google tag verification */}
        <meta name="google-site-verification" content="VGG79QXzkgBxlbUZl_WkUKyFVvUueDd22O_l40gXj0A" />
        
        {/* Balise hreflang pour la langue principale et les alternatives */}
        <link rel="alternate" hrefLang="fr" href="https://babybaby.app/" />
        <link rel="alternate" hrefLang="fr-FR" href="https://babybaby.app/" />
        <link rel="alternate" hrefLang="x-default" href="https://babybaby.app/" />
        
        {/* Amélioration du tracking Google Analytics */}
        <script type="application/ld+json">
          {`{
            "@context": "http://schema.org",
            "@type": "WebPage",
            "name": "BabyBaby - Application de suivi de bébé | Santé, Croissance et Développement",
            "description": "Application complète pour suivre la croissance et le développement de votre bébé",
            "url": "https://babybaby.app/"
          }`}
        </script>
      </Helmet>
      
      {/* Schemas structurés pour le SEO */}
      <WebsiteSchema />
      <OrganizationSchema />
      <ProductSchema />
    </>
  );
};

export default SEOTags;
