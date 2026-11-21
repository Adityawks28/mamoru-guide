import type { Language } from './types';

declare global {
  /** Build day as YYYY-MM-DD, set by `define` in vite.config.ts. Not defined in tests. */
  const __BUILD_DATE__: string | undefined;
  interface Window {
    setLang(lang: Language): void;
    toggleDayNight(): void;
    shareGuide(): Promise<void>;
    switchTab(tabId: string, group: string): void;
    checkBag(): void;
    resetBag(): void;
    savePlan(): void;
    clearPlan(): void;
    printPlan(): void;
    showToast(msg: string): void;
  }
}
