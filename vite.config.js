import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 
                'public/js/app.js', // Use public/js/app.js
                'public/js/components/builds/header.js', // Use public/js/components/builds/header.js
            ],
            refresh: true,
        }),
    ],
});
