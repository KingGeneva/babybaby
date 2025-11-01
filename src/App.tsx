
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from "react-router-dom";
import AppProviders, { WebVitalsReporting } from "./components/layout/AppProviders";
import LoadingFallback from "./components/layout/LoadingFallback";
import ChatbotButton from "./components/chatbot/ChatbotButton";
import CacheManager from "./components/common/CacheManager";
import { appRoutes } from "./routes";

// Version pour le cache - synchronisée avec main.tsx
const APP_VERSION = '1.2.0';
// Create helmet context object to share across components
const helmetContext = {};

const App = () => (
  <BrowserRouter>
    <HelmetProvider context={helmetContext}>
      <AppProviders>
        <WebVitalsReporting>
          <React.Suspense fallback={<LoadingFallback />}>
            <Routes>
              {appRoutes.map((route) => (
                <Route
                  key={route.path || 'notfound'}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
            
            <ChatbotButton />
            <CacheManager version={APP_VERSION} />
          </React.Suspense>
        </WebVitalsReporting>
      </AppProviders>
    </HelmetProvider>
  </BrowserRouter>
);

export default App;
