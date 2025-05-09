
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
    console.log('Fetching milestones for child:', childId);
    
    // Si c'est un mode démo, renvoyez des données de démonstration
    if (childId === 'demo') {
      console.log('Using demo milestones');
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
      
    if (milestonesError) {
      console.error('Error fetching milestones:', milestonesError);
      throw milestonesError;
    }
    
    console.log('Fetched milestones:', milestones);
    
    // Pour les besoins de cette application, nous allons utiliser
    // le champ achieved_date pour déterminer si un jalon est complété
    // Si achieved_date est défini, le jalon est complété
    const completedMilestones = milestones
      ? milestones
        .filter(milestone => milestone.achieved_date !== null && milestone.child_id === childId)
        .map(milestone => milestone.id)
      : [];
    
    console.log('Completed milestones:', completedMilestones);
    
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
    console.log(`Updating milestone ${milestoneId} for child ${childId}, currently completed: ${isCurrentlyCompleted}`);
    
    // Si mode démo, simuler la mise à jour
    if (childId === 'demo') {
      console.log(`Demo: ${isCurrentlyCompleted ? 'Suppression' : 'Ajout'} du jalon ${milestoneId}`);
      return;
    }
    
    // Mettre à jour le jalon en définissant ou en effaçant la date d'achèvement
    const { error } = await supabase
      .from('milestones')
      .update({ 
        achieved_date: isCurrentlyCompleted ? null : new Date().toISOString() 
      })
      .eq('id', milestoneId)
      .eq('child_id', childId);
      
    if (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
    
    console.log('Milestone update successful');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du jalon:', error);
  }
};

/**
 * Génère des jalons de démonstration pour le mode démo
 */
const getDemoMilestones = (): Milestone[] => {
  return [
    // Développement moteur (0-3 mois)
    {
      id: 'milestone-1',
      name: 'Soulève la tête en position ventrale',
      title: 'Contrôle de la tête',
      description: 'Le bébé peut soulever et maintenir sa tête pendant quelques secondes lorsqu'il est sur le ventre',
      expected_age_months: 1,
      category: 'Moteur'
    },
    {
      id: 'milestone-2',
      name: 'Suit des yeux un objet en mouvement',
      title: 'Suivi visuel',
      description: 'Le bébé peut suivre un objet qui se déplace lentement de gauche à droite dans son champ de vision',
      expected_age_months: 2,
      category: 'Visuel'
    },
    {
      id: 'milestone-3',
      name: 'Sourire social',
      title: 'Sourire en réponse',
      description: 'Le bébé commence à sourire en réaction à votre visage ou votre voix',
      expected_age_months: 2,
      category: 'Social'
    },
    
    // Développement moteur (4-6 mois)
    {
      id: 'milestone-4',
      name: 'Rouler du ventre au dos',
      title: 'Premier retournement',
      description: 'Le bébé peut se retourner du ventre vers le dos de façon volontaire',
      expected_age_months: 4,
      category: 'Moteur'
    },
    {
      id: 'milestone-5',
      name: 'Babiller',
      title: 'Premiers babillages',
      description: 'Le bébé commence à produire des sons variés comme "ba", "da", "ma"',
      expected_age_months: 5,
      category: 'Langage'
    },
    {
      id: 'milestone-6',
      name: 'Tenir assis avec support',
      title: 'Position assise avec aide',
      description: 'Le bébé peut rester assis avec un support pendant plusieurs minutes',
      expected_age_months: 5,
      category: 'Moteur'
    },
    {
      id: 'milestone-7',
      name: 'Saisir des objets',
      title: 'Préhension volontaire',
      description: 'Le bébé peut attraper et tenir des objets de façon intentionnelle',
      expected_age_months: 6,
      category: 'Moteur fin'
    },
    
    // Développement moteur (7-9 mois)
    {
      id: 'milestone-8',
      name: 'S'asseoir sans soutien',
      title: 'Position assise autonome',
      description: 'Le bébé peut s\'asseoir sans soutien pendant un moment',
      expected_age_months: 7,
      category: 'Moteur'
    },
    {
      id: 'milestone-9',
      name: 'Préhension en pince',
      title: 'Pince pouce-index',
      description: 'Le bébé utilise son pouce et son index pour saisir de petits objets',
      expected_age_months: 8,
      category: 'Moteur fin'
    },
    {
      id: 'milestone-10',
      name: 'Ramper',
      title: 'Déplacement au sol',
      description: 'Le bébé commence à se déplacer en rampant ou en se traînant',
      expected_age_months: 8,
      category: 'Moteur'
    },
    {
      id: 'milestone-11',
      name: 'Réagit à son prénom',
      title: 'Reconnaissance du prénom',
      description: 'Le bébé se retourne ou réagit quand on l\'appelle par son prénom',
      expected_age_months: 9,
      category: 'Social'
    },
    
    // Développement moteur (10-12 mois)
    {
      id: 'milestone-12',
      name: 'Se tenir debout avec support',
      title: 'Position debout avec aide',
      description: 'Le bébé peut se tenir debout en s\'appuyant sur un meuble',
      expected_age_months: 10,
      category: 'Moteur'
    },
    {
      id: 'milestone-13',
      name: 'Premiers mots',
      title: 'Communication verbale',
      description: 'Le bébé dit ses premiers mots reconnaissables comme "mama" ou "dada"',
      expected_age_months: 11,
      category: 'Langage'
    },
    {
      id: 'milestone-14',
      name: 'Marcher avec aide',
      title: 'Premiers pas assistés',
      description: 'Le bébé fait quelques pas en se tenant à vos mains ou à un meuble',
      expected_age_months: 11,
      category: 'Moteur'
    },
    {
      id: 'milestone-15',
      name: 'Premiers pas autonomes',
      title: 'Marcher sans aide',
      description: 'Le bébé fait ses premiers pas seul, sans soutien',
      expected_age_months: 12,
      category: 'Moteur'
    },
    
    // Développement moteur (au-delà de 12 mois)
    {
      id: 'milestone-16',
      name: 'Phrases de deux mots',
      title: 'Combinaison de mots',
      description: 'L\'enfant peut combiner deux mots pour former des phrases simples',
      expected_age_months: 18,
      category: 'Langage'
    },
    {
      id: 'milestone-17',
      name: 'Monte les escaliers',
      title: 'Monter les marches',
      description: 'L\'enfant peut monter les escaliers en tenant la rampe ou votre main',
      expected_age_months: 18,
      category: 'Moteur'
    },
    {
      id: 'milestone-18',
      name: 'Empiler des cubes',
      title: 'Construction simple',
      description: 'L\'enfant peut empiler 3 à 4 cubes les uns sur les autres',
      expected_age_months: 18,
      category: 'Moteur fin'
    }
  ];
};
