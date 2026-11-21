/**
 * vite-sw-manifest.ts: Vite plugin: generate asset-manifest.json after build
 *
 * WHY THIS EXISTS:
 *   Vite adds a content hash to every output filename (e.g. index-a3f9b2.js).
 *   The hash changes whenever the file content changes.
 *   The service worker needs to know the exact filenames to precache them.
 *   Hard-coding filenames would break on every deploy, so instead we generate
 *   a manifest file at build time and let the SW read it at runtime.
 *
 * OUTPUT:
 *   public/asset-manifest.json, written after every `npm run build`
 *   Shape: { "js": ["assets/index-abc123.js"], "css": ["assets/style-def456.css"] }
 *
 * USAGE in vite.config.ts:
 *   import { swManifestPlugin } from './scripts/vite-sw-manifest';
 *   plugins: [swManifestPlugin()]
 */

import type { Plugin, Rollup } from 'vite';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

interface AssetManifest {
  js: string[];
  css: string[];
}

/** 12 hex characters of SHA-256 over every file (sorted by path, path plus content). */
export function buildHash(files: ReadonlyArray<{ path: string; content: Uint8Array | string }>): string {
  const hash = createHash('sha256');
  const sorted = [...files].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  for (const file of sorted) {
    hash.update(`${file.path}\0`);
    hash.update(file.content);
    hash.update('\0');
  }
  return hash.digest('hex').slice(0, 12);
}

/** Replace the one `const CACHE_NAME = '...';` line with the build hash. */
export function stampCacheName(sw: string, hash: string): string {
  const line = /^const CACHE_NAME = '[^']*';$/gm;
  if ((sw.match(line) ?? []).length !== 1) {
    throw new Error("sw.js must have exactly one `const CACHE_NAME = '...';` line");
  }
  return sw.replace(line, `const CACHE_NAME = 'mamoru-guide-${hash}';`);
}

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)],
  );
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

      // Stamp the cache name: any shipped change gives a new name, an identical rebuild keeps it.
      const files = listFiles(outDir)
        .map(file => ({ path: relative(outDir, file).split(sep).join('/'), content: readFileSync(file) }))
        .filter(file => file.path !== 'sw.js');
      const hash = buildHash(files);
      const swPath = resolve(outDir, 'sw.js');
      writeFileSync(swPath, stampCacheName(readFileSync(swPath, 'utf8'), hash));
      console.log(`[sw-manifest] Cache name: mamoru-guide-${hash}`);

      console.log(`[sw-manifest] Written to ${outPath}`);
      console.log(`[sw-manifest] JS: ${manifest.js.length} file(s), CSS: ${manifest.css.length} file(s)`);
    },
  };
}
