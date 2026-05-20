import React, { useEffect, useMemo, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Milestone } from '@/types/milestone';
import { BADGES, computeXP, getLevelInfo, getUnlockedBadges } from './badges';
import { Lock, Sparkles, Trophy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Props {
  childId: string;
  milestones: Milestone[];
  completedIds: string[];
}

const GamificationPanel: React.FC<Props> = ({ childId, milestones, completedIds }) => {
  const ctx = { milestones, completedIds };
  const unlocked = useMemo(() => getUnlockedBadges(ctx), [milestones, completedIds]);
  const unlockedIds = useMemo(() => new Set(unlocked.map(b => b.id)), [unlocked]);
  const xp = computeXP(completedIds.length, unlocked.length);
  const level = getLevelInfo(xp);

  // Detect newly unlocked badges -> toast
  const storageKey = `bb_badges_${childId || 'demo'}`;
  const seenRef = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (seenRef.current === null) {
      try {
        const raw = localStorage.getItem(storageKey);
        seenRef.current = new Set(raw ? JSON.parse(raw) : []);
      } catch {
        seenRef.current = new Set();
      }
      // Initial mount: mark current as seen without toast to avoid spam
      unlocked.forEach(b => seenRef.current!.add(b.id));
      try { localStorage.setItem(storageKey, JSON.stringify([...seenRef.current])); } catch {}
      return;
    }
    const newOnes = unlocked.filter(b => !seenRef.current!.has(b.id));
    if (newOnes.length) {
      newOnes.forEach(b => {
        toast({
          title: `🏆 Badge débloqué : ${b.name}`,
          description: b.description,
        });
        seenRef.current!.add(b.id);
      });
      try { localStorage.setItem(storageKey, JSON.stringify([...seenRef.current!])); } catch {}
    }
  }, [unlocked, storageKey]);

  const completionPct = milestones.length
    ? Math.round((completedIds.length / milestones.length) * 100)
    : 0;

  return (
    <Card className="overflow-hidden border-2 border-primary/10">
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {level.level}
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Niveau {level.level}</div>
              <div className="font-semibold text-base">{level.title}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Sparkles className="h-4 w-4" />
              {xp} XP
            </div>
            <div className="text-xs text-muted-foreground">
              {level.nextLevelXp - xp} XP au niveau suivant
            </div>
          </div>
        </div>
        <Progress value={level.progress} className="h-2" />
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="bg-background/60 rounded-lg p-2">
            <div className="text-lg font-bold">{completedIds.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Jalons</div>
          </div>
          <div className="bg-background/60 rounded-lg p-2">
            <div className="text-lg font-bold">{unlocked.length}/{BADGES.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Badges</div>
          </div>
          <div className="bg-background/60 rounded-lg p-2">
            <div className="text-lg font-bold">{completionPct}%</div>
            <div className="text-[10px] text-muted-foreground uppercase">Progression</div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-amber-500" />
          <h3 className="font-semibold text-sm">Badges</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {BADGES.map(badge => {
            const isUnlocked = unlockedIds.has(badge.id);
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`relative flex flex-col items-center text-center p-2 rounded-lg border transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br ' + badge.color + ' border-transparent shadow-md hover:scale-105'
                    : 'bg-muted/40 border-dashed border-muted-foreground/20 grayscale opacity-60'
                }`}
                title={badge.description}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isUnlocked ? 'bg-white/20' : 'bg-muted'}`}>
                  {isUnlocked ? (
                    <Icon className="h-5 w-5 text-white" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className={`text-[10px] font-semibold mt-1 leading-tight ${isUnlocked ? 'text-white' : 'text-muted-foreground'}`}>
                  {badge.name}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationPanel;
