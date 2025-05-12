
import React from 'react';
import { Helmet } from 'react-helmet-async';

const ProductSchema: React.FC = () => {
  // Product schema for rich results
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "SoftwareApplication",
    "name": "BabyBaby App",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  );
};

export default ProductSchema;
