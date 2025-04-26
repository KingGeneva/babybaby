
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

export const quizTitles: Record<QuizType, string> = {
  'parenting_style': 'Style Parental',
  'child_development': 'Développement de l\'Enfant',
  'parental_burnout': 'Épuisement Parental'
};
