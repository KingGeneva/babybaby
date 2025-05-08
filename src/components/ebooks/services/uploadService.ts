
import { Ebook } from '../types';
import { supabase } from '@/integrations/supabase/client';

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
