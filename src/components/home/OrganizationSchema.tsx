
import React from 'react';
import { Helmet } from 'react-helmet-async';

const OrganizationSchema: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BabyBaby",
    "alternateName": "BabyBaby App",
    "url": "https://babybaby.org",
    "logo": "https://babybaby.org/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
    "description": "Plateforme québécoise de contenus et d'outils gratuits pour les parents : suivi de croissance, guides, comparatifs de produits.",
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
      "description": "Historique du nom de domaine babybaby.org : enregistré en 1998, puis détenu par Martha Stewart Living Omnimedia entre 2000 et 2003 pour la section Baby de marthastewart.com. La plateforme actuelle est un projet distinct et récent.",
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
      "addressRegion": "QC",
      "addressCountry": "CA"
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
