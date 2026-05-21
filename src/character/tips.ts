export interface Tip { en: string; ja: string; id: string; }

// Ported verbatim (EN/JA) from mamoru-scenarios.jsx lines 7-19; ID translations new.
export const QUAKE_TIPS: Tip[] = [
  { en: "Drop, Cover, Hold On — get under a sturdy table fast.",        ja: "落ちて・隠れて・待機",    id: "Tiarap, lindungi, tahan — segera ke bawah meja kokoh." },
  { en: "Stay away from windows. Glass is the #1 quake injury.",         ja: "窓から離れて",          id: "Jauhi jendela. Kaca adalah cedera gempa nomor satu." },
  { en: "Don't run outside mid-shake. Falling tiles kill.",              ja: "建物の外は危険",        id: "Jangan lari keluar saat gempa. Genteng jatuh berbahaya." },
  { en: "After shaking stops, open the door — frames warp shut.",        ja: "ドアを開けて避難路確保",  id: "Setelah getaran berhenti, buka pintu — kusen bisa macet." },
  { en: "1995 Kobe quake: 6,434 lives lost in 20 seconds.",              ja: "阪神・淡路大震災 1995",  id: "Gempa Kobe 1995: 6.434 jiwa hilang dalam 20 detik." },
  { en: "Kobe rebuilt with new seismic codes. Buildings now bend, not break.", ja: "神戸は強くなった",   id: "Kobe dibangun ulang dengan standar tahan gempa baru." },
  { en: "If outside, crouch in open ground — away from walls & vending machines.", ja: "壁から離れて", id: "Jika di luar, jongkok di tempat terbuka — jauh dari tembok." },
  { en: "Turn off gas at the meter — Kobe '95 lost 7,000 homes to fire.", ja: "ガスを止めて",         id: "Matikan gas di meteran — Kobe '95 kehilangan 7.000 rumah karena api." },
  { en: "Wear shoes — broken glass everywhere after a big one.",         ja: "靴を履いて",            id: "Pakai sepatu — pecahan kaca di mana-mana setelah gempa besar." },
  { en: "Tsunami may follow. Move to high ground, don't wait for sirens.", ja: "津波は早く・高く",     id: "Tsunami bisa menyusul. Naik ke tempat tinggi, jangan tunggu sirine." },
  { en: "Mt. Rokko's granite makes Kobe quakes feel sharper than Tokyo.", ja: "六甲山の地質",         id: "Granit Gunung Rokko membuat gempa Kobe terasa lebih tajam dari Tokyo." },
  { en: "Charge your phone now — power may go for 3+ days.",             ja: "携帯を充電",           id: "Isi daya ponsel sekarang — listrik bisa padam 3+ hari." },
];

// Ported verbatim (EN/JA) from mamoru-scenarios.jsx lines 21-27.
export const BAG_TIPS: Tip[] = [
  { en: "Aim for under 10kg. You'll carry this for hours.",     ja: "10kg以下で",        id: "Targetkan di bawah 10kg. Anda akan membawanya berjam-jam." },
  { en: "Water first. 3L per person, per day.",                 ja: "水が一番",          id: "Air dulu. 3 liter per orang per hari." },
  { en: "Pack copies of your residence card & passport.",       ja: "在留カードのコピーを", id: "Bawa fotokopi kartu izin tinggal dan paspor." },
  { en: "Whistle saves voice — three blasts means SOS.",        ja: "ホイッスル三回はSOS", id: "Peluit hemat suara — tiga tiupan berarti SOS." },
  { en: "Cash. ATMs failed for 5 days in Kobe '95.",            ja: "現金も忘れずに",     id: "Uang tunai. ATM mati 5 hari saat Kobe '95." },
];

// Ported verbatim (EN/JA) from mamoru-scenarios.jsx lines 28-32.
export const MAP_TIPS: Tip[] = [
  { en: "Schools = primary shelters. Look for 避難所 sign.",     ja: "学校は避難所",       id: "Sekolah = tempat pengungsian utama. Cari papan 避難所." },
  { en: "Walk, don't drive — Kobe '95 had 100km of jammed roads.", ja: "歩いて避難",       id: "Jalan kaki, jangan menyetir — Kobe '95 macet 100km." },
  { en: "Take the route you've practiced. New paths lose you.",  ja: "知ってる道で",      id: "Pakai rute yang sudah Anda latih. Jalan baru bisa menyesatkan." },
];

// New pool — calibrated to category IDs in src/first-aid.ts
// (bleeding / burns / fractures / crush / cpr / shock / smoke / psychological).
export const FIRSTAID_TIPS: Tip[] = [
  { en: "Bleeding: firm direct pressure beats any fancy bandage.",        ja: "出血は直接圧迫が最強",    id: "Pendarahan: tekanan langsung yang kuat lebih ampuh dari perban mewah." },
  { en: "Burn? Cool water for 20 minutes. Never ice, butter, or toothpaste.", ja: "やけどは流水20分",     id: "Luka bakar? Air sejuk 20 menit. Jangan es, mentega, atau pasta gigi." },
  { en: "CPR: push hard, push fast — 100-120 per minute, 5-6cm deep.",     ja: "胸骨圧迫は強く速く",    id: "CPR: tekan keras, tekan cepat — 100-120/menit, dalam 5-6cm." },
  { en: "AEDs in Japan: train stations, konbini, schools. Green heart sign.", ja: "AEDは緑のハート",     id: "AED di Jepang: stasiun, minimarket, sekolah. Tanda hati hijau." },
  { en: "Smoke: get low, cover mouth with wet cloth, follow green exit signs.", ja: "煙では低く濡れ布で", id: "Asap: merendah, tutup mulut dengan kain basah, ikuti tanda hijau." },
  { en: "Shock: lay them flat, elevate legs, blanket on top, no food/drink.", ja: "ショック対応は寝かせて足上げ", id: "Syok: baringkan, angkat kaki, selimuti, jangan beri makan/minum." },
  { en: "Crush injury > 15 min: DO NOT free them. Call 119 immediately.",   ja: "圧挫15分超は自力で救出しない", id: "Cedera himpitan > 15 menit: JANGAN bebaskan sendiri. Hubungi 119." },
  { en: "Panic? Try 4-4-4 breathing: in 4, hold 4, out 4.",                ja: "パニック時は4-4-4呼吸",  id: "Panik? Coba napas 4-4-4: tarik 4, tahan 4, buang 4." },
];

// New pool — typhoonScale has 5 levels (Tropical Storm → Violent Typhoon).
export const TYPHOON_TIPS: Tip[] = [
  { en: "Tropical storm: secure balcony items, charge devices, check the forecast.", ja: "熱帯低気圧: ベランダを片付け", id: "Badai tropis: rapikan balkon, isi daya gawai, cek prakiraan." },
  { en: "Severe storm: tape windows in an X, fill the bathtub, top up water.", ja: "強い暴風: 窓に養生テープ",   id: "Badai parah: lakban jendela bentuk X, isi bak mandi, sediakan air." },
  { en: "Typhoon class: stay home if possible, evacuate before winds peak.", ja: "台風: 強風がピーク前に避難",  id: "Kelas topan: tetap di rumah jika bisa, mengungsi sebelum angin puncak." },
  { en: "Very strong: power may be out for days — prepare cash, food, batteries.", ja: "非常に強い: 停電に備える", id: "Sangat kuat: listrik bisa padam berhari — siapkan tunai, makanan, baterai." },
  { en: "Violent typhoon: stay indoors at all costs. No 'quick errands'.",   ja: "猛烈な台風: 絶対に外出禁止",  id: "Topan dahsyat: tetap di dalam bagaimanapun. Jangan keluar sebentar." },
];

// Ported verbatim (EN/JA) from mascot.jsx lines 6-22.
export const DISASTER_FACTS: Tip[] = [
  { en: "1995 Hanshin-Awaji quake reached shindo 7. Kobe lost 6,434 lives in 20 seconds.", ja: "阪神・淡路大震災 — 震度7", id: "Gempa Hanshin-Awaji 1995 mencapai shindo 7. Kobe kehilangan 6.434 jiwa dalam 20 detik." },
  { en: "Falling furniture causes ~30% of quake injuries. Strap your bookshelves.", ja: "家具を固定して", id: "Furnitur jatuh sebabkan ~30% cedera gempa. Ikat rak buku Anda." },
  { en: "Japan has free hazard maps online. Check yours before signing a lease!", ja: "ハザードマップを確認", id: "Jepang punya peta bahaya gratis online. Cek sebelum tanda tangan kontrak!" },
  { en: "Teens & elderly take the heaviest casualties in big quakes — drill with them.", ja: "若者と高齢者を守る", id: "Remaja & lansia paling banyak korban di gempa besar — latih mereka." },
  { en: "Gas leaks kill more than shaking does — turn off the meter after a quake.", ja: "ガスを止めて", id: "Kebocoran gas lebih mematikan dari guncangan — matikan meteran setelah gempa." },
  { en: "2011 Tōhoku tsunami waves reached 40 meters in some bays.",  ja: "津波 — 最大40m",   id: "Tsunami Tōhoku 2011 mencapai 40 meter di beberapa teluk." },
  { en: "SMS gets through when calls don't. Tell family you're OK by text.", ja: "災害時はSMSで", id: "SMS lolos saat telepon gagal. Kabari keluarga via teks." },
  { en: "Pack 72 hours of supplies. Rescue often arrives on day 3.",   ja: "72時間分の備蓄",   id: "Siapkan persediaan 72 jam. Tim penyelamat sering tiba di hari ke-3." },
  { en: "Most quake injuries hit people running outside. Stay, drop, cover.", ja: "走って外へは危険", id: "Kebanyakan cedera gempa terjadi pada yang lari keluar. Diam, tiarap, lindungi." },
  { en: "Mt. Rokko's hard granite makes Kobe quakes feel sharper than Tokyo's.", ja: "六甲山の地質", id: "Granit Gunung Rokko buat gempa Kobe terasa lebih tajam dari Tokyo." },
  { en: "Tsunami warning to first wave: 8–25 min in Tōhoku 2011. Move now.", ja: "津波は早く来る", id: "Dari peringatan tsunami ke gelombang pertama: 8–25 menit di Tōhoku 2011. Bergerak sekarang." },
  { en: "Three whistle blasts = SOS. Saves your voice when buried.",   ja: "笛3回でSOS",      id: "Tiga tiupan peluit = SOS. Hemat suara saat tertimbun." },
  { en: "ATMs failed for 5 days in Kobe '95. Always keep some cash.",  ja: "現金も忘れずに",   id: "ATM mati 5 hari saat Kobe '95. Selalu sediakan uang tunai." },
  { en: "Japanese schools drill quakes monthly — that's why kids react fast.", ja: "毎月の防災訓練", id: "Sekolah Jepang latihan gempa setiap bulan — karena itu anak cepat tanggap." },
  { en: "Tape an X on windows in typhoons — keeps glass from spraying inward.", ja: "台風前の養生テープ", id: "Lakban jendela bentuk X saat topan — kaca tak menyebar ke dalam." },
];
