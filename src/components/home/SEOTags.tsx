
import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import WebsiteSchema from './WebsiteSchema';
import OrganizationSchema from './OrganizationSchema';
import ProductSchema from './ProductSchema';
import { Helmet } from 'react-helmet-async';
import HreflangTags from '@/components/seo/HreflangTags';

const SEOTags: React.FC = () => {
  // URL canonique de la page d'accueil
  const homeCanonicalUrl = "https://babybaby.org/";
  
  // Définition des langues alternatives pour la page d'accueil
  const alternateLanguages = [
    { lang: "fr", url: "https://babybaby.org/" },
    { lang: "fr-FR", url: "https://babybaby.org/" },
    { lang: "en", url: "https://babybaby.org/en/" },
  ];
  
  return (
    <>
      <SEOHead 
        title="BabyBaby - Application de suivi de bébé | Santé, Croissance et Développement" 
        description="BabyBaby : L'application complète pour les parents modernes. Suivez la croissance, la santé et le développement de votre bébé avec des outils innovants. Conseils d'experts et communauté bienveillante."
        canonicalUrl={homeCanonicalUrl}
        ogType="website"
        ogImage="https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"
        keywords={[
          "suivi bébé", "application bébé", "croissance infantile", "santé bébé", 
          "développement enfant", "conseil parental", "outils parents", 
          "carnet santé numérique", "milestones bébé", "courbe croissance",
          "sommeil bébé", "alimentation bébé", "diversification alimentaire"
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
        <meta name="msvalidate.01" content="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" /> {/* Bing Webmaster Tools */}
        <meta name="yandex-verification" content="XXXXXXXXXXXXXXXX" /> {/* Yandex Webmaster */}
        
        {/* Balises pour améliorer l'indexation */}
        <meta name="revisit-after" content="3 days" />
        <meta name="rating" content="general" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        
        {/* Open Graph tags supplémentaires */}
        <meta property="og:url" content={homeCanonicalUrl} />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:image:alt" content="BabyBaby - Application pour parents" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        
        {/* Balises spécifiques pour les réseaux sociaux */}
        <meta name="twitter:creator" content="@babybaby_official" />
        <meta name="twitter:domain" content="babybaby.org" />
        <meta name="twitter:app:name:iphone" content="BabyBaby" />
        <meta name="twitter:app:id:iphone" content="00000000" />
        <meta name="twitter:app:name:googleplay" content="BabyBaby" />
        <meta name="twitter:app:id:googleplay" content="org.babybaby.app" />
        
        {/* Balises pour les moteurs de recherche */}
        <meta name="apple-mobile-web-app-title" content="BabyBaby" />
        <meta name="application-name" content="BabyBaby" />
      </Helmet>
      
      {/* Schemas structurés pour le SEO */}
      <WebsiteSchema />
      <OrganizationSchema />
      <ProductSchema />
      
      {/* Liens vers les domaines connexes pour le référencement croisé */}
      <Helmet>
        <link rel="preconnect" href="https://babybaby.boutique" />
        <link rel="dns-prefetch" href="https://babybaby.boutique" />
      </Helmet>
    </>
  );
};

export default SEOTags;
