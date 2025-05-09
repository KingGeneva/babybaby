
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Ebook } from '@/components/ebooks/types';
import { ebooksData } from '@/components/ebooks/ebooksData';

// Liste de PDFs publics fiables pour la démonstration
const DEMO_PDFS = [
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
  'https://www.orimi.com/pdf-test.pdf',
  'https://file-examples.com/storage/fe4358c310d635bdb9a6917/2017/10/file-sample_150kB.pdf',
  'https://www.clickdimensions.com/links/TestPDFfile.pdf'
];

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
      
      // Utiliser un PDF de démonstration fiable
      try {
        console.log("EbookViewerPage: Obtention de l'URL de prévisualisation...");
        
        // Sélectionner un PDF de démonstration basé sur l'ID de l'ebook pour avoir une URL cohérente
        const demoIndex = parseInt(foundEbook.id.replace('eb-', '')) % DEMO_PDFS.length;
        const url = DEMO_PDFS[demoIndex];
        
        console.log("EbookViewerPage: URL de démonstration sélectionnée:", url);
        setPdfUrl(url);
        setError(null);
        setIsLoading(false);
      } catch (error) {
        console.error("EbookViewerPage: Erreur lors du chargement du PDF:", error);
        setError("Impossible de charger le document. Veuillez réessayer plus tard.");
        setIsLoading(false);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger le livre. Veuillez réessayer plus tard.",
          variant: "destructive"
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
