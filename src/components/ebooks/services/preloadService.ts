
import { Ebook } from '../types';
import { getPreviewUrl } from './previewService';

// Fonction pour précharger les ebooks populaires
export const preloadEbooks = async (ebooks: Ebook[]): Promise<void> => {
  try {
    // Limiter le nombre d'ebooks à précharger (max 3)
    const ebooksToPreload = ebooks.slice(0, 3);
    console.log(`preloadEbooks: Préchargement de ${ebooksToPreload.length} ebooks`);
    
    for (const ebook of ebooksToPreload) {
      try {
        // Créer une URL signée en avance
        const url = await getPreviewUrl(ebook);
        if (url) {
          console.log(`preloadEbooks: URL préchargée pour ${ebook.title}`);
          
          // Précharger l'image de couverture aussi
          if (ebook.coverImage) {
            const img = new Image();
            img.src = ebook.coverImage;
          }
        }
      } catch (err) {
        // Ignorer les erreurs individuelles pour ne pas bloquer les autres préchargements
        console.warn(`preloadEbooks: Échec du préchargement pour ${ebook.title}`, err);
      }
    }
    
  } catch (error) {
    console.error("preloadEbooks: Erreur générale:", error);
  }
};
