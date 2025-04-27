
import { nutritionArticles } from './nutrition';
import { amenagementArticles } from './amenagement';
import { sommeilArticles } from './sommeil';
import { developpementArticles } from './developpement';
import { preparationArticles } from './preparation';

export const articles = [
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
