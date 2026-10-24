import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ list: vi.fn(), download: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { storage: { from: () => mocks } } }));
vi.mock('@/data/articles', () => ({ articles: [{ id: 1, title: 'Local' }] }));
import { fetchPublicArticles, fetchPublicArticle } from './publicArticles';

describe('partial public catalog and detail resolution', () => {
  beforeEach(() => { vi.resetAllMocks(); });
  it('keeps healthy remote articles and marks a failed download as incomplete', async () => {
    mocks.list.mockResolvedValue({ data: [{ name: 'timestamp.json' }, { name: 'broken.json' }], error: null });
    mocks.download.mockImplementation(async (name: string) => name.endsWith('broken.json')
      ? { data: null, error: new Error('offline') }
      : { data: new Blob([JSON.stringify({ id: 200, title: 'Remote' })]), error: null });
    const result = await fetchPublicArticles();
    expect(result.articles.map(a => a.id).sort((a, b) => a - b)).toEqual([1, 200]);
    expect(result.complete).toBe(false);
    expect(result.warning).toBeTruthy();
    expect((await fetchPublicArticle(200, result))?.id).toBe(200);
    await expect(fetchPublicArticle(201, result)).rejects.toThrow();
  });
  it('returns genuine missing only for a fully loaded catalog', async () => {
    mocks.list.mockResolvedValue({ data: [], error: null });
    const result = await fetchPublicArticles();
    expect(result.complete).toBe(true);
    expect(await fetchPublicArticle(201, result)).toBeUndefined();
  });
  it('preserves the first page when a later listing page fails', async () => {
    mocks.list.mockResolvedValueOnce({ data: Array.from({ length: 100 }, (_, i) => ({ name: `${i}.json` })), error: null })
      .mockResolvedValueOnce({ data: null, error: new Error('offline') });
    mocks.download.mockImplementation(async (name: string) => ({ data: new Blob([JSON.stringify({
      id: Number(name.split('/').pop()?.replace('.json', '')) + 200, title: name,
    })]), error: null }));
    const result = await fetchPublicArticles();
    expect(result.articles).toHaveLength(101);
    expect(result.complete).toBe(false);
  });
  it('retains local records and warns when the listing itself is unavailable', async () => {
    mocks.list.mockResolvedValue({ data: null, error: new Error('offline') });
    const result = await fetchPublicArticles();
    expect(result.articles.map(a => a.id)).toEqual([1]);
    expect(result.complete).toBe(false);
    await expect(fetchPublicArticle(200, result)).rejects.toThrow();
  });
});