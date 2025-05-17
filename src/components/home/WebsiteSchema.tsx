
import React from 'react';
import { Helmet } from 'react-helmet-async';

const WebsiteSchema: React.FC = () => {
  // Website schema structured data for SEO
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BabyBaby",
    "url": "https://babybaby.org",
    "description": "Application complète pour le suivi de santé et développement de bébé. Outils, conseils et communauté pour parents.",
    "keywords": "suivi bébé, santé bébé, développement enfant, croissance bébé, conseils parents, application parentalité",
    "inLanguage": "fr-FR",
    "copyrightYear": new Date().getFullYear().toString(),
    "datePublished": "2024-01-01T00:00:00+00:00",
    "dateModified": new Date().toISOString(),
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://babybaby.org/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "ReadAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://babybaby.org/articles"
        }
      }
    ],
    "sameAs": [
      "https://facebook.com/babybaby",
      "https://twitter.com/babybaby_official",
      "https://instagram.com/babybaby_app",
      "https://babybaby.boutique",
      "https://pinterest.com/babybaby_app"
    ],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://babybaby.org/"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default WebsiteSchema;
