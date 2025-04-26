
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import { Loader2 } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import { convertToQuizType, calculateScore } from '@/components/quiz/utils';
import { quizTitles } from '@/components/quiz/types';
import { useQuizSubmission } from '@/hooks/useQuizSubmission';

const QuizDetailPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const quizType = convertToQuizType(quizId);

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['quiz-questions', quizType],
    queryFn: async () => {
      if (!quizType) throw new Error('Type de quiz invalide');
      
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_type', quizType);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('Aucune question trouvée pour ce quiz');
      }
      
      return data.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string)
      }));
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  const { isSubmitting, handleQuizSubmission } = useQuizSubmission({
    quizType,
    answers,
    calculateScore
  });

  const handleAnswerSelect = (answerId: string) => {
    if (!questions) return;
    
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answerId
    }));
  };

  const handleNext = async () => {
    if (!questions) return;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      await handleQuizSubmission();
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

      <QuizNavigation
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        hasCurrentAnswer={Boolean(answers[currentQuestion.id])}
        isSubmitting={isSubmitting}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};

export default QuizDetailPage;
