import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mocks = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock('@/services/publicArticles', () => ({
  fetchPublicArticles: mocks.fetch,
  publicArticlesKey: ['public-articles'],
  localArticles: [{ id: 1, title: 'Guide local', excerpt: 'Québec', category: 'Sommeil' }],
}));
import { useArticles } from './useArticles';

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  return { client, wrapper };
}

describe('shared public article loading', () => {
  beforeEach(() => { mocks.fetch.mockReset(); });
  it('shows local articles immediately while the remote request is pending', () => {
    mocks.fetch.mockReturnValue(new Promise(() => {}));
    const { wrapper, client } = setup();
    const hook = renderHook(() => useArticles(), { wrapper });
    expect(hook.result.current.articles.map(a => a.id)).toEqual([1]);
    expect(hook.result.current.loading).toBe(false);
    hook.unmount(); client.clear();
  });
  it('shares a request and filters without reloading the catalog', async () => {
    mocks.fetch.mockResolvedValue({ complete: true, warning: null, articles: [
      { id: 200, title: 'Sommeil bébé', category: 'Sommeil', excerpt: 'Québec' },
      { id: 201, title: 'Nutrition', category: 'Nutrition', excerpt: 'Repas' },
    ] });
    const { wrapper, client } = setup();
    const hook = renderHook(({ search, category }) => {
      const first = useArticles(category, search);
      const second = useArticles();
      return { first, second };
    }, { wrapper, initialProps: { search: '', category: 'Tous' } });
    await waitFor(() => expect(hook.result.current.first.articles).toHaveLength(2));
    hook.rerender({ search: 'quebec', category: 'Sommeil' });
    expect(hook.result.current.first.articles.map(a => a.id)).toEqual([200]);
    expect(hook.result.current.second.articles).toHaveLength(2);
    expect(mocks.fetch).toHaveBeenCalledTimes(1);
    hook.unmount(); client.clear();
  });
  it('keeps successfully loaded articles visible with an explicit partial failure', async () => {
    mocks.fetch.mockResolvedValue({ complete: false, warning: '1 article indisponible', articles: [
      { id: 200, title: 'Sommeil', category: 'Sommeil', excerpt: '' },
    ] });
    const { wrapper, client } = setup();
    const hook = renderHook(() => useArticles(), { wrapper });
    await waitFor(() => expect(hook.result.current.error).toBe('1 article indisponible'));
    expect(hook.result.current.articles.map(a => a.id)).toEqual([200]);
    hook.unmount(); client.clear();
  });
});