
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

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
  const { toast } = useToast();

  // Fonction pour charger directement le PDF sans FlowPaper
  const openPdfDirectly = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
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
    }, 300);

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
          setTimeout(() => reject(new Error("Timeout de chargement de jQuery")), 5000);
        });
        console.log("FlipbookViewer: jQuery chargé avec succès");
      } catch (error) {
        console.error("FlipbookViewer: Erreur lors du chargement de jQuery:", error);
        setLoadError(true);
        setIsScriptLoading(false);
        return false;
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
          setTimeout(() => reject(new Error("Timeout de chargement de FlowPaper")), 5000);
        });
        console.log("FlipbookViewer: FlowPaper chargé avec succès");
      } catch (error) {
        console.error("FlipbookViewer: Erreur lors du chargement de FlowPaper:", error);
        setLoadError(true);
        setIsScriptLoading(false);
        return false;
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
      if (!scriptsLoaded) {
        return;
      }
      
      if (window.$ && containerRef.current) {
        console.log("FlipbookViewer: Initialisation du viewer avec URL:", pdfUrl);
        
        try {
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
          setLoadError(true);
          toast({
            title: "Erreur de chargement",
            description: "Problème lors de l'initialisation de la visionneuse",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("FlipbookViewer: Erreur générale:", error);
      setLoadError(true);
    }
  };

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
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Réessayer
              </Button>
              
              <Button 
                onClick={openPdfDirectly}
                variant="default"
                className="w-full sm:w-auto flex items-center gap-2"
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
