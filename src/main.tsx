
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App";
import "./index.css";
import LoadingFallback from "@/components/layout/LoadingFallback";
import AppProviders from "@/components/layout/AppProviders";
import { Toaster } from "@/components/ui/sonner";
import CacheManager from "@/components/common/CacheManager";

// Version pour le cache
const APP_VERSION = '1.0.0';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <AppProviders>
          <Suspense fallback={<LoadingFallback />}>
            <App />
            <Toaster position="top-center" />
            <CacheManager version={APP_VERSION} />
          </Suspense>
        </AppProviders>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);
