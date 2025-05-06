
import { supabase } from '@/integrations/supabase/client';
import { ForumTopic } from '../types';
import { GenericSupabaseResponse } from '../utils/supabaseTypes';

/**
 * Récupère tous les sujets d'une catégorie
 */
export const getTopicsByCategoryId = async (
  categoryId: number, 
  page = 1, 
  limit = 10
): Promise<ForumTopic[]> => {
  try {
    const offset = (page - 1) * limit;
    
    const response: GenericSupabaseResponse<ForumTopic[]> = await supabase
      .from('forum_topics')
      .select(`
        *,
        user:user_id (id, username, avatar_url),
        category:category_id (id, name, slug),
        posts:forum_posts (count)
      `)
      .eq('category_id', categoryId)
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (response.error) {
      throw new Error(`Erreur lors de la récupération des sujets: ${response.error.message}`);
    }

    return response.data || [];
  } catch (error) {
    console.error('Erreur dans getTopicsByCategoryId:', error);
    return [];
  }
};

/**
 * Récupère un sujet par son ID
 */
export const getTopicById = async (topicId: number): Promise<ForumTopic | null> => {
  try {
    const response: GenericSupabaseResponse<ForumTopic[]> = await supabase
      .from('forum_topics')
      .select(`
        *,
        user:user_id (id, username, avatar_url),
        category:category_id (id, name, slug)
      `)
      .eq('id', topicId)
      .single();

    if (response.error) {
      throw new Error(`Erreur lors de la récupération du sujet: ${response.error.message}`);
    }

    return response.data || null;
  } catch (error) {
    console.error('Erreur dans getTopicById:', error);
    return null;
  }
};

/**
 * Crée un nouveau sujet
 */
export const createTopic = async (topic: Partial<ForumTopic>): Promise<ForumTopic | null> => {
  try {
    const response: GenericSupabaseResponse<ForumTopic[]> = await supabase
      .from('forum_topics')
      .insert([topic])
      .select(`
        *,
        user:user_id (id, username, avatar_url),
        category:category_id (id, name, slug)
      `)
      .single();

    if (response.error) {
      throw new Error(`Erreur lors de la création du sujet: ${response.error.message}`);
    }

    return response.data || null;
  } catch (error) {
    console.error('Erreur dans createTopic:', error);
    return null;
  }
};

/**
 * Met à jour un sujet
 */
export const updateTopic = async (topicId: number, updates: Partial<ForumTopic>): Promise<ForumTopic | null> => {
  try {
    const response: GenericSupabaseResponse<ForumTopic[]> = await supabase
      .from('forum_topics')
      .update(updates)
      .eq('id', topicId)
      .select(`
        *,
        user:user_id (id, username, avatar_url),
        category:category_id (id, name, slug)
      `)
      .single();

    if (response.error) {
      throw new Error(`Erreur lors de la mise à jour du sujet: ${response.error.message}`);
    }

    return response.data || null;
  } catch (error) {
    console.error('Erreur dans updateTopic:', error);
    return null;
  }
};

/**
 * Supprime un sujet
 */
export const deleteTopic = async (topicId: number): Promise<boolean> => {
  try {
    const response = await supabase
      .from('forum_topics')
      .delete()
      .eq('id', topicId);

    if (response.error) {
      throw new Error(`Erreur lors de la suppression du sujet: ${response.error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Erreur dans deleteTopic:', error);
    return false;
  }
};

/**
 * Récupère le nombre total de sujets dans une catégorie
 */
export const getTopicCountForCategory = async (categoryId: number): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('forum_topics')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId);

    if (error) {
      throw new Error(`Erreur lors du comptage des sujets: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error('Erreur dans getTopicCountForCategory:', error);
    return 0;
  }
};

/**
 * Récupère les sujets récents
 */
export const getRecentTopics = async (limit = 5): Promise<ForumTopic[]> => {
  try {
    const response: GenericSupabaseResponse<ForumTopic[]> = await supabase
      .from('forum_topics')
      .select(`
        *,
        user:user_id (id, username, avatar_url),
        category:category_id (id, name, slug)
      `)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (response.error) {
      throw new Error(`Erreur lors de la récupération des sujets récents: ${response.error.message}`);
    }

    return response.data || [];
  } catch (error) {
    console.error('Erreur dans getRecentTopics:', error);
    return [];
  }
};
