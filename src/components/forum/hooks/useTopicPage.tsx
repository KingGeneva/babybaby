
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getTopicById, 
  incrementTopicViews, 
  getPosts, 
  createPost, 
  likeTopic, 
  likePost 
} from '@/components/forum/forumService';
import { ForumTopic, ForumPost } from '@/components/forum/types';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useTopicPage = (topicId?: string) => {
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

  return {
    topic,
    posts,
    loading,
    page,
    totalPages,
    replyContent,
    setReplyContent,
    submitting,
    handlePageChange,
    handleSubmitReply,
    handleLikeTopic,
    handleLikePost
  };
};
