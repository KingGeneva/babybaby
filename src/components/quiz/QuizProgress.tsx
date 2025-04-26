
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  current: number;
  total: number;
}

const QuizProgress: React.FC<QuizProgressProps> = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <span>Question {current} sur {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default QuizProgress;
