
// Pour les fichiers PDF de démonstration, on utilise des liens statiques
// C'est une solution de contournement pour éviter les problèmes de RLS dans Supabase
export const demoFiles: Record<string, string> = {
  'eb-001': 'https://pdfobject.com/pdf/sample.pdf',
  'eb-002': 'https://www.africau.edu/images/default/sample.pdf',
  'eb-003': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'eb-004': 'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
  'eb-005': 'https://file-examples.com/storage/fed3a30f8bc4ca3efacbbab/2017/10/file-sample_150kB.pdf'
};

// Fonction pour obtenir l'URL de démonstration pour un ebook
export const getDemoFileUrl = (ebookId: string): string | null => {
  if (ebookId in demoFiles) {
    return demoFiles[ebookId];
  }
  return null;
};
