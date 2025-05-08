
// Ce fichier exporte toutes les fonctionnalités des services ebook
// pour simplifier les imports ailleurs dans l'application

export { downloadEbook } from './downloadService';
export { getPreviewUrl } from './previewService';
export { preloadEbooks } from './preloadService';
export { uploadEbook } from './uploadService';
export { getDemoFileUrl, demoFiles } from './demoService';
export { recordDownload } from './analyticsService';
export { getContentType } from './utils';
