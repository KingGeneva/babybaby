
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
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [],
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
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
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
