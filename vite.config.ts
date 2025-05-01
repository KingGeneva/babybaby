
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
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
        // Suppress certain warnings
        format: 'es',
        // Improve code splitting
        manualChunks(id) {
          // Create separate chunks for large dependencies
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) {
              return 'vendor_supabase';
            }
            if (id.includes('react-dom')) {
              return 'vendor_react-dom';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor_react-query';
            }
            if (id.includes('recharts')) {
              return 'vendor_recharts';
            }
            // All other node modules
            return 'vendor';
          }
        }
      },
      // Ignore warnings for certain modules
      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_ERROR') return;
        if (warning.code === 'EVAL') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      }
    },
    // Add timestamp to asset URLs
    assetsInlineLimit: 4096,
    // Improve sourcemaps for better debugging (use 'hidden' for production)
    sourcemap: mode === 'development' ? true : 'hidden',
    // Generate manifest for better asset tracking
    manifest: true,
    // Minification and optimization settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
      format: {
        comments: false
      }
    },
    // Memory optimization for large builds
    chunkSizeWarningLimit: 2000,
    // Ensure correct content hashing
    cssCodeSplit: true,
  }
}));
