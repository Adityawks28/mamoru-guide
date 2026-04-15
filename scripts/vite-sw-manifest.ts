/**
 * vite-sw-manifest.ts — Vite plugin: generate asset-manifest.json after build
 *
 * WHY THIS EXISTS:
 *   Vite adds a content hash to every output filename (e.g. index-a3f9b2.js).
 *   The hash changes whenever the file content changes.
 *   The service worker needs to know the exact filenames to precache them.
 *   Hard-coding filenames would break on every deploy, so instead we generate
 *   a manifest file at build time and let the SW read it at runtime.
 *
 * OUTPUT:
 *   public/asset-manifest.json — written after every `npm run build`
 *   Shape: { "js": ["assets/index-abc123.js"], "css": ["assets/style-def456.css"] }
 *
 * USAGE in vite.config.ts:
 *   import { swManifestPlugin } from './scripts/vite-sw-manifest';
 *   plugins: [swManifestPlugin()]
 */

import type { Plugin, Rollup } from 'vite';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

interface AssetManifest {
  js: string[];
  css: string[];
}

export function swManifestPlugin(): Plugin {
  return {
    name: 'vite-sw-manifest',

    // writeBundle runs after Vite has finished writing all output files to disk
    writeBundle(options: Rollup.NormalizedOutputOptions, bundle: Rollup.OutputBundle): void {
      const manifest: AssetManifest = { js: [], css: [] };

      for (const [fileName] of Object.entries(bundle)) {
        if (fileName.endsWith('.js') && fileName.startsWith('assets/')) {
          manifest.js.push(fileName);
        } else if (fileName.endsWith('.css') && fileName.startsWith('assets/')) {
          manifest.css.push(fileName);
        }
      }

      const outDir = options.dir ?? 'dist';
      // Write into the dist folder so it gets deployed alongside the app
      const outPath = resolve(outDir, 'asset-manifest.json');
      writeFileSync(outPath, JSON.stringify(manifest, null, 2));

      console.log(`[sw-manifest] Written to ${outPath}`);
      console.log(`[sw-manifest] JS: ${manifest.js.length} file(s), CSS: ${manifest.css.length} file(s)`);
    },
  };
}
