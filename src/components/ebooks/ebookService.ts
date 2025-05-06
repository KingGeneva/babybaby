
import { Ebook } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const downloadEbook = async (ebook: Ebook): Promise<void> => {
  try {
    // Start loading feedback
    toast.loading(`Préparation de ${ebook.title}...`);
    
    // Construct the path to access from storage bucket
    const bucketName = 'ebooks';
    const filePath = ebook.fileUrl;
    
    console.log(`Téléchargement de l'ebook: ${ebook.title}, depuis le bucket: ${bucketName}, fichier: ${filePath}`);
    
    // Download the file from Supabase Storage
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .download(filePath);
    
    if (error) {
      console.error("Erreur de stockage:", error);
      throw new Error(`Erreur lors du téléchargement: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("Aucune donnée reçue");
    }
    
    // Create a blob URL from the downloaded file
    const blob = new Blob([data], { type: getContentType(filePath) });
    const url = URL.createObjectURL(blob);
    
    // Open the file in a new tab or download it directly
    const link = document.createElement('a');
    link.href = url;
    link.download = filePath; // Utiliser directement le nom du fichier pour éviter les erreurs
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
    
    // Success notification
    toast.success(`${ebook.title} téléchargé avec succès`);
    
    // Log analytics
    console.log(`Ebook téléchargé: ${ebook.title} (${ebook.id})`);
    
    // Optionally record download analytics
    recordDownload(ebook);
    
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    toast.error(`Impossible de télécharger ${ebook.title}. Veuillez réessayer.`);
  }
};

// Fonction pour enregistrer le téléchargement (optionnelle)
const recordDownload = async (ebook: Ebook) => {
  try {
    console.log("Tentative d'enregistrement du téléchargement pour:", ebook.title);
    const { error } = await supabase
      .from('ebook_downloads')
      .insert({
        ebook_title: ebook.title,
        email: 'anonymous', // À remplacer par l'email de l'utilisateur connecté si disponible
      });
      
    if (error) console.error("Erreur d'enregistrement du téléchargement:", error);
  } catch (err) {
    console.error("Erreur lors de l'enregistrement du téléchargement:", err);
  }
};

// Function to get preview URL (if available)
export const getPreviewUrl = async (ebook: Ebook): Promise<string | null> => {
  try {
    const { data } = await supabase
      .storage
      .from('ebooks')
      .createSignedUrl(ebook.fileUrl, 3600); // URL valide pendant 1 heure
      
    return data?.signedUrl || null;
  } catch (error) {
    console.error("Erreur lors de la création de l'URL signée:", error);
    return null;
  }
};

// Helper function to determine content type based on file extension
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

// Function pour télécharger un nouvel ebook dans le bucket
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
    // 1. Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    const { error: fileError } = await supabase
      .storage
      .from('ebooks')
      .upload(fileName, file);
      
    if (fileError) throw fileError;
    
    // 2. Upload cover image if provided
    let coverImagePath = '/lovable-uploads/placeholder-cover.png'; // Default fallback
    
    if (metadata.coverImage) {
      const coverFileName = `covers/${Date.now()}-${metadata.coverImage.name.replace(/\s+/g, '-')}`;
      
      const { error: coverError } = await supabase
        .storage
        .from('ebooks')
        .upload(coverFileName, metadata.coverImage);
        
      if (!coverError) {
        const { data: coverData } = await supabase
          .storage
          .from('ebooks')
          .getPublicUrl(coverFileName);
          
        coverImagePath = coverData.publicUrl;
      } else {
        console.error("Erreur lors de l'upload de la couverture:", coverError);
      }
    }
    
    // 3. Créer un nouvel objet ebook
    const newEbook: Ebook = {
      id: `eb-${Date.now()}`,
      title: metadata.title,
      description: metadata.description,
      coverImage: coverImagePath,
      fileUrl: fileName,
      fileType: file.name.split('.').pop()?.toUpperCase() || 'PDF',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      category: metadata.category,
      tags: [metadata.category.toLowerCase()],
      author: 'BabyBaby',
      publishDate: new Date().toISOString().split('T')[0]
    };
    
    // Retourner le nouvel ebook
    return newEbook;
    
  } catch (error) {
    console.error("Erreur lors de l'upload de l'ebook:", error);
    return null;
  }
};
