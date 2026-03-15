import type { Language } from './types';

declare global {
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
