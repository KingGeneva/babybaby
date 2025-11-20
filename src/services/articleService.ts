import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/article';

/**
 * Service pour gérer les articles via l'Edge Function
 */
export const articleService = {
  /**
   * Lister tous les articles
   */
  async listArticles(): Promise<Article[]> {
    const { data, error } = await supabase.functions.invoke('manage-articles', {
      body: { action: 'list' }
    });

    if (error) throw error;
    return data.articles;
  },

  /**
   * Créer un nouvel article
   */
  async createArticle(articleData: Omit<Article, 'id'>): Promise<Article> {
    const { data, error } = await supabase.functions.invoke('manage-articles', {
      body: { 
        action: 'create',
        articleData 
      }
    });

    if (error) throw error;
    return data.article;
  },

  /**
   * Mettre à jour un article
   */
  async updateArticle(articleId: number, articleData: Partial<Article>): Promise<void> {
    const { error } = await supabase.functions.invoke('manage-articles', {
      body: { 
        action: 'update',
        articleId,
        articleData 
      }
    });

    if (error) throw error;
  },

  /**
   * Supprimer un article
   */
  async deleteArticle(articleId: number): Promise<void> {
    const { error } = await supabase.functions.invoke('manage-articles', {
      body: { 
        action: 'delete',
        articleId 
      }
    });

    if (error) throw error;
  }
};

// Exemple d'utilisation:
// 
// import { articleService } from '@/services/articleService';
// 
// // Lister
// const articles = await articleService.listArticles();
// 
// // Créer
// const newArticle = await articleService.createArticle({
//   title: "Mon article",
//   content: "Contenu...",
//   category: "Nutrition",
//   // ... autres champs
// });
// 
// // Mettre à jour
// await articleService.updateArticle(123, { title: "Nouveau titre" });
// 
// // Supprimer
// await articleService.deleteArticle(123);
