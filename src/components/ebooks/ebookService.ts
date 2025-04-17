
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Ebook } from "./types";

export async function downloadEbook(ebook: Ebook): Promise<void> {
  try {
    // Generate a signed URL for the PDF file
    const { data, error } = await supabase
      .storage
      .from('ebooks')
      .createSignedUrl(ebook.downloadUrl, 60); // 60 seconds expiration
    
    if (error) {
      console.error('Error generating download URL:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger l'ebook pour le moment. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
      return;
    }
    
    // Open the download link in a new tab
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
      
      toast({
        title: "Téléchargement démarré",
        description: `"${ebook.title}" est en cours de téléchargement.`,
      });
    }
  } catch (err) {
    console.error('Download error:', err);
    toast({
      title: "Erreur de téléchargement",
      description: "Une erreur s'est produite. Veuillez réessayer plus tard.",
      variant: "destructive",
    });
  }
}
