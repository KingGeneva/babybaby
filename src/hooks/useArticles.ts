
import { useState, useEffect } from 'react';
import { Article } from '@/types/article';
import { articles as staticArticles } from '@/data/articles';
import { supabase } from '@/integrations/supabase/client';

export const useArticles = (category: string = "Tous", searchTerm: string = "") => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First get static articles
        let result = [...staticArticles];
        
        // Filter by category if not "Tous"
        if (category !== "Tous") {
          result = result.filter(article => article.category === category);
        }
        
        // Try to load additional articles from Supabase Storage
        try {
          // List JSON files in the articles folder
          const { data: files, error } = await supabase
            .storage
            .from('articles')
            .list('articles');
            
          if (!error && files && files.length > 0) {
            // Filter JSON files
            const jsonFiles = files.filter(file => file.name.endsWith('.json'));
            
            // Load and parse each JSON file
            const storageArticles = await Promise.all(
              jsonFiles.map(async (file) => {
                try {
                  const { data } = await supabase
                    .storage
                    .from('articles')
                    .download(`articles/${file.name}`);
                    
                  if (data) {
                    const text = await data.text();
                    return JSON.parse(text) as Article;
                  }
                } catch (err) {
                  console.error(`Error loading article ${file.name}:`, err);
                }
                return null;
              })
            );
            
            // Add valid storage articles that match the category
            const validStorageArticles = storageArticles.filter((a): a is Article => 
              a !== null && (category === "Tous" || a.category === category)
            );
            
            result = [...result, ...validStorageArticles];
          }
        } catch (error) {
          console.error('Error loading articles from storage:', error);
        }
        
        // Apply search filter if search term provided
        if (searchTerm) {
          const lowerSearchTerm = searchTerm.toLowerCase();
          result = result.filter(article => 
            article.title.toLowerCase().includes(lowerSearchTerm) || 
            article.excerpt.toLowerCase().includes(lowerSearchTerm)
          );
        }

        // Trier les articles par ID décroissant (plus récents en premier)
        result = result.sort((a, b) => b.id - a.id);
        
        setArticles(result);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [category, searchTerm]);

  return { articles, loading, error };
};
