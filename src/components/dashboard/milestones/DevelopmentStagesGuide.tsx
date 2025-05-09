
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Check, CircleDot, Milestone } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface DevelopmentStagesGuideProps {
  babyAgeMonths: number;
}

type DevStage = {
  id: string;
  age: string;
  title: string;
  description: string;
  milestones: string[];
  tips: string[];
};

const developmentStages: DevStage[] = [
  {
    id: "0-3",
    age: "0-3 mois",
    title: "Développement néonatal",
    description: "Durant cette période, votre bébé commence à découvrir le monde et développe ses réflexes de base.",
    milestones: [
      "Tient sa tête brièvement",
      "Suit des yeux un objet en mouvement",
      "Sourit en réponse à vos sourires",
      "Émet des gazouillis et des sons"
    ],
    tips: [
      "Parlez-lui fréquemment",
      "Pratiquez le peau à peau",
      "Montrez-lui des objets contrastés",
      "Faites des exercices doux pour ses jambes et bras"
    ]
  },
  {
    id: "4-6",
    age: "4-6 mois",
    title: "Découverte active",
    description: "Votre bébé devient plus actif et commence à interagir davantage avec son environnement.",
    milestones: [
      "Tient sa tête fermement",
      "Roule du ventre au dos",
      "Saisit des objets volontairement",
      "Rit aux éclats"
    ],
    tips: [
      "Proposez du temps sur le ventre",
      "Introduisez des jouets texturés",
      "Lisez-lui des histoires",
      "Jouez à coucou-caché"
    ]
  },
  {
    id: "7-9",
    age: "7-9 mois",
    title: "Mobilité et exploration",
    description: "La mobilité se développe rapidement à ce stade, permettant une exploration plus active.",
    milestones: [
      "S'assoit sans soutien",
      "Commence à ramper",
      "Transfère les objets entre ses mains",
      "Réagit à son prénom"
    ],
    tips: [
      "Créez un espace sécurisé pour l'exploration",
      "Jouez à des jeux d'imitation",
      "Nommez les objets qu'il regarde",
      "Proposez des activités sensorielles"
    ]
  },
  {
    id: "10-12",
    age: "10-12 mois",
    title: "Premiers pas et premiers mots",
    description: "Votre bébé se prépare à marcher et à communiquer plus clairement.",
    milestones: [
      "Se met debout seul",
      "Fait ses premiers pas avec aide",
      "Dit 1-3 mots avec intention",
      "Comprend des consignes simples"
    ],
    tips: [
      "Encouragez-le à se tenir debout",
      "Parlez-lui avec des phrases simples",
      "Proposez des jouets à pousser",
      "Lisez des livres interactifs"
    ]
  }
];

const DevelopmentStagesGuide: React.FC<DevelopmentStagesGuideProps> = ({ babyAgeMonths }) => {
  const navigate = useNavigate();
  
  // Déterminer la phase actuelle du bébé
  const getCurrentStage = (): string => {
    if (babyAgeMonths <= 3) return "0-3";
    if (babyAgeMonths <= 6) return "4-6";
    if (babyAgeMonths <= 9) return "7-9";
    if (babyAgeMonths <= 12) return "10-12";
    return "10-12"; // Par défaut, afficher la dernière étape
  };
  
  const currentStage = getCurrentStage();

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Milestone className="h-5 w-5 text-babybaby-cosmic" />
              Guide des étapes de développement
            </CardTitle>
            <CardDescription>
              Comprendre les jalons de développement adaptés à l'âge de votre bébé
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{babyAgeMonths} mois</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentStage}>
          <TabsList className="grid grid-cols-4 mb-4">
            {developmentStages.map(stage => (
              <TabsTrigger 
                key={stage.id} 
                value={stage.id}
                className={babyAgeMonths <= parseInt(stage.id.split('-')[1]) ? "font-medium" : ""}
              >
                {stage.age}
                {stage.id === currentStage && (
                  <CircleDot className="h-3 w-3 ml-1 text-babybaby-cosmic" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {developmentStages.map(stage => (
            <TabsContent key={stage.id} value={stage.id} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-1">{stage.title}</h3>
                <p className="text-sm text-slate-600">{stage.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Milestone className="h-4 w-4 text-babybaby-cosmic" /> 
                    Jalons typiques
                  </h4>
                  <ul className="space-y-2">
                    {stage.milestones.map((milestone, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Conseils pour les parents</h4>
                  <ul className="space-y-2">
                    {stage.tips.map((tip, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CircleDot className="h-4 w-4 text-babybaby-cosmic mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-babybaby-cosmic"
                  onClick={() => navigate('/articles?category=Développement')}
                >
                  Articles détaillés 
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DevelopmentStagesGuide;
