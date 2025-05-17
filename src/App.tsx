
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AppProviders from "./components/layout/AppProviders";
import LoadingFallback from "./components/layout/LoadingFallback";
import ChatbotButton from "./components/chatbot/ChatbotButton";
import { appRoutes } from "./routes";

const App = () => (
  <AppProviders>
    <Suspense fallback={<LoadingFallback />}>
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
    </Suspense>
  </AppProviders>
);

export default App;
