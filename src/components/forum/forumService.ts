
import { ForumTopic, ForumPost, ForumCategory } from './types';
import { getAllCategories, getCategoryBySlug, getCategoryById } from './services/categoryService';
import { getTopicsByCategory, getTopicById, createTopic } from './services/topicService';
import { getPostsByTopicId, createPost, likePost, unlikePost } from './services/postService';

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
  likePost,
  unlikePost
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
      user: {
        id: "user2",
        username: "NouveauParent",
        avatar_url: "/placeholder.svg"
      }
    }
  ].slice(0, limit);
};
