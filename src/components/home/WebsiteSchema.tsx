
import React from 'react';
import { Helmet } from 'react-helmet-async';

const WebsiteSchema: React.FC = () => {
  // Website schema structured data for SEO
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

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default WebsiteSchema;
