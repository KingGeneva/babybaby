
import React, { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { articles } from '@/data/articles';

interface CacheManagerProps {
  version?: string;
}

/**
 * CacheManager amélioré avec mise en cache des articles et détection de mise à jour
 */
const CacheManager: React.FC<CacheManagerProps> = ({ version = '1.2' }) => {
  useEffect(() => {
    // Vérification de version et mise en cache
    const storedVersion = localStorage.getItem('app-version');
    const isNewVersion = storedVersion !== version;
    
    // Enregistrer le service worker si supporté
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker enregistré avec succès:', registration.scope);
            
            // Nettoyer les anciens caches au démarrage
            if (registration.active && isNewVersion) {
              registration.active.postMessage({ 
                type: 'CLEAR_OLD_CACHES' 
              });
            }
            
            // Mettre en cache les articles fréquemment consultés
            if (registration.active) {
              cacheFrequentlyAccessedArticles(registration.active);
              
              // Précharger les ressources importantes pendant les périodes d'inactivité
              setupIdlePreloading(registration.active);
            }
          })
          .catch(error => {
            console.error('Échec de l\'enregistrement du Service Worker:', error);
          });
      });
    }
    
    // Notifier l'utilisateur si une nouvelle version est disponible
    if (isNewVersion) {
      toast({
        title: "Nouvelle mise à jour disponible",
        description: "Rechargez la page pour voir les derniers changements et améliorer les performances.",
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
    
    // Précharger des images critiques
    const preloadCriticalImages = () => {
      const criticalImages = [
        "/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png",
        "/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
      ];
      
      criticalImages.forEach(imgSrc => {
        const img = new Image();
        img.src = imgSrc;
      });
    };
    
    // Mettre en cache les articles populaires localement
    const cacheArticlesLocally = () => {
      // Trouver les articles populaires/mis en avant
      const articlesToCache = articles
        .filter(article => article.featured || (article.views && article.views > 50))
        .slice(0, 8); // Limiter aux 8 premiers pour éviter d'alourdir le stockage
      
      if (articlesToCache.length > 0) {
        localStorage.setItem('cached-articles', JSON.stringify(articlesToCache));
        localStorage.setItem('cached-articles-timestamp', Date.now().toString());
      }
    };
    
    // Mettre en cache via le Service Worker
    const cacheFrequentlyAccessedArticles = (serviceWorker: ServiceWorker) => {
      const featuredArticles = articles
        .filter(article => article.featured || (article.views && article.views > 30))
        .slice(0, 5);
      
      featuredArticles.forEach(article => {
        serviceWorker.postMessage({
          type: 'CACHE_ARTICLE',
          url: `/articles/${article.id}`,
          data: article
        });
      });
    };

    // Préchargement de ressources pendant les périodes d'inactivité
    const setupIdlePreloading = (serviceWorker: ServiceWorker) => {
      if ('requestIdleCallback' in window) {
        // @ts-ignore
        window.requestIdleCallback(() => {
          const resourcesToPreload = [
            '/articles',
            '/about',
            '/faq',
            '/community',
            '/lovable-uploads/021f4ab1-8b86-4ff2-80c1-c2c69ea963fb.png',
          ];
          
          serviceWorker.postMessage({
            type: 'PRECACHE_RESOURCES',
            resources: resourcesToPreload
          });
        }, { timeout: 5000 });
      }
    };
    
    // Exécuter le cache local
    preloadCriticalImages();
    cacheArticlesLocally();
    
    // Stocker la version actuelle
    localStorage.setItem('app-version', version);
    
    // Nettoyage du cache local pour les très vieilles entrées
    const cleanupOldCache = () => {
      const cacheTimestamp = localStorage.getItem('cache-timestamp');
      const now = Date.now();
      
      // Si le cache a plus d'une semaine, on nettoie les entrées non essentielles
      if (cacheTimestamp && (now - parseInt(cacheTimestamp)) > 7 * 24 * 60 * 60 * 1000) {
        // Garder uniquement les données importantes
        const keysToKeep = ['app-version', 'cached-articles', 'user-preferences', 'cached-articles-timestamp'];
        
        // Nettoyer les autres entrées
        Object.keys(localStorage).forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });
        
        // Mettre à jour le timestamp
        localStorage.setItem('cache-timestamp', now.toString());
      } else if (!cacheTimestamp) {
        // Initialiser le timestamp s'il n'existe pas
        localStorage.setItem('cache-timestamp', now.toString());
      }
    };
    
    // Exécuter le nettoyage
    cleanupOldCache();
    
  }, [version]);

  return null;
};

export default CacheManager;
