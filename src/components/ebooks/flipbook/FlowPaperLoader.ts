
export interface FlowPaperLoaderResult {
  loaded: boolean;
  error?: Error;
}

/**
 * Loads the necessary FlowPaper scripts
 * Note: Cette fonction est maintenant simplifiée car nous utilisons principalement
 * le visualiseur PDF natif pour plus de fiabilité
 */
export const loadFlowPaperScripts = async (): Promise<FlowPaperLoaderResult> => {
  try {
    // Simuler un délai de chargement pour l'expérience utilisateur
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Nous ne chargeons plus réellement FlowPaper mais nous retournons un succès
    // pour maintenir la compatibilité avec le code existant
    console.log("FlipbookViewer: Transition vers le visualiseur PDF natif");
    
    return { loaded: false, error: new Error("Utilisation du visualiseur PDF natif pour une meilleure compatibilité") };
  } catch (error) {
    console.error("FlipbookViewer: Erreur lors du chargement des scripts:", error);
    return { loaded: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
};
