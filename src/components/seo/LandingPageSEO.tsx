
import React from 'react';
import { Helmet } from 'react-helmet-async';
import SchemaOrg from './SchemaOrg';

interface LandingPageSEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string[];
  image?: string;
  publishedDate?: string;
  modifiedDate?: string;
  authorName?: string;
}

/**
 * Composant pour optimiser le SEO des pages d'accueil
 * Inclut tous les éléments nécessaires pour un bon référencement
 */
const LandingPageSEO: React.FC<LandingPageSEOProps> = ({
  title,
  description,
  canonicalUrl,
  keywords,
  image = "https://babybaby.app/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
  publishedDate = new Date().toISOString(),
  modifiedDate = new Date().toISOString(),
  authorName = "BabyBaby"
}) => {
  // Construction du breadcrumb pour cette page
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://babybaby.app" },
    { name: title, url: canonicalUrl }
  ]);

  // Construction d'un article schema pour cette page
  const articleSchema = buildArticleSchema(
    title,
    description,
    canonicalUrl,
    image,
    publishedDate,
    modifiedDate,
    authorName
  );

  // Construction du schema WebSite
  const websiteSchema = buildWebsiteSchema();

  return (
    <Helmet>
      {/* Balises META de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Balises META pour les réseaux sociaux */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="BabyBaby" />

      {/* Balises META Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Balises META spécifiques à la SEO */}
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={authorName} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Balises pour Google */}
      <meta name="googlebot" content="index, follow" />
      <meta name="google" content="nositelinkssearchbox" />
      <meta name="google" content="notranslate" />

      {/* Gestion des dates pour le SEO */}
      <meta property="article:published_time" content={publishedDate} />
      <meta property="article:modified_time" content={modifiedDate} />

      {/* Schema.org JSON-LD pour les breadcrumbs et l'article */}
      <SchemaOrg schemas={[breadcrumbSchema, articleSchema, websiteSchema]} />
    </Helmet>
  );
};

// Fonctions pour construire les schémas

function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
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
}

function buildArticleSchema(
  title: string,
  description: string,
  url: string,
  imageUrl: string,
  datePublished: string,
  dateModified: string,
  authorName: string
) {
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
}

function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'BabyBaby',
    'url': 'https://babybaby.app',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://babybaby.app/recherche?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export default LandingPageSEO;
