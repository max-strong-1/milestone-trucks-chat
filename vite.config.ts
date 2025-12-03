import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'public/widget',
        lib: {
            entry: path.resolve(__dirname, 'src/widget/index.tsx'),
            name: 'RetellChatbot',
            fileName: (format) => `chatbot.js`,
            formats: ['umd'],
        },
        rollupOptions: {
            // Ensure external dependencies are bundled or handled correctly
            // For a standalone widget, we usually want to bundle React/ReactDOM 
            // unless we know the host site has them (WordPress usually doesn't have the versions we need)
            external: [],
        },
        // Minify for production
        minify: 'esbuild',
    },
});
