export interface ScaleEntry {
  n: string;
  jp: string;
  colors: [string, string];
  en: string;
  ja: string;
  id: string;
  shakeClass: string;
  icon: string;
  pct: number;
  s7?: boolean;
}

export interface VocabItem {
  jp: string;
  rom: string;
  en: string;
  id: string;
}

export type VocabCategory = 'danger' | 'action' | 'places' | 'help';

export type VocabData = Record<VocabCategory, VocabItem[]>;

export interface BagItem {
  e: string;
  en: string;
  ja: string;
  id: string;
  weight: number;
  priority: number;
  det_en: string;
  det_ja: string;
  det_id: string;
}

export type Language = 'en' | 'ja' | 'id';
