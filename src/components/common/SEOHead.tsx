
import { Helmet } from 'react-helmet-async';
import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  lang?: string;
  alternateLanguages?: { lang: string; url: string }[];
  articleData?: {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
    section?: string;
  };
  keywords?: string[];
}

const SEOHead: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonicalUrl, 
  ogImage = "https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png", 
  ogType = "website",
  lang = "fr",
  alternateLanguages = [],
  articleData,
  keywords = ["suivi bébé", "croissance infantile", "santé bébé", "conseil parental", "développement enfant"]
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
    : `https://babybaby.org${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

  // Assurer que l'URL canonique est absolue
  const absoluteCanonicalUrl = canonicalUrl 
    ? (canonicalUrl.startsWith('http') ? canonicalUrl : `https://babybaby.org${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`)
    : undefined;
  
  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{fullTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Meta tags améliorés */}
      <meta name="author" content="BabyBaby" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="revisit-after" content="3 days" />
      <meta name="rating" content="general" />
      
      {/* Performance & mobile optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://analytics.google.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://babybaby.boutique" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://babybaby.boutique" />
      
      {/* Canonical URL - crucial pour éviter le contenu dupliqué */}
      {absoluteCanonicalUrl && <link rel="canonical" href={absoluteCanonicalUrl} />}
      
      {/* Alternate language URLs */}
      {alternateLanguages.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {absoluteCanonicalUrl && <meta property="og:url" content={absoluteCanonicalUrl} />}
      <meta property="og:site_name" content="BabyBaby" />
      <meta property="og:locale" content={lang === "fr" ? "fr_FR" : "en_US"} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@babybaby_official" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={absoluteOgImage} />
      <meta name="twitter:creator" content="@babybaby_official" />
      <meta name="twitter:domain" content="babybaby.org" />
      
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
      
      {/* Mobile specific */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Prevent indexation in non-production environments */}
      {absoluteCanonicalUrl && !absoluteCanonicalUrl.includes('babybaby.org') && (
        <meta name="robots" content="noindex, nofollow" />
      )}
    </Helmet>
  );
};

export default SEOHead;
