
import { supabase } from '@/integrations/supabase/client';
import { ForumTopic } from '../types';
import { getRecentDiscussions } from '../forumService';

/**
 * Récupère les sujets d'une catégorie
 */
export const getTopicsByCategory = async (categoryId: number): Promise<ForumTopic[]> => {
  try {
    // Pour l'instant on utilise des sujets simulés
    const allTopics = await getRecentDiscussions(10);
    return allTopics.filter(topic => topic.category_id === categoryId);
  } catch (error) {
    console.error('Erreur dans getTopicsByCategory:', error);
    return [];
  }
};

/**
 * Récupère un sujet par son ID
 */
export const getTopicById = async (topicId: string): Promise<ForumTopic | null> => {
  try {
    const allTopics = await getRecentDiscussions(10);
    return allTopics.find(topic => topic.id === topicId) || null;
  } catch (error) {
    console.error('Erreur dans getTopicById:', error);
    return null;
  }
};

/**
 * Crée un nouveau sujet
 */
export const createTopic = async (
  title: string,
  content: string,
  categoryId: number,
  userId: string
): Promise<ForumTopic | null> => {
  try {
    // Simuler la création d'un sujet
    const newTopic: ForumTopic = {
      id: Math.random().toString(36).substring(2, 15),
      title,
      content,
      user_id: userId,
      category_id: categoryId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views_count: 0,
      replies_count: 0,
      last_reply_at: new Date().toISOString(),
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      is_pinned: false,
      is_locked: false,
      user: {
        id: userId,
        username: "Utilisateur",
        avatar_url: "/placeholder.svg"
      }
    };
    
    return newTopic;
  } catch (error) {
    console.error('Erreur dans createTopic:', error);
    return null;
  }
};

/**
 * Incrémente le nombre de vues d'un sujet
 */
export const incrementTopicView = async (topicId: string): Promise<boolean> => {
  try {
    // Simuler l'incrémentation des vues
    console.log(`Vues incrémentées pour le sujet ${topicId}`);
    return true;
  } catch (error) {
    console.error('Erreur dans incrementTopicView:', error);
    return false;
  }
};
