export interface Tip { en: string; ja: string; id: string; }

// Adapted from mamoru-scenarios.jsx lines 7-19. The scene shows tip i for
// shindo row i, so keep the order.
export const QUAKE_TIPS: Tip[] = [
  { en: "Drop, Cover, Hold On. Get under a strong table quickly.", ja: "身を低くして、頭を守り、動かないでください。すぐにじょうぶな机の下に入ってください。", id: "Merunduk, berlindung, bertahan. Segera masuk ke bawah meja yang kuat." },
  { en: "Stay away from windows. Broken glass can cut you badly.", ja: "窓から離れてください。割れたガラスで、大きなけがをすることがあります。", id: "Jauhi jendela. Pecahan kaca bisa melukai Anda dengan parah." },
  { en: "Do not run outside during the shaking. Falling roof tiles can kill.", ja: "揺れている間は、外に走って出ないでください。落ちてくる屋根の瓦で死ぬことがあります。", id: "Jangan lari ke luar saat guncangan. Genteng yang jatuh bisa membunuh." },
  { en: "When the shaking stops, open the door. The door frame can bend and lock the door.", ja: "揺れが止まったら、ドアを開けてください。ドアの枠がゆがんで、開かなくなることがあります。", id: "Setelah guncangan berhenti, buka pintu. Kusen pintu bisa bengkok dan pintu macet." },
  { en: "The 1995 earthquake took 6,434 lives. In Kobe City alone, 4,571 people died.", ja: "1995年の阪神・淡路大震災では、6,434人が亡くなりました。神戸市だけで4,571人です。", id: "Gempa 1995 merenggut 6.434 jiwa. Di Kota Kobe saja, 4.571 orang meninggal." },
  { en: "Kobe rebuilt with new earthquake building rules. Buildings now bend and do not break.", ja: "神戸は、地震に強い新しいルールで町を建て直しました。今の建物は、揺れで曲がっても折れません。", id: "Kobe dibangun ulang dengan aturan tahan gempa yang baru. Kini bangunan melentur, tidak patah." },
  { en: "If you are outside, crouch in an open area. Stay away from walls and vending machines.", ja: "外にいるときは、広い場所でしゃがんでください。壁や自動販売機から離れてください。", id: "Jika di luar, jongkok di tempat terbuka. Jauhi tembok dan mesin penjual otomatis." },
  { en: "Switch off the breaker when you leave. In Kobe in 1995, fire burned about 7,000 buildings.", ja: "家を出るときは、ブレーカーを切ってください。1995年の神戸では、火事で約7,000棟が焼けました。", id: "Matikan breaker listrik saat keluar. Di Kobe tahun 1995, api membakar sekitar 7.000 bangunan." },
  { en: "Wear shoes. After a big earthquake, there is broken glass everywhere.", ja: "靴をはいてください。大きな地震のあとは、ガラスの破片がたくさん落ちています。", id: "Pakai sepatu. Setelah gempa besar, ada pecahan kaca di mana-mana." },
  { en: "A tsunami can come after the earthquake. Go to high ground. Do not wait for sirens.", ja: "地震のあと、津波が来ることがあります。高い所へ逃げてください。サイレンを待たないでください。", id: "Tsunami bisa datang setelah gempa. Naik ke tempat tinggi. Jangan tunggu sirene." },
  { en: "Mt. Rokko granite makes Kobe earthquakes feel sharper than Tokyo earthquakes.", ja: "六甲山の花こう岩のため、神戸の地震は東京より揺れが鋭く感じます。", id: "Granit Gunung Rokko membuat gempa di Kobe terasa lebih tajam daripada di Tokyo." },
  { en: "Charge your phone now. The power can be off for 3 days or more.", ja: "今、スマホを充電してください。停電が3日以上続くことがあります。", id: "Isi daya ponsel sekarang. Listrik bisa padam 3 hari atau lebih." },
];

// Adapted from mamoru-scenarios.jsx lines 21-27.
export const BAG_TIPS: Tip[] = [
  { en: "Keep the bag under 10 kg. You may carry it for hours.", ja: "袋は10kg以下にしてください。何時間も運ぶことがあります。", id: "Usahakan tas di bawah 10 kg. Anda mungkin membawanya berjam-jam." },
  { en: "Pack water first. Plan for 3 L per person per day.", ja: "まず水を入れてください。1人1日3Lが目安です。", id: "Masukkan air dulu. Siapkan 3 liter per orang per hari." },
  { en: "Pack copies of your residence card and passport.", ja: "在留カードとパスポートのコピーを入れてください。", id: "Bawa fotokopi kartu izin tinggal dan paspor." },
  { en: "A whistle saves your voice. Three blasts mean SOS.", ja: "笛を使えば、声を出さなくてすみます。3回吹くとSOSの合図です。", id: "Peluit menghemat suara. Tiga tiupan berarti SOS." },
  { en: "Pack cash. In Kobe in 1995, ATMs did not work for 5 days.", ja: "現金も入れてください。1995年の神戸では、ATMが5日間使えませんでした。", id: "Bawa uang tunai. Di Kobe tahun 1995, ATM mati selama 5 hari." },
];

// Adapted from mamoru-scenarios.jsx lines 28-32.
export const MAP_TIPS: Tip[] = [
  { en: "Schools are the main shelters. Look for the 避難所 sign.", ja: "学校が主な避難所です。「避難所」の看板を探してください。", id: "Sekolah adalah tempat pengungsian utama. Cari papan 避難所." },
  { en: "Walk. Do not drive. In Kobe in 1995, 100 km of roads were jammed.", ja: "車ではなく、歩いて避難してください。1995年の神戸では、100kmの道が渋滞しました。", id: "Jalan kaki, jangan naik mobil. Di Kobe tahun 1995, jalan macet sepanjang 100 km." },
  { en: "Use the route you practiced. On a new route, you can get lost.", ja: "練習した道を使ってください。知らない道では、迷うことがあります。", id: "Pakai rute yang sudah Anda latih. Di jalan baru, Anda bisa tersesat." },
];

// New pool — calibrated to category IDs in src/first-aid.ts
// (bleeding / burns / fractures / crush / cpr / shock / smoke / psychological).
export const FIRSTAID_TIPS: Tip[] = [
  { en: "Bleeding: press firmly on the wound. Direct pressure works better than a special bandage.", ja: "出血：傷口を強く、直接押さえてください。特別な包帯より効果があります。", id: "Pendarahan: tekan luka dengan kuat. Tekanan langsung lebih ampuh dari perban khusus." },
  { en: "Burn: cool it in water for 10 min or more. Cover it loosely with a clean cloth. No ice, butter, or toothpaste.", ja: "やけど：水で10分以上冷やしてください。そのあと、きれいな布でゆるく覆ってください。氷、バター、歯みがき粉は使わないでください。", id: "Luka bakar: siram air sejuk minimal 10 menit. Tutup longgar dengan kain bersih. Tanpa es, mentega, pasta gigi." },
  { en: "CPR: push hard and fast, 100 to 120 a minute. Adults 5 to 6 cm, children 1/3 of chest depth. Take a course.", ja: "心肺蘇生：強く、速く、1分間に100〜120回押してください。大人は5〜6cm、子どもは胸の厚さの約3分の1です。講習を受けてください。", id: "CPR: tekan kuat dan cepat, 100 sampai 120 kali per menit. Dewasa 5 sampai 6 cm, anak 1/3 tebal dada." },
  { en: "AEDs in Japan are in train stations, convenience stores, and schools. Look for the green heart sign.", ja: "AEDは、駅、コンビニ、学校にあります。緑のハートのマークが目印です。", id: "AED di Jepang ada di stasiun, minimarket, dan sekolah. Cari tanda hati hijau." },
  { en: "Smoke: stay low. Cover your mouth with a wet cloth. Follow the green exit signs.", ja: "煙：体を低くしてください。ぬれた布で口を覆ってください。緑の非常口のマークに向かってください。", id: "Asap: tetap merendah. Tutup mulut dengan kain basah. Ikuti tanda keluar hijau." },
  { en: "Blood loss shock: lay them flat, raise the legs. Hard to breathe: half sitting. Always call 119.", ja: "出血によるショック：あお向けに寝かせて、足を上げてください。息が苦しい人は、少し体を起こしてください。必ず119番に電話してください。", id: "Syok karena pendarahan: baringkan, angkat kaki. Sesak napas: setengah duduk. Selalu hubungi 119." },
  { en: "Crushed for more than 15 minutes: DO NOT free them yourself. Call 119 now.", ja: "15分以上はさまれている人：自分で助け出さないでください。すぐに119番に電話してください。", id: "Terjepit lebih dari 15 menit: JANGAN bebaskan sendiri. Segera hubungi 119." },
  { en: "If you panic: breathe in for 4 counts, hold for 4, breathe out for 4.", ja: "パニックのとき：4つ数えて息を吸い、4つ止めて、4つで吐いてください。", id: "Saat panik: tarik napas 4 hitungan, tahan 4, buang 4." },
];

// New pool — typhoonScale has 5 levels (Tropical Storm → Violent Typhoon).
// The scale on screen shows the English level names in every language.
export const TYPHOON_TIPS: Tip[] = [
  { en: "Tropical Storm: secure items on the balcony. Charge your devices. Check the forecast.", ja: "Tropical Storm：ベランダの物を片づけてください。スマホなどを充電してください。天気予報を見てください。", id: "Badai tropis: amankan barang di balkon. Isi daya gawai. Cek prakiraan cuaca." },
  { en: "Severe Tropical Storm: tape an X on the windows. Fill the bathtub. Store more water.", ja: "Severe Tropical Storm：窓にテープをXの形にはってください。浴そうに水をためてください。水を多めに用意してください。", id: "Badai tropis kuat: lakban jendela bentuk X. Isi bak mandi. Tambah persediaan air." },
  { en: "Typhoon: stay home if you can. Evacuate before the wind is at its strongest.", ja: "Typhoon：できれば家にいてください。避難するときは、風が一番強くなる前に避難してください。", id: "Topan: tetap di rumah jika bisa. Mengungsilah sebelum angin paling kencang." },
  { en: "Very Strong Typhoon: the power can be off for days. Prepare cash, food, and batteries.", ja: "Very Strong Typhoon：何日も停電することがあります。現金、食べ物、電池を用意してください。", id: "Topan sangat kuat: listrik bisa padam berhari-hari. Siapkan uang tunai, makanan, baterai." },
  { en: "Violent Typhoon: stay indoors. Do not go out, not even for a short time.", ja: "Violent Typhoon：外に出ないでください。少しの用事でも、出ないでください。", id: "Topan dahsyat: tetap di dalam. Jangan keluar, walau hanya sebentar." },
];

// Adapted from mascot.jsx lines 6-22.
export const DISASTER_FACTS: Tip[] = [
  { en: "The 1995 Hanshin-Awaji earthquake reached shindo 7. In Kobe City, 4,571 people died.", ja: "1995年の阪神・淡路大震災は震度7でした。神戸市では4,571人が亡くなりました。", id: "Gempa Hanshin-Awaji 1995 mencapai shindo 7. Di Kota Kobe, 4.571 orang meninggal." },
  { en: "Falling furniture causes about 30% of earthquake injuries. Fasten your bookshelves.", ja: "地震のけがの約30%は、倒れた家具によるものです。本棚を固定してください。", id: "Furnitur jatuh menyebabkan sekitar 30% cedera gempa. Ikat rak buku Anda." },
  { en: "Japan has free hazard maps online. Check yours before you sign a lease.", ja: "日本には、無料のハザードマップ（危ない場所の地図）があります。部屋を借りる前に見てください。", id: "Jepang punya peta bahaya gratis secara online. Cek sebelum tanda tangan kontrak sewa." },
  { en: "In big earthquakes, teens and elderly people have the most casualties. Do drills with them.", ja: "大きな地震では、10代の若者と高齢者の被害が一番多いです。一緒に避難訓練をしてください。", id: "Pada gempa besar, remaja dan lansia paling banyak jadi korban. Lakukan latihan bersama mereka." },
  { en: "In 1995, most people who died were crushed under houses or furniture. Fix furniture to the wall.", ja: "1995年に亡くなった人の多くは、家や家具の下じきになりました。家具を壁に固定してください。", id: "Pada 1995, sebagian besar korban tertimpa rumah atau perabot. Pasang perabot ke dinding." },
  { en: "In the 2011 Tōhoku tsunami, waves reached 40 meters in some bays.", ja: "2011年の東日本大震災では、津波が40mになった湾もありました。", id: "Pada tsunami Tōhoku 2011, gelombang mencapai 40 meter di beberapa teluk." },
  { en: "SMS gets through when calls do not. Send your family a text to say you are OK.", ja: "電話がつながらなくても、SMSは届きます。家族にはSMSで無事を知らせてください。", id: "SMS bisa terkirim saat telepon gagal. Kabari keluarga lewat SMS bahwa Anda selamat." },
  { en: "Pack supplies for 72 hours. Rescue often arrives on day 3.", ja: "72時間（3日）分の物を準備してください。助けが来るのは、3日目になることが多いです。", id: "Siapkan persediaan untuk 72 jam. Tim penyelamat sering tiba di hari ketiga." },
  { en: "Most earthquake injuries happen to people who run outside. Stay where you are. Drop and cover.", ja: "地震のけがの多くは、外へ走り出た人に起きます。その場で身を低くして、頭を守ってください。", id: "Kebanyakan cedera gempa terjadi pada orang yang lari keluar. Tetap di tempat, merunduk, berlindung." },
  { en: "Mt. Rokko's hard granite makes Kobe earthquakes feel sharper than Tokyo earthquakes.", ja: "六甲山のかたい花こう岩のため、神戸の地震は東京より揺れが鋭く感じます。", id: "Granit keras Gunung Rokko membuat gempa di Kobe terasa lebih tajam daripada di Tokyo." },
  { en: "Tōhoku 2011: the first wave came 8 to 25 min after the tsunami warning. Move now.", ja: "2011年の東日本大震災では、津波警報から8〜25分で最初の波が来ました。すぐに逃げてください。", id: "Tōhoku 2011: gelombang pertama tiba 8 sampai 25 menit setelah peringatan tsunami. Segera pergi." },
  { en: "Three whistle blasts mean SOS. A whistle saves your voice if you are buried.", ja: "笛を3回吹くとSOSの合図です。がれきの下にいるとき、声を使わずにすみます。", id: "Tiga tiupan peluit berarti SOS. Peluit menghemat suara saat Anda tertimbun." },
  { en: "In Kobe in 1995, ATMs did not work for 5 days. Always keep some cash.", ja: "1995年の神戸では、ATMが5日間使えませんでした。いつも現金を少し持っていてください。", id: "Di Kobe tahun 1995, ATM mati selama 5 hari. Selalu simpan uang tunai." },
  { en: "Japanese schools have earthquake drills every month. That is why children react fast.", ja: "日本の学校では、毎月、地震の避難訓練をします。だから子どもはすぐに動けます。", id: "Sekolah di Jepang latihan gempa setiap bulan. Karena itu anak-anak cepat bereaksi." },
  { en: "In a typhoon, tape an X on your windows. This stops glass from flying into the room.", ja: "台風のときは、窓にテープをXの形にはってください。ガラスが部屋の中に飛び散るのを防ぎます。", id: "Saat topan, lakban jendela bentuk X. Ini mencegah kaca terlempar ke dalam ruangan." },
];
