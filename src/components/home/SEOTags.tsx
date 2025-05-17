
import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import WebsiteSchema from './WebsiteSchema';
import OrganizationSchema from './OrganizationSchema';
import ProductSchema from './ProductSchema';
import { Helmet } from 'react-helmet-async';
import HreflangTags from '@/components/seo/HreflangTags';

const SEOTags: React.FC = () => {
  // URL canonique de la page d'accueil
  const homeCanonicalUrl = "https://babybaby.app/";
  
  // Définition des langues alternatives pour la page d'accueil
  const alternateLanguages = [
    { lang: "fr", url: "https://babybaby.app/" },
    { lang: "fr-FR", url: "https://babybaby.app/" },
    // Ajoutez d'autres langues si nécessaire
  ];
  
  return (
    <>
      <SEOHead 
        title="BabyBaby - Application de suivi de bébé | Santé, Croissance et Développement" 
        description="BabyBaby : L'application complète pour les parents modernes. Suivez la croissance, la santé et le développement de votre bébé avec des outils innovants. Conseils d'experts et communauté bienveillante."
        canonicalUrl={homeCanonicalUrl}
        ogType="website"
        ogImage="https://babybaby.app/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"
        keywords={[
          "suivi bébé", "application bébé", "croissance infantile", "santé bébé", 
          "développement enfant", "conseil parental", "outils parents", 
          "carnet santé numérique", "milestones bébé", "courbe croissance"
        ]}
        alternateLanguages={alternateLanguages}
      />
      
      {/* Utilisation du composant HreflangTags pour une gestion centralisée */}
      <HreflangTags
        currentLang="fr"
        currentUrl={homeCanonicalUrl}
        alternateLanguages={alternateLanguages}
      />
      
      {/* Google tag verification */}
      <Helmet>
        <meta name="google-site-verification" content="VGG79QXzkgBxlbUZl_WkUKyFVvUueDd22O_l40gXj0A" />
        
        {/* Balises pour améliorer l'indexation */}
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        
        {/* Open Graph tags supplémentaires */}
        <meta property="og:locale:alternate" content="en_US" />
        
        {/* Balises spécifiques pour les réseaux sociaux */}
        <meta name="twitter:creator" content="@babybaby_app" />
        <meta name="twitter:domain" content="babybaby.app" />
      </Helmet>
      
      {/* Schemas structurés pour le SEO */}
      <WebsiteSchema />
      <OrganizationSchema />
      <ProductSchema />
      
      {/* Lien vers la boutique pour le référencement croisé */}
      <Helmet>
        <link rel="preconnect" href="https://babybaby.boutique" />
        <link rel="dns-prefetch" href="https://babybaby.boutique" />
      </Helmet>
    </>
  );
};

export default SEOTags;
