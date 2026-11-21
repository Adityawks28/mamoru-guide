import { defineConfig } from 'vite';
import { swManifestPlugin } from './scripts/vite-sw-manifest';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: '/mamoru-guide/',
  define: {
    // The About section shows this as "Last updated" (YYYY-MM-DD, UTC).
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  plugins: [
    // Generates dist/asset-manifest.json after every build so the
    // service worker can precache the exact hashed JS/CSS filenames.
    swManifestPlugin(),
  ],
});
