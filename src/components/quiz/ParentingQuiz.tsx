import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

type Style = 'nurturer' | 'explorer' | 'structured' | 'balanced';

interface Question {
  id: string;
  text: string;
  options: { label: string; style: Style }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Votre bébé pleure la nuit. Votre premier réflexe ?',
    options: [
      { label: 'Le prendre dans mes bras immédiatement', style: 'nurturer' },
      { label: 'Attendre quelques minutes pour voir s\'il se rendort', style: 'structured' },
      { label: 'Lui parler doucement depuis la porte', style: 'balanced' },
      { label: 'Tenter une nouvelle technique de cododo', style: 'explorer' },
    ],
  },
  {
    id: 'q2',
    text: 'Pour les repas de bébé, vous préférez :',
    options: [
      { label: 'Suivre les recettes et un planning précis', style: 'structured' },
      { label: 'Tester de nouvelles saveurs régulièrement', style: 'explorer' },
      { label: 'M\'adapter à ses envies du moment', style: 'nurturer' },
      { label: 'Un mix entre routine et nouveautés', style: 'balanced' },
    ],
  },
  {
    id: 'q3',
    text: 'Le week-end avec bébé, c\'est plutôt :',
    options: [
      { label: 'Une sortie aventure ou un nouveau lieu', style: 'explorer' },
      { label: 'Cocooning à la maison, câlins et lectures', style: 'nurturer' },
      { label: 'Un emploi du temps doux mais structuré', style: 'structured' },
      { label: 'Au feeling, ça dépend de la journée', style: 'balanced' },
    ],
  },
  {
    id: 'q4',
    text: 'Devant une nouvelle étape de développement, vous :',
    options: [
      { label: 'Lisez des articles spécialisés', style: 'structured' },
      { label: 'Demandez conseil à d\'autres parents', style: 'balanced' },
      { label: 'Faites confiance à votre instinct', style: 'nurturer' },
      { label: 'Essayez plusieurs approches', style: 'explorer' },
    ],
  },
  {
    id: 'q5',
    text: 'Votre plus grande priorité au quotidien :',
    options: [
      { label: 'Sa sécurité affective et nos liens', style: 'nurturer' },
      { label: 'Stimuler sa curiosité', style: 'explorer' },
      { label: 'Lui donner un cadre rassurant', style: 'structured' },
      { label: 'Trouver l\'équilibre famille/perso', style: 'balanced' },
    ],
  },
];

const RESULTS: Record<Style, { title: string; emoji: string; description: string; recommended: string }> = {
  nurturer: {
    title: 'Le Parent Cocon',
    emoji: '🤗',
    description:
      'Vous êtes guidé(e) par l\'instinct et la tendresse. Vos enfants se sentent profondément en sécurité grâce à votre présence chaleureuse.',
    recommended: 'Découvrez nos articles sur l\'éducation positive et le portage.',
  },
  explorer: {
    title: 'Le Parent Explorateur',
    emoji: '🚀',
    description:
      'Curieux et ouvert, vous adorez découvrir avec votre enfant. Chaque jour est une nouvelle aventure d\'éveil.',
    recommended: 'Nos guides sur la motricité libre et les activités sensorielles vont vous passionner.',
  },
  structured: {
    title: 'Le Parent Architecte',
    emoji: '🏛️',
    description:
      'Vous misez sur la régularité et le cadre. Vos routines apportent à votre bébé un repère solide et rassurant.',
    recommended: 'Nos méthodes de sommeil et chronobiologie infantile sont faites pour vous.',
  },
  balanced: {
    title: 'Le Parent Équilibre',
    emoji: '⚖️',
    description:
      'Vous savez doser intuition et organisation. Cette flexibilité fait de vous un parent particulièrement adaptable.',
    recommended: 'Notre sélection d\'e-books couvre toutes les facettes de la parentalité.',
  },
};

const ParentingQuiz: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [tally, setTally] = useState<Record<Style, number>>({
    nurturer: 0,
    explorer: 0,
    structured: 0,
    balanced: 0,
  });
  const [result, setResult] = useState<Style | null>(null);

  const answer = async (style: Style) => {
    const nextTally = { ...tally, [style]: tally[style] + 1 };
    setTally(nextTally);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const winner = (Object.keys(nextTally) as Style[]).reduce((a, b) =>
        nextTally[a] >= nextTally[b] ? a : b
      );
      setResult(winner);
      // Persist anonymously (or attached to user)
      await supabase.from('quiz_results').insert({
        user_id: user?.id ?? null,
        email: user?.email ?? null,
        quiz_slug: 'parenting-style',
        result_key: winner,
        answers: nextTally as any,
      });
    }
  };

  const reset = () => {
    setStep(0);
    setTally({ nurturer: 0, explorer: 0, structured: 0, balanced: 0 });
    setResult(null);
  };

  const progress = result ? 100 : ((step) / QUESTIONS.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
          <Sparkles className="h-4 w-4" />
          Quiz parental
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Quel parent êtes-vous ?</h2>

        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="text-center"
            >
              <div className="text-6xl mb-3">{RESULTS[result].emoji}</div>
              <h3 className="text-2xl font-bold mb-2">{RESULTS[result].title}</h3>
              <p className="text-muted-foreground mb-3">{RESULTS[result].description}</p>
              <p className="text-sm font-medium text-primary mb-6">{RESULTS[result].recommended}</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <a href="/articles">Voir les articles</a>
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refaire le quiz
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Question {step + 1} / {QUESTIONS.length}
              </p>
              <h3 className="text-xl font-semibold mb-5">{QUESTIONS[step].text}</h3>
              <div className="grid gap-2">
                {QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => answer(opt.style)}
                    className="text-left px-4 py-3 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all hover:translate-x-1"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ParentingQuiz;
