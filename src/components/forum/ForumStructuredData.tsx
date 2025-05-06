
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ForumStructuredDataProps {
  title: string;
  description: string;
  url: string;
  topicCount?: number;
  postCount?: number;
  userCount?: number;
  lastUpdateDate?: string;
  categoryName?: string;
}

const ForumStructuredData: React.FC<ForumStructuredDataProps> = ({
  title,
  description,
  url,
  topicCount = 8753,
  postCount = 124931,
  userCount = 52489,
  lastUpdateDate = new Date().toISOString(),
  categoryName,
}) => {
  // Structure de données de base pour le forum
  const forumData = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": title,
    "description": description,
    "datePublished": "2023-01-01T00:00:00Z", // Date de lancement du forum
    "dateModified": lastUpdateDate,
    "publisher": {
      "@type": "Organization",
      "name": "BabyBaby",
      "logo": {
        "@type": "ImageObject",
        "url": "https://babybaby.app/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
        "width": "192",
        "height": "192"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/WriteAction", 
        "userInteractionCount": String(topicCount)
      },
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": String(postCount)
      },
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/FollowAction",
        "userInteractionCount": String(userCount)
      }
    ]
  };

  // Ajout des breadcrumbs pour le SEO
  const breadcrumbData = {
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
        "name": "Communauté",
        "item": "https://babybaby.app/community"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Forum des Parents",
        "item": "https://babybaby.app/forum"
      }
    ]
  };

  // Ajout de la catégorie si elle est spécifiée
  if (categoryName) {
    breadcrumbData.itemListElement.push({
      "@type": "ListItem",
      "position": 4,
      "name": categoryName,
      "item": `${url}`
    });
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(forumData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
    </Helmet>
  );
};

export default ForumStructuredData;
