import type { ScaleEntry, VocabData, BagItem } from './types';

export const scaleData: ScaleEntry[] = [
  {n:'0',jp:'震度0',colors:['#8a8a9a','#556'],en:'People do not feel it.',ja:'人は揺れを感じません。',id:'Tidak terasa.',icon:'🏠',pct:0},
  {n:'1',jp:'震度1',colors:['#88a','#779'],en:'Some people who are quiet indoors feel a slight shake.',ja:'屋内で静かにしている人の中には、少し揺れを感じる人がいます。',id:'Sebagian orang yang diam di dalam ruangan merasakan sedikit guncangan.',icon:'🏠',pct:5},
  {n:'2',jp:'震度2',colors:['#8ab','#7a9'],en:'Most people who are quiet indoors feel it.',ja:'屋内で静かにしている人の大半が、揺れを感じます。',id:'Kebanyakan orang yang diam di dalam ruangan merasakannya.',icon:'🏠',pct:10},
  {n:'3',jp:'震度3',colors:['#4cc9f0','#3ab'],en:'Almost everyone indoors feels it. Dishes on shelves can rattle.',ja:'屋内にいる人のほとんどが、揺れを感じます。棚の食器が音を立てることがあります。',id:'Hampir semua orang di dalam ruangan merasakannya. Piring di rak bisa berbunyi.',icon:'🍽️',pct:20},
  {n:'4',jp:'震度4',colors:['#4ecb71','#3ba'],en:'Most people are startled. Hanging lights swing a lot. Unstable ornaments can fall over.',ja:'ほとんどの人がおどろきます。電灯などのつり下げ物が大きく揺れます。座りの悪い置物が倒れることがあります。',id:'Kebanyakan orang terkejut. Lampu gantung berayun kuat. Pajangan yang tidak stabil bisa jatuh.',icon:'📦',pct:35},
  {n:'5-',jp:'震度5弱',colors:['#f5a623','#d89'],en:'Most people are afraid and want to hold on to something. Furniture that is not fixed can move.',ja:'大半の人がこわいと感じ、物につかまりたいと思います。固定していない家具が動くことがあります。',id:'Kebanyakan orang merasa takut dan ingin berpegangan pada sesuatu. Perabot yang tidak dipasang kuat bisa bergeser.',icon:'🪑',pct:50},
  {n:'5+',jp:'震度5強',colors:['#e87','#d76'],en:'Most people find it hard to walk without holding on. Walls of wooden houses with low earthquake resistance can crack.',ja:'大半の人が、物につかまらないと歩くのが難しくなります。耐震性（たいしんせい）の低い木造住宅（もくぞうじゅうたく）では、壁にひびが入ることがあります。',id:'Kebanyakan orang sulit berjalan tanpa berpegangan. Dinding rumah kayu dengan ketahanan gempa rendah bisa retak.',icon:'🧱',pct:60},
  {n:'6-',jp:'震度6弱',colors:['#e65','#d54'],en:'It is hard to keep standing. Wooden houses with low earthquake resistance can lean, and some fall down.',ja:'立っていることが難しくなります。耐震性（たいしんせい）の低い木造住宅（もくぞうじゅうたく）は、傾くことがあり、倒れるものもあります。',id:'Sulit untuk tetap berdiri. Rumah kayu dengan ketahanan gempa rendah bisa miring, dan sebagian roboh.',icon:'🏚️',pct:75},
  {n:'6+',jp:'震度6強',colors:['#d43','#c32'],en:'You cannot stand. You can only move by crawling. Many wooden houses with low earthquake resistance lean or fall down.',ja:'立っていられません。はわないと動けません。耐震性（たいしんせい）の低い木造住宅（もくぞうじゅうたく）は、傾いたり倒れたりするものが多くなります。',id:'Tidak bisa berdiri. Hanya bisa bergerak dengan merangkak. Banyak rumah kayu dengan ketahanan gempa rendah miring atau roboh.',icon:'💥',pct:88},
  {n:'7',jp:'震度7',colors:['#e84040','#c22'],en:'This is the highest level. Even more wooden houses with low earthquake resistance lean or fall down.',ja:'いちばん上の段階です。耐震性（たいしんせい）の低い木造住宅（もくぞうじゅうたく）は、傾いたり倒れたりするものが、さらに多くなります。',id:'Ini tingkat tertinggi. Makin banyak rumah kayu dengan ketahanan gempa rendah miring atau roboh.',s7:true,icon:'🔴',pct:100},
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
    {jp:'レベル４大雨危険警報',rom:'Reberu yon ooame kiken keihou',en:'Level 4 Urgent Warning (Heavy Rain)',id:'Peringatan Darurat Hujan Lebat Tingkat 4'},
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
  {e:'🍙',en:'Emergency food',ja:'非常食',id:'Makanan darurat',weight:1.2,priority:9,det_en:'Canned dry bread (乾パン), biscuits, chocolate.',det_ja:'缶入り乾パン、ビスケット、チョコレート。',det_id:'Roti kering kaleng (乾パン), biskuit, cokelat.'},
  {e:'🔦',en:'Flashlight + batteries',ja:'懐中電灯 + 電池',id:'Senter + baterai',weight:0.3,priority:8,det_en:'Check that it works.',det_ja:'こわれていないか、確認してください。',det_id:'Pastikan senternya berfungsi.'},
  {e:'📻',en:'Emergency radio',ja:'防災ラジオ',id:'Radio darurat',weight:0.3,priority:9,det_en:'Use it to get correct information.',det_ja:'正しい情報を得るために使います。',det_id:'Pakai untuk mendapat informasi yang benar.'},
  {e:'🩹',en:'First aid kit',ja:'救急箱',id:'Kotak P3K',weight:0.5,priority:9,det_en:'Plasters, bandages, antiseptic.',det_ja:'ばんそうこう、包帯、消毒液。',det_id:'Plester, perban, antiseptik.'},
  {e:'💊',en:'Personal medicine',ja:'いつも飲む薬',id:'Obat pribadi',weight:0.1,priority:10,det_en:'Add your medicine notebook (お薬手帳).',det_ja:'お薬手帳（おくすりてちょう）も入れてください。',det_id:'Masukkan juga buku catatan obatmu (お薬手帳).'},
  {e:'📄',en:'Important documents (copies)',ja:'大切な書類（コピー）',id:'Dokumen penting (salinan)',weight:0.05,priority:8,det_en:'Passport, residence card (zairyu card), health insurance card.',det_ja:'パスポート、在留カード、保険証。',det_id:'Paspor, kartu izin tinggal (zairyu), kartu asuransi kesehatan.'},
  {e:'💴',en:'Cash (coins + small bills)',ja:'現金（小銭 + 千円札）',id:'Uang tunai (koin + uang kecil)',weight:0.15,priority:8,det_en:'Include 10-yen coins for public phones.',det_ja:'公衆電話用に、10円玉も入れてください。',det_id:'Sertakan koin 10 yen untuk telepon umum.'},
  {e:'🔋',en:'Portable phone charger',ja:'モバイルバッテリー',id:'Pengisi daya portabel',weight:0.25,priority:7,det_en:'Phone charger or mobile battery.',det_ja:'携帯電話の充電器・モバイルバッテリー。',det_id:'Pengisi daya ponsel atau power bank.'},
  {e:'🧤',en:'Work gloves + dust mask',ja:'軍手 + 防塵マスク',id:'Sarung tangan + masker',weight:0.15,priority:6},
  {e:'🧥',en:'Warm clothes + rain poncho',ja:'防寒着 + レインポンチョ',id:'Pakaian hangat + jas hujan',weight:1.0,priority:5},
  {e:'🗺️',en:'Printed hazard map',ja:'印刷したハザードマップ',id:'Peta bahaya cetak',weight:0.02,priority:6,det_en:'Check your evacuation site and route on it.',det_ja:'避難場所と避難経路を、この地図で確認してください。',det_id:'Periksa tempat evakuasi dan rute evakuasimu di peta ini.'},
  {e:'📞',en:'Emergency contacts (paper)',ja:'緊急連絡先（紙）',id:'Kontak darurat (kertas)',weight:0.01,priority:7,det_en:'Phones may not connect after a disaster.',det_ja:'災害のあと、電話がつながりにくくなることがあります。',det_id:'Setelah bencana, telepon bisa sulit tersambung.'},
  {e:'🧴',en:'Hygiene items',ja:'衛生用品',id:'Barang kebersihan',weight:0.5,priority:4,det_en:'Wet wipes, toilet paper, hand sanitizer.',det_ja:'ウェットティッシュ、トイレットペーパー、手の消毒液。',det_id:'Tisu basah, kertas toilet, cairan pembersih tangan.'},
  {e:'🛏️',en:'Foil emergency blanket',ja:'アルミブランケット',id:'Selimut darurat foil',weight:0.06,priority:5},
  {e:'👟',en:'Strong shoes',ja:'丈夫な靴',id:'Sepatu yang kuat',weight:0.9,priority:6,det_en:'They protect your feet from broken glass.',det_ja:'割れたガラスから足を守ります。',det_id:'Melindungi kaki dari pecahan kaca.'},
  {e:'🔧',en:'Multitool knife',ja:'マルチツールナイフ',id:'Pisau multifungsi',weight:0.2,priority:4,det_en:'A knife with several tools (十徳ナイフ).',det_ja:'いろいろな道具がついたナイフ（十徳ナイフ）です。',det_id:'Pisau dengan beberapa alat (十徳ナイフ).'},
  {e:'📢',en:'Emergency whistle',ja:'防災ホイッスル',id:'Peluit darurat',weight:0.01,priority:8,det_en:'Blow it to call for help when you are trapped.',det_ja:'閉じこめられたとき、ふいて助けを呼びます。',det_id:'Tiup untuk minta tolong saat terjebak.'},
  {e:'🚽',en:'Portable toilet kit',ja:'簡易トイレ',id:'Kit toilet portabel',weight:0.4,priority:7,det_en:'In 1995, even the fastest evacuation shelters got disaster toilets only on day 3 or later. Pack your own portable toilet.',det_ja:'1995年は、早い避難所でも、災害用トイレが来たのは3日目以降でした。自分の簡易トイレを用意してください。',det_id:'Pada 1995, tempat pengungsian tercepat pun baru dapat toilet darurat pada hari ke-3 atau sesudahnya. Bawa toilet portabelmu sendiri.'},
  {e:'📋',en:'Laminated phrase card',ja:'ラミネート会話カード',id:'Kartu frasa laminasi',weight:0.01,priority:7,det_en:'A paper copy of the Show This Card phrases.',det_ja:'「見せるカード」を紙にしたものです。',det_id:'Versi kertas dari frasa Tunjukkan Kartu Ini.'},
  {e:'🚰',en:'Extra water (2L bottle)',ja:'追加の水（2Lボトル）',id:'Air tambahan (botol 2L)',weight:2.1,priority:6,det_en:'More drinking water. Plan for 3 L per person per day.',det_ja:'追加の飲み水です。1人1日3リットルを目安にしてください。',det_id:'Air minum tambahan. Siapkan 3 L per orang per hari.'},
  {e:'🥫',en:'Canned food (×4)',ja:'缶詰（4缶）',id:'Makanan kaleng (×4)',weight:1.6,priority:3},
  {e:'💻',en:'Laptop + charger',ja:'ノートPC + 充電器',id:'Laptop + pengisi daya',weight:1.8,priority:2,det_en:'It is not on the government lists.',det_ja:'国や自治体のリストには、ありません。',det_id:'Barang ini tidak ada di daftar pemerintah.'},
];

// A game rule, not an official limit. Osaka Prefecture only gives a guide:
// about 15 kg for men and 10 kg for women.
export const MAX_BAG_WEIGHT = 10.0;
