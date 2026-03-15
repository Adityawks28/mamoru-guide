import type { ScaleEntry, VocabData, BagItem } from './types';

export const scaleData: ScaleEntry[] = [
  {n:'0',jp:'震度0',colors:['#667','#556'],en:'Imperceptible',ja:'無感',id:'Tidak terasa',shakeClass:'shaking-0',icon:'🏠',pct:0},
  {n:'1',jp:'震度1',colors:['#88a','#779'],en:'Slight tremor felt indoors',ja:'屋内で僅かに感じる',id:'Getaran ringan di dalam',shakeClass:'shaking-1',icon:'🏠',pct:5},
  {n:'2',jp:'震度2',colors:['#8ab','#7a9'],en:'Felt by most indoors',ja:'屋内の多くの人が感じる',id:'Dirasakan kebanyakan orang',shakeClass:'shaking-2',icon:'🏠',pct:10},
  {n:'3',jp:'震度3',colors:['#4cc9f0','#3ab'],en:'Felt by most, dishes rattle',ja:'ほとんどの人が感じる',id:'Dirasakan semua, piring bergetar',shakeClass:'shaking-3',icon:'🍽️',pct:20},
  {n:'4',jp:'震度4',colors:['#4ecb71','#3ba'],en:'Strong shaking, objects fall',ja:'強い揺れ、物が落ちる',id:'Guncangan kuat, benda jatuh',shakeClass:'shaking-4',icon:'📦',pct:35},
  {n:'5-',jp:'震度5弱',colors:['#f5a623','#d89'],en:'Very strong — furniture moves',ja:'非常に強い — 家具が動く',id:'Sangat kuat — furnitur bergerak',shakeClass:'shaking-5m',icon:'🪑',pct:50},
  {n:'5+',jp:'震度5強',colors:['#e87','#d76'],en:'Hard to stand, walls crack',ja:'立っていられない、壁にひび',id:'Sulit berdiri, dinding retak',shakeClass:'shaking-5p',icon:'🧱',pct:60},
  {n:'6-',jp:'震度6弱',colors:['#e65','#d54'],en:'Impossible to stand, buildings damaged',ja:'立てない、建物損壊',id:'Tidak bisa berdiri, bangunan rusak',shakeClass:'shaking-6m',icon:'🏚️',pct:75},
  {n:'6+',jp:'震度6強',colors:['#d43','#c32'],en:'Widespread collapse possible',ja:'広範囲で倒壊の可能性',id:'Keruntuhan luas mungkin',shakeClass:'shaking-6p',icon:'💥',pct:88},
  {n:'7',jp:'震度7',colors:['#e84040','#c22'],en:'Catastrophic — maximum',ja:'壊滅的 — 最大震度',id:'Bencana — intensitas max',s7:true,shakeClass:'shaking-7',icon:'🔴',pct:100},
];

export const vocabData: VocabData = {
  danger: [
    {jp:'危ない！',rom:'Abunai!',en:'Danger! Watch out!',id:'Bahaya! Awas!'},
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
    {jp:'救急車',rom:'Kyuukyuusha',en:'Ambulance — call 119',id:'Ambulans — telp 119'},
    {jp:'警察',rom:'Keisatsu',en:'Police — call 110',id:'Polisi — telp 110'},
    {jp:'怪我をしました',rom:'Kega wo shimashita',en:'I am injured',id:'Saya terluka'},
    {jp:'下に埋まっています',rom:'Shita ni umatte imasu',en:'I am trapped under debris',id:'Saya terperangkap di bawah puing'},
    {jp:'外国人です',rom:'Gaikokujin desu',en:'I am a foreigner',id:'Saya orang asing'},
  ]
};

export const bagItems: BagItem[] = [
  {e:'💧',en:'Water (500ml × 6)',ja:'水（500ml × 6）',id:'Air (500ml × 6)',weight:3.0,priority:10,det_en:'3L minimum for 3 days',det_ja:'3日分で最低3L',det_id:'Minimal 3L untuk 3 hari'},
  {e:'🍙',en:'Emergency food (3 days)',ja:'非常食（3日分）',id:'Makanan darurat (3 hari)',weight:2.0,priority:9,det_en:'Canned food, crackers, energy bars',det_ja:'缶詰、クラッカー、栄養バー',det_id:'Makanan kaleng, kerupuk, bar energi'},
  {e:'🔦',en:'Flashlight + batteries',ja:'懐中電灯 + 電池',id:'Senter + baterai',weight:0.4,priority:8,det_en:'Or hand-crank/solar',det_ja:'手回し/ソーラーも可',det_id:'Atau engkol tangan/surya'},
  {e:'📻',en:'Emergency radio',ja:'防災ラジオ',id:'Radio darurat',weight:0.5,priority:7,det_en:'NHK broadcasts in multiple languages',det_ja:'NHKは多言語で放送',det_id:'NHK dalam berbagai bahasa'},
  {e:'🩹',en:'First aid kit',ja:'救急箱',id:'Kotak P3K',weight:0.8,priority:9,det_en:'Bandages, antiseptic, pain relief',det_ja:'包帯、消毒液、鎮痛剤',det_id:'Perban, antiseptik, pereda nyeri'},
  {e:'💊',en:'Personal medications (5+ days)',ja:'常備薬（5日分以上）',id:'Obat pribadi (5+ hari)',weight:0.2,priority:10,det_en:'With prescription copy',det_ja:'処方箋のコピーがあれば',det_id:'Dengan salinan resep'},
  {e:'📄',en:'Important documents (copies)',ja:'重要書類（コピー）',id:'Dokumen penting (salinan)',weight:0.1,priority:8,det_en:'Passport, zairyu card, insurance',det_ja:'パスポート、在留カード、保険証',det_id:'Paspor, kartu zairyu, asuransi'},
  {e:'💴',en:'Cash (coins + small bills)',ja:'現金（小銭 + 千円札）',id:'Uang tunai (koin + uang kecil)',weight:0.2,priority:8,det_en:'ATMs may not work',det_ja:'ATMが使えない場合',det_id:'ATM mungkin tidak berfungsi'},
  {e:'🔋',en:'Portable phone charger',ja:'モバイルバッテリー',id:'Pengisi daya portabel',weight:0.4,priority:7,det_en:'Keep it charged!',det_ja:'充電を忘れずに！',det_id:'Tetap terisi!'},
  {e:'🧤',en:'Work gloves + dust mask',ja:'軍手 + 防塵マスク',id:'Sarung tangan + masker',weight:0.3,priority:6,det_en:'For moving debris safely',det_ja:'がれき撤去時の安全',det_id:'Untuk memindahkan puing'},
  {e:'🧥',en:'Warm clothes + rain poncho',ja:'防寒着 + レインポンチョ',id:'Pakaian hangat + jas hujan',weight:1.8,priority:5,det_en:'Especially for winter',det_ja:'特に冬の緊急時に',det_id:'Terutama musim dingin'},
  {e:'🗺️',en:'Printed hazard map',ja:'印刷したハザードマップ',id:'Peta bahaya cetak',weight:0.1,priority:6,det_en:'Mark evacuation route!',det_ja:'避難ルートを記入！',det_id:'Tandai rute evakuasi!'},
  {e:'📞',en:'Emergency contacts (paper)',ja:'緊急連絡先（紙）',id:'Kontak darurat (kertas)',weight:0.05,priority:7,det_en:'Phone may die',det_ja:'スマホが使えない時',det_id:'Ponsel bisa mati'},
  {e:'🧴',en:'Hygiene essentials',ja:'衛生用品',id:'Kebutuhan kebersihan',weight:1.0,priority:4,det_en:'Wet wipes, toilet paper, sanitizer',det_ja:'ウェットティッシュ、トイレットペーパー',det_id:'Tisu basah, kertas toilet'},
  {e:'🛏️',en:'Emergency blanket',ja:'防災ブランケット',id:'Selimut darurat',weight:1.5,priority:5,det_en:'Mylar or compact sleeping bag',det_ja:'アルミブランケット又は寝袋',det_id:'Mylar atau kantong tidur kompak'},
  {e:'👟',en:'Sturdy shoes',ja:'丈夫な靴',id:'Sepatu kokoh',weight:1.0,priority:6,det_en:'Broken glass, debris on ground',det_ja:'ガラス片・がれきから足を守る',det_id:'Pecahan kaca, puing di tanah'},
  {e:'🔧',en:'Multi-tool knife',ja:'マルチツールナイフ',id:'Pisau multifungsi',weight:0.3,priority:4,det_en:'Cutting, opening cans, repairs',det_ja:'切断、缶開け、修理',det_id:'Memotong, membuka kaleng, perbaikan'},
  {e:'📢',en:'Emergency whistle',ja:'防災ホイッスル',id:'Peluit darurat',weight:0.05,priority:8,det_en:'Signal for help when trapped',det_ja:'閉じ込められた時の助け呼び',det_id:'Sinyal minta tolong saat terperangkap'},
];

export const MAX_BAG_WEIGHT = 8.0;
