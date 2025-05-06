
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ForumCategory, ForumTopic } from '@/components/forum/types';
import { getCategoryBySlug, getTopics } from '@/components/forum/forumService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Heart, 
  Clock, 
  Eye,
  Pin,
  Lock,
  ChevronLeft,
  PlusCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import ForumPagination from '@/components/forum/ForumPagination';

const ForumCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryAndTopics = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const categoryData = await getCategoryBySlug(slug);
        
        if (!categoryData) {
          navigate('/forum');
          return;
        }
        
        setCategory(categoryData);
        
        const topicsResponse = await getTopics(categoryData.id, { page, limit: 10 });
        setTopics(topicsResponse.data);
        setTotalPages(topicsResponse.totalPages);
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement de la catégorie:", error);
        setLoading(false);
      }
    };

    fetchCategoryAndTopics();
  }, [slug, page, navigate]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleCreateTopic = () => {
    if (!category) return;
    navigate(`/forum/new-topic/${category.id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: fr
      });
    } catch (e) {
      return dateString;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6 text-babybaby-cosmic">Forum des Parents</h1>
            <p className="text-lg mb-8">Connectez-vous pour accéder au forum et partager avec d'autres parents.</p>
            <Button onClick={() => navigate('/auth')} size="lg">
              Se connecter
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babybaby-cosmic"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-normal p-0"
                      onClick={() => navigate('/forum')}
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Forum
                    </Button>
                    <span className="text-gray-400">•</span>
                    <h1 className="text-2xl font-bold text-babybaby-cosmic">{category?.name}</h1>
                  </div>
                  <p className="text-gray-600">{category?.description}</p>
                </div>
                <Button 
                  className="mt-4 md:mt-0 bg-babybaby-cosmic hover:bg-babybaby-cosmic/90" 
                  onClick={handleCreateTopic}
                >
                  <PlusCircle size={18} className="mr-2" />
                  Nouvelle discussion
                </Button>
              </div>

              {topics.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-4">Aucune discussion dans cette catégorie</h3>
                  <p className="text-gray-600 mb-6">Soyez le premier à lancer une discussion !</p>
                  <Button 
                    className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90" 
                    onClick={handleCreateTopic}
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Nouvelle discussion
                  </Button>
                </div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {topics.map(topic => (
                    <motion.div key={topic.id} variants={itemVariants}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <Link to={`/forum/topics/${topic.id}`} className="block">
                                <div className="flex items-center gap-2">
                                  {topic.is_pinned && (
                                    <Pin size={16} className="text-orange-500" />
                                  )}
                                  {topic.is_locked && (
                                    <Lock size={16} className="text-gray-500" />
                                  )}
                                  <h3 className="text-lg font-medium text-babybaby-cosmic truncate hover:text-babybaby-cosmic/80">
                                    {topic.title}
                                  </h3>
                                </div>
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                  {topic.content}
                                </p>
                              </Link>
                            </div>
                            <div className="flex flex-col items-end ml-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1.5">
                                <Eye size={14} />
                                <span>{topic.views_count}</span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <MessageCircle size={14} />
                                <span>{topic.posts_count || 0}</span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Heart size={14} className={topic.has_liked ? "text-red-500 fill-red-500" : ""} />
                                <span>{topic.likes_count || 0}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center justify-between mt-4 text-xs">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-babybaby-cosmic border-babybaby-cosmic/30">
                                {category?.name}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock size={14} />
                              <span>{formatDate(topic.created_at)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {totalPages > 1 && (
                <div className="mt-8">
                  <ForumPagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForumCategoryPage;
