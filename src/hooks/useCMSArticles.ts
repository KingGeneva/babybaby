import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Article } from '@/types/article';

interface CMSArticle {
  id: number;
  title: string;
  content: string;
  summary: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  reading_time: number;
  tags: string[];
  author: string;
  author_id?: string;
  featured?: boolean;
  views?: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useCMSArticles = () => {
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les articles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createArticle = async (article: Omit<CMSArticle, 'id' | 'date' | 'views'>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userData.user?.id)
        .single();

      const { data, error } = await supabase
        .from('cms_articles')
        .insert({
          ...article,
          author_id: userData.user?.id,
          author: profile?.full_name || 'Anonyme',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Article créé avec succès',
      });

      await fetchArticles();
      return data;
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'article',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateArticle = async (id: number, updates: Partial<CMSArticle>) => {
    try {
      const { error } = await supabase
        .from('cms_articles')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Article mis à jour avec succès',
      });

      await fetchArticles();
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour l\'article',
        variant: 'destructive',
      });
    }
  };

  const deleteArticle = async (id: number) => {
    try {
      const { error } = await supabase
        .from('cms_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Article supprimé avec succès',
      });

      await fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'article',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    createArticle,
    updateArticle,
    deleteArticle,
    refreshArticles: fetchArticles,
  };
};
