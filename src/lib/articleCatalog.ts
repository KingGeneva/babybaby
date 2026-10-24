import type { Article } from '@/types/article';

export interface ArticleFile { name: string; updated_at?: string; created_at?: string }
export interface CatalogTransport {
  list: (offset: number, limit: number) => Promise<ArticleFile[]>;
  read: (name: string) => Promise<unknown>;
}
export const ARTICLE_PAGE_SIZE = 100;
export type CatalogArticle = Article & { __fileTimestamp?: number };

const frenchMonths: Record<string, number> = {
  janvier: 0, fevrier: 1, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, aout: 7, août: 7, septembre: 8, octobre: 9, novembre: 10, decembre: 11, décembre: 11,
};

export function articleDateTimestamp(date?: string | null): number {
  if (!date || typeof date !== 'string') return 0;
  const match = date.trim().toLowerCase().match(/^(\d{1,2})\s+([a-zéû]+)\s+(\d{4})$/i);
  if (match) {
    const month = frenchMonths[match[2]];
    return month === undefined ? 0 : Date.UTC(Number(match[3]), month, Number(match[1]));
  }
  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? 0 : parsed;
}

// Existing Storage articles predate the status field. Explicit drafts stay private.
export function publicArticle(value: unknown): Article | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return;
  const a = value as Record<string, unknown>;
  const id = Number(a.id);
  if (!Number.isSafeInteger(id) || id <= 0 || typeof a.title !== 'string' || !a.title.trim()) return;
  if (a.status !== undefined && a.status !== 'published') return;
  if (a.published === false || a.is_published === false) return;
  return { ...a, id } as unknown as Article;
}

export async function loadCatalog(transport: CatalogTransport): Promise<{ articles: CatalogArticle[]; failures: string[] }> {
  const files: ArticleFile[] = [];
  for (let offset = 0; ; offset += ARTICLE_PAGE_SIZE) {
    const page = await transport.list(offset, ARTICLE_PAGE_SIZE);
    files.push(...page.filter(f => f.name.endsWith('.json') && f.name !== '_index.json'));
    if (page.length < ARTICLE_PAGE_SIZE) break;
  }
  const articles: CatalogArticle[] = [];
  const failures: string[] = [];
  // Bound concurrent JSON downloads rather than launching hundreds at once.
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(6, files.length) }, async () => {
    while (cursor < files.length) {
      const file = files[cursor++];
      try {
        const a = publicArticle(await transport.read(file.name));
        if (a) {
          const timestamp = Date.parse(file.updated_at || file.created_at || '');
          articles.push({ ...a, __fileTimestamp: Number.isNaN(timestamp) ? 0 : timestamp });
        }
      } catch { failures.push(file.name); }
    }
  }));
  return { articles, failures };
}

export function mergeArticles(local: Article[], remote: CatalogArticle[]): Article[] {
  const unique = new Map<number, CatalogArticle>();
  remote.forEach(a => unique.set(a.id, a));
  local.forEach(a => unique.set(a.id, a)); // Same local precedence as direct detail pages.
  return [...unique.values()].sort((a, b) =>
    articleDateTimestamp(b.date) - articleDateTimestamp(a.date) ||
    (b.__fileTimestamp || 0) - (a.__fileTimestamp || 0) || b.id - a.id);
}

export function filterArticles(articles: Article[], category: string, search: string): Article[] {
  const fold = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const query = fold(search.trim());
  return articles.filter(a => (category === 'Tous' || fold(a.category || '') === fold(category)) &&
    (!query || fold(`${a.title || ''} ${a.excerpt || ''}`).includes(query)));
}