
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuizType } from '@/components/quiz/types';

interface UseQuizSubmissionProps {
  quizType: QuizType | undefined;
  answers: Record<string, string>;
  calculateScore: (answers: Record<string, string>) => number;
}

export const useQuizSubmission = ({ 
  quizType, 
  answers, 
  calculateScore 
}: UseQuizSubmissionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuizSubmission = async () => {
    if (!quizType) return;
    
    setIsSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session?.user) {
        await supabase.from('quiz_responses').insert({
          user_id: sessionData.session.user.id,
          quiz_type: quizType,
          answers,
          score: calculateScore(answers)
        });
        
        toast({
          title: "Quiz terminé !",
          description: "Vos réponses ont été enregistrées avec succès."
        });
      } else {
        toast({
          title: "Quiz terminé !",
          description: "Merci d'avoir participé à ce quiz."
        });
      }
      
      navigate('/quiz');
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
