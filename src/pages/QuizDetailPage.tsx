
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
import SEOHead from '@/components/common/SEOHead';
import { Database } from '@/integrations/supabase/types';

type QuizType = Database['public']['Enums']['quiz_type'];
type QuizIdParam = 'parenting-style' | 'child-development' | 'parental-burnout';

// Cette fonction convertit l'ID de l'URL vers le type d'enum Supabase
const convertToQuizType = (quizId: string | undefined): QuizType | undefined => {
  if (!quizId) return undefined;
  
  const mapping: Record<QuizIdParam, QuizType> = {
    'parenting-style': 'parenting_style',
    'child-development': 'child_development',
    'parental-burnout': 'parental_burnout'
  };
  
  // Vérifier si quizId est une clé valide de notre mapping
  return mapping[quizId as QuizIdParam];
};

interface Question {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
}

const QuizDetailPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const quizType = convertToQuizType(quizId);
  const quizTitles: Record<QuizType, string> = {
    'parenting_style': 'Style Parental',
    'child_development': 'Développement de l\'Enfant',
    'parental_burnout': 'Épuisement Parental'
  };

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['quiz-questions', quizType],
    queryFn: async () => {
      if (!quizType) throw new Error('Type de quiz invalide');
      
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_type', quizType);
      
      if (error) throw error;
      return data.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string)
      }));
    },
    enabled: !!quizType
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (answers: Record<string, string>) => {
      if (!user) throw new Error('Vous devez être connecté');
      if (!quizType) throw new Error('Type de quiz invalide');
      
      const { error } = await supabase
        .from('quiz_responses')
        .insert({
          user_id: user.id,
          quiz_type: quizType,
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
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement de vos réponses.",
        variant: "destructive"
      });
    }
  });

  const calculateScore = (answers: Record<string, string>): number => {
    // Logique de calcul du score selon le type de quiz
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

  if (!quizType) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Quiz non trouvé</h2>
        <Button onClick={() => navigate('/quiz')}>Retourner aux quiz</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Quiz non disponible</h2>
        <p className="mb-4 text-gray-600">
          {error instanceof Error ? error.message : "Impossible de charger les questions du quiz"}
        </p>
        <Button onClick={() => navigate('/quiz')}>Retourner aux quiz</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHead 
        title={`Quiz ${quizTitles[quizType]} | BabyBaby`}
        description="Participez à notre quiz interactif pour en découvrir plus sur votre parcours parental."
      />
      
      <h1 className="text-3xl font-bold text-center mb-6">{quizTitles[quizType]}</h1>
      
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
          className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
        >
          {isLastQuestion ? 'Terminer le quiz' : 'Question suivante'}
        </Button>
      </div>
    </div>
  );
};

export default QuizDetailPage;
