
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface FlipbookViewerProps {
  pdfUrl: string;
  title: string;
}

declare global {
  interface Window {
    FlowPaperViewer?: any;
    $?: any;
  }
}

const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pdfUrl, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerInitialized = useRef<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [isScriptLoading, setIsScriptLoading] = useState<boolean>(true);
  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
  const { toast } = useToast();
  const [pdfjsViewer, setPdfjsViewer] = useState<boolean>(false);

  // Fonction pour charger directement le PDF sans FlowPaper
  const openPdfDirectly = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  // Fallback vers l'affichage PDF natif si FlowPaper échoue
  const usePdfJsViewer = () => {
    setPdfjsViewer(true);
    setIsScriptLoading(false);
    setLoadError(false);
  };

  // Gestion des tentatives de chargement
  const handleRetry = () => {
    setIsScriptLoading(true);
    setLoadError(false);
    setPdfjsViewer(false);
    viewerInitialized.current = false;
    
    setTimeout(() => {
      // Tenter d'initialiser à nouveau
      initializeViewer();
    }, 500);
  };

  useEffect(() => {
    console.log("FlipbookViewer: Tentative de chargement avec URL:", pdfUrl);
    
    // Vérifier si l'URL est valide
    if (!pdfUrl) {
      console.error("FlipbookViewer: URL PDF manquante");
      setLoadError(true);
      setIsScriptLoading(false);
      return;
    }

    // Réinitialiser les états
    setLoadError(false);
    setIsScriptLoading(true);
    
    // Délai pour laisser le temps au DOM de se préparer
    const initTimeout = setTimeout(() => {
      initializeViewer();
    }, 500);

    return () => {
      clearTimeout(initTimeout);
    };
  }, [pdfUrl]);

  // Chargement des scripts nécessaires
  const loadScripts = async () => {
    // Vérifier si les scripts sont déjà chargés
    if (window.$ && window.FlowPaperViewer) {
      setIsScriptLoading(false);
      return true;
    }

    // Essayer d'utiliser le PDF viewer natif après quelques tentatives
    const useNativePdfViewer = () => {
      console.log("FlipbookViewer: Utilisation du viewer PDF natif comme fallback");
      usePdfJsViewer();
      return false;
    };

    // Charger jQuery en premier si nécessaire
    if (!window.$) {
      try {
        console.log("FlipbookViewer: Chargement de jQuery");
        const jqueryScript = document.createElement('script');
        jqueryScript.src = '/flowpaper/js/jquery.min.js';
        jqueryScript.async = true;
        document.head.appendChild(jqueryScript);
        
        await new Promise((resolve, reject) => {
          jqueryScript.onload = resolve;
          jqueryScript.onerror = () => {
            reject(new Error("Échec de chargement de jQuery"));
          };
          // Timeout de sécurité
          setTimeout(() => useNativePdfViewer(), 3000);
        });
        console.log("FlipbookViewer: jQuery chargé avec succès");
      } catch (error) {
        console.error("FlipbookViewer: Erreur lors du chargement de jQuery:", error);
        return useNativePdfViewer();
      }
    }
    
    // Puis charger FlowPaper
    if (!window.FlowPaperViewer) {
      try {
        console.log("FlipbookViewer: Chargement de FlowPaper");
        const flowpaperScript = document.createElement('script');
        flowpaperScript.src = '/flowpaper/js/flowpaper.js';
        flowpaperScript.async = true;
        document.head.appendChild(flowpaperScript);
        
        await new Promise((resolve, reject) => {
          flowpaperScript.onload = resolve;
          flowpaperScript.onerror = () => {
            reject(new Error("Échec de chargement de FlowPaper"));
          };
          // Timeout de sécurité
          setTimeout(() => useNativePdfViewer(), 3000);
        });
        console.log("FlipbookViewer: FlowPaper chargé avec succès");
      } catch (error) {
        console.error("FlipbookViewer: Erreur lors du chargement de FlowPaper:", error);
        return useNativePdfViewer();
      }
    }
    
    setIsScriptLoading(false);
    return true;
  };

  const initializeViewer = async () => {
    if (viewerInitialized.current || !containerRef.current) {
      return;
    }
    
    try {
      // Charger les scripts nécessaires
      const scriptsLoaded = await loadScripts();
      if (!scriptsLoaded || pdfjsViewer) {
        return;
      }
      
      if (window.$ && containerRef.current) {
        console.log("FlipbookViewer: Initialisation du viewer avec URL:", pdfUrl);
        
        try {
          // Effectuer une vérification préliminaire de l'URL
          const checkResponse = await fetch(pdfUrl, { method: 'HEAD' });
          if (!checkResponse.ok) {
            console.error("FlipbookViewer: URL inaccessible:", pdfUrl);
            setLoadError(true);
            return;
          }
          
          // Tentative d'initialisation du viewer
          window.$(containerRef.current).FlowPaperViewer({
            config: {
              PDFFile: pdfUrl,
              Scale: 1,
              FitPageOnLoad: true,
              FullScreenAsMaxWindow: true,
              ViewModeToolsVisible: true,
              ZoomToolsVisible: true,
              NavToolsVisible: true,
              CursorToolsVisible: true,
              SearchToolsVisible: true,
              RenderingOrder: 'html5',
            }
          });
          
          viewerInitialized.current = true;
          console.log("FlipbookViewer: Viewer initialisé avec succès");
          
        } catch (error) {
          console.error("FlipbookViewer: Erreur lors de l'initialisation du viewer:", error);
          usePdfJsViewer();
        }
      }
    } catch (error) {
      console.error("FlipbookViewer: Erreur générale:", error);
      usePdfJsViewer();
    }
  };

  if (pdfjsViewer) {
    return (
      <>
        <div className="w-full h-[600px] bg-white flex flex-col">
          <div className="p-2 bg-gray-100 border-b flex justify-between items-center">
            <span className="text-sm font-medium">Visualiseur PDF natif</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRetry}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Réessayer FlowPaper
            </Button>
          </div>
          <iframe 
            src={pdfUrl} 
            className="w-full h-full border-0" 
            title={title}
            onLoad={() => setPdfLoaded(true)}
            onError={() => setLoadError(true)}
          />
        </div>
        {!pdfLoaded && !loadError && (
          <div className="text-center mt-4 text-sm text-gray-500">
            <p>Chargement du document en cours...</p>
          </div>
        )}
      </>
    );
  }

  // Affichage conditionnel selon l'état
  if (loadError) {
    return (
      <>
        <div className="w-full h-[600px] bg-white flex flex-col items-center justify-center p-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-medium text-red-500 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-6">Impossible de charger le livre. Veuillez réessayer plus tard.</p>
            
            <div className="space-y-4">
              <Button 
                onClick={handleRetry}
                variant="outline"
                className="w-full sm:w-auto mx-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Réessayer
              </Button>
              
              <Button 
                onClick={usePdfJsViewer}
                variant="outline"
                className="w-full sm:w-auto mx-2"
              >
                Visualiseur PDF natif
              </Button>
              
              <Button 
                onClick={openPdfDirectly}
                variant="default"
                className="w-full sm:w-auto mx-2 flex items-center gap-2"
              >
                Ouvrir directement <ExternalLink size={16} />
              </Button>
            </div>
          </div>
        </div>
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Si le problème persiste, essayez de télécharger le document.</p>
        </div>
      </>
    );
  }

  if (isScriptLoading) {
    return (
      <>
        <div className="w-full h-[600px] bg-white flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-babybaby-cosmic mb-4"></div>
            <p className="text-gray-600">Chargement de la visionneuse...</p>
          </div>
        </div>
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Préparation du document...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div ref={containerRef} className="w-full h-[600px] bg-white">
        {/* FlowPaper will initialize here */}
      </div>
      <div className="text-center mt-4 text-sm text-gray-500">
        <p>{"Utilisez les contrôles pour naviguer dans le document"}</p>
      </div>
    </>
  );
};

export default FlipbookViewer;
