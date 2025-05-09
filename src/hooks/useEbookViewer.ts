
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Ebook } from '@/components/ebooks/types';
import { ebooksData } from '@/components/ebooks/ebooksData';
import { getDemoFileUrl, fallbackPdfUrls } from '@/components/ebooks/services/demoService';

export const useEbookViewer = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.log("EbookViewerPage: Initialisation avec ID:", id);
    
    // Réinitialiser l'état
    setIsLoading(true);
    setError(null);
    
    // Rechercher l'ebook dans nos données
    const foundEbook = ebooksData.find(e => e.id === id);
    
    if (foundEbook) {
      console.log("EbookViewerPage: Ebook trouvé:", foundEbook.title);
      setEbook(foundEbook);
      
      try {
        console.log("EbookViewerPage: Obtention de l'URL de prévisualisation...");
        
        // Obtenir une URL de démonstration fiable basée sur l'ID de l'ebook
        const demoUrl = getDemoFileUrl(foundEbook.id);
        
        if (demoUrl) {
          console.log("EbookViewerPage: URL de démonstration sélectionnée:", demoUrl);
          setPdfUrl(demoUrl);
          setError(null);
        } else {
          // Fallback sur la première URL de la liste si pas d'URL spécifique
          const fallbackUrl = fallbackPdfUrls[0];
          console.log("EbookViewerPage: URL de fallback utilisée:", fallbackUrl);
          setPdfUrl(fallbackUrl);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("EbookViewerPage: Erreur lors du chargement du PDF:", error);
        // En cas d'erreur, utiliser la première URL de fallback
        setPdfUrl(fallbackPdfUrls[0]);
        setError("Une erreur temporaire est survenue. Nous avons chargé une version de démonstration.");
        setIsLoading(false);
        toast({
          title: "Attention",
          description: "Version de démonstration chargée. Certaines fonctionnalités peuvent être limitées.",
          variant: "default"
        });
      }
    } else {
      console.error("EbookViewerPage: Ebook non trouvé avec ID:", id);
      toast({
        title: "Livre non trouvé",
        description: "Le livre que vous recherchez n'existe pas.",
        variant: "destructive"
      });
      navigate('/ebooks');
    }
  }, [id, navigate, toast, retryCount]);

  // Fonction pour réessayer le chargement
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    ebook,
    pdfUrl,
    isLoading,
    error,
    handleRetry
  };
};
