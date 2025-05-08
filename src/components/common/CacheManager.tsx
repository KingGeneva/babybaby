
import React, { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { articles } from '@/data/articles';

interface CacheManagerProps {
  version?: string;
}

/**
 * CacheManager amélioré avec mise en cache des articles et détection de mise à jour
 */
const CacheManager: React.FC<CacheManagerProps> = ({ version = '1.1' }) => {
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
            
            // Mettre en cache les articles fréquemment consultés
            if (registration.active) {
              cacheFrequentlyAccessedArticles(registration.active);
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
    
    // Mettre en cache les articles populaires localement
    const cacheArticlesLocally = () => {
      // Trouver les articles populaires/mis en avant
      const articlesToCache = articles
        .filter(article => article.featured || (article.views && article.views > 50))
        .slice(0, 5); // Limiter aux 5 premiers pour éviter d'alourdir le stockage
      
      if (articlesToCache.length > 0) {
        localStorage.setItem('cached-articles', JSON.stringify(articlesToCache));
      }
    };
    
    // Mettre en cache via le Service Worker
    const cacheFrequentlyAccessedArticles = (serviceWorker: ServiceWorker) => {
      const featuredArticles = articles
        .filter(article => article.featured)
        .slice(0, 3);
      
      featuredArticles.forEach(article => {
        serviceWorker.postMessage({
          type: 'CACHE_ARTICLE',
          url: `/articles/${article.id}`,
          data: article
        });
      });
    };
    
    // Exécuter le cache local
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
        const keysToKeep = ['app-version', 'cached-articles', 'user-preferences'];
        
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
