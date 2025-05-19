
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaData {
  [key: string]: any;
}

interface SchemaOrgProps {
  schemas: SchemaData[];
}

/**
 * Composant pour injecter des données structurées Schema.org
 * Permet de gérer plusieurs schémas sur une même page
 */
const SchemaOrg: React.FC<SchemaOrgProps> = ({ schemas }) => {
  // Vérification que les schémas sont bien formés
  const validSchemas = schemas.filter(schema => 
    schema && typeof schema === 'object' && '@context' in schema && '@type' in schema
  );

  if (validSchemas.length === 0) {
    console.warn('SchemaOrg: No valid schemas provided');
    return null;
  }

  return (
    <Helmet>
      {validSchemas.map((schema, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

/**
 * Construit un schéma BreadcrumbList
 */
export const buildBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };
};

/**
 * Construit un schéma Article
 */
export const buildArticleSchema = (
  title: string,
  description: string,
  url: string,
  imageUrl: string,
  datePublished: string,
  dateModified: string,
  authorName: string
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'description': description,
    'image': imageUrl,
    'datePublished': datePublished,
    'dateModified': dateModified,
    'author': {
      '@type': 'Person',
      'name': authorName
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'BabyBaby',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://babybaby.app/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png',
        'width': '192',
        'height': '192'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url
    },
    'isAccessibleForFree': 'True'
  };
};

/**
 * Construit un schéma product
 */
export const buildProductSchema = (
  name: string,
  description: string,
  imageUrl: string,
  price: string,
  currency: string = 'EUR',
  availability: string = 'https://schema.org/InStock',
  url: string,
  brand: string = 'BabyBaby',
  reviewCount?: number,
  ratingValue?: number
) => {
  const schema: SchemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': name,
    'description': description,
    'image': imageUrl,
    'offers': {
      '@type': 'Offer',
      'price': price,
      'priceCurrency': currency,
      'availability': availability,
      'url': url
    },
    'brand': {
      '@type': 'Brand',
      'name': brand
    }
  };

  // Ajouter les reviews si disponibles
  if (reviewCount && ratingValue) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      'ratingValue': ratingValue.toString(),
      'reviewCount': reviewCount.toString()
    };
  }

  return schema;
};

/**
 * Construit un schéma local business
 */
export const buildLocalBusinessSchema = (
  name: string,
  description: string,
  url: string,
  imageUrl: string,
  telephone: string,
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  }
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': name,
    'description': description,
    'url': url,
    'image': imageUrl,
    'telephone': telephone,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': address.street,
      'addressLocality': address.locality,
      'addressRegion': address.region,
      'postalCode': address.postalCode,
      'addressCountry': address.country
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '09:00',
        'closes': '17:00'
      }
    ],
    'sameAs': [
      'https://www.facebook.com/babybaby',
      'https://www.instagram.com/babybaby_app/',
      'https://twitter.com/babybaby_app'
    ]
  };
};

/**
 * Construit un schéma FAQ
 */
export const buildFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
};

/**
 * Construit un schéma HowTo
 */
export const buildHowToSchema = (
  name: string,
  description: string,
  imageUrl: string,
  steps: { name: string; text: string; url?: string }[]
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': name,
    'description': description,
    'image': imageUrl,
    'step': steps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step.name,
      'text': step.text,
      'url': step.url
    }))
  };
};

export default SchemaOrg;
