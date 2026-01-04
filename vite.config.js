/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import manifest from './src/manifest';
export default defineConfig({
    plugins: [vue(), crx({ manifest: manifest })],
    resolve: {
        alias: { '@': resolve(__dirname, 'src') }
    },
    build: {
        target: 'esnext',
        minify: 'esbuild',
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('vue') || id.includes('pinia'))
                            return 'vendor-vue';
                        if (id.includes('vueuse'))
                            return 'vendor-vueuse';
                        if (id.includes('lucide') || id.includes('headlessui'))
                            return 'vendor-ui';
                        if (id.includes('dayjs') || id.includes('fuse'))
                            return 'vendor-utils';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 500
    },
    server: { port: 5173, strictPort: true, hmr: { port: 5173 } },
    test: { environment: 'happy-dom' }
});
