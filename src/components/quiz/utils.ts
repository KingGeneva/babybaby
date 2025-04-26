
import { QuizType, QuizIdParam } from './types';

export const convertToQuizType = (quizId: string | undefined): QuizType | undefined => {
  if (!quizId) return undefined;
  
  const mapping: Record<QuizIdParam, QuizType> = {
    'parenting-style': 'parenting_style',
    'child-development': 'child_development',
    'parental-burnout': 'parental_burnout'
  };
  
  return mapping[quizId as QuizIdParam];
};

export const calculateScore = (answers: Record<string, string>): number => {
  return Object.keys(answers).length;
};
