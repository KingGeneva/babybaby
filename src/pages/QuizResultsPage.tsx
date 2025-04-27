
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import QuizResults from '@/components/quiz/QuizResults';
import { QuizType } from '@/components/quiz/types';
import SEOHead from '@/components/common/SEOHead';
import { quizTitles } from '@/components/quiz/types';

const QuizResultsPage = () => {
  const location = useLocation();
  const { results, quizType } = location.state || {};

  if (!results || !quizType) {
    return <Navigate to="/quiz" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHead 
        title={`Résultats ${quizTitles[quizType as QuizType]} | BabyBaby`}
        description="Découvrez les résultats détaillés de votre quiz parental."
      />
      
      <h1 className="text-3xl font-bold text-center mb-8">
        Résultats : {quizTitles[quizType as QuizType]}
      </h1>

      <QuizResults
        quizType={quizType}
        score={results.score}
        detailedResults={results.detailedResults}
        recommendations={results.recommendations}
      />
    </div>
  );
};

export default QuizResultsPage;
