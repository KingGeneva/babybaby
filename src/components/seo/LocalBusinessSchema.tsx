import React from 'react';
import { Helmet } from 'react-helmet-async';

const LocalBusinessSchema: React.FC = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "BabyBaby",
    "image": "https://babybaby.org/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
    "url": "https://babybaby.org",
    "telephone": "+1-581-333-3173",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "QC",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 45.5017,
      "longitude": -73.5673
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://facebook.com/babybaby",
      "https://instagram.com/babybaby_app",
      "https://twitter.com/babybaby_app"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
