
// Fonction utilitaire pour déterminer le type de contenu basé sur l'extension
export const getContentType = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'epub':
      return 'application/epub+zip';
    case 'mobi':
      return 'application/x-mobipocket-ebook';
    default:
      return 'application/octet-stream';
  }
};
