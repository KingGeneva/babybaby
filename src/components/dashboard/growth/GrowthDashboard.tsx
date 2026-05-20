import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import PercentileChart from './PercentileChart';
import GrowthStats from './GrowthStats';
import GrowthHistoryTable, { Measurement } from './GrowthHistoryTable';
import GrowthMeasurementForm from '../GrowthMeasurementForm';
import { normalizeSex } from '@/data/whoGrowthStandards';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  childId: string;
  refreshSignal?: number;
  onMutated?: () => void;
}

const GrowthDashboard: React.FC<Props> = ({ childId, refreshSignal, onMutated }) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [child, setChild] = useState<{ birth_date: string; gender: string | null; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!childId) return;
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const [{ data: c, error: cErr }, { data: m, error: mErr }] = await Promise.all([
          supabase.from('child_profiles').select('birth_date, gender, name').eq('id', childId).single(),
          supabase.from('growth_measurements').select('id, measurement_date, height_cm, weight_kg, head_cm, notes')
            .eq('child_id', childId).order('measurement_date', { ascending: true }),
        ]);
        if (cErr) throw cErr;
        if (mErr) throw mErr;
        if (!cancel) {
          setChild(c as any);
          setMeasurements((m as Measurement[]) ?? []);
        }
      } catch (e: any) {
        toast({ title: 'Erreur', description: e.message ?? 'Chargement impossible', variant: 'destructive' });
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [childId, refresh, refreshSignal]);

  const triggerRefresh = () => {
    setRefresh(v => v + 1);
    onMutated?.();
  };

  if (loading || !child) {
    return (
      <Card><CardContent className="p-8 text-center text-muted-foreground">Chargement…</CardContent></Card>
    );
  }

  const sex = normalizeSex(child.gender);

  return (
    <div className="space-y-6">
      {/* Ajout d'une mesure — mis en avant et toujours accessible */}
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-1">
        <GrowthMeasurementForm childId={childId} onSuccess={triggerRefresh} />
      </div>

      <GrowthStats measurements={measurements} birthDate={child.birth_date} gender={child.gender} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PercentileChart
          title="Poids"
          unit="kg"
          metric="weight"
          field="weight_kg"
          measurements={measurements}
          birthDate={child.birth_date}
          sex={sex}
          color="hsl(var(--primary))"
        />
        <PercentileChart
          title="Taille"
          unit="cm"
          metric="height"
          field="height_cm"
          measurements={measurements}
          birthDate={child.birth_date}
          sex={sex}
          color="hsl(220 80% 55%)"
        />
        <PercentileChart
          title="Tour de tête"
          unit="cm"
          metric="head"
          field="head_cm"
          measurements={measurements}
          birthDate={child.birth_date}
          sex={sex}
          color="hsl(340 75% 55%)"
        />
      </div>

      <GrowthHistoryTable measurements={measurements} onChange={triggerRefresh} />
    </div>
  );
};

export default GrowthDashboard;
