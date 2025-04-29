
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ArticleStructuredDataProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  publisherName?: string;
  publisherLogo?: string;
  url: string;
  category?: string;
  tags?: string[];
}

const ArticleStructuredData: React.FC<ArticleStructuredDataProps> = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName = "BabyBaby",
  authorUrl = "https://babybaby.app/about",
  publisherName = "BabyBaby",
  publisherLogo = "https://lovable.dev/opengraph-image-p98pqg.png",
  url,
  category = "Parentalité",
  tags = [],
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: category,
    keywords: tags.join(", ")
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default ArticleStructuredData;
