
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
    name: 'Premiers sourires',
    title: 'Premiers sourires',
    description: 'Commence à sourire en réponse aux stimuli',
    expected_age_months: 2,
    category: 'Développement social',
    icon: 'smile',
    child_id: 'demo',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Tient sa tête',
    title: 'Tient sa tête',
    description: 'Capable de tenir sa tête droite sans support',
    expected_age_months: 3,
    category: 'Développement moteur',
    icon: 'head',
    child_id: 'demo',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Se retourne',
    title: 'Se retourne',
    description: 'Se retourne du ventre au dos et vice versa',
    expected_age_months: 5,
    category: 'Développement moteur',
    icon: 'rotate',
    child_id: 'demo',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'S\'assoit seul',
    title: 'S\'assoit seul',
    description: 'Capable de s\'asseoir sans support',
    expected_age_months: 6,
    category: 'Développement moteur',
    icon: 'sit',
    child_id: 'demo',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Premiers mots',
    title: 'Premiers mots',
    description: 'Commence à dire des mots reconnaissables',
    expected_age_months: 12,
    category: 'Développement linguistique',
    icon: 'talk',
    child_id: 'demo',
    created_at: new Date().toISOString(),
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
          .eq('child_id', childId)
          .order('expected_age_months', { ascending: true });
          
        if (error) {
          console.error("Error fetching milestones:", error);
          // Fallback aux données par défaut
          setMilestones(defaultMilestones.map(milestone => ({
            ...milestone,
            child_id: childId
          })));
        } else if (data && data.length > 0) {
          setMilestones(data);
          // Prendre note des jalons déjà complétés
          const completed = data.filter(m => m.achieved_date).map(m => m.id);
          setCompletedMilestones(completed);
        } else {
          // Si aucun jalon n'est trouvé pour cet enfant, utiliser les jalons par défaut
          const customizedDefaultMilestones = defaultMilestones.map(milestone => ({
            ...milestone,
            child_id: childId
          }));
          setMilestones(customizedDefaultMilestones);
        }
      } catch (error) {
        console.error("Error in fetchMilestones:", error);
        // Fallback aux données par défaut
        setMilestones(defaultMilestones.map(milestone => ({
          ...milestone,
          child_id: childId
        })));
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
      const milestone = milestones.find(m => m.id === milestoneId);
      
      if (!milestone) return;
      
      if (isCompleted) {
        // Mettre à jour le jalon pour indiquer qu'il n'est pas complété
        await supabase
          .from('milestones')
          .update({ 
            achieved_date: null 
          })
          .eq('id', milestoneId)
          .eq('child_id', childId);
      } else {
        // Mettre à jour le jalon pour indiquer qu'il est complété
        await supabase
          .from('milestones')
          .update({
            achieved_date: new Date().toISOString().split('T')[0]
          })
          .eq('id', milestoneId)
          .eq('child_id', childId);
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
  const categories = Array.from(new Set(milestones.map(m => m.category).filter(Boolean) as string[]));
  
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
                        {milestone.title || milestone.name}
                      </h3>
                      <Badge variant={isCompleted ? "default" : isPast ? "secondary" : "outline"} 
                        className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}>
                        {isCompleted 
                          ? 'Complété' 
                          : `${milestone.expected_age_months} mois`}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{milestone.description || milestone.notes}</p>
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
