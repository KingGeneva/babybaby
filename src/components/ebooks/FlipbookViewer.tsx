
import React from 'react';
import { useFlipbook } from './flipbook/useFlipbook';
import LoadingState from './flipbook/LoadingState';
import ErrorState from './flipbook/ErrorState';
import PdfJsViewer from './flipbook/PdfJsViewer';
import { FlipbookViewerProps } from './flipbook/types';

const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pdfUrl, title }) => {
  const {
    isScriptLoading,
    loadError,
    pdfjsViewer,
    currentUrl,
    openPdfDirectly,
    useFallbackUrl,
    handleRetry
  } = useFlipbook(pdfUrl);

  // Afficher l'état approprié selon la situation
  if (loadError) {
    return (
      <>
        <ErrorState 
          onRetry={handleRetry}
          onUsePdfViewer={() => {}}
          onOpenDirect={openPdfDirectly}
          onUseFallback={useFallbackUrl}
        />
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Si le problème persiste, essayez de télécharger le document.</p>
        </div>
      </>
    );
  }

  if (isScriptLoading) {
    return (
      <>
        <LoadingState />
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Préparation du document...</p>
        </div>
      </>
    );
  }

  // Par défaut, afficher le visualiseur PDF
  return (
    <PdfJsViewer 
      pdfUrl={currentUrl || pdfUrl} 
      title={title} 
      onRetry={handleRetry} 
    />
  );
};

export default FlipbookViewer;
