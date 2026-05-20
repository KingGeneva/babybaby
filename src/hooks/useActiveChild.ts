import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ActiveChild {
  id: string;
  name: string;
  birth_date: string;
  gender: string | null;
}

const STORAGE_KEY = 'babybaby:activeChildId';

export function useActiveChild() {
  const { user } = useAuth();
  const [child, setChild] = useState<ActiveChild | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setChild(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      const storedId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

      // Get all accessible children (own + via family_members)
      const { data, error } = await supabase
        .from('child_profiles')
        .select('id, name, birth_date, gender')
        .order('created_at', { ascending: true });

      if (cancelled) return;
      if (error || !data || data.length === 0) {
        setChild(null);
        setLoading(false);
        return;
      }

      const picked = data.find((c) => c.id === storedId) ?? data[0];
      setChild(picked);
      if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, picked.id);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const switchChild = (id: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, id);
  };

  return { child, loading, switchChild };
}
