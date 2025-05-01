
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
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Generate unique build hashes for each build to avoid caching issues
    rollupOptions: {
      output: {
        // Optimized chunk naming
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
        // Optimize code splitting to reduce memory usage
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          supabase: ['@supabase/supabase-js'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          charts: ['recharts'],
          queries: ['@tanstack/react-query'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          animations: ['framer-motion']
        }
      },
      // Reduce warnings to minimize build memory usage
      onwarn(warning, warn) {
        // Ignore common warnings that aren't critical
        if (warning.code === 'SOURCEMAP_ERROR') return;
        if (warning.code === 'EVAL') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        if (warning.code === 'EMPTY_BUNDLE') return;
        warn(warning);
      }
    },
    // Reduce build memory usage
    chunkSizeWarningLimit: 3000,
    // Optimize sourcemap settings
    sourcemap: mode === 'production' ? false : 'hidden',
    // Minor optimizations
    assetsInlineLimit: 4096,
    // Optimize minification
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      format: {
        comments: false
      },
      mangle: {
        safari10: true
      }
    } : undefined,
    // Disable CSS code split in development to reduce complexity
    cssCodeSplit: mode === 'production',
    // Disable manifest in development
    manifest: mode === 'production',
  }
}));
