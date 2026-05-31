import type { Article } from '@/types/article';

/**
 * Build the SEO-friendly URL path for an article.
 * Format: `/articles/{slug}-{id}` when a slug is available, otherwise `/articles/{id}`.
 * The trailing numeric id is the source of truth — ArticleDetailPage parses it
 * back out, so slugs can change without breaking permalinks.
 */
export function articleUrl(article: Pick<Article, 'id' | 'slug'>): string {
  if (article.slug && article.slug.length > 0) {
    return `/articles/${article.slug}-${article.id}`;
  }
  return `/articles/${article.id}`;
}

/**
 * Extract the numeric article id from a route param that may be either
 * a plain id (`123456`) or a slug-id combo (`mon-article-123456`).
 */
export function parseArticleIdFromParam(param: string | undefined): number | null {
  if (!param) return null;
  if (/^\d+$/.test(param)) return parseInt(param, 10);
  const match = param.match(/-(\d+)$/);
  if (match) return parseInt(match[1], 10);
  return null;
}
