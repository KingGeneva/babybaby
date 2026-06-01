
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink, FileSearch } from 'lucide-react';
import { getNextFallbackUrl, checkUrlAccess } from '../services/demoService';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Fonction pour utiliser une URL de fallback
  const useFallbackUrl = useCallback(async () => {
    setIsLoading(true);
    const fallbackUrl = getNextFallbackUrl();
    console.log("PdfJsViewer: Utilisation d'une URL de fallback:", fallbackUrl);
    
    // Vérifier l'accès avant de définir l'URL
    const isAccessible = await checkUrlAccess(fallbackUrl);
    if (isAccessible) {
      setCurrentUrl(fallbackUrl);
      setIframeKey(prevKey => prevKey + 1); // Force iframe refresh
      setLoadError(false);
      toast.info("Chargement d'une source alternative");
    } else {
      // Si cette URL ne fonctionne pas non plus, essayez-en une autre
      toast.error("Source alternative inaccessible, essai d'une autre source");
      // Essayer la prochaine URL dans la liste
      const nextUrl = getNextFallbackUrl();
      setCurrentUrl(nextUrl);
      setIframeKey(prevKey => prevKey + 1);
    }
    setIsLoading(false);
  }, []);

  // Vérifier si l'URL du PDF est accessible
  const checkPdfAccess = useCallback(async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    setIsLoading(true);
    
    try {
      console.log("PdfJsViewer: Vérification de l'accès au PDF:", currentUrl);
      
      // Essayer d'accéder au PDF via une vérification d'accès
      const isAccessible = await checkUrlAccess(currentUrl);
      
      if (!isAccessible) {
        console.error("PdfJsViewer: PDF inaccessible");
        setLoadError(true);
        // Après un certain nombre d'essais, utiliser automatiquement une URL de fallback
        if (retryCount >= 1) {
          await useFallbackUrl();
        }
      } else {
        console.log("PdfJsViewer: PDF accessible");
        setPdfLoaded(true);
        setLoadError(false);
      }
    } catch (e) {
      console.error("PdfJsViewer: Erreur lors de la vérification du PDF:", e);
      setLoadError(true);
    } finally {
      setIsChecking(false);
      setIsLoading(false);
    }
  }, [currentUrl, retryCount, useFallbackUrl, isChecking]);

  useEffect(() => {
    checkPdfAccess();
    
    // Nettoyage au démontage
    return () => {
      // Si nécessaire, annulez toutes les requêtes en cours ici
    };
  }, [currentUrl, checkPdfAccess]);

  // Gérer un nouveau chargement
  const handleRetryLocal = useCallback(() => {
    setPdfLoaded(false);
    setLoadError(false);
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    
    // Si on a déjà essayé plusieurs fois, utiliser une URL de fallback
    if (retryCount >= 2) {
      useFallbackUrl();
    } else {
      // Forcer le rechargement de l'iframe avec la même URL
      // Ajouter un timestamp pour éviter les problèmes de cache
      const refreshedUrl = `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
      setCurrentUrl(refreshedUrl);
      setIframeKey(prevKey => prevKey + 1);
    }
  }, [retryCount, currentUrl, useFallbackUrl]);

  // Fonction pour ouvrir le PDF directement
  const openDirectly = () => {
    window.open(currentUrl, '_blank');
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
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} /> 
            {isLoading ? 'Chargement...' : 'Actualiser'}
          </Button>
        </div>
        {loadError ? (
          <div className="flex-grow flex flex-col items-center justify-center">
            <p className="text-red-500 mb-4">Impossible de charger le PDF</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleRetryLocal} 
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Réessayer'}
              </Button>
              <Button 
                onClick={useFallbackUrl} 
                size="sm" 
                variant="secondary"
                className="mt-2 sm:mt-0"
                disabled={isLoading}
              >
                <FileSearch className="h-3 w-3 mr-1" /> Utiliser une URL alternative
              </Button>
              <Button 
                onClick={openDirectly} 
                size="sm" 
                variant="outline"
                className="mt-2 sm:mt-0 flex items-center gap-1"
              >
                Ouvrir directement <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-babybaby-cosmic mb-2"></div>
                  <p className="text-sm text-gray-600">Chargement en cours...</p>
                </div>
              </div>
            )}
            <iframe 
              key={`pdf-iframe-${iframeKey}`}
              src={`${currentUrl}#toolbar=1&view=FitH`}
              className="w-full h-full border-0" 
              title={title}
              onLoad={() => {
                setPdfLoaded(true);
                setIsLoading(false);
              }}
              onError={() => {
                setLoadError(true);
                setIsLoading(false);
              }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups"
            />
          </>
        )}
      </div>
      {isLoading && !loadError && (
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Chargement du document en cours...</p>
        </div>
      )}
    </>
  );
};

export default PdfJsViewer;
