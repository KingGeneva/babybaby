import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Award,
  Smile,
  Footprints,
  MessageCircle,
  Hand,
  Baby,
  Laugh,
  Music,
  Star,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeMeta {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string; // tailwind bg/text classes
}

const categoryBadge = (category?: string): { icon: BadgeMeta['icon']; color: string } => {
  switch ((category || '').toLowerCase()) {
    case 'social':
      return { icon: Smile, color: 'bg-pink-100 text-pink-700 border-pink-200' };
    case 'moteur':
      return { icon: Footprints, color: 'bg-blue-100 text-blue-700 border-blue-200' };
    case 'langage':
      return { icon: MessageCircle, color: 'bg-purple-100 text-purple-700 border-purple-200' };
    case 'cognitif':
      return { icon: Star, color: 'bg-amber-100 text-amber-700 border-amber-200' };
    default:
      return { icon: Award, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  }
};

const titleIcon = (title: string): BadgeMeta['icon'] | null => {
  const t = title.toLowerCase();
  if (t.includes('sourire')) return Smile;
  if (t.includes('rire')) return Laugh;
  if (t.includes('marche') || t.includes('pas') || t.includes('ramper')) return Footprints;
  if (t.includes('mot') || t.includes('babill') || t.includes('phrase')) return MessageCircle;
  if (t.includes('tête') || t.includes('asseoir') || t.includes('rouler')) return Hand;
  if (t.includes('chanson') || t.includes('musique')) return Music;
  if (t.includes('naissance') || t.includes('bébé')) return Baby;
  return null;
};

interface CompletedMilestone {
  id: string;
  title: string;
  category: string | null;
}

interface MilestoneBadgesProps {
  childId: string;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

const MilestoneBadges: React.FC<MilestoneBadgesProps> = ({
  childId,
  max,
  size = 'sm',
  className,
}) => {
  const [badges, setBadges] = useState<CompletedMilestone[]>([]);

  useEffect(() => {
    if (!childId || childId === 'demo') return;
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from('milestones')
        .select('id, title, category, achieved_date')
        .eq('child_id', childId)
        .not('achieved_date', 'is', null)
        .order('achieved_date', { ascending: false });
      if (!cancel && data) setBadges(data as any);
    })();
    return () => {
      cancel = true;
    };
  }, [childId]);

  if (!badges.length) return null;

  const visible = max ? badges.slice(0, max) : badges;
  const remaining = max && badges.length > max ? badges.length - max : 0;

  const sizes =
    size === 'md'
      ? { wrap: 'gap-2', chip: 'px-2.5 py-1 text-xs', icon: 'h-4 w-4' }
      : { wrap: 'gap-1.5', chip: 'px-2 py-0.5 text-[11px]', icon: 'h-3.5 w-3.5' };

  return (
    <div className={cn('flex flex-wrap items-center', sizes.wrap, className)}>
      {visible.map((m) => {
        const cat = categoryBadge(m.category || undefined);
        const Icon = titleIcon(m.title) || cat.icon;
        return (
          <span
            key={m.id}
            className={cn(
              'inline-flex items-center gap-1 rounded-full border font-medium',
              sizes.chip,
              cat.color
            )}
            title={m.title}
          >
            <Icon className={sizes.icon} />
            <span className="truncate max-w-[100px]">{m.title}</span>
          </span>
        );
      })}
      {remaining > 0 && (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full border font-medium bg-muted text-muted-foreground border-border',
            sizes.chip
          )}
        >
          <Trophy className={sizes.icon} />+{remaining}
        </span>
      )}
    </div>
  );
};

export default MilestoneBadges;
