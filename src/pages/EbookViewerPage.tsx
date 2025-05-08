
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import FlipbookViewer from '@/components/ebooks/FlipbookViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ebooksData } from '@/components/ebooks/ebooksData';
import { Ebook } from '@/components/ebooks/types';
import SEOHead from '@/components/common/SEOHead';
import { getPreviewUrl } from '@/components/ebooks/ebookService';

const EbookViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find the ebook in our data
    const foundEbook = ebooksData.find(e => e.id === id);
    
    if (foundEbook) {
      setEbook(foundEbook);
      
      // Get a signed URL for the PDF
      const loadPdfUrl = async () => {
        try {
          setIsLoading(true);
          const url = await getPreviewUrl(foundEbook);
          
          if (url) {
            setPdfUrl(url);
          } else {
            throw new Error("Impossible d'obtenir l'URL de prévisualisation");
          }
        } catch (error) {
          console.error("Erreur lors du chargement du PDF:", error);
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
      toast({
        title: "Livre non trouvé",
        description: "Le livre que vous recherchez n'existe pas.",
        variant: "destructive"
      });
      navigate('/ebooks');
    }
  }, [id, navigate, toast]);

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
          
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[600px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-[600px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-babybaby-cosmic"></div>
              </div>
            ) : pdfUrl ? (
              <FlipbookViewer pdfUrl={pdfUrl} title={ebook?.title || 'Ebook'} />
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] text-gray-500">
                <p className="text-xl">Impossible de charger le document</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/ebooks')}
                >
                  Retourner à la bibliothèque
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EbookViewerPage;
