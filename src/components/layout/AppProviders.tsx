import { type ReactNode, useMemo, useEffect } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

// Create QueryClient instance outside component to avoid recreation
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

// Configuration optimisée de React Query avec meilleure gestion du cache
function AppProviders({ children }: { children: ReactNode }) {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider delayDuration={0}>
          <AuthProvider>
            {children}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
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
  useEffect(() => {
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

// Export both components
export { WebVitalsReporting };
export default AppProviders;
