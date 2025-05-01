
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
      // Optimize React plugin
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
  },
  build: {
    // Disable sourcemaps entirely in production to save memory
    sourcemap: mode === 'production' ? false : 'hidden',
    
    // Aggressively split code for better caching and parallel loading
    rollupOptions: {
      output: {
        // Optimized chunk naming
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
        
        // Split code more aggressively to reduce memory usage
        manualChunks(id) {
          // Create smaller chunks
          if (id.includes('node_modules')) {
            // Core libraries
            if (id.includes('react/') || id.includes('/react-dom')) {
              return 'vendor-react';
            }
            
            // UI Components
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            
            // Major feature chunks
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            
            // Data libraries
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            
            // Animation libraries (large)
            if (id.includes('framer-motion')) {
              return 'vendor-animations';
            }
            
            // Lottie (very large)
            if (id.includes('lottie')) {
              return 'vendor-lottie';
            }
            
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('@hookform')) {
              return 'vendor-forms';
            }
            
            // Date utilities
            if (id.includes('date-fns')) {
              return 'vendor-dates';
            }
            
            // Supabase client
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            
            // Charts
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            
            // Third party vendors - group by first letter to create more, smaller chunks
            const fileName = id.split('/').pop();
            const firstLetter = fileName ? fileName.charAt(0).toLowerCase() : 'z';
            
            if (/[a-g]/.test(firstLetter)) return `vendor-${firstLetter}1`;
            if (/[h-n]/.test(firstLetter)) return `vendor-${firstLetter}2`;
            if (/[o-t]/.test(firstLetter)) return `vendor-${firstLetter}3`;
            return `vendor-${firstLetter}4`;
          }
          
          // Split app code
          if (id.includes('/src/')) {
            // Lazy load sections by feature
            if (id.includes('/components/dashboard/')) return 'feature-dashboard';
            if (id.includes('/components/medical/')) return 'feature-medical';
            if (id.includes('/components/tools/')) return 'feature-tools';
            if (id.includes('/components/articles/')) return 'feature-articles';
            if (id.includes('/components/ebooks/')) return 'feature-ebooks';
            
            // Group utils and smaller modules
            if (id.includes('/utils/') || id.includes('/lib/')) return 'app-utils';
            if (id.includes('/hooks/')) return 'app-hooks';
            if (id.includes('/components/ui/')) return 'app-ui';
          }
        }
      },
      // Reduce warnings to minimize build memory usage
      onwarn(warning, warn) {
        // Ignore more warnings
        if (warning.code === 'SOURCEMAP_ERROR') return;
        if (warning.code === 'EVAL') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        if (warning.code === 'MISSING_EXPORT') return;
        if (warning.code === 'EMPTY_BUNDLE') return;
        warn(warning);
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 5000,
    
    // Reduce asset inline limit
    assetsInlineLimit: 2048, // 2kb instead of 4kb
    
    // Optimize minification - use esbuild for development builds (faster)
    // Use terser only for production (smaller but slower)
    minify: mode === 'production' ? 'terser' : 'esbuild',
    terserOptions: mode === 'production' ? {
      compress: {
        passes: 2,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        unsafe: true
      },
      format: {
        comments: false
      },
      mangle: {
        safari10: true
      }
    } : undefined,
    
    // Disable CSS code split in development
    cssCodeSplit: mode === 'production',
    
    // Disable manifest in development
    manifest: mode === 'production',
    
    // Memory limits for node process
    // Can help avoid memory issues when running node with limited memory
    target: 'es2020',
    
    // Reduces build memory usage
    emptyOutDir: true,
  }
}));
