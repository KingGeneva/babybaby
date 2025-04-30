
import React, { useState, useEffect } from 'react';
import { Milestone } from '@/types/milestone';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import MilestoneItem from './milestones/MilestoneItem';
import MilestoneFilters from './milestones/MilestoneFilters';
import BabyAgeDisplay from './milestones/BabyAgeDisplay';
import { 
  calculateBabyAgeMonths, 
  fetchMilestones, 
  updateMilestoneCompletion 
} from './milestones/milestoneUtils';

interface MilestonesListProps {
  childId: string;
  birthDate?: string;
}

const MilestonesList: React.FC<MilestonesListProps> = ({ childId, birthDate }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [babyAgeMonths, setBabyAgeMonths] = useState<number>(0);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Calculate baby's age
    if (birthDate) {
      const ageInMonths = calculateBabyAgeMonths(birthDate);
      setBabyAgeMonths(ageInMonths);
    }
    
    // Fetch milestones data
    const loadMilestones = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchMilestones(childId);
        setMilestones(result.milestones);
        setCompletedMilestones(result.completedMilestones);
      } catch (err) {
        console.error('Error loading milestones:', err);
        setError("Erreur lors du chargement des jalons");
        // Ensure we have at least empty arrays to prevent rendering issues
        setMilestones([]);
        setCompletedMilestones([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadMilestones();
  }, [childId, birthDate]);
  
  const toggleMilestoneCompletion = async (milestoneId: string) => {
    try {
      const isCompleted = completedMilestones.includes(milestoneId);
      let newCompletedMilestones: string[];
      
      if (isCompleted) {
        newCompletedMilestones = completedMilestones.filter(id => id !== milestoneId);
      } else {
        newCompletedMilestones = [...completedMilestones, milestoneId];
      }
      
      setCompletedMilestones(newCompletedMilestones);
      
      // Update milestone completion in database
      await updateMilestoneCompletion(childId, milestoneId, isCompleted);
    } catch (err) {
      console.error('Error toggling milestone:', err);
    }
  };
  
  // Filter milestones based on active tab
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
  
  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        <p>{error}</p>
        <p className="mt-2">Utilisation des données de démonstration.</p>
      </div>
    );
  }
  
  // Generate unique categories for filters
  const categories = Array.from(
    new Set(milestones.map(m => m.category).filter(Boolean) as string[])
  );
  
  return (
    <div>
      <BabyAgeDisplay babyAgeMonths={babyAgeMonths} birthDate={birthDate} />
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <MilestoneFilters categories={categories} activeTab={activeTab} />
        
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
                <MilestoneItem
                  key={milestone.id}
                  milestone={milestone}
                  isCompleted={isCompleted}
                  isPast={isPast}
                  onToggleCompletion={toggleMilestoneCompletion}
                />
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MilestonesList;
