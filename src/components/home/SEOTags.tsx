import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import WebsiteSchema from './WebsiteSchema';
import OrganizationSchema from './OrganizationSchema';
import ProductSchema from './ProductSchema';
import { Helmet } from 'react-helmet-async';
import HreflangTags from '@/components/seo/HreflangTags';
import SoftwareApplicationSchema from '@/components/seo/SoftwareApplicationSchema';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import FAQPageSchema from '@/components/seo/FAQPageSchema';

const SEOTags: React.FC = () => {
  // URL canonique de la page d'accueil
  const homeCanonicalUrl = "https://babybaby.org/";
  
  // Définition des langues alternatives pour la page d'accueil
  // Définition des langues alternatives pour la page d'accueil (Québec prioritaire)
  const alternateLanguages = [
    { lang: "fr-CA", url: "https://babybaby.org/" },
    { lang: "fr-FR", url: "https://babybaby.org/" },
    { lang: "fr", url: "https://babybaby.org/" },
  ];

  // FAQs principales pour le schema FAQ sur la page d'accueil
  const homepageFAQs = [
    {
      question: "Qu'est-ce que l'application BabyBaby ?",
      answer: "BabyBaby est une application tout-en-un pour les parents modernes. Elle permet de suivre la croissance, la santé et le développement de votre bébé avec des outils intelligents, des conseils d'experts et une communauté bienveillante."
    },
    {
      question: "L'application BabyBaby est-elle gratuite ?",
      answer: "Oui, BabyBaby propose une version gratuite avec toutes les fonctionnalités essentielles : suivi de croissance, calendrier de vaccination, articles et forum communautaire. Une version premium offre des fonctionnalités avancées."
    },
    {
      question: "Comment suivre la croissance de mon bébé ?",
      answer: "BabyBaby permet d'enregistrer le poids, la taille et le périmètre crânien de votre bébé. Les données sont affichées sur des courbes de croissance comparées aux normes OMS pour un suivi précis."
    },
    {
      question: "L'application propose-t-elle des outils pour le sommeil de bébé ?",
      answer: "Oui, BabyBaby inclut un générateur de bruit blanc avec différents sons apaisants (pluie, océan, ventilateur) et un lecteur de berceuses pour aider votre bébé à s'endormir paisiblement."
    }
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
          "vaccination bébé", "sommeil bébé", "alimentation bébé", "diversification alimentaire",
          "application parents", "suivi croissance", "calendrier vaccinal"
        ]}
        alternateLanguages={alternateLanguages}
      />
      
      {/* Utilisation du composant HreflangTags pour une gestion centralisée */}
      <HreflangTags
        currentLang="fr"
        currentUrl={homeCanonicalUrl}
        alternateLanguages={alternateLanguages}
      />
      
      {/* Additional meta tags in a single Helmet instance */}
      <Helmet>
        <meta name="google-site-verification" content="VGG79QXzkgBxlbUZl_WkUKyFVvUueDd22O_l40gXj0A" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta name="geo.region" content="CA-QC" />
        <meta name="geo.placename" content="Montréal, Québec" />
        <meta name="ICBM" content="45.5017, -73.5673" />
        <meta name="geo.position" content="45.5017;-73.5673" />
        <meta property="og:locale" content="fr_CA" />
        <meta property="og:locale:alternate" content="fr_FR" />
        <meta property="og:locale:alternate" content="en_CA" />
        <meta name="twitter:creator" content="@babybaby_app" />
        <meta name="twitter:domain" content="babybaby.org" />
        <link rel="preconnect" href="https://babybaby.boutique" />
        <link rel="dns-prefetch" href="https://babybaby.boutique" />
      </Helmet>
      
      {/* Schemas structurés pour le SEO */}
      <WebsiteSchema />
      <OrganizationSchema />
      <ProductSchema />
      <SoftwareApplicationSchema />
      <LocalBusinessSchema />
      <FAQPageSchema faqs={homepageFAQs} />
    </>
  );
};

export default SEOTags;
