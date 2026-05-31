import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

/**
 * Manages a user's article favorites in Supabase.
 * Falls back gracefully for anonymous users (no-op + login prompt).
 */
export function useArticleFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setFavorites(new Set());
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('article_favorites')
      .select('article_id')
      .eq('user_id', user.id);
    if (!error && data) {
      setFavorites(new Set(data.map((r) => r.article_id)));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isFavorite = useCallback(
    (articleId: string | number) => favorites.has(String(articleId)),
    [favorites]
  );

  const toggle = useCallback(
    async (articleId: string | number) => {
      if (!user) {
        toast({
          title: 'Connexion requise',
          description: 'Connectez-vous pour sauvegarder vos articles favoris.',
        });
        return false;
      }
      const id = String(articleId);
      const next = new Set(favorites);
      if (favorites.has(id)) {
        next.delete(id);
        setFavorites(next);
        const { error } = await supabase
          .from('article_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', id);
        if (error) {
          setFavorites(favorites);
          toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
          return false;
        }
        return false;
      } else {
        next.add(id);
        setFavorites(next);
        const { error } = await supabase
          .from('article_favorites')
          .insert({ user_id: user.id, article_id: id });
        if (error) {
          setFavorites(favorites);
          toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
          return false;
        }
        return true;
      }
    },
    [favorites, user]
  );

  return { favorites, isFavorite, toggle, loading, refresh };
}
