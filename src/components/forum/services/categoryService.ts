
import { supabase } from '@/integrations/supabase/client';
import { ForumCategory } from '../types';

/**
 * Récupère toutes les catégories du forum
 */
export const getAllCategories = async (): Promise<ForumCategory[]> => {
  try {
    // Simulation de catégories du forum tant que la table n'existe pas
    return [
      {
        id: 1,
        name: "Développement du bébé",
        description: "Discussions sur les étapes de croissance et développement",
        slug: "developpement",
        icon: "Baby",
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: "Santé et bien-être",
        description: "Questions médicales et bien-être du bébé",
        slug: "sante",
        icon: "Heart",
        order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error('Erreur dans getAllCategories:', error);
    return [];
  }
};

/**
 * Récupère une catégorie par son slug
 */
export const getCategoryBySlug = async (slug: string): Promise<ForumCategory | null> => {
  try {
    // Récupérer des catégories simulées
    const categories = await getAllCategories();
    const category = categories.find(c => c.slug === slug);
    return category || null;
  } catch (error) {
    console.error('Erreur dans getCategoryBySlug:', error);
    return null;
  }
};

/**
 * Récupère une catégorie par son ID
 */
export const getCategoryById = async (id: number): Promise<ForumCategory | null> => {
  try {
    const categories = await getAllCategories();
    const category = categories.find(c => c.id === id);
    return category || null;
  } catch (error) {
    console.error('Erreur dans getCategoryById:', error);
    return null;
  }
};

// Création d'un alias pour getAllCategories pour compatibilité avec l'existant
export const getCategories = getAllCategories;
