
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ForumHeader from './components/ForumHeader';
import RecentDiscussions from './components/RecentDiscussions';
import ForumStats from './components/ForumStats';
import { mockDiscussions } from './data/mockDiscussions';

const ForumSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DiscussionForumPosting",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://babybaby.org/community"
            },
            "headline": "Forum communautaire BabyBaby",
            "description": "Échangez avec d'autres parents sur des sujets comme la grossesse, le développement et la santé des enfants.",
            "publisher": {
              "@type": "Organization",
              "name": "BabyBaby",
              "logo": {
                "@type": "ImageObject",
                "url": "https://babybaby.org/__l5e/assets-v1/645c44c5-bb3e-464d-bff9-39ccadd9b854/logo-babybaby.png"
              }
            },
            "interactionStatistic": [
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/CommentAction",
                "userInteractionCount": "5124"
              },
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/LikeAction",
                "userInteractionCount": "17542"
              }
            ]
          })}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4">
        <ForumHeader />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-3">
            <RecentDiscussions discussions={mockDiscussions} />
          </div>

          <div className="lg:col-span-1">
            <ForumStats />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForumSection;
