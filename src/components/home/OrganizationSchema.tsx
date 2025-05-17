
import React from 'react';
import { Helmet } from 'react-helmet-async';

const OrganizationSchema: React.FC = () => {
  // Organization schema structured data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BabyBaby",
    "alternateName": "BabyBaby App",
    "url": "https://babybaby.app",
    "logo": "https://babybaby.app/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
    "description": "Plateforme leader pour le suivi de développement et santé infantile",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "Équipe BabyBaby"
      }
    ],
    "sameAs": [
      "https://facebook.com/babybaby",
      "https://twitter.com/babybaby_app",
      "https://instagram.com/babybaby_app",
      "https://babybaby.boutique"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "contact@babybaby.app",
        "availableLanguage": ["French"]
      },
      {
        "@type": "ContactPoint",
        "contactType": "technical support",
        "email": "support@babybaby.app",
        "availableLanguage": ["French"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default OrganizationSchema;
