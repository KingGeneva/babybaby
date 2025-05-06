
import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, ArrowRight, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Helmet } from 'react-helmet-async';

// Sample data for forum discussions
const discussions = [
  {
    id: 1,
    title: "Comment gérer les coliques nocturnes",
    excerpt: "Mon bébé de 2 mois souffre de coliques pendant la nuit. Quelles astuces avez-vous trouvées efficaces ?",
    author: "MamanFatiguée",
    comments: 24,
    likes: 18,
    tags: ["Santé", "Sommeil", "0-3 mois"],
    lastActive: "Il y a 2h"
  },
  {
    id: 2,
    title: "Meilleurs livres pour enfants de 18 mois",
    excerpt: "Je cherche des recommandations de livres adaptés pour ma fille qui commence à s'intéresser aux histoires.",
    author: "Papa_Lecteur",
    comments: 15,
    likes: 27,
    tags: ["Développement", "Livres", "12-24 mois"],
    lastActive: "Il y a 6h"
  },
  {
    id: 3,
    title: "Voyage en avion avec un nourrisson",
    excerpt: "Nous prévoyons un vol long-courrier avec notre bébé de 5 mois. Des conseils pour que ça se passe bien ?",
    author: "FamilleVoyageuse",
    comments: 32,
    likes: 41,
    tags: ["Voyage", "Conseils", "3-6 mois"],
    lastActive: "Il y a 1j"
  }
];

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
              "@id": "https://babybaby.app/community"
            },
            "headline": "Forum communautaire BabyBaby",
            "description": "Échangez avec d'autres parents sur des sujets comme la grossesse, le développement et la santé des enfants.",
            "publisher": {
              "@type": "Organization",
              "name": "BabyBaby",
              "logo": {
                "@type": "ImageObject",
                "url": "https://babybaby.app/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png"
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
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto h-12 w-12 bg-babybaby-cosmic/10 rounded-full flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-babybaby-cosmic" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">
            Notre Communauté
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Rejoignez des milliers de parents qui s'entraident et partagent leurs expériences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Discussions récentes</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/forum" className="flex items-center gap-1">
                  Voir tout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {discussions.map((discussion) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-medium hover:text-babybaby-cosmic transition-colors">
                          <Link to={`/forum/topics/${discussion.id}`}>
                            {discussion.title}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Star className="h-4 w-4" />
                          <span>{discussion.likes}</span>
                          <MessageCircle className="h-4 w-4 ml-2" />
                          <span>{discussion.comments}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm my-3 line-clamp-2">
                        {discussion.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center justify-between mt-3">
                        <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
                          {discussion.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">Par <span className="font-medium">{discussion.author}</span></span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{discussion.lastActive}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4">Statistiques</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membres</span>
                    <span className="font-medium">52,489</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discussions</span>
                    <span className="font-medium">8,753</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commentaires</span>
                    <span className="font-medium">124,931</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">En ligne</span>
                    <span className="font-medium text-green-500">239</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full bg-babybaby-cosmic hover:bg-babybaby-cosmic/90" asChild>
                    <Link to="/forum">
                      Rejoindre la discussion
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForumSection;
