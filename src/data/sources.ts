export type SourceId = string;

export interface Source {
  publisher: string;
  title: string;
  url: string;
  /** YYYY-MM-DD */
  checked: string;
}

export const SOURCES: Record<SourceId, Source> = {
  'jma-multilingual': {
    publisher: '気象庁 (Japan Meteorological Agency)',
    title: '多言語辞書データ (気象情報等に関する多言語辞書, xlsx updated 2026-03-26)',
    url: 'https://www.data.jma.go.jp/developer/multilingual.html',
    checked: '2026-11-21',
  },
  'jma-aftershock': {
    publisher: '気象庁 (Japan Meteorological Agency)',
    title: 'Aftershocks',
    url: 'https://www.jma.go.jp/jma/en/Activities/aftershock.html',
    checked: '2026-11-21',
  },
  'cao-countermeasures': {
    publisher: '内閣府 防災担当 (Cabinet Office, Disaster Management)',
    title: 'Disaster Countermeasures: Disaster Emergency Response and Preparedness (災害応急対応とその備え)',
    url: 'https://www.bousai.go.jp/pdf/pam3-2.pdf',
    checked: '2026-11-21',
  },
  'isa-guidebook-en': {
    publisher: '出入国在留管理庁 (Immigration Services Agency of Japan)',
    title: 'Guidebook on Living and Working, 7th edition (English)',
    url: 'https://www.moj.go.jp/isa/content/001450885.pdf',
    checked: '2026-11-21',
  },
  'isa-guidebook-id': {
    publisher: '出入国在留管理庁 (Immigration Services Agency of Japan)',
    title: 'Buku Panduan Hidup dan Bekerja, edisi ke-7 (Indonesian)',
    url: 'https://www.moj.go.jp/isa/content/001450893.pdf',
    checked: '2026-11-21',
  },
  'jfem-aed-guidelines': {
    publisher: 'Japan Foundation for Emergency Medicine (published by the Ministry of Health, Labour and Welfare)',
    title: 'Guidelines for Optimal Placement and Accessibility of Public-Access AEDs (English version, 2021)',
    url: 'https://www.mhlw.go.jp/content/10800000/000755202.pdf',
    checked: '2026-11-21',
  },
  'kemenkes-rjp': {
    publisher: 'Kementerian Kesehatan Republik Indonesia',
    title: 'Sentuhan Kecil Dapat Selamatkan Nyawa',
    url: 'https://kemkes.go.id/id/sentuhan-kecil-dapat-selamatkan-nyawa',
    checked: '2026-11-21',
  },
  'jmaj-crush-syndrome': {
    publisher: 'Japan Medical Association',
    title: 'JMAJ Vol.48 No.7 (2005): Crush Syndrome in Disaster',
    url: 'https://www.med.or.jp/english/activities/pdf/jmaj/v48no07.pdf',
    checked: '2026-11-21',
  },
  'alodokter-crush': {
    publisher: 'Alodokter',
    title: 'Crush Injury: Gejala, Penyebab, dan Pengobatan',
    url: 'https://www.alodokter.com/crush-injury',
    checked: '2026-11-21',
  },
  'aha-arc-first-aid-2024': {
    publisher: 'American Heart Association and American Red Cross',
    title: '2024 AHA-ARC Guidelines for First Aid: Instructor FAQs',
    url: 'https://heart.org/-/media/CPR-Files/Home_CPR_ECC/Instructor-FAQs_2024-AHAARC-Guidelines-for-First-Aid.pdf',
    checked: '2026-11-21',
  },
};
