
import { supabase } from "@/integrations/supabase/client";
import { ForumPost, PaginationParams, PaginatedResponse } from "../types";
import { toast } from "@/components/ui/use-toast";
import { GenericSupabaseResponse, AnyTable } from "../utils/supabaseTypes";

// Limit for pagination
const DEFAULT_LIMIT = 10;

// Forum posts (replies)
export const getPosts = async (
  topicId: string,
  pagination: PaginationParams = { page: 1, limit: DEFAULT_LIMIT }
): Promise<PaginatedResponse<ForumPost>> => {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  try {
    // Cast supabase to allow any table name
    const supabaseAny = supabase as unknown as { from: (table: string) => AnyTable };

    const { data, error, count } = await supabaseAny
      .from("forum_posts")
      .select(`
        *,
        likes_count:forum_likes(count)
      `, { count: "exact" })
      .eq("topic_id", topicId)
      .order("created_at", { ascending: true })
      .limit(limit)
      .range(offset, offset + limit - 1) as GenericSupabaseResponse<ForumPost[]> & { count: number | null };

    if (error) {
      console.error("Error loading posts:", error);
      throw error;
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
      data: data || [],
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

    // Cast supabase to allow any table name
    const supabaseAny = supabase as unknown as { from: (table: string) => AnyTable };

    const { data, error } = await supabaseAny
      .from("forum_posts")
      .insert({
        content,
        topic_id: topicId,
        user_id: userData.user.id,
      })
      .select()
      .maybeSingle() as GenericSupabaseResponse<ForumPost>;

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

    return data || null;
  } catch (error) {
    console.error("Error in createPost:", error);
    return null;
  }
};
