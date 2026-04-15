/**
 * i18n.ts — Internationalisation / locale dictionary system (stub for Phase 0)
 *
 * "i18n" is shorthand for "internationalisation" (18 letters between i and n).
 * Phase 2 will implement the full locale dictionary and applyTranslations().
 * For now these functions exist so other modules can import them safely.
 */

import type { Language } from './types';

/**
 * Translate a dot-notation key to the current language.
 * Example: t('nav.emergency') → 'Emergency' (in English)
 *
 * Phase 0 stub: returns the key as-is until locales are wired up.
 */
export function t(key: string, _lang?: Language): string {
  return key;
}

/**
 * Walk the DOM from `root` (default: document.body) and replace
 * the text content of every [data-i18n] element with its translated string.
 *
 * Phase 0 stub: no-op until locale dictionaries exist.
 */
export function applyTranslations(_root?: Element): void {
  // Phase 2 implementation goes here
}
