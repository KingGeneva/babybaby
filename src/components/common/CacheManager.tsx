
import React, { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CacheManagerProps {
  version?: string;
}

/**
 * Component to manage cache and application updates
 * Simplified for better performance
 */
const CacheManager: React.FC<CacheManagerProps> = ({ version = '1.0.0' }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Check for app version changes
    const storedVersion = localStorage.getItem('app-version');
    
    // Only show update toast if version changed
    if (storedVersion && storedVersion !== version) {
      toast({
        title: "Nouvelle mise à jour disponible",
        description: "Rechargez la page pour voir les derniers changements.",
        action: (
          <button 
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80 text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => {
              setIsUpdating(true);
              // Force reload from network
              window.location.reload();
            }}
          >
            Recharger
          </button>
        ),
        duration: 10000,
      });
    }
    
    // Store current version
    localStorage.setItem('app-version', version);
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .catch(error => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }
  }, [version]);

  if (isUpdating) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center p-4 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babybaby-cosmic mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-900">Mise à jour en cours...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default CacheManager;
