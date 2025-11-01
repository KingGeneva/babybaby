
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { QuizType } from './types';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QuizResultsProps {
  quizType: QuizType;
  score: number;
  detailedResults: {
    dominant_type?: string;
    development_areas?: Record<string, string>;
    burnout_level?: string;
  };
  recommendations: string[];
}

const QuizResults: React.FC<QuizResultsProps> = ({
  quizType,
  score,
  detailedResults,
  recommendations
}) => {
  const navigate = useNavigate();

  const renderDetailedResults = () => {
    if (quizType === 'personnalite' && detailedResults.dominant_type) {
      return (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Votre style parental dominant</AlertTitle>
          <AlertDescription className="capitalize">
            {detailedResults.dominant_type}
          </AlertDescription>
        </Alert>
      );
    }

    if (quizType === 'developpement' && detailedResults.development_areas) {
      return (
        <div className="space-y-4">
          {Object.entries(detailedResults.development_areas).map(([area, status]) => (
            <Alert key={area} variant={status === 'à surveiller' ? 'destructive' : 'default'}>
              {status === 'à surveiller' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <AlertTitle className="capitalize">{area}</AlertTitle>
              <AlertDescription className="capitalize">
                Niveau : {status}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      );
    }

    if (quizType === 'connaissance' && detailedResults.burnout_level) {
      const variant = 
        detailedResults.burnout_level === 'critique' ? 'destructive' :
        detailedResults.burnout_level === 'élevé' ? 'destructive' :
        detailedResults.burnout_level === 'modéré' ? 'default' : 'default';

      return (
        <Alert variant={variant}>
          {variant === 'destructive' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
          <AlertTitle>Niveau d'épuisement</AlertTitle>
          <AlertDescription className="capitalize">
            {detailedResults.burnout_level}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Résultats de votre quiz</CardTitle>
          <CardDescription>
            Voici l'analyse détaillée de vos réponses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderDetailedResults()}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recommandations</h3>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button onClick={() => navigate('/quiz')} variant="outline">
          Retour aux quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;
