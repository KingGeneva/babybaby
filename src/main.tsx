import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Version for the cache - mise à jour pour forcer le rechargement du service worker
const APP_VERSION = '1.2.0'; // Incrémentation pour rafraîchir le cache

// Console log pour vérifier que l'app est bien chargée avec la nouvelle version
console.log(`BabyBaby App v${APP_VERSION} loaded successfully`);

// Create the root with React 18 API
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

// Render the app
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
