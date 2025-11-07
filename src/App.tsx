import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import LoadingFallback from "./components/layout/LoadingFallback";
import ChatbotButton from "./components/chatbot/ChatbotButton";
import CacheManager from "./components/common/CacheManager";
import { appRoutes } from "./routes";

// Version pour le cache
const APP_VERSION = '1.2.0';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      gcTime: 300000,
      refetchOnWindowFocus: false,
      refetchOnMount: true
    },
  },
});

// Create helmet context
const helmetContext = {};

function App() {
  return (
    <BrowserRouter>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider delayDuration={0}>
              <AuthProvider>
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
                  <CacheManager version={APP_VERSION} />
                </Suspense>
                <Toaster position="top-center" richColors />
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
