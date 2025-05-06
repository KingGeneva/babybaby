
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToStructuredDataProps {
  name: string;
  description: string;
  image: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
  totalTime?: string; // Format PT2H30M (2 heures 30 minutes)
  steps: HowToStep[];
  tools?: string[];
  supply?: string[];
  pageUrl: string;
}

const HowToStructuredData: React.FC<HowToStructuredDataProps> = ({
  name,
  description,
  image,
  estimatedCost,
  totalTime,
  steps,
  tools = [],
  supply = [],
  pageUrl,
}) => {
  // HowTo structured data pour les guides pratiques et tutoriels
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "image": {
      "@type": "ImageObject",
      "url": image
    },
    "totalTime": totalTime,
    "estimatedCost": estimatedCost ? {
      "@type": "MonetaryAmount",
      "currency": estimatedCost.currency,
      "value": estimatedCost.value
    } : undefined,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": step.url || `${pageUrl}#step-${index + 1}`,
      "image": step.image ? {
        "@type": "ImageObject",
        "url": step.image
      } : undefined
    })),
    "tool": tools.map(tool => ({
      "@type": "HowToTool",
      "name": tool
    })),
    "supply": supply.map(item => ({
      "@type": "HowToSupply",
      "name": item
    }))
  };

  // BreadcrumbList schema pour améliorer la navigation
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
        "name": name,
        "item": pageUrl
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(howToStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default HowToStructuredData;
