
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw, FileSearch } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
  onUsePdfViewer: () => void;
  onOpenDirect: () => void;
  onUseFallback?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  onRetry, 
  onUsePdfViewer, 
  onOpenDirect,
  onUseFallback 
}) => {
  return (
    <div className="w-full h-[600px] bg-white flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-medium text-red-500 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-6">Impossible de charger le livre. Veuillez réessayer plus tard.</p>
        
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          <Button 
            onClick={onRetry}
            variant="outline"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Réessayer
          </Button>
          
          {onUseFallback && (
            <Button 
              onClick={onUseFallback}
              variant="secondary"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <FileSearch className="h-4 w-4" /> Version alternative
            </Button>
          )}
          
          <Button 
            onClick={onOpenDirect}
            variant="default"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Ouvrir directement <ExternalLink size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
