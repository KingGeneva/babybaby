
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Ebook } from '@/components/ebooks/types';
import { ebooksData } from '@/components/ebooks/ebooksData';
import { getPreviewUrl } from '@/components/ebooks/ebookService';

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
      
      // Obtenir une URL pour le PDF (avec URLs de démo en fallback)
      const loadPdfUrl = async () => {
        try {
          console.log("EbookViewerPage: Obtention de l'URL de prévisualisation...");
          
          // URLs de démo pour le développement (permet d'éviter les problèmes d'authentification)
          const demoUrls: Record<string, string> = {
            'eb-001': 'https://pdfobject.com/pdf/sample.pdf',
            'eb-002': 'https://www.africau.edu/images/default/sample.pdf',
            'eb-003': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            'eb-004': 'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
            'eb-005': 'https://file-examples.com/storage/fed3a30f8bc4ca3efacbbab/2017/10/file-sample_150kB.pdf'
          };
          
          // Utiliser une URL de démo si disponible, sinon essayer de récupérer l'URL via le service
          let url;
          if (id && id in demoUrls) {
            url = demoUrls[id];
            console.log("EbookViewerPage: Utilisation URL de démo:", url);
          } else {
            url = await getPreviewUrl(foundEbook);
          }
          
          if (url) {
            console.log("EbookViewerPage: URL obtenue avec succès:", url);
            setPdfUrl(url);
            setError(null);
          } else {
            throw new Error("Impossible d'obtenir l'URL de prévisualisation");
          }
        } catch (error) {
          console.error("EbookViewerPage: Erreur lors du chargement du PDF:", error);
          setError("Impossible de charger le document. Veuillez réessayer plus tard.");
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger le livre. Veuillez réessayer plus tard.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      loadPdfUrl();
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
