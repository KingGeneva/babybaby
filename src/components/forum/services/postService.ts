
import { supabase } from '@/integrations/supabase/client';
import { ForumPost } from '../types';

/**
 * Récupère les messages d'un sujet
 */
export const getPostsByTopicId = async (topicId: string): Promise<ForumPost[]> => {
  try {
    // Simuler des messages pour un sujet
    return [
      {
        id: "p1",
        topic_id: topicId,
        content: "C'est un sujet très intéressant, merci de l'avoir partagé !",
        user_id: "user3",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        likes_count: 5,
        user: {
          id: "user3",
          username: "ConseillerParental",
          avatar_url: "/placeholder.svg"
        }
      },
      {
        id: "p2",
        topic_id: topicId,
        content: "Je suis d'accord avec le post précédent. J'ai personnellement trouvé que...",
        user_id: "user4",
        created_at: new Date(Date.now() - 43200000).toISOString(),
        updated_at: new Date(Date.now() - 43200000).toISOString(),
        likes_count: 2,
        user: {
          id: "user4",
          username: "MamanDeTrois",
          avatar_url: "/placeholder.svg"
        }
      }
    ];
  } catch (error) {
    console.error('Erreur dans getPostsByTopicId:', error);
    return [];
  }
};

/**
 * Crée un nouveau message
 */
export const createPost = async (
  topicId: string,
  content: string,
  userId: string
): Promise<ForumPost | null> => {
  try {
    // Simuler la création d'un message
    const newPost: ForumPost = {
      id: Math.random().toString(36).substring(2, 15),
      topic_id: topicId,
      content,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes_count: 0,
      user: {
        id: userId,
        username: "Utilisateur",
        avatar_url: "/placeholder.svg"
      }
    };
    
    return newPost;
  } catch (error) {
    console.error('Erreur dans createPost:', error);
    return null;
  }
};

/**
 * Ajoute un like à un message
 */
export const likePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    // Simuler l'ajout d'un like
    console.log(`Like added to post ${postId} by user ${userId}`);
    return true;
  } catch (error) {
    console.error('Erreur dans likePost:', error);
    return false;
  }
};

/**
 * Retire un like d'un message
 */
export const unlikePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    // Simuler le retrait d'un like
    console.log(`Like removed from post ${postId} by user ${userId}`);
    return true;
  } catch (error) {
    console.error('Erreur dans unlikePost:', error);
    return false;
  }
};
