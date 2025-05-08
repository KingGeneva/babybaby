
import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppProviders from "./components/layout/AppProviders";
import LoadingFallback from "./components/layout/LoadingFallback";
import ChatbotButton from "./components/chatbot/ChatbotButton";
import { appRoutes } from "./routes";

const App = () => (
  <AppProviders>
    <Router>
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
    </Router>
  </AppProviders>
);

export default App;
