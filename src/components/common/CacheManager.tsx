
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

    // Variable pour suivre si une notification a déjà été affichée
    let updateNotificationShown = false;

    // Enregistrer ou mettre à jour le service worker avec gestion d'erreur améliorée
    const registerServiceWorker = async () => {
      try {
        // Ajouter un timestamp pour forcer la mise à jour du SW lors du développement
        const swUrl = `/service-worker.js?v=${version}`;
        
        // Vérifier si le service worker est déjà enregistré
        const registrations = await navigator.serviceWorker.getRegistrations();
        let existingRegistration = registrations.find(reg => 
          reg.active && reg.active.scriptURL.includes('service-worker.js'));
        
        if (existingRegistration) {
          console.log('Service Worker déjà enregistré');
          // Ne pas mettre à jour à chaque chargement de page pour éviter les notifications inutiles
          // await existingRegistration.update();
        } else {
          console.log('Enregistrement du Service Worker...');
          existingRegistration = await navigator.serviceWorker.register(swUrl);
          console.log('Service Worker enregistré avec succès:', existingRegistration.scope);
        }
        
        // Vérifier s'il y a une mise à jour du SW
        if (existingRegistration) {
          existingRegistration.onupdatefound = () => {
            const installingWorker = existingRegistration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller && !updateNotificationShown) {
                  console.log('Nouvelle version du Service Worker disponible');
                  // Afficher la notification seulement si elle n'a pas déjà été affichée
                  updateNotificationShown = true;
                  toast("Mise à jour disponible", {
                    description: "Une nouvelle version de l'application est disponible. Rechargez pour l'appliquer.",
                    action: {
                      label: "Recharger",
                      onClick: () => window.location.reload()
                    },
                    // Augmenter la durée avant que le toast ne disparaisse automatiquement
                    duration: 10000
                  });
                } else if (installingWorker.state === 'installed' && !navigator.serviceWorker.controller && !updateNotificationShown) {
                  console.log('Service Worker installé pour la première fois');
                  // La notification pour la première installation est optionnelle
                  // Nous la désactivons pour éviter les popups inutiles
                }
              };
            }
          };
        }
        
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
        // Ne pas afficher de notification d'erreur à l'utilisateur pour éviter les popups
      }
    };
    
    // Écouteur pour recevoir les messages du SW
    const messageHandler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PONG') {
        console.log('Service Worker actif, version:', event.data.version);
      }
    };
    
    navigator.serviceWorker.addEventListener('message', messageHandler);
    
    // Enregistrer le SW mais pas à chaque chargement de page
    // Utiliser localStorage pour vérifier si on l'a déjà fait récemment
    const lastRegistration = localStorage.getItem('swLastRegistration');
    const now = Date.now();
    if (!lastRegistration || (now - Number(lastRegistration)) > 3600000) { // 1 heure
      registerServiceWorker();
      localStorage.setItem('swLastRegistration', now.toString());
    } else {
      console.log('Enregistrement du SW ignoré, déjà fait récemment');
    }
    
    // Nettoyer l'écouteur à la destruction du composant
    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler);
    };
  }, [version]);

  // Ce composant ne rend rien visuellement
  return null;
};

export default CacheManager;
