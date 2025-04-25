
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/common/SEOHead';

// Types pour les quiz
type Quiz = {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: "award" | "book-check" | "trophy";
  color: string;
};

const quizzes: Quiz[] = [
  {
    id: "parenting-style",
    title: "Quel est votre style parental ?",
    description: "Découvrez votre approche unique de la parentalité à travers ce test complet.",
    duration: "10-15 min",
    icon: "award",
    color: "bg-[#FDE1D3]"
  },
  {
    id: "child-development",
    title: "Développement de votre enfant",
    description: "Évaluez les étapes clés du développement de votre enfant.",
    duration: "5-10 min",
    icon: "book-check",
    color: "bg-[#D3E4FD]"
  },
  {
    id: "parental-burnout",
    title: "Test d'épuisement parental",
    description: "Évaluez votre niveau de stress et identifiez les signes d'épuisement.",
    duration: "8-12 min",
    icon: "trophy",
    color: "bg-[#E5DEFF]"
  }
];

const QuizPage = () => {
  const navigate = useNavigate();

  const getIcon = (iconName: Quiz['icon']) => {
    const props = { className: "h-6 w-6" };
    switch (iconName) {
      case "award":
        return <Award {...props} />;
      case "book-check":
        return <BookCheck {...props} />;
      case "trophy":
        return <Trophy {...props} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHead 
        title="Quiz et Tests Parentaux | BabyBaby" 
        description="Découvrez-en plus sur votre style parental et le développement de votre enfant grâce à nos quiz et tests interactifs."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-2">Quiz et Tests Parentaux</h1>
        <p className="text-center text-gray-600 mb-8">
          Explorez nos quiz interactifs pour mieux comprendre votre parcours parental
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-full ${quiz.color} flex items-center justify-center mb-4`}>
                    {getIcon(quiz.icon)}
                  </div>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Durée: {quiz.duration}
                    </span>
                    <Button 
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                      className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
                    >
                      Commencer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizPage;
