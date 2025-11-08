
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuizType } from '@/components/quiz/types';
import { calculateDetailedResults } from '@/components/quiz/calculateUtils';
import { z } from 'zod';

const quizAnswerSchema = z.record(z.string(), z.string().max(500));
const quizResultsSchema = z.object({
  score: z.number().min(0).max(100),
  detailedResults: z.any(),
  recommendations: z.any()
});

interface UseQuizSubmissionProps {
  quizType: QuizType | undefined;
  answers: Record<string, string>;
  questions: any[];
}

export const useQuizSubmission = ({ 
  quizType, 
  answers,
  questions
}: UseQuizSubmissionProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuizSubmission = async () => {
    if (!quizType) return;
    
    setIsSubmitting(true);
    try {
      // Validate answers
      const validatedAnswers = quizAnswerSchema.parse(answers);
      
      const results = calculateDetailedResults(validatedAnswers, questions);
      const validatedResults = quizResultsSchema.parse(results);
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session?.user) {
        await supabase.from('quiz_responses').insert({
          user_id: sessionData.session.user.id,
          quiz_type: quizType,
          answers: validatedAnswers,
          score: validatedResults.score,
          detailed_results: validatedResults.detailedResults,
          recommendations: validatedResults.recommendations
        });
        
        toast({
          title: "Quiz terminé !",
          description: "Vos réponses ont été enregistrées avec succès.",
        });
      }
      
      navigate(`/quiz/${quizType}/results`, { 
        state: { 
          results: validatedResults,
          quizType 
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erreur de validation",
          description: "Les réponses du quiz sont invalides.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement de vos réponses.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleQuizSubmission
  };
};
