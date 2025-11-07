
import { QuizType, QuizIdParam } from './types';

export const convertToQuizType = (quizId: string | undefined): QuizType | undefined => {
  if (!quizId) return undefined;
  
  const mapping: Record<QuizIdParam, QuizType> = {
    'parenting-style': 'connaissance',
    'child-development': 'developpement',
    'parental-burnout': 'personnalite'
  };
  
  return mapping[quizId as QuizIdParam];
};

