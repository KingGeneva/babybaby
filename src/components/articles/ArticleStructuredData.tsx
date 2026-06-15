
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
  keywords?: string[];
  wordCount?: number;
  inLanguage?: string;
}

const ArticleStructuredData: React.FC<ArticleStructuredDataProps> = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  url,
  category,
  keywords,
  wordCount,
  inLanguage = 'fr-CA',
}) => {
  const articleSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "inLanguage": inLanguage,
    "author": {
      "@type": "Person",
      "name": authorName,
    },
    "publisher": {
      "@type": "Organization",
      "name": "BabyBaby",
      "logo": {
        "@type": "ImageObject",
        "url": "https://babybaby.org/__l5e/assets-v1/7f28394d-9670-4734-b87e-6cc9cc307285/logo-babybaby.png",
        "width": "192",
        "height": "192",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
  };

  if (category) articleSchema.articleSection = category;
  if (keywords && keywords.length > 0) articleSchema.keywords = keywords.join(', ');
  if (wordCount && wordCount > 0) articleSchema.wordCount = wordCount;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
    </Helmet>
  );
};

export default ArticleStructuredData;
