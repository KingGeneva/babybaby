import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface ArticleComment {
  id: string;
  user_id: string;
  article_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  author_name?: string;
  author_avatar?: string | null;
}

export function useArticleComments(articleId: string | number | undefined) {
  const { user } = useAuth();
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (articleId === undefined) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', String(articleId))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Comments load error', error);
      setLoading(false);
      return;
    }

    const userIds = Array.from(new Set((data ?? []).map((c) => c.user_id)));
    let profilesMap = new Map<string, { full_name: string | null; avatar_url: string | null }>();
    if (userIds.length) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);
      profilesMap = new Map(
        (profiles ?? []).map((p) => [p.id, { full_name: p.full_name, avatar_url: p.avatar_url }])
      );
    }

    setComments(
      (data ?? []).map((c) => ({
        ...c,
        author_name: profilesMap.get(c.user_id)?.full_name ?? 'Parent BabyBaby',
        author_avatar: profilesMap.get(c.user_id)?.avatar_url ?? null,
      }))
    );
    setLoading(false);
  }, [articleId]);

  useEffect(() => {
    load();
  }, [load]);

  const post = useCallback(
    async (content: string, parentId: string | null = null) => {
      if (!user) {
        toast({ title: 'Connexion requise', description: 'Connectez-vous pour commenter.' });
        return false;
      }
      const trimmed = content.trim();
      if (trimmed.length < 1 || trimmed.length > 2000) {
        toast({ title: 'Commentaire invalide', description: 'Entre 1 et 2000 caractères.', variant: 'destructive' });
        return false;
      }
      setSubmitting(true);
      const { error } = await supabase.from('article_comments').insert({
        user_id: user.id,
        article_id: String(articleId),
        content: trimmed,
        parent_id: parentId,
      });
      setSubmitting(false);
      if (error) {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
        return false;
      }
      await load();
      return true;
    },
    [articleId, load, user]
  );

  const remove = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('article_comments').delete().eq('id', id);
      if (error) {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
        return;
      }
      await load();
    },
    [load]
  );

  return { comments, loading, submitting, post, remove, refresh: load };
}
