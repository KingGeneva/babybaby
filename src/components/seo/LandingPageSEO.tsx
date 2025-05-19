
import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import SchemaOrg, { 
  buildBreadcrumbSchema, 
  buildArticleSchema,
  buildFAQSchema,
  buildHowToSchema
} from '@/components/seo/SchemaOrg';
import HreflangTags from '@/components/seo/HreflangTags';
import { Helmet } from 'react-helmet-async';

interface FAQ {
  question: string;
  answer: string;
}

interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

interface LandingPageSEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string[];
  imageUrl: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  category?: string;
  faqs?: FAQ[];
  howTo?: {
    name: string;
    description: string;
    steps: HowToStep[];
  };
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>;
  alternateLanguages?: Array<{
    lang: string;
    url: string;
  }>;
  videosData?: Array<{
    name: string;
    description: string;
    thumbnailUrl: string;
    contentUrl: string;
    uploadDate: string;
    duration: string;
  }>;
  additionalKeywords?: string[];
  excludeFromSearch?: boolean;
}

/**
 * Composant optimisé pour les pages d'atterrissage (landing pages)
 * Intégre plusieurs schémas et optimisations SEO avancées
 */
const LandingPageSEO: React.FC<LandingPageSEOProps> = ({
  title,
  description,
  canonicalUrl,
  keywords,
  imageUrl,
  datePublished,
  dateModified = new Date().toISOString(),
  author = "BabyBaby",
  category,
  faqs,
  howTo,
  breadcrumbs,
  alternateLanguages = [],
  videosData = [],
  additionalKeywords = [],
  excludeFromSearch = false
}) => {
  // Construire la liste complète des mots-clés
  const allKeywords = [...keywords, ...additionalKeywords];
  
  // Construire les schémas structurés
  const schemas = [
    // Schéma d'article
    buildArticleSchema(
      title,
      description,
      canonicalUrl,
      imageUrl,
      datePublished,
      dateModified,
      author
    ),
    
    // Schéma de fil d'Ariane
    buildBreadcrumbSchema(breadcrumbs)
  ];
  
  // Ajouter le schéma FAQ si présent
  if (faqs && faqs.length > 0) {
    schemas.push(buildFAQSchema(faqs));
  }
  
  // Ajouter le schéma HowTo si présent
  if (howTo) {
    schemas.push(buildHowToSchema(
      howTo.name,
      howTo.description,
      imageUrl,
      howTo.steps
    ));
  }
  
  // Schéma pour les vidéos
  if (videosData.length > 0) {
    videosData.forEach(video => {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": video.name,
        "description": video.description,
        "thumbnailUrl": video.thumbnailUrl,
        "contentUrl": video.contentUrl,
        "uploadDate": video.uploadDate,
        "duration": video.duration,
        "publisher": {
          "@type": "Organization",
          "name": "BabyBaby",
          "logo": {
            "@type": "ImageObject",
            "url": "https://babybaby.app/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
            "width": "192",
            "height": "192"
          }
        }
      });
    });
  }

  return (
    <>
      <SEOHead 
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        ogType="article"
        ogImage={imageUrl}
        keywords={allKeywords}
        alternateLanguages={alternateLanguages}
        articleData={{
          publishedTime: datePublished,
          modifiedTime: dateModified,
          author: author,
          tags: keywords,
          section: category
        }}
        noIndex={excludeFromSearch}
      />
      
      <HreflangTags
        currentLang="fr"
        currentUrl={canonicalUrl}
        alternateLanguages={alternateLanguages}
      />
      
      <SchemaOrg schemas={schemas} />
      
      <Helmet>
        {/* Balises supplémentaires pour le référencement */}
        <link rel="author" href={`https://babybaby.app/auteurs/${author.toLowerCase().replace(/\s+/g, '-')}`} />
        {category && <link rel="category" href={`https://babybaby.app/categories/${category.toLowerCase().replace(/\s+/g, '-')}`} />}
        
        {/* Balises temporelles pour indiquer la fraîcheur du contenu */}
        <meta name="article:published_time" content={datePublished} />
        <meta name="article:modified_time" content={dateModified} />
        
        {/* Amélioration de la préconnexion des ressources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://babybaby.app" />
        
        {/* Métadonnées pour les réseaux sociaux avancées */}
        <meta property="og:article:published_time" content={datePublished} />
        <meta property="og:article:modified_time" content={dateModified} />
        <meta property="og:article:author" content={author} />
        {category && <meta property="og:article:section" content={category} />}
        {keywords.map((keyword, index) => (
          <meta key={index} property="og:article:tag" content={keyword} />
        ))}
        
        {/* Balises sociales étendues */}
        <meta name="twitter:label1" content="Écrit par" />
        <meta name="twitter:data1" content={author} />
        <meta name="twitter:label2" content="Temps de lecture" />
        <meta name="twitter:data2" content="8 minutes" />
        
        {/* Balises supplémentaires pour boosters SEO */}
        <meta name="robots" content={excludeFromSearch ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
        <meta name="googlebot" content={excludeFromSearch ? "noindex, nofollow" : "index, follow"} />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
      </Helmet>
    </>
  );
};

export default LandingPageSEO;
