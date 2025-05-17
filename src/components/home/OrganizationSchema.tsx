
import React from 'react';
import { Helmet } from 'react-helmet-async';

const OrganizationSchema: React.FC = () => {
  // Organization schema structured data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BabyBaby",
    "alternateName": "BabyBaby App",
    "url": "https://babybaby.org",
    "logo": {
      "@type": "ImageObject",
      "url": "https://babybaby.org/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
      "width": "192",
      "height": "192"
    },
    "description": "Plateforme leader pour le suivi de développement et santé infantile",
    "slogan": "Pour un accompagnement complet des parents",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "Équipe BabyBaby"
      }
    ],
    "sameAs": [
      "https://facebook.com/babybaby",
      "https://twitter.com/babybaby_official",
      "https://instagram.com/babybaby_app",
      "https://babybaby.boutique",
      "https://pinterest.com/babybaby_app"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "contact@babybaby.org",
        "availableLanguage": ["French", "English"],
        "telephone": "+33000000000"
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
      "addressCountry": "FR",
      "addressRegion": "Île-de-France",
      "addressLocality": "Paris"
    },
    "knowsAbout": [
      "développement infantile",
      "santé bébé",
      "parentalité",
      "puériculture",
      "alimentation bébé",
      "sommeil bébé"
    ],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://babybaby.org/about"
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
