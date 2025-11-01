
import { QuizType, QuizIdParam } from './types';

export const convertToQuizType = (quizId: string | undefined): QuizType | undefined => {
  if (!quizId) return undefined;
  
  const mapping: Record<QuizIdParam, QuizType> = {
    'parenting-style': 'personnalite',
    'child-development': 'developpement',
    'parental-burnout': 'connaissance'
  };
  
  return mapping[quizId as QuizIdParam];
};

