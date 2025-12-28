import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import manifest from './src/manifest';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        crx({ manifest: manifest }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            port: 5173,
        },
    },
});
