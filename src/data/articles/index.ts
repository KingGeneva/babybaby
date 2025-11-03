
import { nutritionArticles } from './nutrition';
import { amenagementArticles } from './amenagement';
import { sommeilArticles } from './sommeil';
import { developpementArticles } from './developpement';
import { preparationArticles } from './preparation';
import { croissanceArticles } from './croissance';
import { Article } from '@/types/article';
import { supabase } from '@/integrations/supabase/client';

// Cache local pour les articles avec TTL amélioré
const articleCache = new Map<number, { data: Article, timestamp: number }>();
const categoryCache = new Map<string, { data: Article[], timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const CACHE_VERSION = 1; // Incrémenter pour invalider tous les caches

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
  articleCache.set(article.id, { data: article, timestamp: Date.now() });
});

export * from './nutrition';
export * from './amenagement';
export * from './sommeil';
export * from './developpement';
export * from './preparation';
export * from './croissance';

// Vérifier si un élément du cache est encore valide
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_TTL;
};

// This function helps to find an article by ID with cache
export const getArticleById = async (id: number): Promise<Article | undefined> => {
  // Check localStorage first for better performance (for featured articles)
  const cachedArticlesStr = localStorage.getItem('cached-articles');
  if (cachedArticlesStr) {
    try {
      const cachedArticles = JSON.parse(cachedArticlesStr) as Article[];
      const localCachedArticle = cachedArticles.find(a => a.id === id);
      if (localCachedArticle) {
        // Refresh cache en arrière-plan si nécessaire
        const cachedTimestamp = parseInt(localStorage.getItem('cached-articles-timestamp') || '0');
        if (Date.now() - cachedTimestamp > CACHE_TTL) {
          setTimeout(() => fetchArticleAndUpdateCache(id), 100);
        }
        return localCachedArticle;
      }
    } catch (err) {
      // Silent fail, continue with other cache mechanisms
    }
  }
  
  // Check memory cache
  const cachedArticle = articleCache.get(id);
  if (cachedArticle && isCacheValid(cachedArticle.timestamp)) {
    return cachedArticle.data;
  }
  
  // Then, try to find in static articles (fastest)
  const staticArticle = articles.find(article => article.id === id);
  if (staticArticle) {
    articleCache.set(id, { data: staticArticle, timestamp: Date.now() });
    return staticArticle;
  }
  
  // Finally, try to load from Supabase Storage
  return fetchArticleAndUpdateCache(id);
};

// Helper function to fetch article and update cache
const fetchArticleAndUpdateCache = async (id: number): Promise<Article | undefined> => {
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
    articleCache.set(id, { data: article, timestamp: Date.now() });
    
    // Service Worker caching if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_ARTICLE',
        url: `/articles/${id}`,
        data: article
      });
    }
    
    return article;
  } catch (error) {
    console.error('Error loading article from storage:', error);
    return undefined;
  }
};

// This function helps to get articles by category with cache
export const getArticlesByCategory = async (category: string): Promise<Article[]> => {
  // Check memory cache first
  const cachedCategory = categoryCache.get(category);
  if (cachedCategory && isCacheValid(cachedCategory.timestamp)) {
    return cachedCategory.data;
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
  categoryCache.set(category, { data: result, timestamp: Date.now() });
  
  return result;
};

// Helper to invalidate cache when needed (e.g. after adding new article)
export const invalidateArticleCache = () => {
  articleCache.clear();
  categoryCache.clear();
  localStorage.removeItem('cached-articles');
  localStorage.removeItem('cached-articles-timestamp');
  
  // Re-populate with static articles
  articles.forEach(article => {
    articleCache.set(article.id, { data: article, timestamp: Date.now() });
  });
};

// Mise à jour progressive du cache en arrière-plan
export const preloadPopularCategories = () => {
  // Préchargement des catégories populaires en arrière-plan
  if ('requestIdleCallback' in window) {
    // @ts-ignore
    window.requestIdleCallback(() => {
      const popularCategories = ["Tous", "Nutrition", "Sommeil", "Développement"];
      popularCategories.forEach(category => {
        getArticlesByCategory(category);
      });
    }, { timeout: 3000 });
  }
};
