
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Option {
  id: string;
  text: string;
}

interface QuizQuestionProps {
  question: string;
  options: Option[];
  selectedAnswer: string | null;
  onAnswerSelect: (answerId: string) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  selectedAnswer,
  onAnswerSelect,
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">{question}</CardTitle>
        <CardDescription>Choisissez la réponse qui vous correspond le mieux</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswer || ''} onValueChange={onAnswerSelect}>
          <div className="space-y-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="text-base">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
