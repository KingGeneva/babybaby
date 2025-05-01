
import React, { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CacheManagerProps {
  version?: string;
}

/**
 * Component to manage cache and application updates
 * Displays a notification when a new version is available
 */
const CacheManager: React.FC<CacheManagerProps> = ({ version = '1.0.0' }) => {
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
            className="bg-babybaby-cosmic text-white px-4 py-2 rounded-md"
            onClick={() => window.location.reload()}
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
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
          console.log('ServiceWorker registration successful');
          
          // Check for updates every 5 minutes
          setInterval(() => {
            registration.update();
          }, 300000);
          
        }).catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
      });
    }
  }, [version]);

  return null; // This is a non-visual component
};

export default CacheManager;
