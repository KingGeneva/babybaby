
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizProgress from '@/components/quiz/QuizProgress';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type QuizType = 'parenting_style' | 'child_development' | 'parental_burnout';

interface Question {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
}

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: questions, isLoading } = useQuery({
    queryKey: ['quiz-questions', quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_type', quizId);
      
      if (error) throw error;
      return data.map(q => ({
        ...q,
        options: JSON.parse(q.options as string)
      }));
    }
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (answers: Record<string, string>) => {
      if (!user) throw new Error('User must be logged in');
      
      const { error } = await supabase
        .from('quiz_responses')
        .insert({
          user_id: user.id,
          quiz_type: quizId as QuizType,
          answers,
          score: calculateScore(answers)
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Quiz terminé !",
        description: "Vos réponses ont été enregistrées avec succès."
      });
      navigate('/dashboard');
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos réponses.",
        variant: "destructive"
      });
    }
  });

  const calculateScore = (answers: Record<string, string>): number => {
    // Implement scoring logic based on quiz type
    return Object.keys(answers).length;
  };

  const handleAnswerSelect = (answerId: string) => {
    if (!questions) return;
    
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answerId
    }));
  };

  const handleNext = () => {
    if (!questions) return;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitQuizMutation.mutate(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Quiz non trouvé</h2>
        <Button onClick={() => navigate('/quiz')}>Retourner aux quiz</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <QuizProgress current={currentQuestionIndex + 1} total={questions.length} />
      
      <QuizQuestion
        question={currentQuestion.question}
        options={currentQuestion.options}
        selectedAnswer={answers[currentQuestion.id] || null}
        onAnswerSelect={handleAnswerSelect}
      />

      <div className="flex justify-between mt-8 max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Question précédente
        </Button>

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
        >
          {isLastQuestion ? 'Terminer le quiz' : 'Question suivante'}
        </Button>
      </div>
    </div>
  );
};

export default QuizPage;
