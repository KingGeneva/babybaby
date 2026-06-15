
import React from 'react';
import { Helmet } from 'react-helmet-async';

const OrganizationSchema: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BabyBaby",
    "alternateName": "BabyBaby App",
    "url": "https://babybaby.org",
    "logo": "https://babybaby.org/__l5e/assets-v1/7f28394d-9670-4734-b87e-6cc9cc307285/logo-babybaby.png",
    "description": "Plateforme leader pour le suivi de développement et santé infantile. Domaine historique actif depuis 1998.",
    "foundingDate": "1998",
    "knowsAbout": [
      "Parentalité",
      "Développement infantile",
      "Santé bébé",
      "Suivi de croissance",
      "Allaitement",
      "Sommeil du nourrisson"
    ],
    "subjectOf": {
      "@type": "CreativeWork",
      "name": "Historique du domaine babybaby.org",
      "description": "Domaine enregistré en 1998. Détenu et exploité par Martha Stewart Living Omnimedia (MSLO) entre 2000 et 2003 pour la section Baby de marthastewart.com. Refondé aujourd'hui en plateforme moderne pour parents francophones.",
      "url": "https://web.archive.org/web/2000*/babybaby.org"
    },
    "sameAs": [
      "https://facebook.com/babybaby",
      "https://twitter.com/babybaby_app",
      "https://instagram.com/babybaby_app",
      "https://babybaby.boutique",
      "https://web.archive.org/web/2000*/babybaby.org"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "contact@babybaby.org",
        "availableLanguage": ["French"]
      },
      {
        "@type": "ContactPoint",
        "contactType": "technical support",
        "email": "support@babybaby.org",
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
