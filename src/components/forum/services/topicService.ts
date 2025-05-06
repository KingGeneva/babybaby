
import { supabase } from "@/integrations/supabase/client";
import { ForumTopic, PaginationParams, PaginatedResponse } from "../types";
import { toast } from "@/components/ui/use-toast";

// Limit for pagination
const DEFAULT_LIMIT = 10;

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
      .range(offset, offset + limit - 1) as unknown as { 
        data: ForumTopic[] | null, 
        error: any, 
        count: number | null 
      };

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
      .maybeSingle() as unknown as { data: ForumTopic | null, error: any };

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
      } as unknown as any)
      .select()
      .maybeSingle() as unknown as { data: ForumTopic | null, error: any };

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

// Function to increment topic views
export const incrementTopicViews = async (topicId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .rpc('increment_topic_views', { topic_id: topicId }) as unknown as { error: any };

    if (error) {
      console.error("Error incrementing views:", error);
    }
  } catch (error) {
    console.error("Error in incrementTopicViews:", error);
  }
};
