import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mocks = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock('@/services/publicArticles', () => ({
  fetchPublicArticles: mocks.fetch, publicArticlesKey: ['public-articles'], localArticles: [],
  fetchPublicArticle: async (id: number, catalog: { articles: { id: number }[]; complete: boolean }) => {
    const article = catalog.articles.find(a => a.id === id);
    if (!article && !catalog.complete) throw new Error('Incomplete');
    return article;
  },
}));
import { useArticle } from './useArticle';

describe('article retry after partial catalog failure', () => {
  it('refetches an incomplete cached catalog rather than repeatedly serving a false missing result', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    client.setQueryData(['public-articles'], { articles: [], complete: false });
    mocks.fetch.mockResolvedValue({ articles: [{ id: 200 }], complete: true });
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    const hook = renderHook(() => useArticle(200), { wrapper });
    expect((await hook.result.current.getArticleData(200))?.id).toBe(200);
    expect(mocks.fetch).toHaveBeenCalledTimes(1);
    await hook.result.current.getArticleData(200);
    expect(mocks.fetch).toHaveBeenCalledTimes(1);
    hook.unmount(); client.clear();
  });
});