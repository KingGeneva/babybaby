
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Like management
export const likeTopic = async (topicId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour aimer un sujet",
        variant: "destructive",
      });
      return false;
    }

    const { data, error } = await supabase
      .from("forum_likes")
      .insert({
        topic_id: topicId,
        user_id: userData.user.id,
      } as unknown as any)
      .select() as unknown as { data: any, error: any };

    if (error) {
      if (error.code === "23505") { // Duplicate key error
        // User already liked this topic, remove the like
        return await unlikeTopic(topicId);
      }
      
      console.error("Error adding like:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in likeTopic:", error);
    return false;
  }
};

export const unlikeTopic = async (topicId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return false;
    }

    const { error } = await supabase
      .from("forum_likes")
      .delete()
      .eq("topic_id", topicId)
      .eq("user_id", userData.user.id) as unknown as { error: any };

    if (error) {
      console.error("Error removing like:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in unlikeTopic:", error);
    return false;
  }
};

export const likePost = async (postId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour aimer une réponse",
        variant: "destructive",
      });
      return false;
    }

    const { data, error } = await supabase
      .from("forum_likes")
      .insert({
        post_id: postId,
        user_id: userData.user.id,
      } as unknown as any)
      .select() as unknown as { data: any, error: any };

    if (error) {
      if (error.code === "23505") { // Duplicate key error
        // User already liked this post, remove the like
        return await unlikePost(postId);
      }
      
      console.error("Error adding like:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in likePost:", error);
    return false;
  }
};

export const unlikePost = async (postId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return false;
    }

    const { error } = await supabase
      .from("forum_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userData.user.id) as unknown as { error: any };

    if (error) {
      console.error("Error removing like:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in unlikePost:", error);
    return false;
  }
};

// Function to check if a user has liked a topic or post
export const checkUserLikes = async (userId: string, itemIds: string[], type: 'topic' | 'post') => {
  if (!userId || itemIds.length === 0) return {};
  
  try {
    const field = type === 'topic' ? 'topic_id' : 'post_id';
    
    const { data, error } = await supabase
      .from("forum_likes")
      .select("*")
      .eq("user_id", userId)
      .in(field, itemIds) as unknown as { data: any[] | null, error: any };

    if (error) {
      console.error("Error checking likes:", error);
      return {};
    }

    return data?.reduce((acc, like) => {
      acc[like[field]] = true;
      return acc;
    }, {}) || {};
  } catch (error) {
    console.error("Error in checkUserLikes:", error);
    return {};
  }
};
