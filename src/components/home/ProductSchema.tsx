
import React from 'react';

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
    <script type="application/ld+json">
      {JSON.stringify(productSchema)}
    </script>
  );
};

export default ProductSchema;
