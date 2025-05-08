
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
  wordCount?: number;
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
  publisherLogo = "https://babybaby.app/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
  url,
  category = "Parentalité",
  tags = [],
  wordCount,
}) => {
  // Calcul du word count si non fourni
  const estimatedWordCount = wordCount || description.split(" ").length + (title.split(" ").length * 2);
  
  // Normalization des URLs pour s'assurer qu'elles sont absolues
  const absoluteImage = image.startsWith('http') ? image : `https://babybaby.app${image}`;
  const absoluteUrl = url.startsWith('http') ? url : `https://babybaby.app${url}`;
  const absolutePublisherLogo = publisherLogo.startsWith('http') ? publisherLogo : `https://babybaby.app${publisherLogo}`;
  
  // Structured data améliorée pour les articles
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": absoluteImage,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": authorUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": {
        "@type": "ImageObject",
        "url": absolutePublisherLogo,
        "width": "192",
        "height": "192"
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": absoluteUrl,
    },
    "articleSection": category,
    "keywords": tags.join(", "),
    "wordCount": estimatedWordCount,
    "inLanguage": "fr-FR",
    "isAccessibleForFree": "True"
  };

  // FAQ schema pour les articles qui contiennent potentiellement des Q&A
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Comment suivre la croissance de mon bébé?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BabyBaby vous permet de suivre facilement la croissance de votre bébé. Enregistrez le poids, la taille et le périmètre crânien à chaque visite médicale pour visualiser les courbes de croissance."
        }
      },
      {
        "@type": "Question",
        "name": "À quelle fréquence dois-je enregistrer les données de croissance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Il est recommandé d'enregistrer les données à chaque visite médicale ou mensuelle pour les six premiers mois, puis tous les 3 mois jusqu'à l'âge de 2 ans."
        }
      },
      {
        "@type": "Question",
        "name": "Comment interpréter les courbes de croissance de mon bébé?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Les courbes de croissance montrent la progression de votre bébé par rapport aux standards. L'important est que votre bébé suive sa propre courbe de façon constante, pas nécessairement qu'il soit dans la moyenne."
        }
      }
    ]
  };

  // BreadcrumbList schema pour améliorer le contexte de navigation
  const breadcrumbStructuredData = {
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
        "name": "Articles",
        "item": "https://babybaby.app/articles"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category,
        "item": `https://babybaby.app/articles?category=${encodeURIComponent(category)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": title
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </script>
    </Helmet>
  );
};

export default ArticleStructuredData;
