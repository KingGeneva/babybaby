import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Version for the cache - mise à jour pour forcer le rechargement du service worker
const APP_VERSION = '1.2.3'; // Incrémentation pour rafraîchir le cache

// Console log pour vérifier que l'app est bien chargée avec la nouvelle version
console.log(`BabyBaby App v${APP_VERSION} loaded successfully`);
console.log('React version:', React.version);

const clearDevelopmentServiceWorkerCache = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;

  const isDevelopmentPreview =
    window.location.hostname === 'localhost' ||
    window.location.hostname.includes('lovableproject.com') ||
    window.location.hostname.startsWith('id-preview--');

  if (!isDevelopmentPreview) return false;

  const cleanupKey = 'babybaby-dev-sw-cleaned-v2';
  const registrations = await navigator.serviceWorker.getRegistrations();
  const cacheNames = 'caches' in window ? await caches.keys() : [];
  const hasStaleBrowserCache = registrations.length > 0 || cacheNames.length > 0 || Boolean(navigator.serviceWorker.controller);

  if (!hasStaleBrowserCache || sessionStorage.getItem(cleanupKey) === 'true') return false;

  await Promise.all([
    ...registrations.map((registration) => registration.unregister()),
    ...cacheNames.map((cacheName) => caches.delete(cacheName)),
  ]);

  localStorage.removeItem('swLastRegistration');
  sessionStorage.setItem(cleanupKey, 'true');
  window.location.reload();
  return true;
};

const startApp = async () => {
  if (await clearDevelopmentServiceWorkerCache()) return;

  // Create the root with React 18 API
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error('Failed to find the root element');

  const root = createRoot(rootElement);

  // Render the app
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

startApp().catch((error) => {
  console.error('Erreur au démarrage de BabyBaby:', error);
});
