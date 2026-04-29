import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use jsdom to simulate a browser environment (DOM, window, localStorage, etc.)
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    // Makes describe/it/expect available without importing them in every test file
    globals: true,
  },
});
