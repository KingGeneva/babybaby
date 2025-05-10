
// Utilisation de PDFs fiables provenant de sources qui autorisent CORS ou utilisant des proxys
export const demoFiles: Record<string, string> = {
  'eb-001': 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
  'eb-002': 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  'eb-003': 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/TAMReview.pdf',
  'eb-004': 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/annotation-strikeout.pdf',
  'eb-005': 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/basicapi.pdf'
};

// Fonction pour obtenir l'URL de démonstration pour un ebook
export const getDemoFileUrl = (ebookId: string): string | null => {
  if (ebookId in demoFiles) {
    return demoFiles[ebookId];
  }
  // URL par défaut si l'ID n'est pas trouvé (utilisant GitHub qui autorise CORS)
  return 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
};

// Liste de URLs de fallback qui fonctionnent avec CORS
export const fallbackPdfUrls = [
  'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
  'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/TAMReview.pdf',
  'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/basicapi.pdf',
  'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/annotation-line.pdf'
];

// Fonction pour obtenir une URL de fallback
export let currentFallbackIndex = 0;
export const getNextFallbackUrl = (): string => {
  const url = fallbackPdfUrls[currentFallbackIndex];
  currentFallbackIndex = (currentFallbackIndex + 1) % fallbackPdfUrls.length;
  return url;
};

// Essaie de pré-vérifier si une URL est accessible
export const checkUrlAccess = async (url: string): Promise<boolean> => {
  try {
    // Utilise l'API fetch avec un timeout court pour tester rapidement l'accès
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-store',
      mode: 'cors' // Essaie en mode CORS
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error("URL inaccessible:", url, error);
    return false;
  }
};
