
import { Suspense } from "react";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import AppProviders from "./components/layout/AppProviders";
import LoadingFallback from "./components/layout/LoadingFallback";
import ChatbotButton from "./components/chatbot/ChatbotButton";
import { appRoutes } from "./routes";

// AppRoutes component to use the useRoutes hook
const AppRoutes = () => {
  const routes = useRoutes(appRoutes);
  return routes;
};

const App = () => (
  <AppProviders>
    <BrowserRouter>
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
      </Suspense>
      
      <ChatbotButton />
    </BrowserRouter>
  </AppProviders>
);

export default App;
