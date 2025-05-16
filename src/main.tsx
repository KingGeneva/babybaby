
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App";
import "./index.css";
import LoadingFallback from "@/components/layout/LoadingFallback";
import CacheManager from "@/components/common/CacheManager";

// Version pour le cache - mise à jour pour forcer le rechargement du service worker
const APP_VERSION = '1.1.0';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <App />
          <CacheManager version={APP_VERSION} />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
