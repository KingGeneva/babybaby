
import React, { ReactNode, useState } from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

// Configuration optimisée de React Query avec meilleure gestion du cache
function AppProviders({ children }: { children: ReactNode }) {
  // Instance QueryClient créée dans le composant pour éviter les problèmes de SSR
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30000,
        gcTime: 300000,
        refetchOnWindowFocus: false, // Amélioration des performances
        refetchOnMount: true
      },
    },
  }));

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider>
            <AuthProvider>
              {/* Important: Context pour la gestion du Core Web Vitals */}
              <WebVitalsReportingContext>
                {children}
                <Toaster position="top-center" />
              </WebVitalsReportingContext>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

// Contexte pour suivre et signaler les métriques Web Vitals pour le SEO
function WebVitalsReportingContext({ children }: { children: ReactNode }) {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Mesure LCP (Largest Contentful Paint)
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Envoi des données Web Vitals à l'Analytics
          console.info('LCP metric:', entry.startTime);
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // Mesure FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const delay = entry.processingStart - entry.startTime;
          console.info('FID metric:', delay);
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      
      // Mesure CLS (Cumulative Layout Shift)
      let clsValue = 0;
      let clsEntries = [];
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        }
        console.info('CLS value:', clsValue);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      
      return () => {
        observer.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  return <>{children}</>;
}

export default AppProviders;
