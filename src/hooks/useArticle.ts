
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Article } from '@/types/article';
import { articles } from '@/data/articles';
import { supabase } from '@/integrations/supabase/client';

export const useArticle = (articleId: number) => {
  const navigate = useNavigate();
  
  // Format date for structured data with more robust parsing
  const formatDateForStructuredData = (dateString: string) => {
    try {
      // French month names to number mapping
      const monthMap: Record<string, string> = {
        'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
        'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
        'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
      };
      
      // Parse date in format like "15 avril 2025"
      const parts = dateString.split(' ');
      if (parts.length !== 3) {
        throw new Error('Invalid date format');
      }
      
      const day = parts[0].padStart(2, '0');
      const month = monthMap[parts[1].toLowerCase()];
      const year = parts[2];
      
      if (!day || !month || !year) {
        throw new Error('Invalid date components');
      }
      
      // Create a valid ISO date string (YYYY-MM-DD)
      return `${year}-${month}-${day}T12:00:00.000Z`;
    } catch (error) {
      console.error('Error parsing date:', error);
      // Return a fallback valid ISO date
      return new Date().toISOString();
    }
  };
  
  // Get article data
  const getArticleData = async (id: number): Promise<Article | undefined> => {
    try {
      // First check static articles
      const staticArticle = articles.find(article => article.id === id);
      if (staticArticle) return staticArticle;
      
      // Then check Supabase
      try {
        const { data, error } = await supabase
          .storage
          .from('articles')
          .download(`articles/${id}.json`);
          
        if (error || !data) return undefined;
        
        // Read the content of the file JSON
        const text = await data.text();
        const article: Article = JSON.parse(text);
        
        return article;
      } catch (error) {
        console.error('Error loading article from Supabase:', error);
        return undefined;
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      return undefined;
    }
  };

  return {
    getArticleData,
    formatDateForStructuredData
  };
};
