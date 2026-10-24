import { supabase } from '@/integrations/supabase/client';
import { articles as localArticles } from '@/data/articles';
import { loadCatalog, mergeArticles, publicArticle } from '@/lib/articleCatalog';
import type { Article } from '@/types/article';

export const publicArticlesKey = ['public-articles'] as const;

async function readFile(name: string): Promise<unknown> {
  const { data, error } = await supabase.storage.from('articles').download(`articles/${name}`);
  if (error || !data) throw new Error('Impossible de charger les articles distants.');
  return JSON.parse(await data.text());
}

export async function fetchPublicArticles(): Promise<Article[]> {
  const result = await loadCatalog({
    list: async (offset, limit) => {
      const { data, error } = await supabase.storage.from('articles').list('articles', {
        offset, limit, sortBy: { column: 'name', order: 'asc' },
      });
      if (error || !data) throw new Error('Les articles en ligne sont temporairement indisponibles.');
      return data;
    },
    read: readFile,
  });
  if (result.failures.length) throw new Error(`${result.failures.length} articles n’ont pas pu être chargés. Réessaie.`);
  return mergeArticles(localArticles, result.articles);
}

export async function fetchPublicArticle(id: number, catalog?: Article[]): Promise<Article | undefined> {
  const known = localArticles.find(a => a.id === id) || catalog?.find(a => a.id === id);
  if (known) return known;
  // Legacy auto-publications can use a timestamp filename with a different JSON id.
  // The complete catalog resolves by the JSON id, not by an assumed filename.
  return (await fetchPublicArticles()).find(a => a.id === id);
}

export { localArticles, publicArticle };