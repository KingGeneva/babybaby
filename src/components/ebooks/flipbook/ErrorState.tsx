
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
  onUsePdfViewer: () => void;
  onOpenDirect: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry, onUsePdfViewer, onOpenDirect }) => {
  return (
    <div className="w-full h-[600px] bg-white flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-medium text-red-500 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-6">Impossible de charger le livre. Veuillez réessayer plus tard.</p>
        
        <div className="space-y-4">
          <Button 
            onClick={onRetry}
            variant="outline"
            className="w-full sm:w-auto mx-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Réessayer
          </Button>
          
          <Button 
            onClick={onUsePdfViewer}
            variant="outline"
            className="w-full sm:w-auto mx-2"
          >
            Visualiseur PDF natif
          </Button>
          
          <Button 
            onClick={onOpenDirect}
            variant="default"
            className="w-full sm:w-auto mx-2 flex items-center gap-2"
          >
            Ouvrir directement <ExternalLink size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
