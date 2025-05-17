
import React, { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CacheManagerProps {
  version: string;
}

const CacheManager: React.FC<CacheManagerProps> = ({ version }) => {
  const [needsRefresh, setNeedsRefresh] = useState(false);

  useEffect(() => {
    // Check if there's a stored version
    const storedVersion = localStorage.getItem('app-version');
    
    // If version differs, we need to refresh caches
    if (storedVersion && storedVersion !== version) {
      setNeedsRefresh(true);
      
      // Show toast notification
      toast({
        title: "Nouvelle mise à jour disponible",
        description: "Pour une meilleure expérience, veuillez actualiser l'application.",
        duration: 10000,
        action: (
          <button
            onClick={() => refreshApp()}
            className="bg-primary text-white px-3 py-1 rounded-md text-xs font-medium"
          >
            Actualiser maintenant
          </button>
        )
      });
    }
    
    // Update stored version
    localStorage.setItem('app-version', version);
    
    // Register service worker if available
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
          registration => {
            console.log('ServiceWorker registered with scope: ', registration.scope);
          },
          error => {
            console.error('ServiceWorker registration failed: ', error);
          }
        );
      });
    }
  }, [version]);

  const refreshApp = () => {
    // Clear caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Hard reload the page
    window.location.reload();
  };

  // Component doesn't render anything visible
  return null;
};

export default CacheManager;
