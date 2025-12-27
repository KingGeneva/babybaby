import React from 'react';
import { Helmet } from 'react-helmet-async';

const SoftwareApplicationSchema: React.FC = () => {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "BabyBaby",
    "operatingSystem": "Web, iOS, Android",
    "applicationCategory": "HealthApplication",
    "applicationSubCategory": "ParentingApp",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "screenshot": "https://babybaby.app/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png",
    "description": "Application complète pour le suivi de santé, croissance et développement de bébé. Outils intelligents, conseils d'experts et communauté de parents.",
    "featureList": [
      "Suivi de croissance avec courbes OMS",
      "Calendrier de vaccination",
      "Suivi des jalons de développement",
      "Générateur de prénoms",
      "Bruit blanc et berceuses",
      "Forum communautaire",
      "Articles et e-books gratuits",
      "Quiz interactifs"
    ],
    "author": {
      "@type": "Organization",
      "name": "BabyBaby",
      "url": "https://babybaby.app"
    },
    "datePublished": "2024-01-01",
    "dateModified": "2024-12-27",
    "inLanguage": "fr-FR",
    "isAccessibleForFree": true
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(softwareSchema)}
      </script>
    </Helmet>
  );
};

export default SoftwareApplicationSchema;
