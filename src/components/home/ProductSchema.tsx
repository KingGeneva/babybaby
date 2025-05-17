
import React from 'react';
import { Helmet } from 'react-helmet-async';

const ProductSchema: React.FC = () => {
  // Product schema for rich results
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "SoftwareApplication",
    "name": "BabyBaby App",
    "applicationCategory": "HealthApplication, ParentingApplication",
    "operatingSystem": "Web, Android, iOS",
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
      "worstRating": "1",
      "reviewCount": "842"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Marie L."
        },
        "datePublished": "2025-04-02",
        "reviewBody": "Application indispensable pour tous les parents ! Le suivi de croissance est particulièrement utile."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Thomas D."
        },
        "datePublished": "2025-03-15",
        "reviewBody": "Très pratique pour suivre les rendez-vous médicaux et le développement de notre enfant."
      }
    ],
    "description": "Application complète pour suivre la croissance, la santé et le développement de votre bébé avec des outils innovants et des conseils d'experts.",
    "featureList": "Suivi de croissance, Calendrier vaccinal, Journal de développement, Conseils d'experts, Communauté de parents",
    "softwareVersion": "2.4.0",
    "releaseNotes": "Nouvelles fonctionnalités de suivi de sommeil et amélioration des performances"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  );
};

export default ProductSchema;
