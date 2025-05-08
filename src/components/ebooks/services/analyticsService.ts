
import { Ebook } from '../types';
import { supabase } from '@/integrations/supabase/client';

// Fonction pour enregistrer le téléchargement (optionnelle)
export const recordDownload = async (ebook: Ebook) => {
  try {
    const { error } = await supabase
      .from('ebook_downloads')
      .insert({
        ebook_title: ebook.title,
        email: 'anonymous', // À remplacer par l'email de l'utilisateur si disponible
      });
      
    if (error) console.error("Erreur d'enregistrement du téléchargement:", error);
  } catch (err) {
    console.error("Erreur lors de l'enregistrement du téléchargement:", err);
  }
};
