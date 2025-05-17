
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App";
import "./index.css";

// Version pour le cache - mise à jour pour forcer le rechargement du service worker
const APP_VERSION = '1.3.0'; // Incrémentation pour rafraîchir le cache

// Ajouter un élément au document pour indiquer le domaine principal
document.documentElement.setAttribute('data-domain', 'babybaby.org');

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Console log pour vérifier que l'app est bien chargée avec la nouvelle version
console.log(`BabyBaby App v${APP_VERSION} loaded successfully on ${window.location.hostname}`);
