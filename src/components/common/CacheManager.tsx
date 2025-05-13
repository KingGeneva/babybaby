
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

    // Enregistrer ou mettre à jour le service worker avec gestion d'erreur améliorée
    const registerServiceWorker = async () => {
      try {
        // Ajouter un timestamp pour forcer la mise à jour du SW lors du développement
        const swUrl = `/service-worker.js?v=${version}&t=${new Date().getTime()}`;
        
        // Vérifier si le service worker est déjà enregistré
        const registrations = await navigator.serviceWorker.getRegistrations();
        let existingRegistration = registrations.find(reg => 
          reg.active && reg.active.scriptURL.includes('service-worker.js'));
        
        if (existingRegistration) {
          console.log('Service Worker déjà enregistré, mise à jour...');
          await existingRegistration.update();
          existingRegistration = await navigator.serviceWorker.register(swUrl);
        } else {
          console.log('Enregistrement du Service Worker...');
          existingRegistration = await navigator.serviceWorker.register(swUrl);
        }
        
        console.log('Service Worker enregistré avec succès:', existingRegistration.scope);
        
        // Vérifier s'il y a une mise à jour du SW
        existingRegistration.onupdatefound = () => {
          const installingWorker = existingRegistration.installing;
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
                } else {
                  console.log('Service Worker installé pour la première fois');
                  toast.success("Prêt pour une utilisation hors ligne", {
                    description: "L'application peut maintenant fonctionner même sans connexion internet."
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
        // Notifier l'utilisateur des problèmes potentiels de mise en cache
        toast.error("Problème de fonctionnement hors ligne", {
          description: "Les fonctionnalités hors ligne peuvent être limitées. Veuillez recharger la page."
        });
      }
    };
    
    // Écouteur pour recevoir les messages du SW
    const messageHandler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PONG') {
        console.log('Service Worker actif, version:', event.data.version);
      }
    };
    
    navigator.serviceWorker.addEventListener('message', messageHandler);
    
    // Attendre que la page soit complètement chargée pour enregistrer le SW
    if (document.readyState === 'complete') {
      registerServiceWorker();
    } else {
      window.addEventListener('load', registerServiceWorker);
    }
    
    // Nettoyer l'écouteur à la destruction du composant
    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler);
      window.removeEventListener('load', registerServiceWorker);
    };
  }, [version]);

  // Ce composant ne rend rien visuellement
  return null;
};

export default CacheManager;
