
import { Ebook } from './types';
import { toast } from 'sonner';

export const downloadEbook = async (ebook: Ebook): Promise<void> => {
  try {
    // Simuler un délai de téléchargement
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Vérifier si l'URL du fichier est disponible
    if (!ebook.fileUrl) {
      throw new Error("Lien de téléchargement non disponible");
    }
    
    // Dans un environnement de production, ceci serait remplacé par un vrai téléchargement
    // Pour la démo, nous ouvrons simplement l'URL dans un nouvel onglet
    window.open(ebook.fileUrl, '_blank');
    
    // Notification de succès
    toast.success(`${ebook.title} téléchargé avec succès`);
    
    // Log analytics (serait implémenté dans un environnement de production)
    console.log(`Ebook téléchargé: ${ebook.title} (${ebook.id})`);
    
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    toast.error(`Impossible de télécharger ${ebook.title}. Veuillez réessayer.`);
  }
};

// Fonction pour obtenir l'URL de prévisualisation (si disponible)
export const getPreviewUrl = (ebook: Ebook): string | null => {
  // Dans un environnement réel, cette fonction pourrait vérifier si une prévisualisation est disponible
  // et renvoyer son URL. Pour la démo, nous renvoyons simplement l'URL du fichier
  return ebook.fileUrl || null;
};
