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

/**
 * Le HTML statique (prérendu) contient déjà title, description, canonical,
 * hreflang et OG par route. react-helmet-async ajoute ses propres balises
 * (marquées data-rh) sans toujours supprimer les balises statiques : on
 * obtiendrait alors deux canonical ou deux descriptions dans le DOM.
 *
 * On supprime donc UNIQUEMENT la balise statique dont Helmet a produit
 * l'équivalent : si une route ne gère pas son head, la balise initiale reste
 * en place. Le HTML servi aux robots non-JS n'est jamais modifié.
 */
const dedupeStaticHeadTags = () => {
  if (typeof document === 'undefined') return;
  const head = document.head;

  const dedupe = (selector: string, keyOf: (el: Element) => string | null) => {
    const managed = new Set<string>();
    head.querySelectorAll(`${selector}[data-rh]`).forEach((el) => {
      const key = keyOf(el);
      if (key) managed.add(key);
    });
    head.querySelectorAll(`${selector}:not([data-rh])`).forEach((el) => {
      const key = keyOf(el);
      if (key && managed.has(key)) el.parentNode?.removeChild(el);
    });
  };

  dedupe('link[rel="canonical"]', () => 'canonical');
  dedupe('link[rel="alternate"][hreflang]', (el) => `hreflang:${el.getAttribute('hreflang')}`);
  dedupe('meta[name]', (el) => `name:${el.getAttribute('name')}`);
  dedupe('meta[property]', (el) => `property:${el.getAttribute('property')}`);
};

/** Helmet écrit dans le head après le montage : on repasse quelques fois. */
const scheduleHeadDedupe = () => {
  if (typeof window === 'undefined') return;
  const passes = [0, 300, 1200, 3000];
  passes.forEach((delay) => window.setTimeout(dedupeStaticHeadTags, delay));
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
