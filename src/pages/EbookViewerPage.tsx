
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import FlipbookViewer from '@/components/ebooks/FlipbookViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { ebooksData } from '@/components/ebooks/ebooksData';
import { Ebook } from '@/components/ebooks/types';
import SEOHead from '@/components/common/SEOHead';
import { getPreviewUrl, downloadEbook } from '@/components/ebooks/ebookService';

const EbookViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Gestion du téléchargement
  const handleDownload = async () => {
    if (ebook) {
      try {
        await downloadEbook(ebook);
      } catch (error) {
        console.error("Erreur lors du téléchargement:", error);
        toast("Erreur de téléchargement", {
          description: "Impossible de télécharger le document. Veuillez réessayer plus tard.",
        });
      }
    }
  };

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
      
      // Obtenir une URL signée pour le PDF
      const loadPdfUrl = async () => {
        try {
          console.log("EbookViewerPage: Obtention de l'URL de prévisualisation...");
          const url = await getPreviewUrl(foundEbook);
          
          if (url) {
            console.log("EbookViewerPage: URL obtenue avec succès");
            setPdfUrl(url);
            setError(null);
          } else {
            throw new Error("Impossible d'obtenir l'URL de prévisualisation");
          }
        } catch (error) {
          console.error("EbookViewerPage: Erreur lors du chargement du PDF:", error);
          setError("Impossible de charger le document. Veuillez réessayer plus tard.");
          uiToast({
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
      uiToast({
        title: "Livre non trouvé",
        description: "Le livre que vous recherchez n'existe pas.",
        variant: "destructive"
      });
      navigate('/ebooks');
    }
  }, [id, navigate, uiToast, retryCount]);

  // Fonction pour réessayer le chargement
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {ebook && (
        <SEOHead 
          title={`Lire: ${ebook.title} | BabyBaby`}
          description={`Lisez "${ebook.title}" en ligne gratuitement - ${ebook.description}`}
          canonicalUrl={`https://babybaby.app/ebooks/${id}`}
          ogType="article"
          keywords={[...ebook.tags, 'lecture en ligne', 'flipbook', 'livre numérique', 'ebook gratuit']}
        />
      )}

      <NavBar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/ebooks')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour à la bibliothèque
            </Button>
          </div>
          
          {ebook && (
            <h1 className="text-3xl font-bold mb-8 text-center text-babybaby-cosmic">
              {ebook.title}
            </h1>
          )}
          
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[600px] mb-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-[600px]">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-babybaby-cosmic mb-4"></div>
                  <p className="text-gray-500">Chargement du document...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-[600px] text-gray-500">
                <p className="text-xl text-red-500 mb-4">Erreur de chargement</p>
                <p className="mb-8">Impossible de charger le document</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleRetry}
                    variant="outline"
                  >
                    Réessayer
                  </Button>
                  <Button 
                    onClick={() => navigate('/ebooks')}
                    variant="default"
                  >
                    Retourner à la bibliothèque
                  </Button>
                </div>
              </div>
            ) : pdfUrl ? (
              <FlipbookViewer pdfUrl={pdfUrl} title={ebook?.title || 'Ebook'} />
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] text-gray-500">
                <p className="text-xl mb-4">Impossible de charger le document</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/ebooks')}
                >
                  Retourner à la bibliothèque
                </Button>
              </div>
            )}
          </div>
          
          {ebook && !isLoading && (
            <div className="flex justify-center">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex items-center gap-2 border-babybaby-cosmic text-babybaby-cosmic hover:bg-babybaby-cosmic hover:text-white"
              >
                <Download size={16} />
                Télécharger ce document
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EbookViewerPage;
