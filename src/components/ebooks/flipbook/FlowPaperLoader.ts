
export interface FlowPaperLoaderResult {
  loaded: boolean;
  error?: Error;
}

/**
 * Loads the necessary FlowPaper scripts
 */
export const loadFlowPaperScripts = async (): Promise<FlowPaperLoaderResult> => {
  // Check if the scripts are already loaded
  if (window.$ && window.FlowPaperViewer) {
    return { loaded: true };
  }

  try {
    // Load jQuery first if needed
    if (!window.$) {
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
        
        // Safety timeout
        setTimeout(() => reject(new Error("Timeout loading jQuery")), 5000);
      });
      console.log("FlipbookViewer: jQuery chargé avec succès");
    }
    
    // Then load FlowPaper
    if (!window.FlowPaperViewer) {
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
        
        // Safety timeout
        setTimeout(() => reject(new Error("Timeout loading FlowPaper")), 5000);
      });
      console.log("FlipbookViewer: FlowPaper chargé avec succès");
    }
    
    return { loaded: true };
  } catch (error) {
    console.error("FlipbookViewer: Erreur lors du chargement des scripts:", error);
    return { loaded: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
};
