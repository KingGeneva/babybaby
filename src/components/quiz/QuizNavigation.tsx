
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface QuizNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  hasCurrentAnswer: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestionIndex,
  totalQuestions,
  hasCurrentAnswer,
  isSubmitting,
  onPrevious,
  onNext,
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex justify-between mt-8 max-w-2xl mx-auto">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
      >
        Question précédente
      </Button>

      <Button
        onClick={onNext}
        disabled={!hasCurrentAnswer || isSubmitting}
        className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement...
          </>
        ) : (
          isLastQuestion ? 'Terminer le quiz' : 'Question suivante'
        )}
      </Button>
    </div>
  );
};

export default QuizNavigation;
