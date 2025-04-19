
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
      console.error('File not found:', ebook.downloadUrl);
      
      // Simuler un téléchargement puisque les fichiers PDF ne sont pas encore dans Supabase
      // En production, remplacer cette partie par un lien réel vers le fichier dans Supabase
      const mockPdfUrl = `https://pxynugnbikiwbsqdgewx.supabase.co/storage/v1/object/public/ebooks/${ebook.downloadUrl}`;
      
      // Dans cet exemple, on ouvre une URL simulée (qui ne fonctionnera pas en réalité sans les fichiers)
      window.open(mockPdfUrl, '_blank');
      
      toast.success("Téléchargement démarré", {
        description: `"${ebook.title}" est en cours de téléchargement.`
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
