
// Exporter tous les services forum
export * from './categoryService';
export * from './topicService';

// Export des fonctions individuelles pour éviter les ambiguïtés
export { 
  getPostsByTopicId, 
  createPost 
} from './postService';

export { 
  likeTopic, 
  unlikeTopic,
  likePost,
  unlikePost
} from './likeService';

export * from './userService';
