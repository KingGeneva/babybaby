import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';

const mocks = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('@/hooks/useArticle', () => ({ useArticle: () => ({ getArticleData: mocks.get, formatDateForStructuredData: () => '2026-10-24' }) }));
vi.mock('@/components/NavBar', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/common/SEOHead', () => ({ default: () => null }));
vi.mock('@/components/articles/ArticleStructuredData', () => ({ default: () => null }));
vi.mock('@/components/articles/ArticleHeader', () => ({ default: ({ title }: { title: string }) => <h1>{title}</h1> }));
vi.mock('@/components/articles/ArticleImage', () => ({ default: () => null }));
vi.mock('@/components/articles/ArticleContent', () => ({ default: () => null }));
vi.mock('@/components/articles/ArticleActions', () => ({ default: () => null }));
vi.mock('@/components/articles/ArticlePromotion', () => ({ default: () => null }));
vi.mock('@/components/articles/ArticleNotFound', () => ({ default: () => <div role="status">Missing</div> }));
vi.mock('@/components/articles/ReadingProgressBar', () => ({ default: () => null }));
vi.mock('@/components/articles/ArticleTOC', () => ({ default: () => null }));
vi.mock('@/components/articles/ArticleComments', () => ({ default: () => null }));
import ArticleDetailPage from './ArticleDetailPage';

function Navigation() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/articles/invalid')}>Invalid URL</button>;
}
function setup() {
  return render(<MemoryRouter initialEntries={['/articles/200']}><Navigation />
    <Routes><Route path="/articles/:id" element={<ArticleDetailPage />} /></Routes>
  </MemoryRouter>);
}

describe('article URL transitions', () => {
  beforeEach(() => { mocks.get.mockReset(); });
  it('clears the previous article when navigating to an invalid parameter', async () => {
    mocks.get.mockResolvedValue({ id: 200, title: 'Previous article', date: '24 octobre 2026' });
    setup();
    await screen.findByRole('heading', { name: 'Previous article' });
    fireEvent.click(screen.getByRole('button', { name: 'Invalid URL' }));
    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Previous article' })).toBeNull());
    expect(screen.getByRole('status')).toBeDefined();
    expect(mocks.get).toHaveBeenCalledTimes(1);
  });
  it('clears a previous load error when navigating to an invalid parameter', async () => {
    mocks.get.mockRejectedValue(new Error('offline'));
    setup();
    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button', { name: 'Invalid URL' }));
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
    expect(screen.getByRole('status')).toBeDefined();
  });
});