
import React from 'react';

const ContestStructuredData: React.FC = () => {
  // Données structurées pour la page des concours
  const contestSchema = {
    "@context": "https://schema.org",
    "@type": "SpecialAnnouncement",
    "category": "https://schema.org/AnnouncementNewsArticle",
    "name": "Concours et offres exclusives BabyBaby",
    "description": "Inscrivez-vous pour être informé des prochains concours et promotions exclusives pour parents et bébés.",
    "datePosted": new Date().toISOString(),
    "expires": new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    "url": "https://babybaby.app/contests",
    "spatialCoverage": {
      "@type": "Country",
      "name": "France"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BabyBaby",
      "url": "https://babybaby.app"
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(contestSchema)}
    </script>
  );
};

export default ContestStructuredData;
