
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ebook } from "./types";

export async function downloadEbook(ebook: Ebook): Promise<void> {
  try {
    console.log(`Tentative de téléchargement de: ${ebook.title} (fichier: ${ebook.downloadUrl})`);
    
    // Récupérer les métadonnées du fichier directement au lieu de faire une recherche
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('ebooks')
      .createSignedUrl(ebook.downloadUrl, 60);
    
    if (fileError) {
      console.error('Erreur lors du téléchargement:', fileError);
      
      // Vérifier si nous avons les fichiers connus en Supabase
      const knownFiles = {
        "sommeil-bebe-techniques.pdf": "sommeil-bebe-astuces.pdf",
        "Les_6_premiers_mois_Guide_complet_babybaby.pdf": "Les 6 premiers mois - Guide complet.pdf"
      };
      
      // Vérifier si nous avons une correspondance pour ce fichier
      const correctFileName = knownFiles[ebook.downloadUrl];
      
      if (correctFileName) {
        console.log(`Tentative avec le nom de fichier correct: ${correctFileName}`);
        
        // Tenter à nouveau avec le nom de fichier corrigé
        const { data, error } = await supabase
          .storage
          .from('ebooks')
          .createSignedUrl(correctFileName, 60);
        
        if (error || !data?.signedUrl) {
          throw new Error(`Échec avec le nom corrigé: ${error?.message}`);
        }
        
        // Ouvrir dans un nouvel onglet et notifier l'utilisateur
        window.open(data.signedUrl, '_blank');
        toast.success("Téléchargement démarré", {
          description: `"${ebook.title}" est en cours de téléchargement.`
        });
        return;
      }
      
      // Utiliser le mode démo comme solution de secours
      console.log('Utilisation du mode démo');
      const fallbackUrl = `https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf`;
      
      toast.info("Utilisation du mode démo", {
        description: `Les PDF spécifiques ne sont pas trouvés. Un PDF d'exemple sera téléchargé à la place de "${ebook.title}".`
      });
      
      window.open(fallbackUrl, '_blank');
      toast.success("Téléchargement démarré", {
        description: `Un exemple de PDF est en cours de téléchargement.`
      });
      return;
    }
    
    if (fileData?.signedUrl) {
      // Ouvrir dans un nouvel onglet et notifier l'utilisateur
      window.open(fileData.signedUrl, '_blank');
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
