
import { supabase } from '@/integrations/supabase/client';

/**
 * Like un sujet
 */
export const likeTopic = async (topicId: string): Promise<boolean> => {
  try {
    console.log(`Liké le sujet ${topicId}`);
    return true;
  } catch (error) {
    console.error('Erreur dans likeTopic:', error);
    return false;
  }
};

/**
 * Unlike un sujet
 */
export const unlikeTopic = async (topicId: string): Promise<boolean> => {
  try {
    console.log(`Unlike le sujet ${topicId}`);
    return true;
  } catch (error) {
    console.error('Erreur dans unlikeTopic:', error);
    return false;
  }
};

/**
 * Like un post
 */
export const likePost = async (postId: string): Promise<boolean> => {
  try {
    console.log(`Liké le post ${postId}`);
    return true;
  } catch (error) {
    console.error('Erreur dans likePost:', error);
    return false;
  }
};

/**
 * Unlike un post
 */
export const unlikePost = async (postId: string): Promise<boolean> => {
  try {
    console.log(`Unlike le post ${postId}`);
    return true;
  } catch (error) {
    console.error('Erreur dans unlikePost:', error);
    return false;
  }
};
