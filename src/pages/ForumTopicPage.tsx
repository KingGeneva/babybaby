
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ForumTopic, ForumPost } from '@/components/forum/types';
import { 
  getTopicById, 
  incrementTopicViews 
} from '@/components/forum/services/topicService';
import { getPosts, createPost } from '@/components/forum/services/postService';
import { likeTopic, likePost } from '@/components/forum/services/likeService';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Heart, 
  Clock, 
  Eye,
  ChevronLeft,
  Pin,
  Lock,
  User,
  ThumbsUp
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import ForumPagination from '@/components/forum/ForumPagination';
import ForumEditor from '@/components/forum/ForumEditor';

const ForumTopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopicAndPosts = async () => {
      if (!topicId) return;
      
      try {
        setLoading(true);
        const topicData = await getTopicById(topicId);
        
        if (!topicData) {
          navigate('/forum');
          return;
        }
        
        setTopic(topicData);
        
        const postsResponse = await getPosts(topicId, { page, limit: 10 });
        setPosts(postsResponse.data);
        setTotalPages(postsResponse.totalPages);
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement du sujet:", error);
        setLoading(false);
      }
    };

    fetchTopicAndPosts();
  }, [topicId, page, navigate]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim() || !topicId || !user) {
      return;
    }
    
    try {
      setSubmitting(true);
      const newPost = await createPost(replyContent, topicId);
      
      if (newPost) {
        setReplyContent('');
        
        // Recharger les posts ou ajouter le nouveau post à la liste
        const postsResponse = await getPosts(topicId, { page, limit: 10 });
        setPosts(postsResponse.data);
        setTotalPages(postsResponse.totalPages);

        // Si nous sommes sur une page autre que la dernière, naviguer vers la dernière page
        if (page !== postsResponse.totalPages) {
          setPage(postsResponse.totalPages);
        }
        
        toast({
          title: "Réponse publiée",
          description: "Votre réponse a été publiée avec succès",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la publication de la réponse:", error);
      toast({
        title: "Erreur",
        description: "Impossible de publier votre réponse. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeTopic = async () => {
    if (!topicId || !user) return;
    
    try {
      await likeTopic(topicId);
      
      // Mise à jour locale du like
      setTopic(prev => {
        if (!prev) return prev;
        
        const hasLiked = !prev.has_liked;
        const likesCount = (prev.likes_count || 0) + (hasLiked ? 1 : -1);
        
        return {
          ...prev,
          has_liked: hasLiked,
          likes_count: likesCount
        };
      });
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;
    
    try {
      await likePost(postId);
      
      // Mise à jour locale du like
      setPosts(prev => prev.map(post => {
        if (post.id !== postId) return post;
        
        const hasLiked = !post.has_liked;
        const likesCount = (post.likes_count || 0) + (hasLiked ? 1 : -1);
        
        return {
          ...post,
          has_liked: hasLiked,
          likes_count: likesCount
        };
      }));
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
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

  const formatExactDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  const getInitials = (name: string = 'Utilisateur') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-normal p-0"
                    onClick={() => topic?.category?.slug ? 
                      navigate(`/forum/categories/${topic.category.slug}`) : 
                      navigate('/forum')}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    {topic?.category?.name || 'Forum'}
                  </Button>
                </div>
                
                <div className="mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        {topic?.is_pinned && <Pin size={16} className="text-orange-500" />}
                        {topic?.is_locked && <Lock size={16} className="text-gray-500" />}
                        <CardTitle className="text-2xl font-bold text-babybaby-cosmic">{topic?.title}</CardTitle>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>{topic?.user?.username || 'Utilisateur'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span title={formatExactDate(topic?.created_at || '')}>
                            {formatDate(topic?.created_at || '')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{topic?.views_count || 0} vues</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={14} />
                          <span>{topic?.posts_count || 0} réponses</span>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {topic?.category?.name}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-4">
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: topic?.content || '' }} />
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0 pb-3">
                      <div></div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleLikeTopic}
                        className={topic?.has_liked ? "text-red-500 border-red-200" : ""}
                      >
                        <Heart 
                          size={16} 
                          className={`mr-1 ${topic?.has_liked ? "fill-red-500 text-red-500" : ""}`} 
                        />
                        J'aime {topic?.likes_count ? `(${topic.likes_count})` : ''}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Réponses {posts.length > 0 ? `(${posts.length})` : ''}
                  </h2>
                  
                  {posts.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg bg-gray-50">
                      <MessageCircle size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Aucune réponse pour le moment.</p>
                      <p className="text-gray-600">Soyez le premier à répondre !</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post, index) => (
                        <Card key={post.id} id={`post-${post.id}`} className="relative">
                          <CardContent className="p-5">
                            <div className="flex gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={post.user?.avatar_url} alt={post.user?.username || 'Utilisateur'} />
                                <AvatarFallback>{getInitials(post.user?.username)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                  <div className="font-medium">
                                    {post.user?.username || 'Utilisateur'}
                                  </div>
                                  <div className="text-sm text-gray-500" title={formatExactDate(post.created_at)}>
                                    {formatDate(post.created_at)}
                                  </div>
                                </div>
                                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                                <div className="flex justify-end mt-3">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleLikePost(post.id)}
                                    className={post.has_liked ? "text-red-500" : "text-gray-500"}
                                  >
                                    <ThumbsUp 
                                      size={16} 
                                      className={`mr-1 ${post.has_liked ? "fill-red-500 text-red-500" : ""}`} 
                                    />
                                    {post.likes_count || 0}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <div className="absolute top-2 right-2 text-xs text-gray-400">
                            #{index + 1 + (page - 1) * 10}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {totalPages > 1 && (
                    <div className="mt-6">
                      <ForumPagination 
                        currentPage={page} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange} 
                      />
                    </div>
                  )}
                </div>
                
                {!topic?.is_locked && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Répondre</h3>
                    <Card>
                      <CardContent className="p-5">
                        <form onSubmit={handleSubmitReply}>
                          <ForumEditor 
                            value={replyContent}
                            onChange={setReplyContent}
                            placeholder="Votre réponse..."
                            minHeight="200px"
                          />
                          <div className="flex justify-end mt-4">
                            <Button 
                              type="submit" 
                              className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
                              disabled={!replyContent.trim() || submitting}
                            >
                              {submitting ? 'Publication...' : 'Publier'}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForumTopicPage;
