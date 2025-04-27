
import { QuizOption, QuizResult } from './types';

type AnswerAnalysis = {
  typeScores?: Record<string, number>;
  developmentScores?: Record<string, number>;
  burnoutScore?: number;
};

const generateRecommendations = (
  quizType: string,
  analysis: AnswerAnalysis
): string[] => {
  const recommendations: string[] = [];

  if (quizType === 'parenting_style') {
    const dominantType = Object.entries(analysis.typeScores || {})
      .sort(([,a], [,b]) => b - a)[0][0];
    
    switch (dominantType) {
      case 'autoritaire':
        recommendations.push(
          "Essayez d'intégrer plus de dialogue avec votre enfant",
          "Privilégiez l'explication plutôt que la punition",
          "Laissez plus de place à la négociation"
        );
        break;
      case 'permissif':
        recommendations.push(
          "Établissez des limites claires mais bienveillantes",
          "Maintenez une certaine structure dans le quotidien",
          "Restez cohérent dans l'application des règles"
        );
        break;
      case 'désengagé':
        recommendations.push(
          "Passez plus de temps de qualité avec votre enfant",
          "Impliquez-vous davantage dans ses activités",
          "Établissez des routines communes"
        );
        break;
      case 'démocratique':
        recommendations.push(
          "Continuez à maintenir un équilibre entre autorité et écoute",
          "Partagez votre approche avec d'autres parents",
          "Adaptez votre style selon les besoins de votre enfant"
        );
        break;
    }
  }

  if (quizType === 'child_development') {
    const areas = analysis.developmentScores || {};
    Object.entries(areas).forEach(([area, score]) => {
      if (score <= 1) {
        recommendations.push(
          `Consultez un professionnel pour le développement ${area}`,
          `Mettez en place des activités ciblées pour stimuler le développement ${area}`
        );
      }
    });
  }

  if (quizType === 'parental_burnout') {
    const score = analysis.burnoutScore || 0;
    if (score > 12) {
      recommendations.push(
        "Consultez rapidement un professionnel de santé",
        "Demandez de l'aide à votre entourage",
        "Prenez des mesures pour vous reposer"
      );
    } else if (score > 8) {
      recommendations.push(
        "Accordez-vous plus de moments de repos",
        "Parlez de vos difficultés à vos proches",
        "Envisagez un soutien professionnel"
      );
    } else if (score > 4) {
      recommendations.push(
        "Prévoyez des moments de détente réguliers",
        "Équilibrez vos responsabilités",
        "Écoutez vos besoins"
      );
    }
  }

  return recommendations;
};

const generateDetailedResults = (
  quizType: string,
  analysis: AnswerAnalysis
) => {
  if (quizType === 'parenting_style') {
    const types = analysis.typeScores || {};
    const dominantType = Object.entries(types)
      .sort(([,a], [,b]) => b - a)[0][0];
    return { dominant_type: dominantType };
  }
  
  if (quizType === 'child_development') {
    const areas = analysis.developmentScores || {};
    const developmentAreas = Object.entries(areas).reduce(
      (acc, [area, score]) => ({
        ...acc,
        [area]: score <= 1 ? 'à surveiller' : score <= 2 ? 'normal' : 'avancé'
      }),
      {}
    );
    return { development_areas: developmentAreas };
  }
  
  if (quizType === 'parental_burnout') {
    const score = analysis.burnoutScore || 0;
    let level = 'faible';
    if (score > 12) level = 'critique';
    else if (score > 8) level = 'élevé';
    else if (score > 4) level = 'modéré';
    return { burnout_level: level };
  }

  return {};
};

export const calculateDetailedResults = (
  answers: Record<string, string>,
  questions: any[]
): QuizResult => {
  const analysis: AnswerAnalysis = {};
  const quizType = questions[0]?.quiz_type;
  let totalScore = 0;

  questions.forEach((question) => {
    const answer = answers[question.id];
    const selectedOption = question.options.find((opt: QuizOption) => opt.id === answer);
    
    if (!selectedOption) return;
    
    totalScore += selectedOption.score;

    if (quizType === 'parenting_style') {
      analysis.typeScores = analysis.typeScores || {};
      analysis.typeScores[selectedOption.type || ''] = 
        (analysis.typeScores[selectedOption.type || ''] || 0) + selectedOption.score;
    } else if (quizType === 'child_development') {
      analysis.developmentScores = analysis.developmentScores || {};
      const area = selectedOption.development?.split(' ')[0] || '';
      analysis.developmentScores[area] = 
        (analysis.developmentScores[area] || 0) + selectedOption.score;
    } else if (quizType === 'parental_burnout') {
      analysis.burnoutScore = (analysis.burnoutScore || 0) + selectedOption.score;
    }
  });

  const recommendations = generateRecommendations(quizType, analysis);
  const detailedResults = generateDetailedResults(quizType, analysis);

  return {
    score: totalScore,
    detailedResults,
    recommendations
  };
};

