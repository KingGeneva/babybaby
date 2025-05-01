import React, { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from "@/components/ui/skeleton";

interface CacheManagerProps {
  version?: string;
}

/**
 * Component to manage cache and application updates
 * Displays a notification when a new version is available
 * Enhanced with better error handling and loading states
 */
const CacheManager: React.FC<CacheManagerProps> = ({ version = '1.0.0' }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Store the current version in localStorage
    const storedVersion = localStorage.getItem('app-version');
    const currentVersion = version;
    
    // If there's a version mismatch, it means the app was updated
    if (storedVersion && storedVersion !== currentVersion) {
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
                navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
              }
              // Force reload from network, not cache
              window.location.reload();
            }}
          >
            Recharger
          </button>
        ),
        duration: 10000,
      });
    }
    
    // Store the current version
    localStorage.setItem('app-version', currentVersion);
    
    // Register service worker for better cache management
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful');
            
            // Check for updates more frequently (every 2 minutes)
            setInterval(() => {
              registration.update()
                .then(() => console.log('ServiceWorker update check completed'))
                .catch(error => console.error('ServiceWorker update check failed:', error));
            }, 120000);
            
          }).catch(error => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }

    // Clean up stale caches on load
    const clearStaleData = async () => {
      try {
        // Clear stale data from IndexedDB/localStorage older than 7 days
        const lastCleanup = localStorage.getItem('last-cache-cleanup');
        const now = Date.now();
        if (!lastCleanup || (now - Number(lastCleanup)) > 7 * 24 * 60 * 60 * 1000) {
          // Clean up any old localStorage items (keep app settings)
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('temp-') || key.startsWith('cache-')) {
              localStorage.removeItem(key);
            }
          }
          localStorage.setItem('last-cache-cleanup', now.toString());
        }
      } catch (e) {
        console.error('Cache cleanup error:', e);
      }
    };
    
    clearStaleData();
    
  }, [version]);

  if (isUpdating) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center p-4 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babybaby-cosmic mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900">Mise à jour en cours...</h3>
          <p className="text-sm text-gray-500">Veuillez patienter un instant.</p>
        </div>
      </div>
    );
  }

  return null; // This is a non-visual component under normal operation
};

export default CacheManager;
