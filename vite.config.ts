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
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React e bibliotecas relacionadas
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separar Lucide icons
          'icons': ['lucide-react'],
          // Separar UI components
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-checkbox'],
          // Separar utilitários
          'utils': ['clsx', 'tailwind-merge']
        }
      }
    },
    // Aumentar o limite de aviso para 600kb
    chunkSizeWarningLimit: 600
  }
}));
