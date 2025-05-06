
import { ForumTopic, ForumPost, ForumCategory, PaginationParams, PaginatedResponse } from './types';
import { getAllCategories, getCategoryBySlug, getCategoryById } from './services/categoryService';
import { getTopicsByCategory, getTopicById, createTopic, incrementTopicView } from './services/topicService';
import { getPostsByTopicId, createPost } from './services/postService';
import { likeTopic, unlikeTopic, likePost, unlikePost } from './services/likeService';

// Export all individual service functions
export {
  getAllCategories,
  getCategoryBySlug,
  getCategoryById,
  getTopicsByCategory,
  getTopicById,
  createTopic,
  getPostsByTopicId,
  createPost,
  likeTopic,
  unlikeTopic,
  likePost,
  unlikePost,
  incrementTopicView
};

// Main service function for forum data
export const getForumData = async () => {
  const categories = await getAllCategories();
  return { categories };
};

// Get recent discussions
export const getRecentDiscussions = async (limit: number = 5): Promise<ForumTopic[]> => {
  // Simulate recent discussions with mock data
  return [
    {
      id: "1",
      title: "Comment gérer les coliques de bébé ?",
      content: "Mon bébé souffre de coliques depuis une semaine...",
      user_id: "user1",
      category_id: 1,
      views_count: 47,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updated_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      replies_count: 8,
      last_reply_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      slug: "comment-gerer-coliques-bebe",
      is_pinned: false,
      is_locked: false,
      user: {
        id: "user1",
        username: "Parent2023",
        avatar_url: "/placeholder.svg"
      }
    },
    {
      id: "2",
      title: "Alimentation et diversification",
      content: "À quel âge avez-vous commencé la diversification ?",
      user_id: "user2",
      category_id: 2,
      views_count: 32,
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      replies_count: 5,
      last_reply_at: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
      slug: "alimentation-et-diversification",
      is_pinned: false,
      is_locked: false,
      user: {
        id: "user2",
        username: "NouveauParent",
        avatar_url: "/placeholder.svg"
      }
    }
  ].slice(0, limit);
};

// Add a function to get paginated topics
export const getTopics = async (categoryId: number, options: { page: number; limit: number }) => {
  const topics = await getTopicsByCategory(categoryId);
  const totalTopics = topics.length;
  const totalPages = Math.ceil(totalTopics / options.limit);
  
  const start = (options.page - 1) * options.limit;
  const end = start + options.limit;
  const paginatedTopics = topics.slice(start, end);
  
  return {
    data: paginatedTopics,
    total: totalTopics,
    page: options.page,
    limit: options.limit,
    totalPages
  };
};

// Add a function to get paginated posts
export const getPosts = async (topicId: string, options: { page: number; limit: number }): Promise<PaginatedResponse<ForumPost>> => {
  const posts = await getPostsByTopicId(topicId);
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / options.limit);
  
  const start = (options.page - 1) * options.limit;
  const end = start + options.limit;
  const paginatedPosts = posts.slice(start, end);
  
  return {
    data: paginatedPosts,
    total: totalPosts,
    page: options.page,
    limit: options.limit,
    totalPages
  };
};

// Add function to increment topic views
export const incrementTopicViews = async (topicId: string) => {
  return await incrementTopicView(topicId);
};
