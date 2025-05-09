
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface PdfJsViewerProps {
  pdfUrl: string;
  title: string;
  onRetry: () => void;
}

const PdfJsViewer: React.FC<PdfJsViewerProps> = ({ pdfUrl, title, onRetry }) => {
  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Fonction pour vérifier si l'URL du PDF est accessible
  useEffect(() => {
    const checkPdfAccess = async () => {
      try {
        // Vérifier si le PDF est accessible en créant une image temporaire
        const img = new Image();
        img.onerror = () => setLoadError(true);
        img.onload = () => {
          setPdfLoaded(true);
          setLoadError(false);
        };
        // Ajouter un paramètre timestamp pour éviter la mise en cache
        img.src = `${pdfUrl}#page=1&timestamp=${new Date().getTime()}`;
      } catch (e) {
        console.error("Erreur lors de la vérification du PDF:", e);
        setLoadError(true);
      }
    };

    checkPdfAccess();
  }, [pdfUrl, retryCount]);

  // Gérer un nouveau chargement
  const handleRetryLocal = () => {
    setPdfLoaded(false);
    setLoadError(false);
    setRetryCount(prev => prev + 1);
  };

  return (
    <>
      <div className="w-full h-[600px] bg-white flex flex-col">
        <div className="p-2 bg-gray-100 border-b flex justify-between items-center">
          <span className="text-sm font-medium">Visualiseur PDF</span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRetryLocal}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Actualiser
          </Button>
        </div>
        {loadError ? (
          <div className="flex-grow flex flex-col items-center justify-center">
            <p className="text-red-500 mb-4">Impossible de charger le PDF</p>
            <div className="flex gap-2">
              <Button onClick={handleRetryLocal} size="sm">
                Réessayer
              </Button>
              <Button onClick={() => window.open(pdfUrl, '_blank')} size="sm" variant="outline">
                Ouvrir dans un nouvel onglet
              </Button>
            </div>
          </div>
        ) : (
          <iframe 
            src={`${pdfUrl}#toolbar=1&view=FitH&timestamp=${new Date().getTime()}`}
            className="w-full h-full border-0" 
            title={title}
            onLoad={() => setPdfLoaded(true)}
            onError={() => setLoadError(true)}
          />
        )}
      </div>
      {!pdfLoaded && !loadError && (
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Chargement du document en cours...</p>
        </div>
      )}
    </>
  );
};

export default PdfJsViewer;
