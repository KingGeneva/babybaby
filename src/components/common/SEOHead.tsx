
import { Helmet } from 'react-helmet-async';
import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile' | 'book';
  lang?: string;
  alternateLanguages?: { lang: string; url: string }[];
  articleData?: {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
    section?: string;
  };
  productData?: {
    price?: string;
    currency?: string;
    availability?: 'in stock' | 'out of stock' | 'preorder';
    brand?: string;
  };
  keywords?: string[];
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonicalUrl, 
  ogImage = "https://babybaby.app/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png", 
  ogType = "website",
  lang = "fr",
  alternateLanguages = [],
  articleData,
  productData,
  keywords = ["suivi bébé", "croissance infantile", "santé bébé", "conseil parental", "développement enfant"],
  noIndex = false
}: SEOProps) => {
  const siteTitle = "BabyBaby - Application de suivi de bébé";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  const maxDescLength = 160;
  
  // Optimisation de la description pour respecter la longueur recommandée
  const optimizedDescription = description.length > maxDescLength 
    ? `${description.substring(0, maxDescLength - 3)}...` 
    : description;

  // Assurer que l'URL de l'image OG est absolue
  const absoluteOgImage = ogImage.startsWith('http') 
    ? ogImage 
    : `https://babybaby.app${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

  // Assurer que l'URL canonique est absolue
  const absoluteCanonicalUrl = canonicalUrl 
    ? (canonicalUrl.startsWith('http') ? canonicalUrl : `https://babybaby.app${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`)
    : undefined;
  
  // Create a clean object of HTML attributes to avoid null values
  const htmlAttributes = { lang };
  
  // Date de dernière modification pour les moteurs de recherche
  const lastModDate = articleData?.modifiedTime || new Date().toISOString();
  
  return (
    <Helmet htmlAttributes={htmlAttributes}>
      <title>{fullTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Meta tags améliorés */}
      <meta name="author" content={articleData?.author || "BabyBaby"} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      
      {/* Date de dernière modification pour les bots */}
      <meta name="lastmod" content={lastModDate} />
      
      {/* Performance & mobile optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://analytics.ahrefs.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://babybaby.boutique" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://babybaby.boutique" />
      
      {/* Canonical URL - crucial pour éviter le contenu dupliqué */}
      {absoluteCanonicalUrl && <link rel="canonical" href={absoluteCanonicalUrl} />}
      
      {/* Open Graph / Facebook avec propriétés étendues */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      {absoluteCanonicalUrl && <meta property="og:url" content={absoluteCanonicalUrl} />}
      <meta property="og:site_name" content="BabyBaby" />
      <meta property="og:locale" content={lang === "fr" ? "fr_FR" : "en_US"} />
      {alternateLanguages.map(alt => (
        <meta key={alt.lang} property="og:locale:alternate" content={alt.lang.includes('fr') ? `fr_${alt.lang.split('-')[1] || 'FR'}` : `en_${alt.lang.split('-')[1] || 'US'}`} />
      ))}
      
      {/* Twitter Card complet */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@babybaby_app" />
      <meta name="twitter:creator" content="@babybaby_app" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={absoluteOgImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:domain" content="babybaby.app" />
      <meta name="twitter:url" content={absoluteCanonicalUrl || "https://babybaby.app"} />
      
      {/* Article specific structured data */}
      {ogType === 'article' && articleData && (
        <>
          <meta property="article:published_time" content={articleData.publishedTime} />
          {articleData.modifiedTime && (
            <meta property="article:modified_time" content={articleData.modifiedTime} />
          )}
          {articleData.author && (
            <meta property="article:author" content={articleData.author} />
          )}
          {articleData.section && (
            <meta property="article:section" content={articleData.section} />
          )}
          {articleData.tags && articleData.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Product specific metadata */}
      {ogType === 'product' && productData && (
        <>
          {productData.price && (
            <meta property="product:price:amount" content={productData.price} />
          )}
          {productData.currency && (
            <meta property="product:price:currency" content={productData.currency} />
          )}
          {productData.availability && (
            <meta property="product:availability" content={productData.availability} />
          )}
          {productData.brand && (
            <meta property="product:brand" content={productData.brand} />
          )}
        </>
      )}
      
      {/* Mobile specific */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Prevent indexation in non-production environments */}
      {absoluteCanonicalUrl && !absoluteCanonicalUrl.includes('babybaby.app') && (
        <meta name="robots" content="noindex, nofollow" />
      )}
    </Helmet>
  );
};

export default SEOHead;
