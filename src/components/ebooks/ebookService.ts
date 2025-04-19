
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ebook } from "./types";

export async function downloadEbook(ebook: Ebook): Promise<void> {
  try {
    // On vérifie d'abord si le fichier existe en essayant de récupérer ses métadonnées
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('ebooks')
      .list('', {
        search: ebook.downloadUrl
      });
    
    if (fileError || !fileData || fileData.length === 0) {
      console.log('File not found in Supabase storage, using fallback method');
      
      // Puisque les fichiers ne sont pas encore dans Supabase, on utilise un lien de téléchargement direct
      // En production, ces fichiers devraient être téléchargés dans le bucket Supabase
      
      // On peut utiliser des PDF d'exemple d'Adobe pour simuler les téléchargements
      const fallbackUrl = `https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf`;
      
      // Pour être plus claire, montrer à l'utilisateur quel fichier il télécharge
      toast.info("Utilisation du mode démo", {
        description: `Les PDF réels ne sont pas encore chargés. Un PDF d'exemple sera téléchargé à la place de "${ebook.title}".`
      });
      
      // Ouvrir le lien dans un nouvel onglet
      window.open(fallbackUrl, '_blank');
      
      toast.success("Téléchargement démarré", {
        description: `Un exemple de PDF est en cours de téléchargement.`
      });
      return;
    }
    
    // Si le fichier existe, on génère une URL signée
    const { data, error } = await supabase
      .storage
      .from('ebooks')
      .createSignedUrl(ebook.downloadUrl, 60);
    
    if (error) {
      console.error('Error generating download URL:', error);
      
      // Message d'erreur plus spécifique basé sur le code d'erreur
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
    console.error('Download error:', err);
    toast.error("Erreur de téléchargement", {
      description: "Une erreur s'est produite. Veuillez réessayer plus tard."
    });
  }
}
