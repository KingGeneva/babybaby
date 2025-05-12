
import { toast } from 'sonner';

// Ensemble d'URLs de démonstration fiables pour les PDFs
export const demoFiles = [
  "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "https://www.orimi.com/pdf-test.pdf",
  "https://file-examples.com/wp-content/uploads/2017/10/file-sample_150kB.pdf"
];

let currentFallbackIndex = 0;

// Obtenir une URL de démo basée sur l'ID
export const getDemoFileUrl = (id: string): string => {
  // Correspondance entre IDs et fichiers de démo
  switch (id) {
    case "eb-001":
      return demoFiles[0];
    case "eb-002":
      return demoFiles[1];
    case "eb-003":
      return demoFiles[2];
    default:
      return demoFiles[3];
  }
};

// Obtenir la prochaine URL de fallback en rotation
export const getNextFallbackUrl = (): string => {
  const url = demoFiles[currentFallbackIndex];
  currentFallbackIndex = (currentFallbackIndex + 1) % demoFiles.length;
  return url;
};

// Obtenir toutes les URLs de fallback qui ne sont pas celle en cours
export const getFallbackUrls = (currentUrl: string): string[] => {
  return demoFiles.filter(url => url !== currentUrl);
};

// Vérifier si une URL est accessible
export const checkUrlAccess = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error(`Erreur d'accès à ${url}:`, error);
    return false;
  }
};

export const fallbackPdfUrls = demoFiles;
