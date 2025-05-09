
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onNavigateBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onNavigateBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[600px] text-gray-500">
      <p className="text-xl text-red-500 mb-4">Erreur de chargement</p>
      <p className="mb-8">{error}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onRetry}
          variant="outline"
        >
          Réessayer
        </Button>
        <Button 
          onClick={onNavigateBack}
          variant="default"
        >
          Retourner à la bibliothèque
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
