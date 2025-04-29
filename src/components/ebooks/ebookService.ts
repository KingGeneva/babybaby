
import { Ebook } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const downloadEbook = async (ebook: Ebook): Promise<void> => {
  try {
    // Simulate a brief loading delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get the actual filename from the database or use the one from the ebook object
    const filename = ebook.fileUrl.split('/').pop() || 'sommeil-bebe-astuces.pdf';
    
    // For the specific ebook "Le sommeil du bébé" we know the exact filename
    const actualFilename = ebook.title === "Les secrets d'un sommeil paisible" ? 
      'sommeil-bebe-astuces.pdf' : filename;
    
    // Construct the path to access from storage bucket
    const bucketName = 'ebooks';
    const filePath = actualFilename;
    
    // Download the file from Supabase Storage
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .download(filePath);
    
    if (error) {
      throw new Error(`Erreur lors du téléchargement: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("Aucune donnée reçue");
    }
    
    // Create a blob URL from the downloaded file
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Open the file in a new tab
    window.open(url, '_blank');
    
    // Clean up the blob URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
    
    // Notification de succès
    toast.success(`${ebook.title} téléchargé avec succès`);
    
    // Log analytics
    console.log(`Ebook téléchargé: ${ebook.title} (${ebook.id})`);
    
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    toast.error(`Impossible de télécharger ${ebook.title}. Veuillez réessayer.`);
  }
};

// Fonction pour obtenir l'URL de prévisualisation (si disponible)
export const getPreviewUrl = (ebook: Ebook): string | null => {
  // Dans un environnement réel, cette fonction pourrait vérifier si une prévisualisation est disponible
  // et renvoyer son URL. Pour la démo, nous renvoyons simplement l'URL du fichier
  return ebook.fileUrl || null;
};
