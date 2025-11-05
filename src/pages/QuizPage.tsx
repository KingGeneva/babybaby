
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookCheck, Trophy, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/common/SEOHead';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Use the has_role function to check admin status
      const { data, error } = await supabase.rpc('has_role' as any, {
        _user_id: user.id,
        _role: 'admin'
      }) as { data: boolean | null, error: any };

      if (!error && data === true) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du statut d'administrateur:", error);
    }
  };

  React.useEffect(() => {
    checkAdmin();
  }, []);

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

  const seedQuizData = async () => {
    setIsSeeding(true);
    setSeedError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Vous devez être connecté");
      }

      // Use environment variable for correct project URL
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-quiz-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          }
        }
      );
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Données de quiz initialisées",
          description: "Les questions de quiz ont été ajoutées avec succès.",
        });
        // Attendre un moment pour que les données soient disponibles
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(result.error || "Une erreur s'est produite lors de l'initialisation des données");
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des données de quiz:", error);
      setSeedError(error instanceof Error ? error.message : "Une erreur s'est produite");
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser les données de quiz.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
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

        {isAdmin && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Database className="h-5 w-5" /> 
                  Administration
                </CardTitle>
                <CardDescription>
                  Outils d'administration des quiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                {seedError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{seedError}</AlertDescription>
                  </Alert>
                )}
                <Button 
                  onClick={seedQuizData} 
                  disabled={isSeeding} 
                  variant="outline"
                  className="w-full"
                >
                  {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Initialiser les données de quiz
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Cette action ajoutera des questions pour tous les types de quiz dans la base de données.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

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
