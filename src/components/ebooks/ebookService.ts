
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ebook } from "./types";

export async function downloadEbook(ebook: Ebook): Promise<void> {
  try {
    console.log(`Tentative de téléchargement de: ${ebook.title} (fichier: ${ebook.downloadUrl})`);
    
    // Récupération de l'URL signée directement depuis Supabase
    const { data, error } = await supabase
      .storage
      .from('ebooks')
      .createSignedUrl(ebook.downloadUrl, 300); // Augmentation du délai à 5 minutes
    
    if (error) {
      console.error('Erreur lors de la création de l\'URL signée:', error);
      
      // Informer l'utilisateur
      toast.error("Erreur de téléchargement", {
        description: `Impossible de télécharger "${ebook.title}" pour le moment. Veuillez réessayer plus tard.`
      });
      return;
    }
    
    if (data?.signedUrl) {
      // Ouvrir dans un nouvel onglet et notifier l'utilisateur
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
    console.error('Erreur inattendue:', err);
    toast.error("Erreur système", {
      description: "Une erreur inattendue s'est produite. Nos équipes ont été informées."
    });
  }
}
