import type { SourceId } from './sources';

export interface GlossaryTerm {
  ja: string;
  /** Hiragana; katakana for a loanword such as AED. */
  reading: string;
  en: string;
  id: string;
  source: SourceId;
}

// Every app string whose Japanese contains `ja` must use `en` and `id` (case-insensitive).
export const GLOSSARY: ReadonlyArray<GlossaryTerm> = [
  // id: the Indonesian edition of the same leaflet (cao-evacuation-points-id).
  { ja: '避難所', reading: 'ひなんじょ', en: 'evacuation shelter', id: 'tempat pengungsian', source: 'cao-evacuation-points-en' },
  // id: ISA guidebook heading for 避難場所 (isa-guidebook-id); JMA has "lokasi evakuasi" only inside a sentence.
  { ja: '避難場所', reading: 'ひなんばしょ', en: 'evacuation site', id: 'tempat evakuasi', source: 'jma-multilingual' },
  // id: JMA dictionary sentences and the ISA Indonesian guidebook (isa-guidebook-id) both use "perintah evakuasi".
  // Keep it: the JMA Nagasaki level sheet (jma-nagasaki-levels-id) says "Instruksi Evakuasi", but the national sources agree.
  { ja: '避難指示', reading: 'ひなんしじ', en: 'Evacuation Instruction', id: 'perintah evakuasi', source: 'cao-countermeasures' },
  { ja: '高齢者等避難', reading: 'こうれいしゃとうひなん', en: 'Evacuation of the Elderly, etc.', id: 'Proses Evakuasi Lansia, dll.', source: 'jma-multilingual' },
  // id: not in the JMA dictionary; Level 5 name on the JMA Nagasaki Indonesian level sheet (jma-nagasaki-levels-id).
  { ja: '緊急安全確保', reading: 'きんきゅうあんぜんかくほ', en: 'Emergency Safety Measures', id: 'tindakan keselamatan darurat', source: 'cao-countermeasures' },
  // JMA's term row adds "skala kecil"; its sentence rows drop it, which keeps this a substring of 大津波警報.
  { ja: '津波警報', reading: 'つなみけいほう', en: 'Tsunami Warning', id: 'peringatan bahaya tsunami', source: 'jma-multilingual' },
  { ja: '大津波警報', reading: 'おおつなみけいほう', en: 'Major Tsunami Warning', id: 'peringatan bahaya tsunami skala besar', source: 'jma-multilingual' },
  { ja: '津波注意報', reading: 'つなみちゅういほう', en: 'Tsunami Advisory', id: 'pemberitahuan tsunami', source: 'jma-multilingual' },
  // Level 4 class of JMA weather warnings from 2026-05-29, e.g. レベル４大雨危険警報 "Level 4 Urgent Warning (Heavy Rain)".
  // en: JMA 警戒レベル相当情報の英語表記について; id: JMA dictionary rows "Peringatan Darurat <phenomenon> Tingkat 4".
  { ja: '危険警報', reading: 'きけんけいほう', en: 'Urgent Warning', id: 'Peringatan Darurat', source: 'jma-warning-2026-english' },
  { ja: '緊急地震速報', reading: 'きんきゅうじしんそくほう', en: 'Earthquake Early Warning', id: 'peringatan dini gempa bumi', source: 'jma-multilingual' },
  // JMA lists "skala intensitas gempa bumi / skala intensitas seismik"; the second matches en word for word.
  { ja: '震度', reading: 'しんど', en: 'seismic intensity', id: 'skala intensitas seismik', source: 'jma-multilingual' },
  // id: not in the JMA dictionary; "gempa susulan" is the app's only Indonesian for 余震.
  { ja: '余震', reading: 'よしん', en: 'aftershock', id: 'gempa susulan', source: 'jma-aftershock' },
  // No official term in any language; en from the ISA guidebook sentence on this fire, id confirmed by Aditya (native speaker).
  { ja: '通電火災', reading: 'つうでんかさい', en: 'electrical fire', id: 'kebakaran listrik', source: 'isa-guidebook-en' },
  // id: Alodokter usage (alodokter-crush), not an official body; KBBI and Kemenkes have no term. "cedera himpitan" means crush injury.
  { ja: '圧挫症候群', reading: 'あつざしょうこうぐん', en: 'crush syndrome', id: 'sindrom crush', source: 'jmaj-crush-syndrome' },
  // id: Kemenkes writes "Resusitasi Jantung Paru (RJP)" (kemenkes-rjp).
  { ja: '心肺蘇生', reading: 'しんぱいそせい', en: 'CPR', id: 'RJP', source: 'jfem-aed-guidelines' },
  { ja: 'AED', reading: 'エーイーディー', en: 'AED', id: 'AED', source: 'jfem-aed-guidelines' },
  // id: not in KBBI; "torniket" is the app's only Indonesian for 止血帯.
  { ja: '止血帯', reading: 'しけつたい', en: 'tourniquet', id: 'torniket', source: 'aha-arc-first-aid-2024' },
];
