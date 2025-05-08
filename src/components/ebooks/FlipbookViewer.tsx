
import React from 'react';
import { useFlipbook } from './flipbook/useFlipbook';
import LoadingState from './flipbook/LoadingState';
import ErrorState from './flipbook/ErrorState';
import PdfJsViewer from './flipbook/PdfJsViewer';
import FlowPaperViewer from './flipbook/FlowPaperViewer';
import { FlipbookViewerProps } from './flipbook/types';

const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pdfUrl, title }) => {
  const {
    isScriptLoading,
    loadError,
    pdfjsViewer,
    setPdfLoaded,
    openPdfDirectly,
    usePdfJsViewer,
    handleRetry
  } = useFlipbook(pdfUrl);

  // Show the appropriate component based on the current state
  if (pdfjsViewer) {
    return (
      <PdfJsViewer 
        pdfUrl={pdfUrl} 
        title={title} 
        onRetry={handleRetry} 
      />
    );
  }

  if (loadError) {
    return (
      <>
        <ErrorState 
          onRetry={handleRetry}
          onUsePdfViewer={usePdfJsViewer}
          onOpenDirect={openPdfDirectly}
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

  return (
    <>
      <FlowPaperViewer pdfUrl={pdfUrl} />
      <div className="text-center mt-4 text-sm text-gray-500">
        <p>{"Utilisez les contrôles pour naviguer dans le document"}</p>
      </div>
    </>
  );
};

export default FlipbookViewer;
