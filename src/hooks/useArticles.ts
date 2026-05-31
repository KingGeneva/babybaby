
import { useState, useEffect } from 'react';
import { Article } from '@/types/article';
import { articles as staticArticles } from '@/data/articles';
import { supabase } from '@/integrations/supabase/client';

type SortableArticle = Article & { __fileTimestamp?: number };

const frenchMonths: Record<string, number> = {
  janvier: 0, fevrier: 1, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, aout: 7, août: 7, septembre: 8, octobre: 9, novembre: 10, decembre: 11, décembre: 11,
};

const getArticleDateTimestamp = (date: string) => {
  const parsed = Date.parse(date);
  if (!Number.isNaN(parsed)) return parsed;

  const normalized = date.trim().toLowerCase();
  const match = normalized.match(/^(\d{1,2})\s+([a-zéû]+)\s+(\d{4})$/i);
  if (!match) return 0;

  const [, day, month, year] = match;
  const monthIndex = frenchMonths[month];
  return monthIndex === undefined ? 0 : Date.UTC(Number(year), monthIndex, Number(day));
};

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
        let result: SortableArticle[] = staticArticles.map(article => ({ ...article, __fileTimestamp: 0 }));
        
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
                    const article = JSON.parse(text) as Article;
                    const metadata = file as { updated_at?: string; created_at?: string };
                    const fileTimestamp = Date.parse(metadata.updated_at || metadata.created_at || '');
                    return {
                      ...article,
                      __fileTimestamp: Number.isNaN(fileTimestamp) ? 0 : fileTimestamp,
                    } as SortableArticle;
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

        // Sort by article date first, then by storage update date for articles published the same day.
        result = result.sort((a, b) => {
          const dateDiff = getArticleDateTimestamp(b.date) - getArticleDateTimestamp(a.date);
          if (dateDiff !== 0) return dateDiff;

          const fileDiff = (b.__fileTimestamp || 0) - (a.__fileTimestamp || 0);
          if (fileDiff !== 0) return fileDiff;

          return b.id - a.id;
        });
        
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
