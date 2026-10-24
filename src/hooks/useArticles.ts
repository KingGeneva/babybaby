import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPublicArticles, localArticles, publicArticlesKey } from '@/services/publicArticles';
import { filterArticles } from '@/lib/articleCatalog';

export const useArticles = (category = 'Tous', searchTerm = '') => {
  const query = useQuery({
    queryKey: publicArticlesKey,
    queryFn: fetchPublicArticles,
    staleTime: 60_000,
    retry: 1,
  });
  const articles = useMemo(() => filterArticles(query.data?.articles || localArticles, category, searchTerm),
    [query.data, category, searchTerm]);
  return { articles, loading: query.isPending && articles.length === 0,
    error: query.error?.message || query.data?.warning || null, retry: query.refetch };
};