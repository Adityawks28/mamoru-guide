// i18n.ts — locale dictionary system
// Keys use dot-notation: 'nav.emergency', 'mode.prompt', etc.
// Coexists with the old [data-lang] CSS approach during migration.

import type { Language } from './types';
import { en } from './locales/en';
import { ja } from './locales/ja';
import { id } from './locales/id';

const LOCALES: Record<Language, Record<string, string>> = { en, ja, id };

// Internal language state — updated by lang.ts via setI18nLang().
// Avoids a circular import (lang.ts ↔ i18n.ts).
let _lang: Language = 'en';

export function setI18nLang(lang: Language): void {
  _lang = lang;
}

// Returns the translated string for `key` in `lang` (defaults to current language).
// Falls back to English, then to the key itself if it's missing entirely.
export function t(key: string, lang?: Language): string {
  const l = lang ?? _lang;
  return LOCALES[l]?.[key] ?? LOCALES['en']?.[key] ?? key;
}

// Walk `root` (default: document.body) and set textContent of every [data-i18n] element.
// Elements with [data-i18n-html] get innerHTML instead (for keys that contain markup).
export function applyTranslations(root: Element = document.body): void {
  root.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n!;
    el.textContent = t(key);
  });

  root.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml!;
    el.innerHTML = t(key);
  });
}
