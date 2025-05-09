
import { useState, useEffect } from 'react';
import { getNextFallbackUrl } from '../services/demoService';

export const useFlipbook = (pdfUrl: string) => {
  const [isScriptLoading, setIsScriptLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [pdfjsViewer, setPdfjsViewer] = useState<boolean>(true); // Toujours utiliser le visualiseur PDF natif
  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>(pdfUrl);

  // Function to open the PDF directly in a new tab
  const openPdfDirectly = () => {
    if (currentUrl) {
      window.open(currentUrl, '_blank');
    }
  };

  // Fonction pour utiliser une URL de fallback
  const useFallbackUrl = () => {
    const fallbackUrl = getNextFallbackUrl();
    console.log("useFlipbook: Utilisation d'une URL de fallback:", fallbackUrl);
    setCurrentUrl(fallbackUrl);
    setLoadError(false);
    setIsScriptLoading(false);
    setPdfjsViewer(true);
  };

  // Function to retry loading PDF
  const handleRetry = () => {
    setIsScriptLoading(true);
    setLoadError(false);
    setPdfjsViewer(true);
    
    setTimeout(() => {
      checkPdfAccess();
    }, 500);
  };

  // Fonction pour vérifier l'accessibilité du PDF
  const checkPdfAccess = async () => {
    console.log("useFlipbook: Vérification d'accès au PDF:", currentUrl);
    
    if (!currentUrl) {
      console.error("useFlipbook: URL PDF manquante");
      setLoadError(true);
      setIsScriptLoading(false);
      return;
    }

    try {
      const response = await fetch(currentUrl, { 
        method: 'HEAD',
        headers: { 'Cache-Control': 'no-cache' }
      }).catch(() => null);
      
      if (!response || !response.ok) {
        throw new Error("PDF inaccessible");
      }
      
      // Utiliser directement le visualiseur PDF natif
      setPdfjsViewer(true);
      setIsScriptLoading(false);
      setLoadError(false);
      
    } catch (error) {
      console.error("useFlipbook: Erreur d'accès au PDF:", error);
      setLoadError(true);
      setIsScriptLoading(false);
    }
  };

  // Initialize when pdfUrl changes
  useEffect(() => {
    setIsScriptLoading(true);
    setLoadError(false);
    // Utiliser l'URL fournie
    setCurrentUrl(pdfUrl);
    
    const initTimeout = setTimeout(() => {
      // Toujours utiliser le visualiseur PDF natif directement
      setPdfjsViewer(true);
      setIsScriptLoading(false);
    }, 500);

    return () => {
      clearTimeout(initTimeout);
    };
  }, [pdfUrl]);

  return {
    isScriptLoading,
    loadError,
    pdfjsViewer,
    pdfLoaded,
    setPdfLoaded,
    currentUrl,
    openPdfDirectly,
    useFallbackUrl,
    handleRetry
  };
};
