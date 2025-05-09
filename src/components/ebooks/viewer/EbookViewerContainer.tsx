
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import FlipbookViewer from '@/components/ebooks/FlipbookViewer';
import { Ebook } from '@/components/ebooks/types';
import { toast } from 'sonner';
import { downloadEbook } from '@/components/ebooks/ebookService';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

interface EbookViewerContainerProps {
  ebook: Ebook | null;
  pdfUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onNavigateBack: () => void;
}

const EbookViewerContainer: React.FC<EbookViewerContainerProps> = ({
  ebook,
  pdfUrl,
  isLoading,
  error,
  onRetry,
  onNavigateBack
}) => {
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[600px] mb-6">
      {isLoading ? (
        <LoadingState message="Chargement du document..." />
      ) : error ? (
        <ErrorState 
          error={error} 
          onRetry={onRetry} 
          onNavigateBack={onNavigateBack} 
        />
      ) : pdfUrl ? (
        <FlipbookViewer pdfUrl={pdfUrl} title={ebook?.title || 'Ebook'} />
      ) : (
        <div className="flex flex-col items-center justify-center h-[600px] text-gray-500">
          <p className="text-xl mb-4">Impossible de charger le document</p>
          <Button 
            className="mt-4" 
            onClick={onNavigateBack}
          >
            Retourner à la bibliothèque
          </Button>
        </div>
      )}
      
      {ebook && !isLoading && (
        <div className="flex justify-center mt-6">
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
  );
};

export default EbookViewerContainer;
