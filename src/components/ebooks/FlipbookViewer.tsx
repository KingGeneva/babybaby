
import React from 'react';
import { useFlipbook } from './flipbook/useFlipbook';
import PdfJsViewer from './flipbook/PdfJsViewer';
import LoadingState from './flipbook/LoadingState';
import ErrorState from './flipbook/ErrorState';
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

  if (isScriptLoading) {
    return <LoadingState />;
  }

  if (loadError) {
    return (
      <ErrorState
        onRetry={handleRetry}
        onUsePdfViewer={() => {}}
        onOpenDirect={openPdfDirectly}
        onUseFallback={useFallbackUrl}
      />
    );
  }

  if (pdfjsViewer) {
    return <PdfJsViewer pdfUrl={currentUrl} title={title} onRetry={handleRetry} />;
  }

  return null;
};

export default FlipbookViewer;
