
import { Ebook } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getContentType } from './utils';
import { recordDownload } from './analyticsService';

// Téléchargement d'un ebook
export const downloadEbook = async (ebook: Ebook): Promise<void> => {
  try {
    // Feedback de chargement
    toast.loading(`Préparation de ${ebook.title}...`);
    
    // Construction du chemin d'accès au bucket de stockage
    const bucketName = 'ebooks';
    const filePath = ebook.fileUrl;
    
    console.log(`Téléchargement de l'ebook depuis: bucket=${bucketName}, fichier=${filePath}`);
    
    // Si l'URL est déjà une URL complète (directe), on l'utilise directement
    if (filePath.startsWith('http')) {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${ebook.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      
      toast.dismiss();
      toast.success(`${ebook.title} téléchargé avec succès`);
      
      recordDownload(ebook);
      return;
    }
    
    // Téléchargement du fichier depuis Supabase Storage
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .download(filePath);
    
    if (error) {
      console.error("Erreur de stockage:", error);
      console.log("Détails de l'erreur:", JSON.stringify(error));
      throw new Error(`Erreur lors du téléchargement: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("Aucune donnée reçue");
    }
    
    // Création d'une URL à partir du fichier téléchargé
    const blob = new Blob([data], { type: getContentType(filePath) });
    const url = URL.createObjectURL(blob);
    
    // Mise en cache du PDF si service worker disponible
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_PDF',
        url: `/ebooks/${ebook.id}/content.pdf`,
        pdfBlob: blob
      });
    }
    
    // Ouverture ou téléchargement direct du fichier
    const link = document.createElement('a');
    link.href = url;
    
    // Utilisation du bon nom de fichier basé sur le titre de l'ebook
    let downloadFilename = `${ebook.title}.pdf`;
    
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Nettoyage de l'URL du blob après un délai
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
    
    // Notification de succès
    toast.dismiss();
    toast.success(`${ebook.title} téléchargé avec succès`);
    
    // Analytics
    console.log(`Ebook téléchargé: ${ebook.title} (${ebook.id})`);
    
    // Enregistrement optionnel des statistiques de téléchargement
    recordDownload(ebook);
    
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    toast.dismiss();
    toast.error(`Impossible de télécharger ${ebook.title}. Veuillez réessayer.`);
  }
};
