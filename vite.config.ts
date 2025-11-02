
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Configuration React optimisée
      tsDecorators: false,
      jsxImportSource: undefined,
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    // Configuration de build optimisée
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2018',
    cssMinify: 'esbuild',
    
    // Réduire la taille des chunks pour éviter les problèmes de mémoire
    chunkSizeWarningLimit: 1000,
    
    // Optimisation du rollup pour mieux gérer la mémoire
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('lucide-react') || id.includes('date-fns')) {
              return 'vendor-tools';
            }
            if (id.includes('react-router-dom')) {
              return 'vendor-routing';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-data';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animations';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'vendor-forms';
            }
          }
        }
      },
      // Réduire les warnings pour économiser la mémoire
      onwarn(warning, warn) {
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        if (warning.code === 'EVAL') return;
        warn(warning);
      }
    },
    
    // Options pour réduire l'utilisation de mémoire
    emptyOutDir: true,
    cssCodeSplit: true,
  }
}));
