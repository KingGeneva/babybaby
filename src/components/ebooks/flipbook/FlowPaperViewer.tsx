
import React, { useRef, useEffect } from 'react';

interface FlowPaperViewerProps {
  pdfUrl: string;
}

const FlowPaperViewer: React.FC<FlowPaperViewerProps> = ({ pdfUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current || viewerInitialized.current || !window.$ || !pdfUrl) {
      return;
    }

    try {
      console.log("FlowPaperViewer: Initialisation du viewer avec URL:", pdfUrl);
      
      // Initialize FlowPaper viewer
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
      console.log("FlowPaperViewer: Viewer initialisé avec succès");
    } catch (error) {
      console.error("FlowPaperViewer: Erreur lors de l'initialisation du viewer:", error);
      throw error; // Let parent component handle this error
    }
  }, [pdfUrl]);

  return (
    <div ref={containerRef} className="w-full h-[600px] bg-white">
      {/* FlowPaper will initialize here */}
    </div>
  );
};

export default FlowPaperViewer;
