
// Pour les fichiers PDF de démonstration, on utilise des liens statiques
// C'est une solution de contournement pour éviter les problèmes d'accès aux PDFs
export const demoFiles: Record<string, string> = {
  'eb-001': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'eb-002': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // URL ultra-fiable de W3C
  'eb-003': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'eb-004': 'https://www.orimi.com/pdf-test.pdf', // URL alternative fiable
  'eb-005': 'https://www.clickdimensions.com/links/TestPDFfile.pdf' // Autre URL fiable
};

// Fonction pour obtenir l'URL de démonstration pour un ebook
export const getDemoFileUrl = (ebookId: string): string | null => {
  if (ebookId in demoFiles) {
    return demoFiles[ebookId];
  }
  // URL par défaut si l'ID n'est pas trouvé
  return 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
};

// Liste de URLs de fallback en cas d'échec du chargement
export const fallbackPdfUrls = [
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'https://www.orimi.com/pdf-test.pdf',
  'https://www.clickdimensions.com/links/TestPDFfile.pdf'
];

// Fonction pour obtenir une URL de fallback
export let currentFallbackIndex = 0;
export const getNextFallbackUrl = (): string => {
  const url = fallbackPdfUrls[currentFallbackIndex];
  currentFallbackIndex = (currentFallbackIndex + 1) % fallbackPdfUrls.length;
  return url;
};
