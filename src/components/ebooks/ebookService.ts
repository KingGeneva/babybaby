
import { Ebook } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

// Fonction pour enregistrer le téléchargement (optionnelle)
const recordDownload = async (ebook: Ebook) => {
  try {
    const { error } = await supabase
      .from('ebook_downloads')
      .insert({
        ebook_title: ebook.title,
        email: 'anonymous', // À remplacer par l'email de l'utilisateur si disponible
      });
      
    if (error) console.error("Erreur d'enregistrement du téléchargement:", error);
  } catch (err) {
    console.error("Erreur lors de l'enregistrement du téléchargement:", err);
  }
};

// Fonction pour obtenir l'URL de prévisualisation pour FlipBook
export const getPreviewUrl = async (ebook: Ebook): Promise<string | null> => {
  try {
    console.log(`getPreviewUrl: Obtention URL pour ${ebook.title} (${ebook.id})`);
    
    // Pour les fichiers PDF de démonstration, on utilise des liens statiques
    // C'est une solution de contournement pour éviter les problèmes de RLS dans Supabase
    const demoFiles = {
      'eb-001': 'https://pdfobject.com/pdf/sample.pdf',
      'eb-002': 'https://www.africau.edu/images/default/sample.pdf',
      'eb-003': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      'eb-004': 'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
      'eb-005': 'https://file-examples.com/storage/fed3a30f8bc4ca3efacbbab/2017/10/file-sample_150kB.pdf'
    };
    
    // Si nous avons une URL de démonstration pour cet ebook, l'utiliser
    if (ebook.id in demoFiles) {
      console.log(`getPreviewUrl: Utilisation de l'URL de démo pour ${ebook.id}`);
      return demoFiles[ebook.id as keyof typeof demoFiles];
    }
    
    // Tentative direct avec une URL publique d'abord (si disponible)
    if (ebook.fileUrl.startsWith('http')) {
      console.log("getPreviewUrl: URL directe détectée, utilisation sans signature");
      return ebook.fileUrl;
    }
    
    try {
      // Tentative de génération d'une URL publique temporaire
      const { data, error } = await supabase
        .storage
        .from('ebooks')
        .createSignedUrl(ebook.fileUrl, 7200); // URL valide pendant 2 heures
      
      if (error) {
        console.error("getPreviewUrl: Erreur lors de la création de l'URL signée:", error);
        
        // Tentative de fallback vers une URL publique
        const { data: publicUrlData } = await supabase
          .storage
          .from('ebooks')
          .getPublicUrl(ebook.fileUrl);
          
        if (publicUrlData && publicUrlData.publicUrl) {
          console.log("getPreviewUrl: URL publique obtenue comme fallback");
          return publicUrlData.publicUrl;
        }
        
        throw error;
      }
      
      if (!data || !data.signedUrl) {
        console.error("getPreviewUrl: Pas d'URL signée générée");
        throw new Error("Aucune URL signée générée");
      }
        
      console.log("getPreviewUrl: URL signée obtenue avec succès");
      return data.signedUrl;
    } catch (error) {
      console.error("getPreviewUrl: Erreur lors de la génération de l'URL:", error);
      // Tomber sur une URL de démo comme fallback final
      return 'https://pdfobject.com/pdf/sample.pdf';
    }
  } catch (error) {
    console.error("getPreviewUrl: Erreur critique:", error);
    // Tomber sur une URL de démo comme fallback final
    return 'https://pdfobject.com/pdf/sample.pdf';
  }
};

// Fonction utilitaire pour déterminer le type de contenu basé sur l'extension
const getContentType = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'epub':
      return 'application/epub+zip';
    case 'mobi':
      return 'application/x-mobipocket-ebook';
    default:
      return 'application/octet-stream';
  }
};

// Fonction pour précharger les ebooks populaires
export const preloadEbooks = async (ebooks: Ebook[]): Promise<void> => {
  try {
    // Limiter le nombre d'ebooks à précharger (max 3)
    const ebooksToPreload = ebooks.slice(0, 3);
    console.log(`preloadEbooks: Préchargement de ${ebooksToPreload.length} ebooks`);
    
    for (const ebook of ebooksToPreload) {
      try {
        // Créer une URL signée en avance
        const url = await getPreviewUrl(ebook);
        if (url) {
          console.log(`preloadEbooks: URL préchargée pour ${ebook.title}`);
          
          // Précharger l'image de couverture aussi
          if (ebook.coverImage) {
            const img = new Image();
            img.src = ebook.coverImage;
          }
        }
      } catch (err) {
        // Ignorer les erreurs individuelles pour ne pas bloquer les autres préchargements
        console.warn(`preloadEbooks: Échec du préchargement pour ${ebook.title}`, err);
      }
    }
    
  } catch (error) {
    console.error("preloadEbooks: Erreur générale:", error);
  }
};

// Fonction pour téléverser un nouvel ebook (pour l'administration)
export const uploadEbook = async (
  file: File, 
  metadata: { 
    title: string; 
    description: string; 
    category: string;
    coverImage?: File;
  }
): Promise<Ebook | null> => {
  try {
    // Générer un ID unique pour l'ebook
    const ebookId = `eb-${Date.now().toString().slice(-6)}`;
    
    // Préparer le chemin du fichier dans le stockage
    const filePath = `${ebookId}/${file.name.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Téléverser le fichier PDF
    const { error: uploadError } = await supabase
      .storage
      .from('ebooks')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error("Erreur lors du téléchargement du fichier:", uploadError);
      throw new Error(`Erreur lors du téléchargement: ${uploadError.message}`);
    }
    
    // Gérer l'image de couverture si fournie
    let coverImageUrl = `/placeholder.svg`;
    
    if (metadata.coverImage) {
      const coverImagePath = `${ebookId}/cover-${metadata.coverImage.name.replace(/\s+/g, '-').toLowerCase()}`;
      
      const { error: coverUploadError } = await supabase
        .storage
        .from('ebooks')
        .upload(coverImagePath, metadata.coverImage);
      
      if (!coverUploadError) {
        const { data: coverData } = await supabase
          .storage
          .from('ebooks')
          .getPublicUrl(coverImagePath);
        
        if (coverData) {
          coverImageUrl = coverData.publicUrl;
        }
      }
    }
    
    // Créer l'objet ebook
    const newEbook: Ebook = {
      id: ebookId,
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      fileUrl: filePath,
      coverImage: coverImageUrl,
      fileType: file.type || 'application/pdf',
      fileSize: `${Math.round(file.size / 1024)} Ko`,
      tags: [metadata.category, 'ebook'],
      uploadDate: new Date().toISOString()
    };
    
    // Dans un environnement réel, on enregistrerait aussi dans une base de données
    // Pour l'instant, on retourne simplement le nouvel ebook
    return newEbook;
    
  } catch (error) {
    console.error("Erreur lors du téléversement de l'ebook:", error);
    return null;
  }
};
