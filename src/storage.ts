/**
 * storage.ts — Typed localStorage wrapper
 *
 * All localStorage keys used by the app are declared here in one place.
 * This prevents typos, key collisions, and makes it easy to see exactly
 * what data the app stores on the user's device.
 *
 * PRIVACY: All values are local-only. Nothing here is ever sent to a server.
 */

// ---------------------------------------------------------------------------
// Schema — every localStorage key the app uses, with its value type
// ---------------------------------------------------------------------------

export interface StorageSchema {
  /** Active UI language: 'en' | 'ja' | 'id' */
  'mamoru-lang': string;

  /** Active theme: 'day' | 'night' */
  'mamoru-theme': string;

  /** v1 emergency plan — flat key/value form data (kept for migration only) */
  'mamoru-emergency-plan': string;

  /** v2 emergency plan — structured JSON (EmergencyPlan type from plan-model.ts) */
  'mamoru-plan-v2': string;

  /** Saved primary/backup shelters — JSON (SavedShelters type from shelter-storage.ts) */
  'mamoru-shelters': string;

  /**
   * Active accessibility modes — space-separated list of class names.
   * Possible values: 'a11y-large-text', 'a11y-high-contrast',
   *                  'a11y-simplified', 'a11y-reduced-motion'
   * Empty string means no user preference set (system defaults apply).
   */
  'mamoru-a11y': string;

  /** Personal best score for the bag-packing game */
  'mamoru-best-score': string;

  /** Personal best score for the preparedness quiz */
  'mamoru-quiz-best': string;
}

export type StorageKey = keyof StorageSchema;

// ---------------------------------------------------------------------------
// Typed read / write / remove helpers
// ---------------------------------------------------------------------------

/** Read a value from localStorage. Returns null if the key is not set. */
export function getItem<K extends StorageKey>(key: K): StorageSchema[K] | null {
  return localStorage.getItem(key) as StorageSchema[K] | null;
}

/** Write a value to localStorage. */
export function setItem<K extends StorageKey>(key: K, value: StorageSchema[K]): void {
  localStorage.setItem(key, value);
}

/** Remove a key from localStorage. */
export function removeItem(key: StorageKey): void {
  localStorage.removeItem(key);
}
