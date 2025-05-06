
export interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  category?: ForumCategory;
  user?: ForumUser;
  posts_count?: number;
  likes_count?: number;
  has_liked?: boolean;
}

export interface ForumPost {
  id: string;
  content: string;
  user_id: string;
  topic_id: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  user?: ForumUser;
  likes_count?: number;
  has_liked?: boolean;
}

export interface ForumLike {
  id: string;
  user_id: string;
  post_id: string | null;
  topic_id: string | null;
  created_at: string;
}

export interface ForumUser {
  id: string;
  username?: string;
  avatar_url?: string;
  full_name?: string;
  created_at?: string;
  posts_count?: number;
  topics_count?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
