
import { supabase } from '@/integrations/supabase/client';
import { ForumCategory } from '../types';
import { GenericSupabaseResponse } from '../utils/supabaseTypes';

/**
 * Récupère toutes les catégories du forum
 */
export const getAllCategories = async (): Promise<ForumCategory[]> => {
  try {
    // Récupérer les catégories depuis Supabase
    const response: GenericSupabaseResponse<ForumCategory[]> = await supabase
      .from('forum_categories')
      .select('*')
      .order('order', { ascending: true });

    if (response.error) {
      throw new Error(`Erreur lors de la récupération des catégories: ${response.error.message}`);
    }

    return response.data || [];
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
    const response: GenericSupabaseResponse<ForumCategory[]> = await supabase
      .from('forum_categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (response.error) {
      throw new Error(`Erreur lors de la récupération de la catégorie: ${response.error.message}`);
    }

    return response.data || null;
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
    const response: GenericSupabaseResponse<ForumCategory[]> = await supabase
      .from('forum_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (response.error) {
      throw new Error(`Erreur lors de la récupération de la catégorie: ${response.error.message}`);
    }

    return response.data || null;
  } catch (error) {
    console.error('Erreur dans getCategoryById:', error);
    return null;
  }
};
