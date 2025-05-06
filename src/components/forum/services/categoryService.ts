
import { supabase } from '@/integrations/supabase/client';
import { ForumCategory } from '../types';

/**
 * Récupère toutes les catégories du forum
 */
export const getAllCategories = async (): Promise<ForumCategory[]> => {
  try {
    // Récupérer les catégories depuis Supabase
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      throw new Error(`Erreur lors de la récupération des catégories: ${error.message}`);
    }

    return data || [];
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
    // Récupérer la catégorie depuis Supabase
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      throw new Error(`Erreur lors de la récupération de la catégorie: ${error.message}`);
    }

    return data || null;
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
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Erreur lors de la récupération de la catégorie: ${error.message}`);
    }

    return data || null;
  } catch (error) {
    console.error('Erreur dans getCategoryById:', error);
    return null;
  }
};

// Création d'un alias pour getAllCategories pour compatibilité avec l'existant
export const getCategories = getAllCategories;
