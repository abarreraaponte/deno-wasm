import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { run } from "vite-plugin-run";

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
        }),
		vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
		run([
            {
                name: "wayfinder",
                run: ["php", "artisan", "wayfinder:generate --path=resources/js/types/_wayfinder"],
                pattern: ["routes/**/*.php", "app/**/Http/**/*.php"],
            },
        ]),
        tailwindcss(),
    ],
});
