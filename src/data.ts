import type { ScaleEntry, VocabData, BagItem } from './types';

export const scaleData: ScaleEntry[] = [
  {n:'0',jp:'震度0',colors:['#8a8a9a','#556'],en:'People do not feel it.',ja:'人は揺れを感じません。',id:'Tidak terasa.',icon:'🏠',pct:0},
  {n:'1',jp:'震度1',colors:['#88a','#779'],en:'People indoors feel a slight shake.',ja:'建物の中で、少し揺れを感じます。',id:'Getaran ringan terasa di dalam ruangan.',icon:'🏠',pct:5},
  {n:'2',jp:'震度2',colors:['#8ab','#7a9'],en:'Many people indoors feel it.',ja:'建物の中の多くの人が感じます。',id:'Banyak orang di dalam ruangan merasakannya.',icon:'🏠',pct:10},
  {n:'3',jp:'震度3',colors:['#4cc9f0','#3ab'],en:'Most people feel it. Dishes shake and make noise.',ja:'ほとんどの人が感じます。食器がカタカタ鳴ります。',id:'Kebanyakan orang merasakannya. Piring bergetar dan berbunyi.',icon:'🍽️',pct:20},
  {n:'4',jp:'震度4',colors:['#4ecb71','#3ba'],en:'Strong shaking. Objects fall.',ja:'強く揺れます。物が落ちます。',id:'Guncangan kuat. Benda jatuh.',icon:'📦',pct:35},
  {n:'5-',jp:'震度5弱',colors:['#f5a623','#d89'],en:'Very strong shaking. Furniture moves.',ja:'とても強く揺れます。家具が動きます。',id:'Guncangan sangat kuat. Perabot bergeser.',icon:'🪑',pct:50},
  {n:'5+',jp:'震度5強',colors:['#e87','#d76'],en:'It is hard to walk without holding on to something. Walls crack.',ja:'物につかまらないと、歩くのが難しいです。壁にひびが入ります。',id:'Sulit berjalan tanpa berpegangan. Dinding retak.',icon:'🧱',pct:60},
  {n:'6-',jp:'震度6弱',colors:['#e65','#d54'],en:'It is hard to keep standing. Buildings are damaged.',ja:'立っていることが難しいです。建物がこわれます。',id:'Sulit untuk tetap berdiri. Bangunan rusak.',icon:'🏚️',pct:75},
  {n:'6+',jp:'震度6強',colors:['#d43','#c32'],en:'You cannot stand. You can only move by crawling. Buildings can collapse over a large area.',ja:'立っていられません。はわないと動けません。広い範囲で、建物がたおれるかもしれません。',id:'Tidak bisa berdiri. Hanya bisa bergerak dengan merangkak. Bangunan bisa runtuh di area yang luas.',icon:'💥',pct:88},
  {n:'7',jp:'震度7',colors:['#e84040','#c22'],en:'Very severe damage. This is the highest level.',ja:'とても大きな被害が出ます。いちばん強い震度です。',id:'Kerusakan sangat parah. Ini tingkat tertinggi.',s7:true,icon:'🔴',pct:100},
];

export const vocabData: VocabData = {
  danger: [
    {jp:'危ない！',rom:'Abunai!',en:'Danger! Be careful!',id:'Bahaya! Awas!'},
    {jp:'地震',rom:'Jishin',en:'Earthquake',id:'Gempa bumi'},
    {jp:'津波',rom:'Tsunami',en:'Tsunami',id:'Tsunami'},
    {jp:'台風',rom:'Taifuu',en:'Typhoon',id:'Topan'},
    {jp:'洪水',rom:'Kouzui',en:'Flood',id:'Banjir'},
    {jp:'土砂崩れ',rom:'Dosha kuzure',en:'Landslide',id:'Tanah longsor'},
    {jp:'火事',rom:'Kaji',en:'Fire',id:'Kebakaran'},
    {jp:'大雨警報',rom:'Ooame keihou',en:'Heavy rain warning',id:'Peringatan hujan lebat'},
  ],
  action: [
    {jp:'逃げて！',rom:'Nigete!',en:'Run away! Evacuate!',id:'Lari! Mengungsi!'},
    {jp:'避難する',rom:'Hinan suru',en:'To evacuate',id:'Mengungsi'},
    {jp:'身を守る',rom:'Mi wo mamoru',en:'Protect yourself',id:'Lindungi diri'},
    {jp:'頭を守れ',rom:'Atama wo mamore',en:'Protect your head',id:'Lindungi kepala'},
    {jp:'高いところへ',rom:'Takai tokoro e',en:'Go to high ground',id:'Pergi ke tempat tinggi'},
  ],
  places: [
    {jp:'避難場所',rom:'Hinan basho',en:'Evacuation site',id:'Tempat pengungsian'},
    {jp:'避難所',rom:'Hinanjo',en:'Evacuation shelter',id:'Penampungan pengungsi'},
    {jp:'集会所',rom:'Shuukaijo',en:'Assembly hall',id:'Aula pertemuan'},
    {jp:'高台',rom:'Takadai',en:'High ground / hilltop',id:'Tanah tinggi'},
  ],
  help: [
    {jp:'助けて！',rom:'Tasukete!',en:'Help me!',id:'Tolong!'},
    {jp:'救急車',rom:'Kyuukyuusha',en:'Ambulance (call 119)',id:'Ambulans (telepon 119)'},
    {jp:'警察',rom:'Keisatsu',en:'Police (call 110)',id:'Polisi (telepon 110)'},
    {jp:'怪我をしました',rom:'Kega wo shimashita',en:'I am injured',id:'Saya terluka'},
    {jp:'下に埋まっています',rom:'Shita ni umatte imasu',en:'I am trapped under debris',id:'Saya terperangkap di bawah puing'},
    {jp:'外国人です',rom:'Gaikokujin desu',en:'I am a foreigner',id:'Saya orang asing'},
  ],
  medical: [
    {jp:'アレルギーがあります',rom:'Arerugii ga arimasu',en:'I have allergies',id:'Saya punya alergi'},
    {jp:'日本語がわかりません',rom:'Nihongo ga wakarimasen',en:'I do not understand Japanese',id:'Saya tidak mengerti bahasa Jepang'},
    {jp:'英語が話せますか？',rom:'Eigo ga hanasemasu ka?',en:'Do you speak English?',id:'Apakah Anda bisa berbahasa Inggris?'},
    {jp:'私の電話番号は...',rom:'Watashi no denwa bangou wa...',en:'My phone number is...',id:'Nomor telepon saya...'},
    {jp:'糖尿病です',rom:'Tounyoubyou desu',en:'I have diabetes',id:'Saya penderita diabetes'},
    {jp:'心臓病があります',rom:'Shinzoubyou ga arimasu',en:'I have heart disease',id:'Saya punya penyakit jantung'},
    {jp:'薬を飲んでいます',rom:'Kusuri wo nonde imasu',en:'I am taking medicine',id:'Saya sedang minum obat'},
    {jp:'妊娠中です',rom:'Ninshin-chuu desu',en:'I am pregnant',id:'Saya sedang hamil'},
  ]
};

export const bagItems: BagItem[] = [
  {e:'💧',en:'Water (500ml × 6)',ja:'水（500ml × 6）',id:'Air (500ml × 6)',weight:3.1,priority:10,det_en:'One person needs about 3L of drinking water each day.',det_ja:'飲み水は、1人1日3Lぐらい必要です。',det_id:'Satu orang butuh sekitar 3L air minum per hari.'},
  {e:'🍙',en:'Emergency food (3 days)',ja:'非常食（3日分）',id:'Makanan darurat (3 hari)',weight:1.2,priority:9,det_en:'Alpha rice (dried instant rice), crackers, energy bars.',det_ja:'アルファ米（水やお湯でもどすご飯）、クラッカー、栄養バー。',det_id:'Nasi instan (alpha rice), biskuit, bar energi.'},
  {e:'🔦',en:'Flashlight + batteries',ja:'懐中電灯 + 電池',id:'Senter + baterai',weight:0.3,priority:8,det_en:'A hand crank or solar flashlight is also OK.',det_ja:'手回し式やソーラー式でもいいです。',det_id:'Senter engkol tangan atau tenaga surya juga bisa.'},
  {e:'📻',en:'Emergency radio',ja:'防災ラジオ',id:'Radio darurat',weight:0.3,priority:9,det_en:'NHK broadcasts in many languages.',det_ja:'NHKは、いろいろな言葉で放送します。',det_id:'NHK menyiarkan dalam berbagai bahasa.'},
  {e:'🩹',en:'First aid kit',ja:'救急箱',id:'Kotak P3K',weight:0.5,priority:9,det_en:'Bandages, antiseptic, pain medicine.',det_ja:'包帯、消毒液、痛み止め。',det_id:'Perban, antiseptik, obat pereda nyeri.'},
  {e:'💊',en:'Personal medicine (5+ days)',ja:'いつも飲む薬（5日分以上）',id:'Obat pribadi (5+ hari)',weight:0.1,priority:10,det_en:'Add a copy of your prescription if you have one.',det_ja:'処方箋のコピーがあれば、いっしょに入れます。',det_id:'Sertakan salinan resep jika ada.'},
  {e:'📄',en:'Important documents (copies)',ja:'大切な書類（コピー）',id:'Dokumen penting (salinan)',weight:0.05,priority:8,det_en:'Passport, residence card (zairyu card), health insurance card.',det_ja:'パスポート、在留カード、保険証。',det_id:'Paspor, kartu izin tinggal (zairyu), kartu asuransi kesehatan.'},
  {e:'💴',en:'Cash (coins + small bills)',ja:'現金（小銭 + 千円札）',id:'Uang tunai (koin + uang kecil)',weight:0.15,priority:8,det_en:'ATMs may not work.',det_ja:'ATMが使えないことがあります。',det_id:'ATM mungkin tidak berfungsi.'},
  {e:'🔋',en:'Portable phone charger',ja:'モバイルバッテリー',id:'Pengisi daya portabel',weight:0.25,priority:7,det_en:'Keep it charged.',det_ja:'いつも充電しておいてください。',det_id:'Selalu isi dayanya.'},
  {e:'🧤',en:'Work gloves + dust mask',ja:'軍手 + 防塵マスク',id:'Sarung tangan + masker',weight:0.15,priority:6,det_en:'Use them to move debris safely.',det_ja:'がれきを安全に動かすために使います。',det_id:'Untuk memindahkan puing dengan aman.'},
  {e:'🧥',en:'Warm clothes + rain poncho',ja:'防寒着 + レインポンチョ',id:'Pakaian hangat + jas hujan',weight:1.0,priority:5,det_en:'You need them most in winter.',det_ja:'特に冬に必要です。',det_id:'Terutama untuk musim dingin.'},
  {e:'🗺️',en:'Printed hazard map',ja:'印刷したハザードマップ',id:'Peta bahaya cetak',weight:0.02,priority:6,det_en:'Mark your evacuation route on it.',det_ja:'避難ルートを書きこみます。',det_id:'Tandai rute evakuasi Anda di peta.'},
  {e:'📞',en:'Emergency contacts (paper)',ja:'緊急連絡先（紙）',id:'Kontak darurat (kertas)',weight:0.01,priority:7,det_en:'Your phone can stop working.',det_ja:'スマホが使えなくなることがあります。',det_id:'Ponsel bisa mati.'},
  {e:'🧴',en:'Hygiene items',ja:'衛生用品',id:'Barang kebersihan',weight:0.5,priority:4,det_en:'Wet wipes, toilet paper, hand sanitizer.',det_ja:'ウェットティッシュ、トイレットペーパー、手の消毒液。',det_id:'Tisu basah, kertas toilet, cairan pembersih tangan.'},
  {e:'🛏️',en:'Foil emergency blanket',ja:'アルミブランケット',id:'Selimut darurat foil',weight:0.06,priority:5,det_en:'It folds to the size of your palm. It keeps your body heat in.',det_ja:'手のひらサイズにたためます。体の熱を逃がしません。',det_id:'Bisa dilipat seukuran telapak tangan. Menahan panas tubuh.'},
  {e:'👟',en:'Strong shoes',ja:'丈夫な靴',id:'Sepatu yang kuat',weight:0.9,priority:6,det_en:'They protect your feet from broken glass and debris.',det_ja:'割れたガラスやがれきから足を守ります。',det_id:'Melindungi kaki dari pecahan kaca dan puing.'},
  {e:'🔧',en:'Multitool knife',ja:'マルチツールナイフ',id:'Pisau multifungsi',weight:0.2,priority:4,det_en:'For cutting, opening cans, and repairs.',det_ja:'切る、缶を開ける、直すときに使います。',det_id:'Untuk memotong, membuka kaleng, dan memperbaiki barang.'},
  {e:'📢',en:'Emergency whistle',ja:'防災ホイッスル',id:'Peluit darurat',weight:0.01,priority:8,det_en:'Blow it to call for help when you are trapped.',det_ja:'閉じこめられたとき、ふいて助けを呼びます。',det_id:'Tiup untuk minta tolong saat terjebak.'},
  {e:'🚽',en:'Portable toilet kit',ja:'簡易トイレ',id:'Kit toilet portabel',weight:0.4,priority:7,det_en:'A lesson from the 1995 Kobe and 2011 East Japan earthquakes.',det_ja:'阪神・淡路大震災（1995年）と東日本大震災（2011年）から学んだことです。',det_id:'Pelajaran dari gempa Kobe 1995 dan Jepang Timur 2011.'},
  {e:'📋',en:'Laminated phrase card',ja:'ラミネート会話カード',id:'Kartu frasa laminasi',weight:0.01,priority:7,det_en:'A paper copy of the Show This Card phrases.',det_ja:'「見せるカード」を紙にしたものです。',det_id:'Versi kertas dari frasa Tunjukkan Kartu Ini.'},
  {e:'🚰',en:'Extra water (2L bottle)',ja:'追加の水（2Lボトル）',id:'Air tambahan (botol 2L)',weight:2.1,priority:6,det_en:'Water for day 2. It is heavy, but it is hard to replace.',det_ja:'2日目の水です。重いですが、代わりになる物がありません。',det_id:'Air untuk hari ke-2. Berat, tapi sulit diganti.'},
  {e:'🥫',en:'Canned food (×4)',ja:'缶詰（4缶）',id:'Makanan kaleng (×4)',weight:1.6,priority:3,det_en:'It is heavy. Light alpha rice can replace it.',det_ja:'重いです。軽いアルファ米を代わりに使えます。',det_id:'Berat. Nasi instan yang ringan bisa menggantikannya.'},
  {e:'💻',en:'Laptop + charger',ja:'ノートPC + 充電器',id:'Laptop + pengisi daya',weight:1.8,priority:2,det_en:'Your phone is enough for news and maps.',det_ja:'ニュースや地図は、スマホで十分です。',det_id:'Ponsel sudah cukup untuk berita dan peta.'},
];

// Japanese city guides put a grab bag at about 10 kg (women) to 15 kg (men),
// light enough to run with; Mamoru packs to the lower figure.
export const MAX_BAG_WEIGHT = 10.0;
