
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuizType } from '@/components/quiz/types';
import { calculateDetailedResults } from '@/components/quiz/calculateUtils';

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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuizSubmission = async () => {
    if (!quizType) return;
    
    setIsSubmitting(true);
    try {
      const results = calculateDetailedResults(answers, questions);
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session?.user) {
        await supabase.from('quiz_responses').insert({
          user_id: sessionData.session.user.id,
          quiz_type: quizType,
          answers,
          score: results.score,
          detailed_results: results.detailedResults,
          recommendations: results.recommendations
        });
        
        toast({
          title: "Quiz terminé !",
          description: "Vos réponses ont été enregistrées avec succès.",
        });
      }
      
      navigate(`/quiz/${quizType}/results`, { 
        state: { 
          results,
          quizType 
        }
      });
    } catch (error) {
      console.error("Erreur lors de la soumission du quiz:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos réponses.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleQuizSubmission
  };
};
