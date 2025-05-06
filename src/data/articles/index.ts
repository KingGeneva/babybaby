
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
];

export * from './nutrition';
export * from './amenagement';
export * from './sommeil';
export * from './developpement';
export * from './preparation';

// This function helps to find an article by ID
export const getArticleById = async (id: number): Promise<Article | undefined> => {
  // D'abord, chercher dans les articles statiques
  const staticArticle = articles.find(article => article.id === id);
  if (staticArticle) return staticArticle;
  
  // Ensuite, essayer de charger depuis Supabase Storage
  try {
    // Essayer de trouver un fichier JSON avec l'ID de l'article
    const { data, error } = await supabase
      .storage
      .from('articles')
      .download(`articles/${id}.json`);
      
    if (error || !data) return undefined;
    
    // Lire le contenu du fichier JSON
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
  
  // Filtrer par catégorie si ce n'est pas "Tous"
  if (category !== "Tous") {
    result = result.filter(article => article.category === category);
  }
  
  // Essayer de charger des articles supplémentaires depuis Supabase Storage
  try {
    // Lister les fichiers JSON dans le dossier articles
    const { data: files, error } = await supabase
      .storage
      .from('articles')
      .list('articles');
      
    if (!error && files && files.length > 0) {
      // Filtrer les fichiers JSON
      const jsonFiles = files.filter(file => file.name.endsWith('.json'));
      
      // Charger et analyser chaque fichier JSON
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
      
      // Ajouter les articles valides qui correspondent à la catégorie
      const validStorageArticles = storageArticles.filter((a): a is Article => 
        a !== null && (category === "Tous" || a.category === category)
      );
      
      result = [...result, ...validStorageArticles];
    }
  } catch (error) {
    console.error('Error loading articles from storage:', error);
  }
  
  // Trier par ID décroissant pour avoir les plus récents en premier
  result = result.sort((a, b) => b.id - a.id);
  
  return result;
};
