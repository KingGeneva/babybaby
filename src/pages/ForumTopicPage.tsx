
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ForumTopic, ForumPost } from '@/components/forum/types';
import { 
  getTopicById, 
  incrementTopicViews 
} from '@/components/forum/services/topicService';
import { getPosts, createPost } from '@/components/forum/services/postService';
import { likeTopic, likePost } from '@/components/forum/services/likeService';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import TopicHeader from '@/components/forum/components/TopicHeader';
import TopicReplies from '@/components/forum/components/TopicReplies';
import ReplyForm from '@/components/forum/components/ReplyForm';
import AuthNotice from '@/components/forum/components/AuthNotice';
import { useForumFormatters } from '@/components/forum/hooks/useForumFormatters';

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
  const { formatDate, formatExactDate, getInitials } = useForumFormatters();

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

  if (!user) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="pt-24 pb-20 px-4">
          <AuthNotice />
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
            <div className="mb-8">
              <TopicHeader
                topic={topic}
                formatDate={formatDate}
                formatExactDate={formatExactDate}
                handleLikeTopic={handleLikeTopic}
              />
              
              <TopicReplies
                posts={posts}
                page={page}
                totalPages={totalPages}
                formatDate={formatDate}
                formatExactDate={formatExactDate}
                handleLikePost={handleLikePost}
                handlePageChange={handlePageChange}
                getInitials={getInitials}
              />
              
              {!topic?.is_locked && (
                <ReplyForm
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  handleSubmitReply={handleSubmitReply}
                  submitting={submitting}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForumTopicPage;
