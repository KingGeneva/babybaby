
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { getNextFallbackUrl } from '../services/demoService';

interface PdfJsViewerProps {
  pdfUrl: string;
  title: string;
  onRetry: () => void;
}

const PdfJsViewer: React.FC<PdfJsViewerProps> = ({ pdfUrl, title, onRetry }) => {
  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [currentUrl, setCurrentUrl] = useState<string>(pdfUrl);
  const [iframeKey, setIframeKey] = useState<number>(0); // Pour forcer le rechargement de l'iframe

  // Fonction pour utiliser une URL de fallback
  const useFallbackUrl = () => {
    const fallbackUrl = getNextFallbackUrl();
    console.log("PdfJsViewer: Utilisation d'une URL de fallback:", fallbackUrl);
    setCurrentUrl(fallbackUrl);
    setIframeKey(prevKey => prevKey + 1); // Force iframe refresh
  };

  // Vérifier si l'URL du PDF est accessible
  useEffect(() => {
    const checkPdfAccess = async () => {
      try {
        console.log("PdfJsViewer: Tentative d'accès au PDF:", currentUrl);
        
        // Essayer d'accéder au PDF via un fetch HEAD pour vérifier rapidement l'accès
        const response = await fetch(currentUrl, { 
          method: 'HEAD',
          // Ajouter un cache-buster pour éviter les problèmes de cache
          headers: { 'Cache-Control': 'no-cache' },
          mode: 'cors' // Permettre les requêtes cross-origin
        });
        
        if (!response.ok) {
          console.error("PdfJsViewer: Erreur d'accès au PDF, statut:", response.status);
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        setPdfLoaded(true);
        setLoadError(false);
      } catch (e) {
        console.error("PdfJsViewer: Erreur lors de la vérification du PDF:", e);
        setLoadError(true);
        // Après 2 essais, utiliser automatiquement une URL de fallback
        if (retryCount >= 1 && currentUrl === pdfUrl) {
          useFallbackUrl();
        }
      }
    };

    checkPdfAccess();
  }, [currentUrl, retryCount, pdfUrl]);

  // Gérer un nouveau chargement
  const handleRetryLocal = () => {
    setPdfLoaded(false);
    setLoadError(false);
    setRetryCount(prev => prev + 1);
    
    // Si on a déjà essayé 3 fois avec la même URL, utiliser une URL de fallback
    if (retryCount >= 2 && currentUrl === pdfUrl) {
      useFallbackUrl();
    } else {
      // Forcer le rechargement de l'iframe
      setIframeKey(prevKey => prevKey + 1);
    }
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
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleRetryLocal} size="sm">
                Réessayer
              </Button>
              <Button 
                onClick={useFallbackUrl} 
                size="sm" 
                variant="secondary"
                className="mt-2 sm:mt-0"
              >
                Utiliser une URL alternative
              </Button>
              <Button 
                onClick={() => window.open(currentUrl, '_blank')} 
                size="sm" 
                variant="outline"
                className="mt-2 sm:mt-0 flex items-center gap-1"
              >
                Ouvrir directement <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <iframe 
            key={`pdf-iframe-${iframeKey}`}
            src={`${currentUrl}#toolbar=1&view=FitH&timestamp=${new Date().getTime()}`}
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
