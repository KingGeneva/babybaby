
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

// Catégories du forum
export const getCategories = async (): Promise<ForumCategory[]> => {
  const { data, error } = await supabase
    .from("forum_categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Erreur lors du chargement des catégories:", error);
    throw error;
  }

  return data || [];
};

export const getCategoryBySlug = async (slug: string): Promise<ForumCategory | null> => {
  const { data, error } = await supabase
    .from("forum_categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") { // Not found
      console.error("Erreur lors du chargement de la catégorie:", error);
      throw error;
    }
    return null;
  }

  return data;
};

// Sujets du forum
export const getTopics = async (
  categoryId?: string, 
  pagination: PaginationParams = { page: 1, limit: DEFAULT_LIMIT }
): Promise<PaginatedResponse<ForumTopic>> => {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  // Requête de base
  const baseQuery = supabase
    .from("forum_topics")
    .select(`
      *,
      category:forum_categories(*),
      posts_count:forum_posts(count),
      likes_count:forum_likes(count)
    `)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  // Ajouter le filtre par catégorie si nécessaire
  const query = categoryId 
    ? baseQuery.eq("category_id", categoryId)
    : baseQuery;

  // Récupérer les sujets avec pagination
  const { data, error, count } = await query
    .limit(limit)
    .range(offset, offset + limit - 1)
    .returns<ForumTopic[]>();

  if (error) {
    console.error("Erreur lors du chargement des sujets:", error);
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
};

export const getTopicById = async (id: string): Promise<ForumTopic | null> => {
  const { data, error } = await supabase
    .from("forum_topics")
    .select(`
      *,
      category:forum_categories(*),
      posts_count:forum_posts(count),
      likes_count:forum_likes(count)
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code !== "PGRST116") { // Not found
      console.error("Erreur lors du chargement du sujet:", error);
      throw error;
    }
    return null;
  }

  // Increment les vues
  await incrementTopicViews(id);

  return data;
};

export const createTopic = async (
  title: string,
  content: string,
  categoryId: string
): Promise<ForumTopic | null> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    toast({
      title: "Erreur d'authentification",
      description: "Vous devez être connecté pour créer un sujet",
      variant: "destructive",
    });
    return null;
  }

  const { data, error } = await supabase
    .from("forum_topics")
    .insert({
      title,
      content,
      category_id: categoryId,
      user_id: userData.user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création du sujet:", error);
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

  return data;
};

// Posts (réponses) du forum
export const getPosts = async (
  topicId: string,
  pagination: PaginationParams = { page: 1, limit: DEFAULT_LIMIT }
): Promise<PaginatedResponse<ForumPost>> => {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

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
    console.error("Erreur lors du chargement des réponses:", error);
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
};

export const createPost = async (
  content: string,
  topicId: string
): Promise<ForumPost | null> => {
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
    .single();

  if (error) {
    console.error("Erreur lors de la création de la réponse:", error);
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

  return data;
};

// Gestion des likes
export const likeTopic = async (topicId: string): Promise<boolean> => {
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
      // L'utilisateur a déjà aimé ce sujet, suppression du like
      return await unlikeTopic(topicId);
    }
    
    console.error("Erreur lors de l'ajout du like:", error);
    return false;
  }

  return true;
};

export const unlikeTopic = async (topicId: string): Promise<boolean> => {
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
    console.error("Erreur lors de la suppression du like:", error);
    return false;
  }

  return true;
};

export const likePost = async (postId: string): Promise<boolean> => {
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
      // L'utilisateur a déjà aimé cette réponse, suppression du like
      return await unlikePost(postId);
    }
    
    console.error("Erreur lors de l'ajout du like:", error);
    return false;
  }

  return true;
};

export const unlikePost = async (postId: string): Promise<boolean> => {
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
    console.error("Erreur lors de la suppression du like:", error);
    return false;
  }

  return true;
};

// Fonction pour incrémenter les vues d'un sujet
export const incrementTopicViews = async (topicId: string): Promise<void> => {
  const { error } = await supabase
    .rpc('increment_topic_views', { topic_id: topicId });

  if (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error);
  }
};

// Fonction pour obtenir le profil utilisateur
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Erreur lors du chargement du profil:", error);
    throw error;
  }

  return data;
};

// Fonction pour vérifier si un utilisateur a aimé un sujet ou une réponse
export const checkUserLikes = async (userId: string, itemIds: string[], type: 'topic' | 'post') => {
  if (!userId || itemIds.length === 0) return {};
  
  const field = type === 'topic' ? 'topic_id' : 'post_id';
  
  const { data, error } = await supabase
    .from("forum_likes")
    .select("*")
    .eq("user_id", userId)
    .in(field, itemIds);

  if (error) {
    console.error("Erreur lors de la vérification des likes:", error);
    return {};
  }

  return data.reduce((acc, like) => {
    acc[like[field]] = true;
    return acc;
  }, {});
};
