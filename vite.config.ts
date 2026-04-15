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
  plugins: [
    // Generates dist/asset-manifest.json after every build so the
    // service worker can precache the exact hashed JS/CSS filenames.
    swManifestPlugin(),
  ],
});
