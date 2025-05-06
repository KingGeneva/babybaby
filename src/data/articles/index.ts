
import { nutritionArticles } from './nutrition';
import { amenagementArticles } from './amenagement';
import { sommeilArticles } from './sommeil';
import { developpementArticles } from './developpement';
import { preparationArticles } from './preparation';
import { Article } from '@/types/article';
import { supabase } from '@/integrations/supabase/client';

// Combine all articles from different categories
export const articles: Article[] = [
  ...nutritionArticles,
  ...amenagementArticles,
  ...sommeilArticles,
  ...developpementArticles,
  ...preparationArticles
].sort((a, b) => b.id - a.id); // Sort by ID in descending order (newest first)

export * from './nutrition';
export * from './amenagement';
export * from './sommeil';
export * from './developpement';
export * from './preparation';

// This function helps to find an article by ID
export const getArticleById = async (id: number): Promise<Article | undefined> => {
  // First, check in static articles
  const staticArticle = articles.find(article => article.id === id);
  if (staticArticle) return staticArticle;
  
  // Then, try to load from Supabase Storage
  try {
    // Try to find a JSON file with the article ID
    const { data, error } = await supabase
      .storage
      .from('articles')
      .download(`articles/${id}.json`);
      
    if (error || !data) return undefined;
    
    // Read JSON file content
    const text = await data.text();
    const article: Article = JSON.parse(text);
    
    return article;
  } catch (error) {
    console.error('Error loading article from storage:', error);
    return undefined;
  }
};

// This function helps to get articles by category
export const getArticlesByCategory = async (category: string): Promise<Article[]> => {
  let result = [...articles];
  
  // Filter by category if not "Tous"
  if (category !== "Tous") {
    result = result.filter(article => article.category === category);
  }
  
  // Try to load additional articles from Supabase Storage
  try {
    // List JSON files in articles folder
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
  
  // Sort by ID in descending order to have the most recent first
  result = result.sort((a, b) => b.id - a.id);
  
  return result;
};
