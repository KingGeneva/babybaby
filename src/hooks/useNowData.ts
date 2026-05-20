import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Feeding {
  id: string;
  type: string;
  started_at: string;
  ended_at: string | null;
  amount_ml: number | null;
}

interface Sleep {
  id: string;
  started_at: string;
  ended_at: string | null;
}

interface Diaper {
  id: string;
  type: string;
  occurred_at: string;
}

export function useNowData(childId: string | undefined) {
  const [lastFeeding, setLastFeeding] = useState<Feeding | null>(null);
  const [activeSleep, setActiveSleep] = useState<Sleep | null>(null);
  const [lastDiaper, setLastDiaper] = useState<Diaper | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!childId) return;
    const [feed, sleep, diaper] = await Promise.all([
      supabase
        .from('feedings')
        .select('id, type, started_at, ended_at, amount_ml')
        .eq('child_id', childId)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('sleeps')
        .select('id, started_at, ended_at')
        .eq('child_id', childId)
        .is('ended_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('diapers')
        .select('id, type, occurred_at')
        .eq('child_id', childId)
        .order('occurred_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    setLastFeeding(feed.data ?? null);
    setActiveSleep(sleep.data ?? null);
    setLastDiaper(diaper.data ?? null);
    setLoading(false);
  }, [childId]);

  useEffect(() => {
    if (!childId) {
      setLoading(false);
      return;
    }
    refresh();

    // Realtime sync — co-parent mode
    const channel = supabase
      .channel(`now-${childId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feedings', filter: `child_id=eq.${childId}` },
        () => refresh()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sleeps', filter: `child_id=eq.${childId}` },
        () => refresh()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'diapers', filter: `child_id=eq.${childId}` },
        () => refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [childId, refresh]);

  return { lastFeeding, activeSleep, lastDiaper, loading, refresh };
}
