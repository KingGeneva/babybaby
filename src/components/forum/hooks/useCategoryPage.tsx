
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForumCategory, ForumTopic } from '@/components/forum/types';
import { getCategoryBySlug, getTopics } from '@/components/forum/forumService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const useCategoryPage = (slug?: string) => {
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  return {
    category,
    topics,
    loading,
    page,
    totalPages,
    handlePageChange,
    handleCreateTopic,
    formatDate
  };
};
