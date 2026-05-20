import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { haptic } from '@/lib/haptic';
import { cn } from '@/lib/utils';

type Mode = 'feeding' | 'diaper' | 'sleep' | null;

interface Props {
  mode: Mode;
  childId: string;
  lastFeedingType?: string | null;
  onClose: () => void;
  onLogged: () => void;
}

const sideButton =
  'flex-1 min-h-[var(--tap-min)] rounded-2xl border border-[hsl(var(--night-border))] bg-[hsl(var(--night-surface-2))] text-[hsl(var(--night-foreground))] px-4 py-4 text-base font-medium transition active:scale-[0.97] hover:bg-[hsl(var(--night-surface-2)/0.8)]';

export function QuickLogSheet({ mode, childId, lastFeedingType, onClose, onLogged }: Props) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const suggestedBreast =
    lastFeedingType === 'breast_left' ? 'breast_right' : 'breast_left';

  const logFeeding = async (type: 'breast_left' | 'breast_right' | 'bottle_formula', amount?: number) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('feedings').insert({
      child_id: childId,
      logged_by: user.id,
      type,
      started_at: new Date().toISOString(),
      amount_ml: amount ?? null,
    });
    setSaving(false);
    if (error) {
      toast.error('Échec du log : ' + error.message);
      return;
    }
    haptic.success();
    toast.success('Tétée enregistrée');
    onLogged();
    onClose();
  };

  const logDiaper = async (type: 'wet' | 'dirty' | 'mixed') => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('diapers').insert({
      child_id: childId,
      logged_by: user.id,
      type,
      occurred_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast.error('Échec du log : ' + error.message);
      return;
    }
    haptic.success();
    toast.success('Couche enregistrée');
    onLogged();
    onClose();
  };

  const toggleSleep = async () => {
    if (!user) return;
    setSaving(true);
    // Look for an active sleep
    const { data: active } = await supabase
      .from('sleeps')
      .select('id')
      .eq('child_id', childId)
      .is('ended_at', null)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (active) {
      const { error } = await supabase
        .from('sleeps')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', active.id);
      setSaving(false);
      if (error) return toast.error(error.message);
      haptic.success();
      toast.success('Réveil enregistré');
    } else {
      const { error } = await supabase.from('sleeps').insert({
        child_id: childId,
        logged_by: user.id,
        started_at: new Date().toISOString(),
      });
      setSaving(false);
      if (error) return toast.error(error.message);
      haptic.success();
      toast.success('Sommeil démarré');
    }
    onLogged();
    onClose();
  };

  return (
    <Sheet open={mode !== null} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="bg-[hsl(var(--night-surface))] border-t border-[hsl(var(--night-border))] text-[hsl(var(--night-foreground))] rounded-t-3xl max-h-[80vh]"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-3xl text-[hsl(var(--night-foreground))]">
            {mode === 'feeding' && 'Tétée'}
            {mode === 'diaper' && 'Couche'}
            {mode === 'sleep' && 'Sommeil'}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {mode === 'feeding' && (
            <>
              <p className="text-sm text-[hsl(var(--night-muted-foreground))]">
                Sein suggéré :{' '}
                <span className="text-[hsl(var(--rose-pastel))] font-medium">
                  {suggestedBreast === 'breast_left' ? 'gauche' : 'droit'}
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  className={cn(sideButton, suggestedBreast === 'breast_left' && 'ring-2 ring-[hsl(var(--rose-pastel))]')}
                  disabled={saving}
                  onClick={() => logFeeding('breast_left')}
                >
                  Sein gauche
                </button>
                <button
                  className={cn(sideButton, suggestedBreast === 'breast_right' && 'ring-2 ring-[hsl(var(--rose-pastel))]')}
                  disabled={saving}
                  onClick={() => logFeeding('breast_right')}
                >
                  Sein droit
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[60, 90, 120, 150, 180, 210].map((ml) => (
                  <button
                    key={ml}
                    className={sideButton}
                    disabled={saving}
                    onClick={() => logFeeding('bottle_formula', ml)}
                  >
                    {ml} ml
                  </button>
                ))}
              </div>
            </>
          )}

          {mode === 'diaper' && (
            <div className="grid grid-cols-3 gap-3">
              <button className={sideButton} disabled={saving} onClick={() => logDiaper('wet')}>
                💧 Pipi
              </button>
              <button className={sideButton} disabled={saving} onClick={() => logDiaper('dirty')}>
                💩 Caca
              </button>
              <button className={sideButton} disabled={saving} onClick={() => logDiaper('mixed')}>
                ✨ Les deux
              </button>
            </div>
          )}

          {mode === 'sleep' && (
            <button
              className={cn(sideButton, 'min-h-[var(--tap-lg)] text-lg')}
              disabled={saving}
              onClick={toggleSleep}
            >
              😴 Démarrer / Terminer le sommeil
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
