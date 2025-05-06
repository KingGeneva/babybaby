
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ForumPost, ForumTopic } from './types';

interface ForumTopicStructuredDataProps {
  topic: ForumTopic;
  posts: ForumPost[];
  url: string;
  categoryName: string;
}

const ForumTopicStructuredData: React.FC<ForumTopicStructuredDataProps> = ({
  topic,
  posts,
  url,
  categoryName,
}) => {
  // 1. FAQPage Schema - Traiter le sujet de forum comme une FAQ
  // Cette structure aide Google à afficher le contenu sous forme de rich snippets dans les résultats de recherche
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": topic.title,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": topic.content,
          "dateCreated": topic.created_at,
          "upvoteCount": topic.likes_count || 0,
          "author": {
            "@type": "Person",
            "name": "Utilisateur BabyBaby"
          }
        }
      }
    ]
  };

  // 2. DiscussionForumPosting Schema - Structure de données spécifique aux forums
  const discussionSchema = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": topic.title,
    "description": topic.meta_description || topic.content.substring(0, 160),
    "datePublished": topic.created_at,
    "dateModified": posts && posts.length > 0 
      ? posts[posts.length - 1].created_at 
      : topic.created_at,
    "author": {
      "@type": "Person",
      "name": "Utilisateur BabyBaby"
    },
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/ViewAction",
        "userInteractionCount": String(topic.views_count || 0)
      },
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": String(posts?.length || 0) 
      },
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/LikeAction",
        "userInteractionCount": String(topic.likes_count || 0)
      }
    ],
    "comment": posts && posts.map(post => ({
      "@type": "Comment",
      "text": post.content,
      "dateCreated": post.created_at,
      "upvoteCount": post.likes_count || 0,
      "author": {
        "@type": "Person",
        "name": "Utilisateur BabyBaby"
      }
    }))
  };

  // 3. BreadcrumbList Schema - Amélioration de la navigation et du contexte
  const breadcrumbSchema = {
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
        "name": "Forum",
        "item": "https://babybaby.app/forum"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": categoryName,
        "item": `https://babybaby.app/forum/categories/${topic.category_id}`
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": topic.title,
        "item": url
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(discussionSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      
      {/* Métadonnées spécifiques pour améliorer le SEO des pages de sujet de forum */}
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={topic.created_at} />
      <meta property="article:section" content={categoryName} />
      <meta name="twitter:label1" content="Réponses" />
      <meta name="twitter:data1" content={String(posts?.length || 0)} />
      <meta name="twitter:label2" content="Vues" />
      <meta name="twitter:data2" content={String(topic.views_count || 0)} />
    </Helmet>
  );
};

export default ForumTopicStructuredData;
