
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ebook } from "./types";

export async function downloadEbook(ebook: Ebook): Promise<void> {
  try {
    // Check if the bucket exists first
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      console.error('Error checking buckets:', bucketsError);
      toast.error("Erreur de téléchargement", {
        description: "Configuration de stockage incorrecte. Veuillez contacter l'assistance."
      });
      return;
    }
    
    const ebooksBucketExists = buckets?.some(bucket => bucket.name === 'ebooks');
    
    if (!ebooksBucketExists) {
      console.error('Ebooks bucket does not exist');
      toast.error("Erreur de téléchargement", {
        description: "Le stockage des ebooks n'est pas configuré. Veuillez contacter l'assistance."
      });
      return;
    }
    
    // If we reach here, the bucket exists, so try to generate the download URL
    const { data, error } = await supabase
      .storage
      .from('ebooks')
      .createSignedUrl(ebook.downloadUrl, 60);
    
    if (error) {
      console.error('Error generating download URL:', error);
      
      // More specific error message based on error code
      if (error.message.includes('not found')) {
        toast.error("Fichier non trouvé", {
          description: `Le fichier "${ebook.title}" n'existe pas dans notre bibliothèque actuellement.`
        });
      } else {
        toast.error("Erreur de téléchargement", {
          description: "Impossible de télécharger l'ebook pour le moment. Veuillez réessayer plus tard."
        });
      }
      return;
    }
    
    if (data?.signedUrl) {
      // Open in a new tab and notify user
      window.open(data.signedUrl, '_blank');
      toast.success("Téléchargement démarré", {
        description: `"${ebook.title}" est en cours de téléchargement.`
      });
    } else {
      toast.error("Lien non généré", {
        description: "Impossible de générer le lien de téléchargement."
      });
    }
  } catch (err) {
    console.error('Download error:', err);
    toast.error("Erreur de téléchargement", {
      description: "Une erreur s'est produite. Veuillez réessayer plus tard."
    });
  }
}
