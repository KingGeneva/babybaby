
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App";
import "./index.css";

// Version for the cache - mise à jour pour forcer le rechargement du service worker
const APP_VERSION = '1.2.0'; // Incrémentation pour rafraîchir le cache

// Create helmet context object to share across components
const helmetContext = {};

// Console log pour vérifier que l'app est bien chargée avec la nouvelle version
console.log(`BabyBaby App v${APP_VERSION} loaded successfully`);

// Create the root with React 18 API
const root = ReactDOM.createRoot(document.getElementById("root")!);

// Render the app with all required providers
root.render(
  <React.StrictMode>
    <HelmetProvider context={helmetContext}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
