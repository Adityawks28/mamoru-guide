import type { VocabItem } from '../types';
import { GLOSSARY } from './glossary';

export interface WarningWord {
  /** Exact `ja` of a GLOSSARY entry. */
  term: string;
  /** Modified Hepburn with doubled vowels, like vocabData `rom` (no macrons). */
  rom: string;
  claimId: string;
  instruction_en: string;
  instruction_ja: string;
  instruction_id: string;
}

// Lines are copied from docs/superpowers/specs/2026-11-21-warning-words-verification.md, in row order.
export const WARNING_WORDS: ReadonlyArray<WarningWord> = [
  {
    term: '警戒レベル', rom: 'Keikai reberu', claimId: 'warn-alert-level',
    instruction_en: 'Levels 1 and 2 come from JMA, and Levels 3 to 5 come from your city. Leave by Level 4.',
    instruction_ja: 'レベル1と2は、気象庁（きしょうちょう）などが出します。レベル3から5は、市町村（しちょうそん）が出します。レベル4までに避難（ひなん）してください。',
    instruction_id: 'Tingkat 1 dan 2 berasal dari JMA, dan Tingkat 3 sampai 5 berasal dari kota tempat tinggalmu. Mengungsilah paling lambat di Tingkat 4.',
  },
  {
    term: 'レベル２大雨注意報', rom: 'Reberu ni ooame chuuihou', claimId: 'warn-level-2-advisory',
    instruction_en: 'Check your hazard map and how you will evacuate.',
    instruction_ja: 'ハザードマップで、避難（ひなん）のしかたを確認（かくにん）してください。',
    instruction_id: 'Cek peta bahaya dan cara kamu akan mengungsi.',
  },
  {
    term: '高齢者等避難', rom: 'Koureisha tou hinan', claimId: 'warn-level-3-elderly',
    instruction_en: 'Older people and people who need more time leave a danger area. Other people get ready to leave.',
    instruction_ja: 'お年寄りや、避難（ひなん）に時間がかかる人は、危ない場所から避難します。ほかの人は、避難の準備をします。',
    instruction_id: 'Lansia dan orang yang butuh waktu lebih lama mengungsi dari daerah berbahaya. Orang lain bersiap mengungsi.',
  },
  {
    term: 'レベル３大雨警報', rom: 'Reberu san ooame keihou', claimId: 'warn-level-3-warning',
    instruction_en: 'Do the same as for alert level 3. Older people and people who need more time leave a danger area.',
    instruction_ja: '警戒レベル（けいかいレベル）3と同じことをしてください。お年寄りや、避難（ひなん）に時間がかかる人は、危ない場所から避難します。',
    instruction_id: 'Lakukan hal yang sama seperti tingkat peringatan 3. Lansia dan orang yang butuh waktu lebih lama mengungsi dari daerah berbahaya.',
  },
  {
    term: '避難指示', rom: 'Hinan shiji', claimId: 'warn-level-4-instruction',
    instruction_en: 'Everyone in a danger area must leave.',
    instruction_ja: '危ない場所にいる人は、全員避難（ひなん）してください。',
    instruction_id: 'Semua orang di daerah berbahaya harus mengungsi.',
  },
  {
    term: 'レベル４大雨危険警報', rom: 'Reberu yon ooame kiken keihou', claimId: 'warn-level-4-urgent',
    instruction_en: 'Do the same as for alert level 4. Everyone in a danger area must leave.',
    instruction_ja: '警戒レベル（けいかいレベル）4と同じことをしてください。危ない場所にいる人は、全員避難（ひなん）してください。',
    instruction_id: 'Lakukan hal yang sama seperti tingkat peringatan 4. Semua orang di daerah berbahaya harus mengungsi.',
  },
  {
    term: '緊急安全確保', rom: 'Kinkyuu anzen kakuho', claimId: 'warn-level-5-safety',
    instruction_en: 'A disaster is already here or will come very soon. Act now to save your life.',
    instruction_ja: '災害（さいがい）が起きているか、すぐに起きそうです。すぐに命を守る行動をしてください。',
    instruction_id: 'Bencana sedang atau akan segera terjadi. Segera lindungi nyawamu.',
  },
  {
    term: 'レベル５大雨特別警報', rom: 'Reberu go ooame tokubetsu keihou', claimId: 'warn-level-5-emergency',
    instruction_en: 'Do the same as for alert level 5. Act now to save your life.',
    instruction_ja: '警戒レベル（けいかいレベル）5と同じことをしてください。すぐに命を守る行動をしてください。',
    instruction_id: 'Lakukan hal yang sama seperti tingkat peringatan 5. Segera lindungi nyawamu.',
  },
  {
    term: '津波注意報', rom: 'Tsunami chuuihou', claimId: 'warn-tsunami-advisory',
    instruction_en: 'Get out of the water and leave the coast.',
    instruction_ja: '海から上がってください。海岸（かいがん）から離れてください。',
    instruction_id: 'Keluar dari air dan jauhi pantai.',
  },
  {
    term: '津波警報', rom: 'Tsunami keihou', claimId: 'warn-tsunami-warning',
    instruction_en: 'Go to high ground or an evacuation building now.',
    instruction_ja: 'すぐに逃げてください。高台（たかだい）や避難（ひなん）ビルへ行ってください。',
    instruction_id: 'Segera pergi ke tempat tinggi atau gedung evakuasi.',
  },
  {
    term: '大津波警報', rom: 'Oo tsunami keihou', claimId: 'warn-tsunami-major',
    instruction_en: 'A huge tsunami can come. Go to high ground or an evacuation building now.',
    instruction_ja: '巨大（きょだい）な津波が来るおそれがあります。すぐに高台（たかだい）や避難（ひなん）ビルへ逃げてください。',
    instruction_id: 'Tsunami yang sangat besar bisa datang. Segera pergi ke tempat tinggi atau gedung evakuasi.',
  },
  {
    term: '緊急地震速報', rom: 'Kinkyuu jishin sokuhou', claimId: 'warn-eew',
    instruction_en: 'Stay calm and protect yourself first.',
    instruction_ja: 'あわてずに、まず身の安全（あんぜん）を確保（かくほ）してください。',
    instruction_id: 'Tetap tenang dan lindungi dirimu dulu.',
  },
  {
    term: 'Jアラート', rom: 'Jei araato', claimId: 'warn-jalert',
    instruction_en: 'J-Alert sends urgent national alerts, such as missiles, Earthquake Early Warnings and Major Tsunami Warnings, to phones and town loudspeakers.',
    instruction_ja: 'Jアラートは、国からの急ぎの情報を、すぐに携帯電話や町のスピーカーに送ります。たとえば、ミサイルや緊急地震速報（きんきゅうじしんそくほう）の情報です。大津波警報（おおつなみけいほう）も送ります。',
    instruction_id: 'J-Alert mengirim peringatan nasional yang mendesak, seperti rudal, peringatan dini gempa bumi, dan peringatan bahaya tsunami skala besar, ke ponsel dan pengeras suara kota.',
  },
  {
    term: '避難場所', rom: 'Hinan basho', claimId: 'warn-evac-site',
    instruction_en: 'This is a place to escape to from danger now. Your city chooses sites for each type of disaster.',
    instruction_ja: '災害（さいがい）の危険から、すぐに逃げるための場所です。市町村（しちょうそん）が、災害の種類ごとに決めています。',
    instruction_id: 'Ini tempat untuk menyelamatkan diri dari bahaya sekarang. Kota tempat tinggalmu menentukan tempat ini untuk tiap jenis bencana.',
  },
];

export function warningVocab(words: ReadonlyArray<WarningWord> = WARNING_WORDS): VocabItem[] {
  return words.map((w) => {
    const g = GLOSSARY.find((t) => t.ja === w.term);
    if (!g) throw new Error(`No glossary term: ${w.term}`);
    return {
      jp: g.ja, rom: w.rom, reading: g.reading, en: g.en, id: g.id,
      instruction: { en: w.instruction_en, ja: w.instruction_ja, id: w.instruction_id },
    };
  });
}
