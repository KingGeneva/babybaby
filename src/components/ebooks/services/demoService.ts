
// Liste des URLs de démonstration fiables pour les ebooks
export const demoFiles: Record<string, string> = {
  "eb-001": "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
  "eb-002": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "eb-003": "https://www.africau.edu/images/default/sample.pdf",
  "eb-004": "https://www.orimi.com/pdf-test.pdf",
  "eb-005": "https://www.orimi.com/pdf-test.pdf",
  "eb-006": "https://www.africau.edu/images/default/sample.pdf",
  "eb-007": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
};

export const fallbackPdfUrls = [
  "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "https://www.africau.edu/images/default/sample.pdf",
];

let currentFallbackIndex = 0;

// Obtenir l'URL de démonstration pour un ID d'ebook spécifique
export const getDemoFileUrl = (ebookId: string): string => {
  return demoFiles[ebookId] || fallbackPdfUrls[0];
};

// Obtenir une URL de fallback suivante
export const getNextFallbackUrl = (): string => {
  currentFallbackIndex = (currentFallbackIndex + 1) % fallbackPdfUrls.length;
  return fallbackPdfUrls[currentFallbackIndex];
};

// Vérifier si une URL est accessible
export const checkUrlAccess = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
    });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'URL:", error);
    return false;
  }
};
