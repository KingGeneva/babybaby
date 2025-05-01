
import React, { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CacheManagerProps {
  version?: string;
}

/**
 * Component to manage cache and application updates
 * Optimized for build performance
 */
const CacheManager: React.FC<CacheManagerProps> = ({ version = '1.0.0' }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Simple version check
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
              // Clear cache through service worker
              if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
              }
              // Force reload from network, not cache
              setTimeout(() => window.location.reload(), 500);
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
    
    // Register service worker - simplified approach
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .catch(error => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }

    // More efficient cleanup strategy - only run once per week
    const lastCleanup = localStorage.getItem('last-cache-cleanup');
    const now = Date.now();
    if (!lastCleanup || (now - Number(lastCleanup)) > 7 * 24 * 60 * 60 * 1000) {
      // Target only specific keys to avoid excessive operations
      const keysToCheck = ['temp-', 'cache-'];
      
      // Process in batches for better performance
      let count = 0;
      Object.keys(localStorage).forEach(key => {
        if (keysToCheck.some(prefix => key.startsWith(prefix))) {
          localStorage.removeItem(key);
          count++;
        }
      });
      
      // Only log if items were actually removed
      if (count > 0) {
        console.log(`Cache cleanup: removed ${count} items`);
      }
      
      localStorage.setItem('last-cache-cleanup', now.toString());
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
