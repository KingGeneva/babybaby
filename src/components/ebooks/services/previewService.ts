
import { Ebook } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { getDemoFileUrl } from './demoService';

// Fonction pour obtenir l'URL de prévisualisation pour FlipBook
export const getPreviewUrl = async (ebook: Ebook): Promise<string | null> => {
  try {
    console.log(`getPreviewUrl: Obtention URL pour ${ebook.title} (${ebook.id})`);
    
    // Pour les fichiers PDF de démonstration, on utilise des liens statiques
    const demoFileUrl = getDemoFileUrl(ebook.id);
    if (demoFileUrl) {
      console.log(`getPreviewUrl: Utilisation de l'URL de démo pour ${ebook.id}`);
      return demoFileUrl;
    }
    
    // Tentative direct avec une URL publique d'abord (si disponible)
    if (ebook.fileUrl.startsWith('http')) {
      console.log("getPreviewUrl: URL directe détectée, utilisation sans signature");
      return ebook.fileUrl;
    }
    
    try {
      // Tentative de génération d'une URL publique temporaire
      const { data, error } = await supabase
        .storage
        .from('ebooks')
        .createSignedUrl(ebook.fileUrl, 7200); // URL valide pendant 2 heures
      
      if (error) {
        console.error("getPreviewUrl: Erreur lors de la création de l'URL signée:", error);
        
        // Tentative de fallback vers une URL publique
        const { data: publicUrlData } = await supabase
          .storage
          .from('ebooks')
          .getPublicUrl(ebook.fileUrl);
          
        if (publicUrlData && publicUrlData.publicUrl) {
          console.log("getPreviewUrl: URL publique obtenue comme fallback");
          return publicUrlData.publicUrl;
        }
        
        throw error;
      }
      
      if (!data || !data.signedUrl) {
        console.error("getPreviewUrl: Pas d'URL signée générée");
        throw new Error("Aucune URL signée générée");
      }
        
      console.log("getPreviewUrl: URL signée obtenue avec succès");
      return data.signedUrl;
    } catch (error) {
      console.error("getPreviewUrl: Erreur lors de la génération de l'URL:", error);
      // Tomber sur une URL de démo comme fallback final
      return 'https://pdfobject.com/pdf/sample.pdf';
    }
  } catch (error) {
    console.error("getPreviewUrl: Erreur critique:", error);
    // Tomber sur une URL de démo comme fallback final
    return 'https://pdfobject.com/pdf/sample.pdf';
  }
};
