
import { useEffect } from 'react';
import { toast } from 'sonner';

interface CacheManagerProps {
  version: string;
}

const CacheManager: React.FC<CacheManagerProps> = ({ version }) => {
  useEffect(() => {
    // Vérifier si le service worker est supporté
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker non supporté par ce navigateur');
      return;
    }

    // Enregistrer ou mettre à jour le service worker
    const registerServiceWorker = async () => {
      try {
        // Ajouter un timestamp pour forcer la mise à jour du SW lors du développement
        const swUrl = `/service-worker.js?v=${version}&t=${new Date().getTime()}`;
        const registration = await navigator.serviceWorker.register(swUrl);
        
        console.log('Service Worker enregistré avec succès:', registration.scope);
        
        // Vérifier s'il y a une mise à jour du SW
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('Nouvelle version du Service Worker disponible');
                  toast("Mise à jour disponible", {
                    description: "Une nouvelle version de l'application est disponible. Rechargez pour l'appliquer.",
                    action: {
                      label: "Recharger",
                      onClick: () => window.location.reload()
                    }
                  });
                }
              }
            };
          }
        };
        
        // Nettoyer le cache si besoin
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CLEAR_OLD_CACHES'
          });
          
          // Vérifier que le SW est fonctionnel avec un ping
          setTimeout(() => {
            navigator.serviceWorker.controller?.postMessage({
              type: 'PING'
            });
          }, 1000);
        }
        
      } catch (error) {
        console.error('Erreur d\'enregistrement du Service Worker:', error);
      }
    };
    
    // Écouteur pour recevoir les messages du SW
    const messageHandler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PONG') {
        console.log('Service Worker actif, version:', event.data.version);
      }
    };
    
    navigator.serviceWorker.addEventListener('message', messageHandler);
    
    // Enregistrer le SW ou le mettre à jour
    registerServiceWorker();
    
    // Nettoyer l'écouteur à la destruction du composant
    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler);
    };
  }, [version]);

  // Ce composant ne rend rien visuellement
  return null;
};

export default CacheManager;
