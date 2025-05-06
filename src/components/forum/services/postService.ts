
import { supabase } from '@/integrations/supabase/client';
import { ForumPost } from '../types';
import { GenericSupabaseResponse } from '../utils/supabaseTypes';

/**
 * Récupère les posts d'un sujet
 */
export const getPostsByTopicId = async (topicId: number, page = 1, limit = 10): Promise<ForumPost[]> => {
  try {
    const offset = (page - 1) * limit;
    
    const response: GenericSupabaseResponse<ForumPost[]> = await supabase
      .from('forum_posts')
      .select(`
        *,
        user:user_id (id, username, email, avatar_url, created_at)
      `)
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (response.error) {
      throw new Error(`Erreur lors de la récupération des posts: ${response.error.message}`);
    }

    return response.data || [];
  } catch (error) {
    console.error('Erreur dans getPostsByTopicId:', error);
    return [];
  }
};

/**
 * Récupère un post par son ID
 */
export const getPostById = async (postId: number): Promise<ForumPost | null> => {
  try {
    const response: GenericSupabaseResponse<ForumPost[]> = await supabase
      .from('forum_posts')
      .select(`
        *,
        user:user_id (id, username, email, avatar_url, created_at)
      `)
      .eq('id', postId)
      .single();

    if (response.error) {
      throw new Error(`Erreur lors de la récupération du post: ${response.error.message}`);
    }

    return response.data || null;
  } catch (error) {
    console.error('Erreur dans getPostById:', error);
    return null;
  }
};

/**
 * Crée un nouveau post
 */
export const createPost = async (post: Partial<ForumPost>): Promise<ForumPost | null> => {
  try {
    const response: GenericSupabaseResponse<ForumPost[]> = await supabase
      .from('forum_posts')
      .insert([post])
      .select(`
        *,
        user:user_id (id, username, email, avatar_url, created_at)
      `)
      .single();

    if (response.error) {
      throw new Error(`Erreur lors de la création du post: ${response.error.message}`);
    }

    return response.data || null;
  } catch (error) {
    console.error('Erreur dans createPost:', error);
    return null;
  }
};

/**
 * Met à jour un post
 */
export const updatePost = async (postId: number, updates: Partial<ForumPost>): Promise<ForumPost | null> => {
  try {
    const response: GenericSupabaseResponse<ForumPost[]> = await supabase
      .from('forum_posts')
      .update(updates)
      .eq('id', postId)
      .select(`
        *,
        user:user_id (id, username, email, avatar_url, created_at)
      `)
      .single();

    if (response.error) {
      throw new Error(`Erreur lors de la mise à jour du post: ${response.error.message}`);
    }

    return response.data || null;
  } catch (error) {
    console.error('Erreur dans updatePost:', error);
    return null;
  }
};

/**
 * Supprime un post
 */
export const deletePost = async (postId: number): Promise<boolean> => {
  try {
    const response = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', postId);

    if (response.error) {
      throw new Error(`Erreur lors de la suppression du post: ${response.error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Erreur dans deletePost:', error);
    return false;
  }
};

/**
 * Récupère le nombre de posts d'un sujet
 */
export const getPostCountForTopic = async (topicId: number): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('forum_posts')
      .select('*', { count: 'exact', head: true })
      .eq('topic_id', topicId);

    if (error) {
      throw new Error(`Erreur lors du comptage des posts: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error('Erreur dans getPostCountForTopic:', error);
    return 0;
  }
};
