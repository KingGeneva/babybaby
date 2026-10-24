import { describe, expect, it } from 'vitest';
import { filterArticles, loadCatalog, mergeArticles, publicArticle } from './articleCatalog';
import type { Article } from '@/types/article';

const article = (id: number, extra = {}) => ({ id, title: `Guide ${id}`, category: 'Sommeil', excerpt: 'Bébé au Québec', ...extra });

describe('public article catalog', () => {
  it('loads beyond the Storage limit of 100 and ignores the index', async () => {
    const files = Array.from({ length: 152 }, (_, i) => ({ name: `${1700000000000 + i}.json` }));
    files.splice(10, 0, { name: '_index.json' });
    const offsets: number[] = [];
    const result = await loadCatalog({
      list: async (offset, limit) => { offsets.push(offset); return files.slice(offset, offset + limit); },
      read: async name => article(Number(name.slice(0, -5)) - 1700000000000 + 1),
    });
    expect(offsets).toEqual([0, 100]);
    expect(result.articles).toHaveLength(152);
    expect(result.articles.find(a => a.id === 152)).toBeDefined();
  });
  it('resolves JSON ids independently of timestamp filenames', async () => {
    const result = await loadCatalog({ list: async () => [{ name: '1777940102000.json' }], read: async () => article(200) });
    expect(result.articles[0].id).toBe(200);
  });
  it('preserves legacy published records and excludes explicit drafts', () => {
    expect(publicArticle(article(200))?.id).toBe(200);
    expect(publicArticle(article(201, { status: 'draft' }))).toBeUndefined();
    expect(publicArticle(article(202, { published: false }))).toBeUndefined();
    expect(publicArticle(article(203, { status: 'published' }))?.id).toBe(203);
  });
  it('rejects the index, missing titles and invalid ids', () => {
    expect(publicArticle([])).toBeUndefined();
    expect(publicArticle(article(-1))).toBeUndefined();
    expect(publicArticle(article(1, { title: '' }))).toBeUndefined();
  });
  it('deduplicates with local detail-page precedence', () => {
    const merged = mergeArticles([article(1) as Article], [article(1, { title: 'Remote' }) as Article, article(2) as Article]);
    expect(merged).toHaveLength(2);
    expect(merged.find(a => a.id === 1)?.title).toBe('Guide 1');
  });
  it('filters categories and accent-insensitive search without fetching', () => {
    const rows = [article(1) as Article, article(2, { category: 'Nutrition', title: 'Allaitement' }) as Article];
    expect(filterArticles(rows, 'Sommeil', 'quebec').map(a => a.id)).toEqual([1]);
    expect(filterArticles(rows, 'Tous', 'allaitement').map(a => a.id)).toEqual([2]);
  });
  it('reports download failures rather than treating them as missing articles', async () => {
    const result = await loadCatalog({ list: async () => [{ name: '200.json' }], read: async () => { throw new Error('offline'); } });
    expect(result.failures).toEqual(['200.json']);
  });
});