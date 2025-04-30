
import { nutritionArticles } from './nutrition';
import { amenagementArticles } from './amenagement';
import { sommeilArticles } from './sommeil';
import { developpementArticles } from './developpement';
import { preparationArticles } from './preparation';
import { Article } from '@/types/article';

// Combine all articles from different categories
export const articles: Article[] = [
  ...nutritionArticles,
  ...amenagementArticles,
  ...sommeilArticles,
  ...developpementArticles,
  ...preparationArticles
];

export * from './nutrition';
export * from './amenagement';
export * from './sommeil';
export * from './developpement';
export * from './preparation';

// This function helps to find an article by ID
export const getArticleById = (id: number): Article | undefined => {
  return articles.find(article => article.id === id);
};

// This function helps to get articles by category
export const getArticlesByCategory = (category: string): Article[] => {
  if (category === "Tous") return articles;
  return articles.filter(article => article.category === category);
};
