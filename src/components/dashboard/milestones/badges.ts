import { Milestone } from '@/types/milestone';
import {
  Award, Star, Trophy, Sparkles, Crown, Medal, Heart,
  Footprints, MessageCircle, Users, Brain, Target, Rocket, Gem
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string; // tailwind gradient classes
  check: (ctx: BadgeContext) => boolean;
}

export interface BadgeContext {
  milestones: Milestone[];
  completedIds: string[];
}

const completedOfCategory = (ctx: BadgeContext, category: string) =>
  ctx.milestones.filter(m => m.category === category && ctx.completedIds.includes(m.id)).length;

export const BADGES: Badge[] = [
  {
    id: 'first-step',
    name: 'Premier pas',
    description: 'Compléter votre tout premier jalon',
    icon: Sparkles,
    color: 'from-amber-400 to-orange-500',
    check: ctx => ctx.completedIds.length >= 1,
  },
  {
    id: 'explorer',
    name: 'Explorateur',
    description: 'Compléter 5 jalons',
    icon: Target,
    color: 'from-sky-400 to-blue-600',
    check: ctx => ctx.completedIds.length >= 5,
  },
  {
    id: 'achiever',
    name: 'Performeur',
    description: 'Compléter 10 jalons',
    icon: Medal,
    color: 'from-violet-400 to-purple-600',
    check: ctx => ctx.completedIds.length >= 10,
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Compléter 20 jalons',
    icon: Trophy,
    color: 'from-yellow-400 to-amber-600',
    check: ctx => ctx.completedIds.length >= 20,
  },
  {
    id: 'legend',
    name: 'Légende',
    description: 'Compléter 50 jalons',
    icon: Crown,
    color: 'from-pink-500 to-rose-600',
    check: ctx => ctx.completedIds.length >= 50,
  },
  {
    id: 'motor-pro',
    name: 'Petit athlète',
    description: '3 jalons moteurs complétés',
    icon: Footprints,
    color: 'from-emerald-400 to-green-600',
    check: ctx => completedOfCategory(ctx, 'Moteur') >= 3,
  },
  {
    id: 'social-star',
    name: 'Étoile sociale',
    description: '3 jalons sociaux complétés',
    icon: Users,
    color: 'from-pink-400 to-fuchsia-600',
    check: ctx => completedOfCategory(ctx, 'Social') >= 3,
  },
  {
    id: 'chatterbox',
    name: 'Petit bavard',
    description: '3 jalons langage complétés',
    icon: MessageCircle,
    color: 'from-cyan-400 to-teal-600',
    check: ctx => completedOfCategory(ctx, 'Langage') >= 3,
  },
  {
    id: 'genius',
    name: 'Petit génie',
    description: '3 jalons cognitifs complétés',
    icon: Brain,
    color: 'from-indigo-400 to-violet-600',
    check: ctx => completedOfCategory(ctx, 'Cognitif') >= 3,
  },
  {
    id: 'heart',
    name: 'Cœur sur la main',
    description: 'Compléter 15 jalons',
    icon: Heart,
    color: 'from-rose-400 to-red-600',
    check: ctx => ctx.completedIds.length >= 15,
  },
  {
    id: 'rocket',
    name: 'Décollage',
    description: 'Compléter 30 jalons',
    icon: Rocket,
    color: 'from-blue-500 to-indigo-700',
    check: ctx => ctx.completedIds.length >= 30,
  },
  {
    id: 'perfection',
    name: 'Perfection',
    description: 'Compléter tous les jalons',
    icon: Gem,
    color: 'from-fuchsia-500 via-purple-500 to-indigo-600',
    check: ctx => ctx.milestones.length > 0 && ctx.completedIds.length === ctx.milestones.length,
  },
];

// XP system: 10 XP per milestone, 50 XP per badge
export const XP_PER_MILESTONE = 10;
export const XP_PER_BADGE = 50;

export const computeXP = (completedCount: number, unlockedBadges: number) =>
  completedCount * XP_PER_MILESTONE + unlockedBadges * XP_PER_BADGE;

// Level thresholds (cumulative XP)
const LEVELS = [0, 50, 150, 300, 500, 800, 1200, 1700, 2300, 3000, 4000];
const LEVEL_TITLES = [
  'Nouveau-né', 'Curieux', 'Aventurier', 'Explorateur', 'Pionnier',
  'Héros', 'Champion', 'Maître', 'Virtuose', 'Légende', 'Mythe'
];

export const getLevelInfo = (xp: number) => {
  let level = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i]) level = i;
  }
  const current = LEVELS[level];
  const next = LEVELS[level + 1] ?? current + 1000;
  const progress = Math.min(100, Math.round(((xp - current) / (next - current)) * 100));
  return {
    level: level + 1,
    title: LEVEL_TITLES[level] ?? 'Mythe',
    xp,
    currentLevelXp: current,
    nextLevelXp: next,
    progress,
  };
};

export const getUnlockedBadges = (ctx: BadgeContext) =>
  BADGES.filter(b => b.check(ctx));
