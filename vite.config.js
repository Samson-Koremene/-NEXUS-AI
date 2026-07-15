import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'ui-vendor': ['lucide-react', 'react-markdown', 'rehype-highlight'],
                    'supabase-vendor': ['@supabase/supabase-js']
                }
            }
        },
        // Optionally also bump the chunk size warning limit slightly if needed
        chunkSizeWarningLimit: 600
    }
});
