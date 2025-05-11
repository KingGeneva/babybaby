
import React from 'react';

const OrganizationSchema: React.FC = () => {
  // Organization schema structured data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BabyBaby",
    "url": "https://babybaby.app",
    "logo": "https://lovable.dev/opengraph-image-p98pqg.png",
    "description": "Plateforme leader pour le suivi de développement et santé infantile",
    "sameAs": [
      "https://facebook.com/babybaby",
      "https://twitter.com/babybaby_app",
      "https://instagram.com/babybaby_app"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "contact@babybaby.app"
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(organizationSchema)}
    </script>
  );
};

export default OrganizationSchema;
