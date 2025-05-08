
// Ce fichier est maintenant un simple réexport des services séparés
// pour maintenir la compatibilité avec le code existant

import { 
  downloadEbook, 
  getPreviewUrl, 
  preloadEbooks, 
  uploadEbook, 
  getContentType
} from './services';

// Réexporter toutes les fonctions pour maintenir la compatibilité
export { 
  downloadEbook, 
  getPreviewUrl, 
  preloadEbooks, 
  uploadEbook, 
  getContentType 
};
