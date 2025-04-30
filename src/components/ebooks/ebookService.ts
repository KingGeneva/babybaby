
import { Ebook } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const downloadEbook = async (ebook: Ebook): Promise<void> => {
  try {
    // Start loading feedback
    toast.loading(`Préparation de ${ebook.title}...`);
    
    // Get the actual filename - use the last part of the URL path
    const filename = ebook.fileUrl.split('/').pop() || 'ebook.pdf';
    
    // Construct the path to access from storage bucket
    const bucketName = 'ebooks';
    
    // Download the file from Supabase Storage
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .download(filename);
    
    if (error) {
      console.error("Storage error:", error);
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
    
    // Success notification
    toast.success(`${ebook.title} téléchargé avec succès`);
    
    // Log analytics
    console.log(`Ebook téléchargé: ${ebook.title} (${ebook.id})`);
    
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    toast.error(`Impossible de télécharger ${ebook.title}. Veuillez réessayer.`);
  }
};

// Function to get preview URL (if available)
export const getPreviewUrl = (ebook: Ebook): string | null => {
  return ebook.fileUrl || null;
};
