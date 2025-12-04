import React from 'react';
import { Helmet } from 'react-helmet-async';
import { reportMetadata, productCategories } from '@/data/babyProductsReport';

const ReportStructuredData: React.FC = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": reportMetadata.title,
    "description": reportMetadata.description,
    "image": "https://babybaby.app/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png",
    "datePublished": reportMetadata.publishDate,
    "dateModified": reportMetadata.updateDate,
    "author": {
      "@type": "Organization",
      "name": reportMetadata.author,
      "url": "https://babybaby.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BabyBaby",
      "logo": {
        "@type": "ImageObject",
        "url": "https://babybaby.app/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://babybaby.app/rapport-puericulture-2026"
    },
    "keywords": reportMetadata.keywords.join(", ")
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": productCategories.slice(0, 5).map(category => ({
      "@type": "Question",
      "name": `Quel est le meilleur ${category.title.toLowerCase()} en 2026 au Canada?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Le meilleur ${category.title.toLowerCase()} en 2026 est le ${category.products[0]?.name} de ${category.products[0]?.brand}. ${category.products[0]?.description?.slice(0, 200)}...`
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://babybaby.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Guides",
        "item": "https://babybaby.app/guides"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Rapport Puériculture 2026",
        "item": "https://babybaby.app/rapport-puericulture-2026"
      }
    ]
  };

  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Meilleurs Produits Bébé 2026 - Canada",
    "description": reportMetadata.description,
    "numberOfItems": productCategories.reduce((acc, cat) => acc + cat.products.length, 0),
    "itemListElement": productCategories.flatMap((category, catIndex) => 
      category.products.map((product, prodIndex) => ({
        "@type": "ListItem",
        "position": catIndex * 3 + prodIndex + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "brand": {
            "@type": "Brand",
            "name": product.brand
          },
          "description": product.description,
          "category": category.title
        }
      }))
    )
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(productListSchema)}
      </script>
    </Helmet>
  );
};

export default ReportStructuredData;
