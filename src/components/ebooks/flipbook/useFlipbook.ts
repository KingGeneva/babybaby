
import { useState, useEffect, useCallback } from 'react';
import { getNextFallbackUrl, checkUrlAccess } from '../services/demoService';
import { toast } from 'sonner';

export const useFlipbook = (pdfUrl: string) => {
  const [isScriptLoading, setIsScriptLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [pdfjsViewer, setPdfjsViewer] = useState<boolean>(true); // Toujours utiliser le visualiseur PDF natif
  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>(pdfUrl);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Function to open the PDF directly in a new tab
  const openPdfDirectly = useCallback(() => {
    if (currentUrl) {
      window.open(currentUrl, '_blank');
    }
  }, [currentUrl]);

  // Fonction pour utiliser une URL de fallback
  const useFallbackUrl = useCallback(async () => {
    try {
      setIsScriptLoading(true);
      
      const fallbackUrl = getNextFallbackUrl();
      console.log("useFlipbook: Utilisation d'une URL de fallback:", fallbackUrl);
      
      // Vérifier si cette URL est accessible
      const isAccessible = await checkUrlAccess(fallbackUrl);
      
      if (isAccessible) {
        setCurrentUrl(fallbackUrl);
        setLoadError(false);
        toast.success("Utilisation d'une source alternative");
      } else {
        // Si cette URL n'est pas accessible, essayez-en une autre
        const nextUrl = getNextFallbackUrl();
        console.log("useFlipbook: Premier fallback inaccessible, essai avec:", nextUrl);
        setCurrentUrl(nextUrl);
        toast.info("Recherche d'une source fiable...");
      }
      
    } catch (error) {
      console.error("useFlipbook: Erreur lors du changement d'URL:", error);
      toast.error("Problème de chargement des sources alternatives");
      // En cas d'échec complet, utiliser l'URL Mozilla qui est très fiable
      setCurrentUrl('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
    } finally {
      setIsScriptLoading(false);
    }
  }, []);

  // Function to retry loading PDF
  const handleRetry = useCallback(() => {
    setIsScriptLoading(true);
    setLoadError(false);
    setPdfjsViewer(true);
    
    // Ajouter un timestamp pour éviter les problèmes de cache
    const refreshedUrl = `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
    setCurrentUrl(refreshedUrl);
    
    setTimeout(() => {
      checkPdfAccess();
    }, 500);
  }, [currentUrl]);

  // Fonction pour vérifier l'accessibilité du PDF
  const checkPdfAccess = useCallback(async () => {
    if (isChecking) return;
    setIsChecking(true);
    console.log("useFlipbook: Vérification d'accès au PDF:", currentUrl);
    
    if (!currentUrl) {
      console.error("useFlipbook: URL PDF manquante");
      setLoadError(true);
      setIsScriptLoading(false);
      setIsChecking(false);
      return;
    }

    try {
      // Vérifier si l'URL est accessible
      const isAccessible = await checkUrlAccess(currentUrl);
      
      if (!isAccessible) {
        console.error("useFlipbook: PDF inaccessible");
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
    } finally {
      setIsChecking(false);
    }
  }, [currentUrl, isChecking]);

  // Initialize when pdfUrl changes
  useEffect(() => {
    setIsScriptLoading(true);
    setLoadError(false);
    // Utiliser l'URL fournie
    setCurrentUrl(pdfUrl);
    
    const initTimeout = setTimeout(() => {
      // Vérifier l'accessibilité de l'URL
      checkPdfAccess();
    }, 500);

    return () => {
      clearTimeout(initTimeout);
    };
  }, [pdfUrl, checkPdfAccess]);

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
