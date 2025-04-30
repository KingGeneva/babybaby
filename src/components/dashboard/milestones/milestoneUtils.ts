
import { supabase } from '@/integrations/supabase/client';
import { Milestone } from '@/types/milestone';

/**
 * Calcule l'âge du bébé en mois à partir de sa date de naissance
 */
export const calculateBabyAgeMonths = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const now = new Date();
  
  let months = (now.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += now.getMonth();
  
  // Ajustement si le jour du mois actuel est avant le jour de naissance
  if (now.getDate() < birth.getDate()) {
    months--;
  }
  
  return Math.max(0, months);
};

/**
 * Récupère tous les jalons et les jalons complétés pour un enfant
 */
export const fetchMilestones = async (childId: string) => {
  try {
    // Si c'est un mode démo, renvoyez des données de démonstration
    if (childId === 'demo') {
      const demoMilestones = getDemoMilestones();
      return {
        milestones: demoMilestones,
        completedMilestones: ['milestone-1', 'milestone-3']
      };
    }
    
    // Récupérer tous les jalons disponibles
    const { data: milestones, error: milestonesError } = await supabase
      .from('milestones')
      .select('*')
      .order('expected_age_months', { ascending: true });
      
    if (milestonesError) throw milestonesError;
    
    // Récupérer les jalons complétés pour cet enfant
    const { data: completions, error: completionsError } = await supabase
      .from('milestone_completions')
      .select('milestone_id')
      .eq('child_id', childId);
      
    if (completionsError) throw completionsError;
    
    // Extraire les IDs des jalons complétés
    const completedMilestones = completions ? completions.map(c => c.milestone_id) : [];
    
    return {
      milestones: milestones || [],
      completedMilestones
    };
  } catch (error) {
    console.error('Erreur lors du chargement des jalons:', error);
    // En cas d'erreur, renvoyer des données de démonstration
    const demoMilestones = getDemoMilestones();
    return {
      milestones: demoMilestones,
      completedMilestones: []
    };
  }
};

/**
 * Met à jour l'état de complétion d'un jalon
 */
export const updateMilestoneCompletion = async (childId: string, milestoneId: string, isCurrentlyCompleted: boolean) => {
  try {
    // Si mode démo, simuler la mise à jour
    if (childId === 'demo') {
      console.log(`Demo: ${isCurrentlyCompleted ? 'Suppression' : 'Ajout'} du jalon ${milestoneId}`);
      return;
    }
    
    if (isCurrentlyCompleted) {
      // Supprimer l'enregistrement si le jalon est déjà complété
      await supabase
        .from('milestone_completions')
        .delete()
        .eq('child_id', childId)
        .eq('milestone_id', milestoneId);
    } else {
      // Ajouter un nouvel enregistrement si le jalon n'est pas complété
      await supabase
        .from('milestone_completions')
        .insert({
          child_id: childId,
          milestone_id: milestoneId,
          completed_at: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du jalon:', error);
  }
};

/**
 * Génère des jalons de démonstration pour le mode démo
 */
const getDemoMilestones = (): Milestone[] => {
  return [
    {
      id: 'milestone-1',
      name: 'Sourire',
      title: 'Sourire',
      description: 'Le bébé commence à sourire en réponse à votre voix ou à votre visage',
      expected_age_months: 1,
      category: 'Social'
    },
    {
      id: 'milestone-2',
      name: 'Tenir sa tête',
      title: 'Tenir sa tête',
      description: 'Le bébé peut tenir sa tête droite sans aide pendant quelques instants',
      expected_age_months: 2,
      category: 'Moteur'
    },
    {
      id: 'milestone-3',
      name: 'Rire aux éclats',
      title: 'Rire aux éclats',
      description: 'Le bébé commence à rire en réponse à des stimuli',
      expected_age_months: 3,
      category: 'Social'
    },
    {
      id: 'milestone-4',
      name: 'Rouler',
      title: 'Rouler du ventre au dos',
      description: 'Le bébé peut rouler du ventre au dos',
      expected_age_months: 4,
      category: 'Moteur'
    },
    {
      id: 'milestone-5',
      name: 'Babiller',
      title: 'Babiller',
      description: 'Le bébé commence à produire des sons variés comme "ba", "da", "ma"',
      expected_age_months: 5,
      category: 'Langage'
    },
    {
      id: 'milestone-6',
      name: 'S\'asseoir',
      title: 'S\'asseoir sans soutien',
      description: 'Le bébé peut s\'asseoir sans soutien pendant un moment',
      expected_age_months: 6,
      category: 'Moteur'
    },
    {
      id: 'milestone-7',
      name: 'Ramper',
      title: 'Commencer à ramper',
      description: 'Le bébé commence à se déplacer en rampant',
      expected_age_months: 8,
      category: 'Moteur'
    },
    {
      id: 'milestone-8',
      name: 'Premiers mots',
      title: 'Premiers mots',
      description: 'Le bébé dit ses premiers mots reconnaissables comme "mama" ou "dada"',
      expected_age_months: 10,
      category: 'Langage'
    },
    {
      id: 'milestone-9',
      name: 'Marcher',
      title: 'Premiers pas',
      description: 'Le bébé fait ses premiers pas seul',
      expected_age_months: 12,
      category: 'Moteur'
    },
    {
      id: 'milestone-10',
      name: 'Phrases simples',
      title: 'Phrases simples',
      description: 'L\'enfant peut combiner deux mots pour former des phrases simples',
      expected_age_months: 18,
      category: 'Langage'
    }
  ];
};
