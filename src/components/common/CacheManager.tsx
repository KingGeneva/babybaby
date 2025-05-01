
import React, { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CacheManagerProps {
  version?: string;
}

/**
 * Version simplifiée de CacheManager avec seulement les fonctionnalités essentielles
 */
const CacheManager: React.FC<CacheManagerProps> = ({ version = '1.0' }) => {
  useEffect(() => {
    // Vérification simple de la version
    const storedVersion = localStorage.getItem('app-version');
    
    if (storedVersion && storedVersion !== version) {
      toast({
        title: "Nouvelle mise à jour disponible",
        description: "Rechargez la page pour voir les derniers changements.",
        action: (
          <button 
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80 text-white px-4 py-2 rounded-md"
            onClick={() => window.location.reload()}
          >
            Recharger
          </button>
        ),
        duration: 10000,
      });
    }
    
    // Stocker la version actuelle
    localStorage.setItem('app-version', version);
  }, [version]);

  return null;
};

export default CacheManager;
