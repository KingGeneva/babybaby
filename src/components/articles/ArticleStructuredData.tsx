
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ArticleStructuredDataProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
  category?: string;
  tags?: string[];
  wordCount?: number;
  readingTime?: number;
}

const ArticleStructuredData: React.FC<ArticleStructuredDataProps> = ({
  title,
  description,
  image,
  datePublished,
  dateModified = datePublished,
  authorName,
  url,
  category,
  tags = [],
  wordCount = 1200,
  readingTime = 5
}) => {
  // Ensure the URL uses babybaby.org
  const normalizedUrl = url.replace("babybaby.app", "babybaby.org");
  const normalizedImage = image.replace("babybaby.app", "babybaby.org");
  
  // Create the article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": normalizedImage,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": "https://babybaby.org/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BabyBaby",
      "logo": {
        "@type": "ImageObject",
        "url": "https://babybaby.org/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
        "width": "192",
        "height": "192"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": normalizedUrl
    },
    "wordCount": wordCount,
    "timeRequired": `PT${readingTime}M`,
    "inLanguage": "fr-FR",
    "copyrightYear": datePublished.substring(0, 4)
  };

  // Add category and keywords to schema if provided
  if (category) {
    articleSchema["articleSection"] = category;
  }
  
  if (tags && tags.length > 0) {
    articleSchema["keywords"] = tags.join(", ");
  }

  // Create breadcrumb schema for the article
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://babybaby.org"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Articles",
        "item": "https://babybaby.org/articles"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category || "Article",
        "item": category ? `https://babybaby.org/articles?category=${category.toLowerCase()}` : "https://babybaby.org/articles"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": title,
        "item": normalizedUrl
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default ArticleStructuredData;
