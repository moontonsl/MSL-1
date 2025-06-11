import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        // host: '10.10.120.31', // your PC's local IP

        // npm run dev
        // php artisan serve --host=0.0.0.0 --port=8000
        host: '192.168.1.14',
        port: 5173,
        strictPort: true,
        cors: {
            origin: '*', // allow any origin
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        },
        watch: {
            usePolling: true, // helps with detecting file changes on some networks
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});
