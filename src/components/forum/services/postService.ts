
import { supabase } from '@/integrations/supabase/client';
import { ForumPost } from '../types';

/**
 * Récupère les posts d'un sujet
 */
export const getPostsByTopicId = async (topicId: string): Promise<ForumPost[]> => {
  try {
    // Simuler des posts pour un sujet
    return [
      {
        id: "post1",
        content: "C'est un excellent sujet, j'ai eu le même problème avec mon bébé.",
        user_id: "user3",
        topic_id: topicId,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        user: {
          id: "user3",
          username: "MamanExperimentée",
          avatar_url: "/placeholder.svg"
        },
        likes_count: 3,
        has_liked: false
      },
      {
        id: "post2",
        content: "Voici ce qui a fonctionné pour nous...",
        user_id: "user4",
        topic_id: topicId,
        created_at: new Date(Date.now() - 43200000).toISOString(),
        updated_at: new Date(Date.now() - 43200000).toISOString(),
        user: {
          id: "user4",
          username: "PapaNovice",
          avatar_url: "/placeholder.svg"
        },
        likes_count: 1,
        has_liked: false
      }
    ];
  } catch (error) {
    console.error('Erreur dans getPostsByTopicId:', error);
    return [];
  }
};

/**
 * Crée un nouveau post
 */
export const createPost = async (content: string, topicId: string): Promise<ForumPost | null> => {
  try {
    const userId = "simulated_user"; // Dans une vraie app, ce serait l'ID du user connecté
    
    const newPost: ForumPost = {
      id: Math.random().toString(36).substring(2, 15),
      content,
      user_id: userId,
      topic_id: topicId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: userId,
        username: "Utilisateur",
        avatar_url: "/placeholder.svg"
      },
      likes_count: 0,
      has_liked: false
    };
    
    return newPost;
  } catch (error) {
    console.error('Erreur dans createPost:', error);
    return null;
  }
};
