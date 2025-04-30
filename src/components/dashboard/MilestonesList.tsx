
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, differenceInMonths, parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Milestone } from '@/types/milestone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Baby, Calendar, CheckCircle2 } from "lucide-react";

interface MilestonesListProps {
  childId: string;
  birthDate?: string;
}

// Données de jalons par défaut si aucun n'est trouvé en base de données
const defaultMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Premiers sourires',
    description: 'Commence à sourire en réponse aux stimuli',
    expected_age_months: 2,
    category: 'Développement social',
    icon: 'smile'
  },
  {
    id: '2',
    title: 'Tient sa tête',
    description: 'Capable de tenir sa tête droite sans support',
    expected_age_months: 3,
    category: 'Développement moteur',
    icon: 'head'
  },
  {
    id: '3',
    title: 'Se retourne',
    description: 'Se retourne du ventre au dos et vice versa',
    expected_age_months: 5,
    category: 'Développement moteur',
    icon: 'rotate'
  },
  {
    id: '4',
    title: 'S\'assoit seul',
    description: 'Capable de s\'asseoir sans support',
    expected_age_months: 6,
    category: 'Développement moteur',
    icon: 'sit'
  },
  {
    id: '5',
    title: 'Premiers mots',
    description: 'Commence à dire des mots reconnaissables',
    expected_age_months: 12,
    category: 'Développement linguistique',
    icon: 'talk'
  }
];

const MilestonesList: React.FC<MilestonesListProps> = ({ childId, birthDate }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [babyAgeMonths, setBabyAgeMonths] = useState<number>(0);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  useEffect(() => {
    // Calculer l'âge du bébé
    if (birthDate) {
      const birthDateObj = parseISO(birthDate);
      const ageInMonths = differenceInMonths(new Date(), birthDateObj);
      setBabyAgeMonths(ageInMonths);
    }
    
    // Si c'est une démo ou un test, utiliser les données par défaut
    if (!childId || childId === 'demo') {
      setMilestones(defaultMilestones);
      setCompletedMilestones(['1', '2']);
      setLoading(false);
      return;
    }
    
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const { supabase } = await import('@/integrations/supabase/client');
        
        // Récupérer les jalons de la base de données
        const { data, error } = await supabase
          .from('milestones')
          .select('*')
          .order('expected_age_months', { ascending: true });
          
        if (error) {
          console.error("Error fetching milestones:", error);
          // Fallback aux données par défaut
          setMilestones(defaultMilestones);
        } else {
          setMilestones(data || defaultMilestones);
        }
        
        // Récupérer les jalons complétés pour cet enfant
        const { data: completedData, error: completedError } = await supabase
          .from('completed_milestones')
          .select('milestone_id')
          .eq('child_id', childId);
          
        if (completedError) {
          console.error("Error fetching completed milestones:", completedError);
        } else {
          const completedIds = completedData ? completedData.map(item => item.milestone_id) : [];
          setCompletedMilestones(completedIds);
        }
      } catch (error) {
        console.error("Error in fetchMilestones:", error);
        // Fallback aux données par défaut
        setMilestones(defaultMilestones);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMilestones();
  }, [childId, birthDate]);
  
  const toggleMilestoneCompletion = async (milestoneId: string) => {
    const isCompleted = completedMilestones.includes(milestoneId);
    let newCompletedMilestones: string[];
    
    if (isCompleted) {
      newCompletedMilestones = completedMilestones.filter(id => id !== milestoneId);
    } else {
      newCompletedMilestones = [...completedMilestones, milestoneId];
    }
    
    setCompletedMilestones(newCompletedMilestones);
    
    // Pour le mode démo, ne pas essayer de sauvegarder en base de données
    if (!childId || childId === 'demo') {
      return;
    }
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (isCompleted) {
        // Supprimer le jalon complété
        await supabase
          .from('completed_milestones')
          .delete()
          .eq('child_id', childId)
          .eq('milestone_id', milestoneId);
      } else {
        // Ajouter le jalon complété
        await supabase
          .from('completed_milestones')
          .insert({
            child_id: childId,
            milestone_id: milestoneId,
            completed_date: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error("Error updating milestone completion:", error);
    }
  };
  
  const filteredMilestones = activeTab === 'all' 
    ? milestones 
    : activeTab === 'upcoming'
    ? milestones.filter(m => m.expected_age_months > babyAgeMonths && !completedMilestones.includes(m.id))
    : activeTab === 'completed'
    ? milestones.filter(m => completedMilestones.includes(m.id))
    : milestones.filter(m => m.category === activeTab);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Générer les options de catégorie pour les onglets
  const categories = Array.from(new Set(milestones.map(m => m.category)));
  
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Baby className="h-5 w-5 text-babybaby-cosmic" />
        {birthDate ? (
          <p className="text-sm font-medium">
            <span className="font-semibold">{babyAgeMonths}</span> mois ({format(parseISO(birthDate), 'dd/MM/yyyy', { locale: fr })})
          </p>
        ) : (
          <p className="text-sm font-medium">Âge non disponible</p>
        )}
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="completed">Complétés</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredMilestones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun jalon trouvé dans cette catégorie.
            </div>
          ) : (
            filteredMilestones.map(milestone => {
              const isCompleted = completedMilestones.includes(milestone.id);
              const isPast = milestone.expected_age_months <= babyAgeMonths;
              return (
                <div
                  key={milestone.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : isPast 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => toggleMilestoneCompletion(milestone.id)}
                      className={isCompleted ? 'bg-green-500 border-green-500' : ''}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-gray-900">
                        {milestone.title}
                      </h3>
                      <Badge variant={isCompleted ? "success" : isPast ? "default" : "outline"}>
                        {isCompleted 
                          ? 'Complété' 
                          : `${milestone.expected_age_months} mois`}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MilestonesList;
