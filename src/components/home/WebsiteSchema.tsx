
import React from 'react';
import { Helmet } from 'react-helmet-async';

const WebsiteSchema: React.FC = () => {
  // Website schema structured data for SEO
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BabyBaby",
    "url": "https://babybaby.org/",
    "description": "Application complète pour le suivi de santé et développement de bébé. Outils, conseils et communauté pour parents.",
    "inLanguage": ["fr-CA", "fr-FR"],
    "publisher": {
      "@type": "Organization",
      "name": "BabyBaby",
      "url": "https://babybaby.org/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://babybaby.org/__l5e/assets-v1/7f28394d-9670-4734-b87e-6cc9cc307285/logo-babybaby.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://babybaby.org/articles?search={search_term_string}",
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
