
import { supabase } from "@/integrations/supabase/client";
import { 
  ForumCategory, 
  ForumTopic, 
  ForumPost, 
  PaginationParams, 
  PaginatedResponse 
} from "./types";
import { toast } from "@/components/ui/use-toast";

// Limit for pagination
const DEFAULT_LIMIT = 10;

// Forum categories
export const getCategories = async (): Promise<ForumCategory[]> => {
  try {
    const { data, error } = await supabase
      .from("forum_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error loading categories:", error);
      throw error;
    }

    return data as ForumCategory[] || [];
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
};

export const getCategoryBySlug = async (slug: string): Promise<ForumCategory | null> => {
  try {
    const { data, error } = await supabase
      .from("forum_categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Error loading category:", error);
      throw error;
    }

    return data as ForumCategory;
  } catch (error) {
    console.error("Error in getCategoryBySlug:", error);
    return null;
  }
};

// Forum topics
export const getTopics = async (
  categoryId?: string, 
  pagination: PaginationParams = { page: 1, limit: DEFAULT_LIMIT }
): Promise<PaginatedResponse<ForumTopic>> => {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  try {
    // Base query
    let query = supabase
      .from("forum_topics")
      .select(`
        *,
        posts_count:forum_posts(count),
        likes_count:forum_likes(count)
      `, { count: 'exact' })
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    // Add category filter if needed
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    // Get topics with pagination
    const { data, error, count } = await query
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error loading topics:", error);
      throw error;
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
      data: data as ForumTopic[] || [],
      total: count || 0,
      page,
      limit,
      totalPages
    };
  } catch (error) {
    console.error("Error in getTopics:", error);
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0
    };
  }
};

export const getTopicById = async (id: string): Promise<ForumTopic | null> => {
  try {
    const { data, error } = await supabase
      .from("forum_topics")
      .select(`
        *,
        posts_count:forum_posts(count),
        likes_count:forum_likes(count)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error loading topic:", error);
      throw error;
    }

    if (data) {
      // Increment views
      await incrementTopicViews(id);
    }

    return data as ForumTopic;
  } catch (error) {
    console.error("Error in getTopicById:", error);
    return null;
  }
};

export const createTopic = async (
  title: string,
  content: string,
  categoryId: string
): Promise<ForumTopic | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour créer un sujet",
        variant: "destructive",
      });
      return null;
    }

    // Generate slug for SEO
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/gi, '-')
      .substring(0, 60);

    const { data, error } = await supabase
      .from("forum_topics")
      .insert({
        title,
        content,
        category_id: categoryId,
        user_id: userData.user.id,
        slug: slug, // Add slug for SEO
        meta_description: content.substring(0, 160) // First 160 chars as meta description
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error creating topic:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le sujet. Veuillez réessayer.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Succès",
      description: "Votre sujet a été créé.",
    });

    return data as ForumTopic;
  } catch (error) {
    console.error("Error in createTopic:", error);
    return null;
  }
};

// Forum posts (replies)
export const getPosts = async (
  topicId: string,
  pagination: PaginationParams = { page: 1, limit: DEFAULT_LIMIT }
): Promise<PaginatedResponse<ForumPost>> => {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  try {
    const { data, error, count } = await supabase
      .from("forum_posts")
      .select(`
        *,
        likes_count:forum_likes(count)
      `, { count: "exact" })
      .eq("topic_id", topicId)
      .order("created_at", { ascending: true })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error loading posts:", error);
      throw error;
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
      data: data as ForumPost[] || [],
      total: count || 0,
      page,
      limit,
      totalPages
    };
  } catch (error) {
    console.error("Error in getPosts:", error);
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0
    };
  }
};

export const createPost = async (
  content: string,
  topicId: string
): Promise<ForumPost | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour répondre",
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase
      .from("forum_posts")
      .insert({
        content,
        topic_id: topicId,
        user_id: userData.user.id,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Erreur",
        description: "Impossible de publier votre réponse. Veuillez réessayer.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Succès",
      description: "Votre réponse a été publiée.",
    });

    return data as ForumPost;
  } catch (error) {
    console.error("Error in createPost:", error);
    return null;
  }
};

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
      })
      .select();

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
      .eq("user_id", userData.user.id);

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
      })
      .select();

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
      .eq("user_id", userData.user.id);

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

// Function to increment topic views
export const incrementTopicViews = async (topicId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .rpc('increment_topic_views', { topic_id: topicId });

    if (error) {
      console.error("Error incrementing views:", error);
    }
  } catch (error) {
    console.error("Error in incrementTopicViews:", error);
  }
};

// Function to get user profile
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error loading profile:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
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
      .in(field, itemIds);

    if (error) {
      console.error("Error checking likes:", error);
      return {};
    }

    return data.reduce((acc, like) => {
      acc[like[field]] = true;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error in checkUserLikes:", error);
    return {};
  }
};
