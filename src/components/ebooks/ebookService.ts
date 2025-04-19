
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ebook } from "./types";

export async function downloadEbook(ebook: Ebook): Promise<void> {
  try {
    console.log(`Tentative de téléchargement de: ${ebook.title} (fichier: ${ebook.downloadUrl})`);
    
    // Récupérer l'URL signée pour le téléchargement
    const { data, error } = await supabase
      .storage
      .from('ebooks')
      .createSignedUrl(ebook.downloadUrl, 60);
    
    if (error) {
      console.error('Erreur lors du téléchargement:', error);
      
      // Utiliser le mode démo comme solution de secours
      console.log('Utilisation du mode démo');
      const fallbackUrl = `https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf`;
      
      toast.info("Fichier non trouvé", {
        description: `Le fichier "${ebook.title}" n'est pas disponible actuellement. Un PDF d'exemple sera téléchargé à la place.`
      });
      
      window.open(fallbackUrl, '_blank');
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
    console.error('Erreur de téléchargement:', err);
    toast.error("Erreur de téléchargement", {
      description: "Une erreur s'est produite. Veuillez réessayer plus tard."
    });
  }
}
