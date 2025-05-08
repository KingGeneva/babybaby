
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface PdfJsViewerProps {
  pdfUrl: string;
  title: string;
  onRetry: () => void;
}

const PdfJsViewer: React.FC<PdfJsViewerProps> = ({ pdfUrl, title, onRetry }) => {
  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  return (
    <>
      <div className="w-full h-[600px] bg-white flex flex-col">
        <div className="p-2 bg-gray-100 border-b flex justify-between items-center">
          <span className="text-sm font-medium">Visualiseur PDF natif</span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onRetry}
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
};

export default PdfJsViewer;
