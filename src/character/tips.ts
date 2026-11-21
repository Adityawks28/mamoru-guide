export interface Tip { en: string; ja: string; id: string; claimId?: string; }

// Adapted from mamoru-scenarios.jsx lines 7-19. The scene shows tip i for
// shindo row i, so keep the order.
export const QUAKE_TIPS: Tip[] = [
  { en: "Drop, Cover, Hold On. Get under a strong table quickly.", ja: "身を低くして、頭を守り、動かないでください。すぐにじょうぶな机の下に入ってください。", id: "Merunduk, berlindung, bertahan. Segera masuk ke bawah meja yang kuat." },
  { en: "Stay away from windows. Broken glass can cut you badly.", ja: "窓から離れてください。割れたガラスで、大きなけがをすることがあります。", id: "Jauhi jendela. Pecahan kaca bisa melukaimu dengan parah." },
  { en: "Do not run outside during the shaking. Roof tiles can fall and kill you.", ja: "ゆれている間は、外に走って出ないでください。落ちてくる屋根の瓦（かわら）で、死ぬことがあります。", id: "Jangan lari keluar saat guncangan. Genteng bisa jatuh dan membunuhmu." },
  { en: "When the shaking stops, open the door. The door frame can bend and lock the door.", ja: "ゆれが止まったら、ドアを開けてください。ドアの枠（わく）がゆがんで、開かなくなることがあります。", id: "Setelah guncangan berhenti, buka pintu. Kusen pintu bisa bengkok dan pintu macet." },
  { en: "The 1995 earthquake killed 6,434 people. In Kobe City, 4,571 people died.", ja: "1995年の地震では、6,434人が亡くなりました。神戸市では、4,571人が亡くなりました。", id: "Gempa 1995 menewaskan 6.434 orang. Di Kota Kobe, 4.571 orang meninggal.", claimId: "tip-kobe-deaths" },
  { en: "In 1995, buildings from 1981 or earlier had the worst damage. Then Japan made a law to make them stronger.", ja: "1981年以前の建物は、1995年の地震で被害（ひがい）が特に大きかったです。そのあと、古い建物を強くするための法律（ほうりつ）ができました。", id: "Pada 1995, bangunan tahun 1981 dan sebelumnya paling rusak. Lalu dibuat undang-undang untuk memperkuatnya.", claimId: "tip-building-law" },
  { en: "If you are outside, crouch in an open area. Stay away from walls and vending machines.", ja: "外にいるときは、広い場所でしゃがんでください。壁や自動販売機（じどうはんばいき）から離れてください。", id: "Jika di luar, jongkok di tempat terbuka. Jauhi tembok dan mesin penjual otomatis." },
  { en: "Switch off the breaker when you leave. Electrical fires can start when the power comes back on.", ja: "家を出るときは、ブレーカーを切ってください。電気がもどったときに、火事になることがあります。これを通電火災（つうでんかさい）といいます。", id: "Matikan breaker listrik saat kamu pergi. Kebakaran listrik bisa terjadi saat listrik menyala lagi.", claimId: "tip-breaker-fire" },
  { en: "Wear shoes. After a big earthquake, there can be broken glass on the floor.", ja: "靴をはいてください。大きな地震のあとは、床にガラスの破片（はへん）が落ちていることがあります。", id: "Pakai sepatu. Setelah gempa besar, bisa ada pecahan kaca di lantai.", claimId: "tip-shoes-glass" },
  { en: "A tsunami can come after the earthquake. Go to high ground. Do not wait for sirens.", ja: "地震のあと、津波が来ることがあります。高い所へ逃げてください。サイレンを待たないでください。", id: "Tsunami bisa datang setelah gempa. Naik ke tempat tinggi. Jangan tunggu sirene." },
  { en: "Keep spare batteries and a phone charger ready. In 1995, some areas of Kobe had no power for up to 6 days.", ja: "予備（よび）の電池と、スマホの充電器を用意してください。1995年の神戸では、長い所で6日間、電気が止まりました。", id: "Siapkan baterai cadangan dan pengisi daya ponsel. Pada 1995, sebagian Kobe tanpa listrik sampai 6 hari.", claimId: "tip-kobe-power" },
];

// Adapted from mamoru-scenarios.jsx lines 21-27.
export const BAG_TIPS: Tip[] = [
  { en: "The guide weight for a bag is about 15 kg for men and 10 kg for women.", ja: "バッグの重さの目安（めやす）は、男性は約15kg、女性は約10kgです。", id: "Panduan berat tas: sekitar 15 kg untuk laki-laki dan 10 kg untuk perempuan.", claimId: "tip-bag-weight" },
  { en: "Pack water first. Plan for 3 L per person per day.", ja: "まず水を入れてください。1人1日3Lが目安（めやす）です。", id: "Masukkan air dulu. Siapkan 3 liter per orang per hari.", claimId: "tip-water-3l" },
  { en: "Pack copies of your residence card and passport.", ja: "在留カードとパスポートのコピーを入れてください。", id: "Bawa fotokopi kartu izin tinggal dan paspormu.", claimId: "tip-id-copies" },
  { en: "A whistle needs only a little breath. Blow it to call for help if you are trapped.", ja: "笛は、少しの息で鳴らせます。閉じこめられたら、笛をふいて助けを呼んでください。", id: "Peluit hanya butuh sedikit napas. Tiup untuk minta tolong jika kamu terjebak.", claimId: "tip-whistle" },
  { en: "Pack cash. In 1995, up to 450 bank branches in Hyogo closed. All of them opened again by 1 February.", ja: "現金も入れてください。1995年の兵庫県では、最大450の銀行の店が休みました。2月1日までに、すべての店がまた開きました。", id: "Bawa uang tunai. Pada 1995, sampai 450 cabang bank di Hyogo tutup. Semua buka lagi paling lambat 1 Februari.", claimId: "tip-kobe-banks" },
];

// Adapted from mamoru-scenarios.jsx lines 28-32.
export const MAP_TIPS: Tip[] = [
  { en: "Schools are often evacuation sites and evacuation shelters. Find your 避難場所 and 避難所 on the city map.", ja: "学校は、避難場所（ひなんばしょ）にも避難所（ひなんじょ）にもなることが多いです。市の地図で、近くの避難場所と避難所を確かめてください。", id: "Sekolah sering jadi tempat evakuasi dan tempat pengungsian. Cari 避難場所 dan 避難所 di peta kota.", claimId: "tip-shelter-types" },
  { en: "Walk. Do not drive. In 1995, traffic jams in Kobe blocked fire engines and ambulances.", ja: "車ではなく、歩いて避難（ひなん）してください。1995年の神戸では、渋滞（じゅうたい）が、消防車や救急車のじゃまになりました。", id: "Jalan kaki. Jangan naik mobil. Pada 1995, macet di Kobe menghambat mobil pemadam kebakaran dan ambulans.", claimId: "tip-kobe-traffic" },
  { en: "Use a route you practiced. Know more than one route.", ja: "練習した道を使ってください。避難（ひなん）する道を、2つ以上知っておいてください。", id: "Pakai rute yang sudah kamu latih. Ketahui lebih dari satu rute.", claimId: "tip-routes" },
];

// New pool: calibrated to category IDs in src/first-aid.ts
// (bleeding / burns / fractures / crush / cpr / shock / smoke / psychological).
export const FIRSTAID_TIPS: Tip[] = [
  { en: "Bleeding: press firmly on the wound with a clean cloth. Continue to press until paramedics arrive.", ja: "出血（しゅっけつ）：きれいな布で、傷口（きずぐち）を強く押さえてください。救急隊（きゅうきゅうたい）が来るまで、押さえつづけてください。", id: "Perdarahan: tekan luka dengan kuat memakai kain bersih. Terus tekan sampai paramedis datang.", claimId: "tip-bleeding-pressure" },
  { en: "Burn: cool it under running tap water for 10 to 20 minutes. Cool a large burn for less time. No ice or butter.", ja: "やけど：水道の流れる水で、10〜20分冷やしてください。広いやけどは、長く冷やさないでください。氷やバターは使わないでください。", id: "Luka bakar: siram air keran 10 sampai 20 menit. Luka luas: lebih singkat. Jangan pakai es atau mentega.", claimId: "tip-burn-cooling" },
  { en: "CPR: push hard and fast, 100 to 120 times a minute. Adults about 5 cm, children and babies 1/3 of chest depth.", ja: "心肺蘇生（しんぱいそせい）：強く、速く、1分間に100〜120回押してください。大人は約5cm、子どもと赤ちゃんは胸の厚さの約3分の1です。", id: "RJP: tekan kuat dan cepat, 100 sampai 120 kali/menit. Dewasa sekitar 5 cm, anak/bayi sekitar 1/3 tebal dada.", claimId: "tip-cpr-depth" },
  { en: "In Japan, many stations, schools, and some convenience stores have an AED. Look for the AED sign.", ja: "日本では、多くの駅や学校、一部のコンビニに、AEDがあります。AEDのマークをさがしてください。", id: "Di Jepang, banyak stasiun, sekolah, dan sebagian minimarket punya AED. Cari tanda AED.", claimId: "tip-aed-places" },
  { en: "Smoke: stay low. Cover your nose and mouth with any cloth. Do not lose time to make it wet.", ja: "煙：体を低くしてください。どんな布でもいいので、鼻と口を覆（おお）ってください。布をぬらす時間を使わないでください。", id: "Asap: tetap merendah. Tutup hidung dan mulut dengan kain apa saja. Jangan buang waktu untuk membasahinya.", claimId: "tip-smoke-low" },
  { en: "Shock: lay the person flat on the back. Hard to breathe: easiest position. Vomiting: on the side. Call 119.", ja: "ショック：あおむけに寝かせてください。息が苦しい人は、いちばん楽な姿勢（しせい）にしてください。吐いたときは、横向きにしてください。119番に電話してください。", id: "Syok: baringkan telentang. Sesak napas: posisi paling nyaman. Muntah: miringkan badannya. Hubungi 119.", claimId: "tip-shock-position" },
  { en: "Trapped person: call 119. Make sure the place is safe for you. Free them slowly and carefully.", ja: "はさまれた人がいたら：119に電話してください。その場所が、あなたにとって安全か確かめてください。ゆっくり、注意して助け出してください。", id: "Ada orang terjepit: hubungi 119. Pastikan tempatnya aman untukmu. Keluarkan dia pelan-pelan dan hati-hati.", claimId: "tip-crush" },
  { en: "Fast breathing from panic: speak calmly. Ask the person to breathe slowly. Help them sit comfortably.", ja: "パニックで息が速いとき：落ち着いて話してください。ゆっくり息をするように伝えてください。楽にすわれるように、手伝ってください。", id: "Napas cepat karena panik: bicaralah dengan tenang. Minta dia bernapas pelan-pelan. Bantu dia duduk nyaman.", claimId: "tip-breathing" },
];

// New pool: typhoonScale has 5 levels (Tropical Storm → Violent Typhoon).
// The scale on screen shows the English level names in every language.
export const TYPHOON_TIPS: Tip[] = [
  { en: "Tropical Storm: secure balcony items. Keep spare batteries and a phone charger. Check the forecast.", ja: "Tropical Storm：ベランダの物を片づけてください。予備（よび）の電池と、スマホの充電器を用意してください。天気予報を見てください。", id: "Badai tropis: amankan barang di balkon. Siapkan baterai cadangan dan pengisi daya ponsel. Cek prakiraan cuaca.", claimId: "typhoon-prep-1" },
  { en: "Severe Tropical Storm: put film or tape on the windows. Close the curtains. Fill the bathtub. Store water.", ja: "Severe Tropical Storm：窓にフィルムかテープをはりましょう。カーテンを閉めましょう。おふろに水をためましょう。水を多めに用意しましょう。", id: "Badai tropis kuat: pasang film atau lakban di jendela. Tutup tirai. Isi bak mandi. Simpan air.", claimId: "typhoon-prep-2" },
  { en: "Typhoon: check the hazard map. If you live in a danger area, leave before the wind and rain get strong.", ja: "Typhoon：ハザードマップを見てください。危ない場所に住んでいたら、風と雨が強くなる前に避難（ひなん）してください。", id: "Topan: cek peta bahaya. Jika kamu tinggal di daerah berbahaya, mengungsilah sebelum angin dan hujan kuat.", claimId: "typhoon-prep-3" },
  { en: "Very Strong Typhoon: the power can be off for days. Prepare cash, food, and batteries.", ja: "Very Strong Typhoon：何日も電気が止まることがあります。現金、食べ物、電池を用意してください。", id: "Topan sangat kuat: listrik bisa padam berhari-hari. Siapkan uang tunai, makanan, dan baterai.", claimId: "typhoon-prep-4" },
  { en: "Violent Typhoon: do not go out unless you need to. Stay away from dangerous places.", ja: "Violent Typhoon：必要なとき以外は、外に出ないでください。危ない場所に近づかないでください。", id: "Topan dahsyat: jangan keluar kecuali perlu. Jauhi tempat berbahaya.", claimId: "typhoon-prep-5" },
];

// Adapted from mascot.jsx lines 6-22.
export const DISASTER_FACTS: Tip[] = [
  { en: "Great Hanshin-Awaji Earthquake (1995): seismic intensity 7 in parts of Kobe. 4,571 people died in Kobe City.", ja: "1995年に、阪神・淡路大震災（はんしん・あわじだいしんさい）が起きました。神戸の一部で、震度（しんど）7になりました。神戸市では、4,571人が亡くなりました。", id: "Gempa Besar Hanshin-Awaji 1995: skala intensitas seismik 7 di sebagian Kobe. 4.571 orang tewas di Kota Kobe.", claimId: "tip-kobe-deaths" },
  { en: "In recent earthquakes, furniture that fell or moved hurt 30 to 50% of injured people. Fix it to the wall.", ja: "最近の地震では、けがをした人の3〜5割が、家具でけがをしました。家具がたおれたり、動いたりしたためです。家具を壁に固定（こてい）してください。", id: "Pada gempa terkini, 30 sampai 50% korban luka terkena perabot jatuh atau bergeser. Ikat perabot ke dinding.", claimId: "tip-furniture-injuries" },
  { en: "Japan has free hazard maps online. Check yours before you sign a lease.", ja: "日本には、無料のハザードマップ（危ない場所の地図）があります。部屋を借りる前に見てください。", id: "Jepang punya peta bahaya gratis secara online. Cek peta daerahmu sebelum menandatangani kontrak sewa.", claimId: "tip-hazard-maps" },
  { en: "In 1995, many older people died. People in their 20s and foreign residents also had high death rates.", ja: "1995年の地震では、多くの高齢者（こうれいしゃ）が亡くなりました。20代の人と外国人も、亡くなった人の割合（わりあい）が高かったです。", id: "Pada 1995, banyak lansia meninggal. Orang usia 20-an dan warga asing juga punya angka kematian tinggi.", claimId: "tip-casualty-groups" },
  { en: "In 1995, houses or furniture crushed most of the people who died. Fix furniture to the wall.", ja: "1995年に亡くなった人の多くは、家や家具の下じきになりました。家具を壁に固定（こてい）してください。", id: "Pada 1995, sebagian besar korban tertimpa rumah atau perabot. Ikat perabot ke dinding.", claimId: "tip-1995-crushed" },
  { en: "In 2011, the tsunami ran up the land to 40.1 m at Ryori Bay in Ōfunato. It is the highest on record in Japan.", ja: "2011年の津波は、陸を40.1mの高さまでかけ上がりました。場所は、大船渡市（おおふなとし）の綾里湾（りょうりわん）です。記録に残る中で、日本でいちばん高いです。", id: "Pada 2011, tsunami naik ke daratan hingga 40,1 m di Teluk Ryori, Ōfunato. Ini rekor tertinggi di Jepang.", claimId: "tip-tohoku-40m" },
  { en: "After a disaster, phone calls can fail. Use 171 or your carrier's 災害用伝言板 to say you are safe.", ja: "災害のあとは、電話がつながらないことがあります。171か携帯電話会社の災害用伝言板（さいがいようでんごんばん）を使ってください。無事を知らせてください。", id: "Setelah bencana, telepon bisa tidak tersambung. Pakai 171 atau 災害用伝言板 operatormu untuk kabar selamat.", claimId: "tip-safety-message" },
  { en: "Store food and water for at least 3 days. For a very large disaster, store enough for 1 week.", ja: "水と食べ物を、少なくとも3日分用意してください。とても大きな災害のために、1週間分あるとよいです。", id: "Simpan makanan dan air untuk minimal 3 hari. Untuk bencana sangat besar, simpan untuk 1 minggu.", claimId: "tip-stock-days" },
  { en: "Do not run outside during the shaking. Roof tiles, glass and signs can fall on you. Drop, cover and hold on.", ja: "ゆれている間は、外に飛び出さないでください。瓦（かわら）やガラス、看板（かんばん）が落ちてくることがあります。身を低くして、頭を守り、動かないでください。", id: "Jangan lari keluar saat guncangan. Genteng, kaca, dan papan nama bisa jatuh. Merunduk, berlindung, bertahan.", claimId: "tip-run-outside" },
  { en: "In 2011, later tsunami waves were often bigger than the first. Stay high until the warning ends.", ja: "2011年の津波では、あとの波のほうが、最初の波より大きいことが多くありました。警報（けいほう）が終わるまで、高い所にいてください。", id: "Tsunami 2011: gelombang berikutnya sering lebih besar dari yang pertama. Tetap di atas sampai peringatan usai.", claimId: "tip-tohoku-later-waves" },
  { en: "If you are trapped, blow a whistle to call for help. A whistle needs only a little breath.", ja: "閉じこめられたら、笛をふいて助けを呼んでください。笛は、少しの息で鳴らせます。", id: "Jika kamu terjebak, tiup peluit untuk minta tolong. Peluit hanya butuh sedikit napas.", claimId: "tip-whistle" },
  { en: "In 1995, up to 450 bank branches in Hyogo closed. All opened again by 1 February. Always keep some cash.", ja: "1995年の兵庫県では、最大450の銀行の店が休みました。2月1日までに、すべての店がまた開きました。いつも現金を少し持っていてください。", id: "Selalu bawa tunai. Pada 1995, sampai 450 cabang bank di Hyogo tutup. Semua buka lagi paling lambat 1 Februari.", claimId: "tip-kobe-banks" },
  { en: "Before a typhoon, put film or tape on the windows. Close the curtains. This helps to keep broken glass out.", ja: "台風の前に、窓にフィルムかテープをはってください。カーテンを閉めてください。割れたガラスが、部屋に入りにくくなります。", id: "Sebelum topan, pasang film atau lakban di jendela. Tutup tirai. Ini membantu mencegah kaca terlempar masuk.", claimId: "tip-window-film" },
];
