
import { nutritionArticles } from './nutrition';
import { amenagementArticles } from './amenagement';
import { sommeilArticles } from './sommeil';
import { developpementArticles } from './developpement';
import { preparationArticles } from './preparation';
import { croissanceArticles } from './croissance';
import { Article } from '@/types/article';
import { supabase } from '@/integrations/supabase/client';

// Cache local pour les articles
const articleCache = new Map<number, Article>();
const categoryCache = new Map<string, Article[]>();
let cacheExpiration = Date.now() + (15 * 60 * 1000); // 15 minutes

// Combine all articles from different categories
export const articles: Article[] = [
  ...nutritionArticles,
  ...amenagementArticles,
  ...sommeilArticles,
  ...developpementArticles,
  ...preparationArticles,
  ...croissanceArticles
].sort((a, b) => b.id - a.id); // Sort by ID in descending order (newest first)

// Pré-remplir le cache avec les articles statiques
articles.forEach(article => {
  articleCache.set(article.id, article);
});

export * from './nutrition';
export * from './amenagement';
export * from './sommeil';
export * from './developpement';
export * from './preparation';
export * from './croissance';

// This function helps to find an article by ID with cache
export const getArticleById = async (id: number): Promise<Article | undefined> => {
  // Check cache first
  if (articleCache.has(id)) {
    return articleCache.get(id);
  }
  
  // First, check in static articles
  const staticArticle = articles.find(article => article.id === id);
  if (staticArticle) {
    articleCache.set(id, staticArticle);
    return staticArticle;
  }
  
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
    
    // Cache the article
    articleCache.set(id, article);
    
    return article;
  } catch (error) {
    console.error('Error loading article from storage:', error);
    return undefined;
  }
};

// Refresh the cache every 15 minutes or when explicitly called
const refreshCache = () => {
  if (Date.now() > cacheExpiration) {
    articleCache.clear();
    categoryCache.clear();
    
    // Pre-fill with static articles
    articles.forEach(article => {
      articleCache.set(article.id, article);
    });
    
    cacheExpiration = Date.now() + (15 * 60 * 1000);
  }
};

// This function helps to get articles by category with cache
export const getArticlesByCategory = async (category: string): Promise<Article[]> => {
  // Check if we need to refresh the cache
  refreshCache();
  
  // Check cache first
  if (categoryCache.has(category)) {
    return categoryCache.get(category) || [];
  }
  
  let result = [...articles];
  
  // Filter by category if not "Tous"
  if (category !== "Tous") {
    result = result.filter(article => article.category === category);
  }
  
  // Try to load additional articles from Supabase Storage with error handling
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
            const { data, error: downloadError } = await supabase
              .storage
              .from('articles')
              .download(`articles/${file.name}`);
              
            if (downloadError) {
              // Gérer l'erreur silencieusement
              console.log(`Skip loading article ${file.name} due to permission error`);
              return null;
            }
              
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
  
  // Cache the result
  categoryCache.set(category, result);
  
  return result;
};

// Helper to invalidate cache when needed (e.g. after adding new article)
export const invalidateArticleCache = () => {
  articleCache.clear();
  categoryCache.clear();
  cacheExpiration = 0;
};
