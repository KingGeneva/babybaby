import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Baby, Milk, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveChild } from '@/hooks/useActiveChild';
import { useNowData } from '@/hooks/useNowData';
import { BigTapButton } from '@/components/now/BigTapButton';
import { QuickLogSheet } from '@/components/now/QuickLogSheet';

function formatAgo(iso: string | undefined | null): string {
  if (!iso) return '—';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `il y a ${h}h${m.toString().padStart(2, '0')}`;
}

function formatClock(d: Date) {
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

type Mode = 'feeding' | 'diaper' | 'sleep' | null;

export default function NowPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { child, loading: childLoading } = useActiveChild();
  const { lastFeeding, activeSleep, lastDiaper, refresh } = useNowData(child?.id);
  const [mode, setMode] = useState<Mode>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!childLoading && user && !child) navigate('/parental-dashboard');
  }, [child, childLoading, user, navigate]);

  const suggestedBreast = useMemo(() => {
    if (lastFeeding?.type === 'breast_left') return 'droit';
    if (lastFeeding?.type === 'breast_right') return 'gauche';
    return null;
  }, [lastFeeding]);

  if (authLoading || childLoading || !child) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--night-bg))]">
        <div className="text-[hsl(var(--night-muted-foreground))] font-display text-2xl">…</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Maintenant · BabyBaby</title>
        <meta name="description" content="L'écran nocturne. Un geste, et c'est noté." />
        <meta name="theme-color" content="#11141f" />
      </Helmet>

      <main
        className="min-h-screen relative flex flex-col"
        style={{ background: 'var(--gradient-night)' }}
      >
        {/* Header */}
        <header className="px-6 pt-12 pb-4">
          <p className="font-display text-[hsl(var(--night-muted-foreground))] text-sm tracking-widest uppercase">
            {child.name}
          </p>
          <h1 className="font-display text-[hsl(var(--night-foreground))] text-7xl tabular-nums leading-none mt-1">
            {formatClock(now)}
          </h1>
        </header>

        {/* Status */}
        <section className="px-6 py-6 space-y-3 text-[hsl(var(--night-foreground))]">
          <StatusRow
            icon={<Milk className="w-5 h-5" />}
            label="Dernière tétée"
            value={
              lastFeeding
                ? `${formatAgo(lastFeeding.started_at)}${
                    suggestedBreast ? ` · sein ${suggestedBreast} suggéré` : ''
                  }`
                : 'aucune'
            }
          />
          <StatusRow
            icon={<Moon className="w-5 h-5" />}
            label="Sommeil"
            value={
              activeSleep
                ? `dort depuis ${formatAgo(activeSleep.started_at).replace('il y a ', '')}`
                : 'éveillé'
            }
          />
          <StatusRow
            icon={<Baby className="w-5 h-5" />}
            label="Dernière couche"
            value={lastDiaper ? formatAgo(lastDiaper.occurred_at) : 'aucune'}
          />
        </section>

        {/* Actions */}
        <section className="px-6 pb-12 mt-auto grid grid-cols-1 gap-4">
          <BigTapButton
            tone="accent"
            icon={<Milk />}
            label="Tétée"
            sublabel={suggestedBreast ? `sein ${suggestedBreast}` : 'au choix'}
            onClick={() => setMode('feeding')}
          />
          <div className="grid grid-cols-2 gap-4">
            <BigTapButton
              tone="sky"
              icon={<Baby />}
              label="Couche"
              onClick={() => setMode('diaper')}
            />
            <BigTapButton
              tone="lilac"
              icon={<Moon />}
              label={activeSleep ? 'Réveil' : 'Sommeil'}
              onClick={() => setMode('sleep')}
            />
          </div>
          <button
            onClick={() => navigate('/parental-dashboard')}
            className="text-[hsl(var(--night-muted-foreground))] text-sm py-3 flex items-center justify-center gap-2 hover:text-[hsl(var(--night-foreground))] transition"
          >
            <Sparkles className="w-4 h-4" /> Tout va bien · journée complète
          </button>
        </section>

        <QuickLogSheet
          mode={mode}
          childId={child.id}
          lastFeedingType={lastFeeding?.type}
          onClose={() => setMode(null)}
          onLogged={refresh}
        />
      </main>
    </>
  );
}

function StatusRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[hsl(var(--night-surface)/0.6)] border border-[hsl(var(--night-border))] backdrop-blur px-4 py-3">
      <div className="text-[hsl(var(--night-muted-foreground))]">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs uppercase tracking-wider text-[hsl(var(--night-muted-foreground))]">
          {label}
        </div>
        <div className="text-base font-body truncate">{value}</div>
      </div>
    </div>
  );
}
