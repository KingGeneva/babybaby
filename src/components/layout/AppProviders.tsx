
import React, { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

// Configuration optimisée de React Query avec meilleure gestion du cache
function AppProviders({ children }: { children: ReactNode }) {
  // Instance QueryClient créée dans le composant pour éviter les problèmes de SSR
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30000,
        gcTime: 300000,
        refetchOnWindowFocus: false, // Amélioration des performances
        refetchOnMount: true
      },
    },
  });

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-center" />
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

// Types pour les métriques de Core Web Vitals
interface PerformanceEntryWithDetails extends PerformanceEntry {
  processingStart?: number; // Pour FID
  hadRecentInput?: boolean; // Pour CLS
  value?: number; // Pour CLS
}

// Composant séparé pour le suivi des Web Vitals
function WebVitalsReporting({ children }: { children: ReactNode }) {
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
          const fidEntry = entry as PerformanceEntryWithDetails;
          if (fidEntry.processingStart) {
            const delay = fidEntry.processingStart - entry.startTime;
            console.info('FID metric:', delay);
          }
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      
      // Mesure CLS (Cumulative Layout Shift)
      let clsValue = 0;
      let clsEntries: PerformanceEntryWithDetails[] = [];
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const clsEntry = entry as PerformanceEntryWithDetails;
          if (clsEntry && clsEntry.hadRecentInput === false && clsEntry.value !== undefined) {
            clsValue += clsEntry.value;
            clsEntries.push(clsEntry);
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

// Exporter le composant principal et non le contexte directement
export default AppProviders;
