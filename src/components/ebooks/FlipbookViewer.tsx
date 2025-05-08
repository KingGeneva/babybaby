
import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    // Make sure FlowPaper is loaded
    const loadFlowPaper = async () => {
      if (!window.$ || !window.FlowPaperViewer) {
        try {
          // Load jQuery first if not already loaded
          if (!window.$) {
            const jqueryScript = document.createElement('script');
            jqueryScript.src = '/flowpaper/js/jquery.min.js';
            jqueryScript.async = true;
            document.head.appendChild(jqueryScript);
            await new Promise(resolve => {
              jqueryScript.onload = resolve;
            });
          }
          
          // Then load FlowPaper
          const flowpaperScript = document.createElement('script');
          flowpaperScript.src = '/flowpaper/js/flowpaper.js';
          flowpaperScript.async = true;
          document.head.appendChild(flowpaperScript);
          await new Promise(resolve => {
            flowpaperScript.onload = resolve;
          });
        } catch (error) {
          console.error("Erreur lors du chargement des scripts FlowPaper:", error);
        }
      }
      
      return true;
    };

    const initializeViewer = async () => {
      if (viewerInitialized.current || !containerRef.current) return;
      
      const flowPaperLoaded = await loadFlowPaper();
      
      if (flowPaperLoaded && window.$ && containerRef.current) {
        try {
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
        } catch (error) {
          console.error("Erreur lors de l'initialisation du viewer:", error);
        }
      }
    };

    // Load/Initialize FlowPaper when component mounts
    initializeViewer();
    
    // Cleanup on unmount
    return () => {
      // FlowPaper doesn't provide an official destroy method, so we'll just clean up our references
      viewerInitialized.current = false;
    };
  }, [pdfUrl, containerRef]);

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
