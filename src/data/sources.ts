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
    title: '多言語辞書データ (気象情報等に関する多言語辞書, xlsx updated 2026-11-12)',
    url: 'https://www.data.jma.go.jp/developer/multilingual.html',
    checked: '2026-11-21',
  },
  'jma-aftershock': {
    publisher: '気象庁 (Japan Meteorological Agency)',
    title: 'Aftershocks',
    url: 'https://www.jma.go.jp/jma/en/Activities/aftershock.html',
    checked: '2026-11-21',
  },
  'jma-nagasaki-levels-id': {
    publisher: '長崎地方気象台 (JMA Nagasaki Local Meteorological Office)',
    title: 'List of evacuation actions (Indonesian)',
    url: 'https://www.data.jma.go.jp/nagasaki-c/kikikuru/image/List%20of%20evacuation%20actions_ID.pdf',
    checked: '2026-11-21',
  },
  'cao-evacuation-points-en': {
    publisher: 'Cabinet Office (Disaster Management) and Fire and Disaster Management Agency',
    title: 'Evacuation Essentials Under COVID-19 Crisis: 5 points to keep in mind (English)',
    url: 'https://www.bousai.go.jp/kokusai/evacuation_points/pdf/point_en.pdf',
    checked: '2026-11-21',
  },
  'cao-evacuation-points-id': {
    publisher: 'Cabinet Office (Disaster Management) and Fire and Disaster Management Agency',
    title: 'Poin Evakuasi Di Bawah COVID-19 Crisis: 5 hal yang harus diperhatikan (Indonesian)',
    url: 'https://www.bousai.go.jp/kokusai/evacuation_points/pdf/point_id.pdf',
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

export type ClaimStatus = 'verified' | 'changed' | 'removed' | 'needs-medical-review' | 'pending';

export interface Claim {
  sources: SourceId[];
  status: ClaimStatus;
  note: string;
}

// Sources listed on a pending or needs-medical-review claim are where to look,
// not proof. Tasks 4 to 6 set verified, changed or removed after reading them.
export const CLAIMS: Record<string, Claim> = {
  'fa-bleeding-1': { sources: [], status: 'needs-medical-review', note: 'Wear gloves or put a clean cloth between hand and blood' },
  'fa-bleeding-2': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Direct pressure on the wound; 10 minute timer' },
  'fa-bleeding-3': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Do not remove a soaked cloth; add more on top' },
  'fa-bleeding-4': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Raise the injured area above the heart' },
  'fa-bleeding-5': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Tourniquet 5 to 7 cm above the wound, note the time, never loosen' },
  'fa-burns-1': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Cool under cool running water; 10 minute timer' },
  'fa-burns-2': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Remove jewelry and tight clothing before swelling' },
  'fa-burns-3': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Do not remove stuck clothing or break blisters; no ice, butter, toothpaste' },
  'fa-burns-4': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Cover loosely with non-fibrous material such as cling film' },
  'fa-burns-5': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Seek medical help for large burns or burns on face, hands, joints' },
  'fa-fractures-1': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Do not move the injured limb' },
  'fa-fractures-2': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Splint from magazines or cardboard' },
  'fa-fractures-3': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Pad the splint; tie above and below the injury' },
  'fa-fractures-4': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Ice wrapped in cloth, 20 minutes on and 20 minutes off' },
  'fa-fractures-5': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Check circulation below the injury' },
  'fa-crush-1': { sources: ['jmaj-crush-syndrome', 'alodokter-crush'], status: 'needs-medical-review', note: 'Trapped more than 15 minutes: do not free them yourself; crush syndrome risk' },
  'fa-crush-2': { sources: ['jmaj-crush-syndrome', 'alodokter-crush'], status: 'needs-medical-review', note: 'Call 119 and say crush injury' },
  'fa-crush-3': { sources: ['jmaj-crush-syndrome', 'alodokter-crush'], status: 'needs-medical-review', note: 'Keep calm; give water if conscious and able to swallow' },
  'fa-crush-4': { sources: ['jmaj-crush-syndrome', 'alodokter-crush'], status: 'needs-medical-review', note: 'Keep warm; watch for confusion or sleepiness' },
  'fa-crush-5': { sources: ['jmaj-crush-syndrome', 'alodokter-crush'], status: 'needs-medical-review', note: 'Note the time trapped for paramedics' },
  'fa-cpr-1': { sources: ['kemenkes-rjp'], status: 'needs-medical-review', note: 'Check responsiveness by tapping shoulders and shouting' },
  'fa-cpr-2': { sources: ['jfem-aed-guidelines', 'kemenkes-rjp'], status: 'needs-medical-review', note: 'Call 119 and ask for an AED' },
  'fa-cpr-3': { sources: ['kemenkes-rjp'], status: 'needs-medical-review', note: 'Hand position: heel of hand on chest center' },
  'fa-cpr-4': { sources: ['kemenkes-rjp', 'aha-arc-first-aid-2024'], status: 'needs-medical-review', note: '100 to 120 per minute; depth 5 to 6 cm adult, about 5 cm child, about 4 cm infant' },
  'fa-cpr-5': { sources: ['jfem-aed-guidelines'], status: 'needs-medical-review', note: 'Do not stop pushes; AED locations in Japan and green heart sign' },
  'fa-shock-1': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Signs of shock' },
  'fa-shock-2': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Position: legs raised 20 to 30 cm; half sitting for breathing trouble; side if vomiting' },
  'fa-shock-3': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Keep warm and off the cold ground' },
  'fa-shock-4': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'No food or drink; wet the lips' },
  'fa-shock-5': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Stay, talk calmly, watch breathing' },
  'fa-smoke-1': { sources: [], status: 'needs-medical-review', note: 'Stay low and crawl; air near the floor is cleaner' },
  'fa-smoke-2': { sources: [], status: 'needs-medical-review', note: 'Wet cloth over nose and mouth' },
  'fa-smoke-3': { sources: [], status: 'needs-medical-review', note: 'Test door handle with back of hand; never open a hot door' },
  'fa-smoke-4': { sources: [], status: 'needs-medical-review', note: 'Follow green emergency exit signs' },
  'fa-smoke-5': { sources: [], status: 'needs-medical-review', note: 'Outside: sit person upright, loosen clothes, call 119' },
  'fa-psychological-1': { sources: [], status: 'needs-medical-review', note: 'Calm approach and reassurance' },
  'fa-psychological-2': { sources: [], status: 'needs-medical-review', note: 'Breathing 4 seconds in, 4 hold, 4 out' },
  'fa-psychological-3': { sources: [], status: 'needs-medical-review', note: 'Grounding 5-4-3 senses technique' },
  'fa-psychological-4': { sources: [], status: 'needs-medical-review', note: 'Listen without judging; avoid saying Calm down' },
  'fa-psychological-5': { sources: [], status: 'needs-medical-review', note: 'Help with practical needs' },
  'tip-kobe-deaths': { sources: ['cao-countermeasures'], status: 'pending', note: '1995 Hanshin-Awaji deaths: 6,434 total, 4,571 in Kobe City; shindo 7 (used by two tips)' },
  'tip-kobe-fire': { sources: [], status: 'pending', note: 'Kobe 1995 fire burned about 7,000 buildings (also in earthquake-now step 5)' },
  'tip-power-3days': { sources: [], status: 'pending', note: 'Power can be off for 3 days or more' },
  'tip-bag-10kg': { sources: [], status: 'pending', note: 'Keep the emergency bag under 10 kg' },
  'tip-water-3l': { sources: [], status: 'pending', note: 'Plan 3 L of water per person per day' },
  'tip-whistle-sos': { sources: [], status: 'pending', note: 'Three whistle blasts mean SOS (used by two tips)' },
  'tip-kobe-atm': { sources: [], status: 'pending', note: 'Kobe 1995 ATMs did not work for 5 days (used by two tips)' },
  'tip-kobe-traffic': { sources: [], status: 'pending', note: 'Kobe 1995 traffic jam of 100 km' },
  'tip-burn-cooling': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Burn: cool in water 10 minutes or more' },
  'tip-cpr-depth': { sources: ['kemenkes-rjp', 'aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'CPR rate 100 to 120 per minute; adult 5 to 6 cm; child 1/3 chest depth' },
  'tip-shock-position': { sources: ['aha-arc-first-aid-2024'], status: 'needs-medical-review', note: 'Blood loss shock: lay flat and raise legs; half sitting if breathing is hard; always call 119' },
  'tip-crush-15min': { sources: ['jmaj-crush-syndrome', 'alodokter-crush'], status: 'needs-medical-review', note: 'Crushed more than 15 minutes: do not free them yourself' },
  'tip-breathing-444': { sources: [], status: 'needs-medical-review', note: 'Panic breathing 4-4-4 counts' },
  'tip-furniture-30pct': { sources: [], status: 'pending', note: 'Falling furniture causes about 30% of earthquake injuries' },
  'tip-casualty-groups': { sources: [], status: 'pending', note: 'Teens and elderly people have the most casualties in big earthquakes' },
  'tip-1995-crushed': { sources: [], status: 'pending', note: 'Most 1995 deaths were crushing under houses or furniture' },
  'tip-tohoku-40m': { sources: [], status: 'pending', note: 'Tohoku 2011 tsunami reached 40 m in some bays' },
  'tip-72h': { sources: ['cao-countermeasures'], status: 'pending', note: 'Prepare 72 hours of supplies; rescue often on day 3' },
  'tip-tohoku-wave-timing': { sources: [], status: 'pending', note: 'Tohoku 2011 first wave 8 to 25 minutes after the warning' },
  'typhoon-prep-1': { sources: [], status: 'pending', note: 'Tropical Storm: secure balcony items, charge devices, check forecast' },
  'typhoon-prep-2': { sources: [], status: 'pending', note: 'Severe Tropical Storm: tape X on windows, fill bathtub, store water' },
  'typhoon-prep-3': { sources: [], status: 'pending', note: 'Typhoon: stay home or evacuate before the wind peaks' },
  'typhoon-prep-4': { sources: [], status: 'pending', note: 'Very Strong Typhoon: power cut for days, prepare cash, food, batteries' },
  'typhoon-prep-5': { sources: [], status: 'pending', note: 'Violent Typhoon: stay indoors' },
  'typhoon-level-1': { sources: ['jma-multilingual'], status: 'pending', note: 'Tropical Storm: wind 34 to 47 knots and damage description' },
  'typhoon-level-2': { sources: ['jma-multilingual'], status: 'pending', note: 'Severe Tropical Storm: wind 48 to 63 knots and damage description' },
  'typhoon-level-3': { sources: ['jma-multilingual'], status: 'pending', note: 'Typhoon: wind 64 to 84 knots and damage description' },
  'typhoon-level-4': { sources: ['jma-multilingual'], status: 'pending', note: 'Very Strong Typhoon: wind 85 to 104 knots and damage description' },
  'typhoon-level-5': { sources: ['jma-multilingual'], status: 'pending', note: 'Violent Typhoon: wind 105+ knots and damage description' },
  'eqnow-1': { sources: [], status: 'pending', note: 'DROP to the ground' },
  'eqnow-2': { sources: [], status: 'pending', note: 'Take COVER under a strong table' },
  'eqnow-3': { sources: [], status: 'pending', note: 'HOLD ON until shaking stops' },
  'eqnow-4': { sources: [], status: 'pending', note: 'Open the door after shaking stops' },
  'eqnow-5': { sources: [], status: 'pending', note: 'Switch off breaker and gas; Kobe fire 7,000 buildings' },
  'eqnow-6': { sources: [], status: 'pending', note: 'Put on shoes before moving' },
  'eqnow-7': { sources: [], status: 'pending', note: 'Check tsunami warning; go to high ground, do not wait for sirens' },
  'drill-step-1': { sources: [], status: 'pending', note: 'Drop, Cover, Hold On in a classroom on the 4th floor' },
  'drill-step-2': { sources: [], status: 'pending', note: 'Gas smell after shaking: open windows, use stairs, no elevator, switches or flames' },
  'drill-step-3': { sources: [], status: 'needs-medical-review', note: 'Head wound: direct pressure and call 119; do not move the person' },
  'drill-step-4': { sources: [], status: 'pending', note: 'Tsunami warning 500 m from the coast' },
  'drill-step-5': { sources: [], status: 'pending', note: 'Aftershock at the shelter' },
  'drill-step-6': { sources: [], status: 'pending', note: 'When to return to the apartment' },
};
