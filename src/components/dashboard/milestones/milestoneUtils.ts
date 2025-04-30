
import { Milestone } from '@/types/milestone';
import { differenceInMonths, parseISO } from 'date-fns';

// Default milestones data
export const defaultMilestones: Milestone[] = [
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

// Calculate baby age in months
export const calculateBabyAgeMonths = (birthDate?: string): number => {
  if (!birthDate) return 0;
  return differenceInMonths(new Date(), parseISO(birthDate));
};

// Fetch milestones from database or use defaults
export const fetchMilestones = async (childId: string): Promise<{
  milestones: Milestone[];
  completedMilestones: string[];
}> => {
  // For demo purposes
  if (!childId || childId === 'demo') {
    return {
      milestones: defaultMilestones,
      completedMilestones: ['1', '2'],
    };
  }
  
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('child_id', childId)
      .order('expected_age_months', { ascending: true });
      
    if (error) {
      console.error("Error fetching milestones:", error);
      // Fallback to defaults
      return {
        milestones: defaultMilestones.map(milestone => ({
          ...milestone,
          child_id: childId
        })),
        completedMilestones: []
      };
    } 
    
    if (data && data.length > 0) {
      // Extract completed milestones
      const completed = data.filter(m => m.achieved_date).map(m => m.id);
      return {
        milestones: data,
        completedMilestones: completed
      };
    } else {
      // No milestones found for child, use defaults
      return {
        milestones: defaultMilestones.map(milestone => ({
          ...milestone,
          child_id: childId
        })),
        completedMilestones: []
      };
    }
  } catch (error) {
    console.error("Error in fetchMilestones:", error);
    // Fallback to defaults
    return {
      milestones: defaultMilestones.map(milestone => ({
        ...milestone,
        child_id: childId
      })),
      completedMilestones: []
    };
  }
};

// Toggle milestone completion status
export const updateMilestoneCompletion = async (
  childId: string,
  milestoneId: string,
  isCompleted: boolean
): Promise<void> => {
  // For demo mode, don't try to save to database
  if (!childId || childId === 'demo') {
    return;
  }
  
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    if (isCompleted) {
      // Update milestone to indicate it's not completed
      await supabase
        .from('milestones')
        .update({ achieved_date: null })
        .eq('id', milestoneId)
        .eq('child_id', childId);
    } else {
      // Update milestone to indicate it's completed
      await supabase
        .from('milestones')
        .update({ achieved_date: new Date().toISOString().split('T')[0] })
        .eq('id', milestoneId)
        .eq('child_id', childId);
    }
  } catch (error) {
    console.error("Error updating milestone completion:", error);
  }
};
