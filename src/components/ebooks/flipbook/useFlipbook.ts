
import { useState, useEffect } from 'react';
import { loadFlowPaperScripts } from './FlowPaperLoader';

export const useFlipbook = (pdfUrl: string) => {
  const [isScriptLoading, setIsScriptLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [pdfjsViewer, setPdfjsViewer] = useState<boolean>(false);
  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);

  // Function to open the PDF directly in a new tab
  const openPdfDirectly = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  // Function to use native PDF.js viewer instead of FlowPaper
  const usePdfJsViewer = () => {
    setPdfjsViewer(true);
    setIsScriptLoading(false);
    setLoadError(false);
  };

  // Function to retry loading FlowPaper
  const handleRetry = () => {
    setIsScriptLoading(true);
    setLoadError(false);
    setPdfjsViewer(false);
    
    setTimeout(() => {
      initializeViewer();
    }, 500);
  };

  // Function to initialize the viewer
  const initializeViewer = async () => {
    console.log("useFlipbook: Tentative de chargement avec URL:", pdfUrl);
    
    if (!pdfUrl) {
      console.error("useFlipbook: URL PDF manquante");
      setLoadError(true);
      setIsScriptLoading(false);
      return;
    }

    try {
      // Perform a preliminary check of the URL
      const checkResponse = await fetch(pdfUrl, { method: 'HEAD' }).catch(() => null);
      
      if (!checkResponse || !checkResponse.ok) {
        console.error("useFlipbook: URL inaccessible:", pdfUrl);
        setLoadError(true);
        setIsScriptLoading(false);
        return;
      }
      
      // Load the necessary scripts
      const { loaded, error } = await loadFlowPaperScripts();
      
      if (!loaded || error) {
        console.error("useFlipbook: Échec du chargement des scripts:", error);
        usePdfJsViewer();
        return;
      }
      
      setIsScriptLoading(false);
      setLoadError(false);
    } catch (error) {
      console.error("useFlipbook: Erreur générale:", error);
      usePdfJsViewer();
    }
  };

  // Initialize the viewer when pdfUrl changes
  useEffect(() => {
    setIsScriptLoading(true);
    setLoadError(false);
    
    const initTimeout = setTimeout(() => {
      initializeViewer();
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
    openPdfDirectly,
    usePdfJsViewer,
    handleRetry
  };
};
