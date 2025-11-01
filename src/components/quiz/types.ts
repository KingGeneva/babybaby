
import { Database } from '@/integrations/supabase/types';

export type QuizType = Database['public']['Enums']['quiz_type'];
export type QuizIdParam = 'parenting-style' | 'child-development' | 'parental-burnout';

export interface Question {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
}

export interface QuizOption {
  id: string;
  text: string;
  score: number;
  type?: string;
  development?: string;
  burnout?: string;
}

export interface QuizResult {
  score: number;
  detailedResults: {
    dominant_type?: string;
    development_areas?: Record<string, string>;
    burnout_level?: string;
  };
  recommendations: string[];
}

export const quizTitles: Partial<Record<QuizType, string>> = {
  'personnalite': 'Style Parental',
  'developpement': 'Développement de l\'Enfant',
  'connaissance': 'Connaissances Parentales',
  'nutrition': 'Nutrition et Alimentation',
  'sommeil': 'Sommeil de Bébé'
};

