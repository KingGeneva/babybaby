
import { useState, useEffect } from 'react';
import { Article } from '@/types/article';
import { articles as allArticles } from '@/data/articles';

export const useSeriesArticles = (seriesId?: string) => {
  const [articles, setArticles] = useState<Array<{id: number; title: string; position: number;}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seriesId) {
      setArticles([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Trouver tous les articles de la même série
      const seriesArticles = allArticles
        .filter(article => article.series?.id === seriesId)
        .map(article => ({
          id: article.id,
          title: article.title,
          position: article.series?.position || 0
        }))
        .sort((a, b) => a.position - b.position);

      setArticles(seriesArticles);
    } catch (err) {
      console.error('Error loading series articles:', err);
      setError('Impossible de charger les articles de cette série');
    } finally {
      setLoading(false);
    }
  }, [seriesId]);

  return { articles, loading, error };
};
