export interface Shelter {
  name: string;
  name_en?: string;
  lat: number;
  lng: number;
  address: string;
  types: ('earthquake' | 'flood' | 'tsunami' | 'fire' | 'landslide')[];
}

// Pre-processed shelter data for Hyogo/Kansai region
// Source: GSI (国土地理院) and local government open data
export const shelters: Shelter[] = [
  // === KOBE — Chuo Ward (中央区) ===
  { name: '神戸市立中央区役所', name_en: 'Chuo Ward Office', lat: 34.6901, lng: 135.1956, address: '神戸市中央区東町115', types: ['earthquake', 'flood'] },
  { name: '東遊園地', name_en: 'Higashi Yuenchi Park', lat: 34.6910, lng: 135.1935, address: '神戸市中央区加納町6', types: ['earthquake', 'fire'] },
  { name: '生田中学校', name_en: 'Ikuta Junior High School', lat: 34.6960, lng: 135.1880, address: '神戸市中央区中山手通4-23-2', types: ['earthquake', 'flood', 'fire'] },
  { name: 'こうべ花時計前広場', name_en: 'Kobe Flower Clock Plaza', lat: 34.6895, lng: 135.1962, address: '神戸市中央区加納町6', types: ['earthquake'] },
  { name: '磯上公園', name_en: 'Isokami Park', lat: 34.6875, lng: 135.2000, address: '神戸市中央区磯上通3', types: ['earthquake', 'fire'] },

  // === KOBE — Nada Ward (灘区) ===
  { name: '灘区役所', name_en: 'Nada Ward Office', lat: 34.7140, lng: 135.2350, address: '神戸市灘区桜口町4-2-1', types: ['earthquake', 'flood'] },
  { name: '神戸大学', name_en: 'Kobe University', lat: 34.7250, lng: 135.2350, address: '神戸市灘区六甲台町1-1', types: ['earthquake', 'fire'] },
  { name: '稗田小学校', name_en: 'Hieda Elementary School', lat: 34.7120, lng: 135.2380, address: '神戸市灘区大内通3-4-1', types: ['earthquake', 'flood', 'fire'] },
  { name: '王子公園', name_en: 'Oji Park', lat: 34.7130, lng: 135.2180, address: '神戸市灘区王子町3', types: ['earthquake', 'fire'] },
  { name: '六甲小学校', name_en: 'Rokko Elementary School', lat: 34.7215, lng: 135.2345, address: '神戸市灘区八幡町3-1-13', types: ['earthquake', 'flood', 'fire'] },

  // === KOBE — Higashinada Ward (東灘区) ===
  { name: '東灘区役所', name_en: 'Higashinada Ward Office', lat: 34.7184, lng: 135.2620, address: '神戸市東灘区住吉東町5-2-1', types: ['earthquake', 'flood'] },
  { name: '住吉小学校', name_en: 'Sumiyoshi Elementary School', lat: 34.7200, lng: 135.2630, address: '神戸市東灘区住吉宮町3-5-7', types: ['earthquake', 'flood', 'fire'] },
  { name: '甲南大学', name_en: 'Konan University', lat: 34.7270, lng: 135.2720, address: '神戸市東灘区岡本8-9-1', types: ['earthquake', 'fire'] },
  { name: '御影公会堂', name_en: 'Mikage Public Hall', lat: 34.7175, lng: 135.2535, address: '神戸市東灘区御影石町4-4-1', types: ['earthquake', 'flood'] },
  { name: '魚崎小学校', name_en: 'Uozaki Elementary School', lat: 34.7105, lng: 135.2715, address: '神戸市東灘区魚崎南町4-1-20', types: ['earthquake', 'flood', 'tsunami', 'fire'] },

  // === KOBE — Hyogo Ward (兵庫区) ===
  { name: '兵庫区役所', name_en: 'Hyogo Ward Office', lat: 34.6780, lng: 135.1640, address: '神戸市兵庫区荒田町1-21-1', types: ['earthquake', 'flood'] },
  { name: '会下山公園', name_en: 'Egesanzan Park', lat: 34.6720, lng: 135.1600, address: '神戸市兵庫区会下山町', types: ['earthquake', 'fire'] },
  { name: '湊川公園', name_en: 'Minatogawa Park', lat: 34.6760, lng: 135.1680, address: '神戸市兵庫区荒田町', types: ['earthquake', 'fire'] },
  { name: '夢野中学校', name_en: 'Yumeno Junior High School', lat: 34.6810, lng: 135.1550, address: '神戸市兵庫区鵯越町10-1', types: ['earthquake', 'flood', 'fire'] },

  // === KOBE — Nagata Ward (長田区) ===
  { name: '長田区役所', name_en: 'Nagata Ward Office', lat: 34.6620, lng: 135.1480, address: '神戸市長田区北町3-4-3', types: ['earthquake', 'flood'] },
  { name: '若松公園（鉄人28号前）', name_en: 'Wakamatsu Park (Tetsujin 28)', lat: 34.6550, lng: 135.1480, address: '神戸市長田区若松町6', types: ['earthquake', 'fire'] },
  { name: '駒ヶ林小学校', name_en: 'Komagabayashi Elementary', lat: 34.6510, lng: 135.1460, address: '神戸市長田区駒ヶ林町2-1-1', types: ['earthquake', 'flood', 'tsunami', 'fire'] },

  // === KOBE — Suma Ward (須磨区) ===
  { name: '須磨区役所', name_en: 'Suma Ward Office', lat: 34.6500, lng: 135.1290, address: '神戸市須磨区大黒町4-6-1', types: ['earthquake', 'flood'] },
  { name: '須磨海浜公園', name_en: 'Suma Beach Park', lat: 34.6380, lng: 135.1290, address: '神戸市須磨区若宮町1', types: ['earthquake', 'tsunami'] },
  { name: '北須磨小学校', name_en: 'Kita-Suma Elementary', lat: 34.6600, lng: 135.1200, address: '神戸市須磨区友が丘1-1', types: ['earthquake', 'flood', 'fire', 'landslide'] },

  // === KOBE — Tarumi Ward (垂水区) ===
  { name: '垂水区役所', name_en: 'Tarumi Ward Office', lat: 34.6310, lng: 135.0540, address: '神戸市垂水区日向1-5-1', types: ['earthquake', 'flood'] },
  { name: '舞子公園', name_en: 'Maiko Park', lat: 34.6300, lng: 135.0290, address: '神戸市垂水区東舞子町', types: ['earthquake', 'tsunami'] },
  { name: '垂水小学校', name_en: 'Tarumi Elementary', lat: 34.6330, lng: 135.0580, address: '神戸市垂水区神田町4-1', types: ['earthquake', 'flood', 'fire'] },

  // === KOBE — Kita Ward (北区) ===
  { name: '北区役所', name_en: 'Kita Ward Office', lat: 34.7430, lng: 135.1570, address: '神戸市北区鈴蘭台北町1-9-1', types: ['earthquake', 'flood', 'landslide'] },
  { name: '鈴蘭台小学校', name_en: 'Suzurandai Elementary', lat: 34.7440, lng: 135.1560, address: '神戸市北区鈴蘭台北町3-9-29', types: ['earthquake', 'flood', 'landslide', 'fire'] },

  // === KOBE — Nishi Ward (西区) ===
  { name: '西区役所', name_en: 'Nishi Ward Office', lat: 34.6870, lng: 135.0200, address: '神戸市西区糀台5-4-1', types: ['earthquake', 'flood'] },
  { name: '西神中央公園', name_en: 'Seishin Chuo Park', lat: 34.6880, lng: 135.0180, address: '神戸市西区糀台5', types: ['earthquake', 'fire'] },

  // === NISHINOMIYA (西宮市) ===
  { name: '西宮市役所', name_en: 'Nishinomiya City Hall', lat: 34.7367, lng: 135.3410, address: '西宮市六湛寺町10-3', types: ['earthquake', 'flood'] },
  { name: '甲子園球場周辺広場', name_en: 'Koshien Stadium Area', lat: 34.7216, lng: 135.3618, address: '西宮市甲子園町', types: ['earthquake', 'fire'] },
  { name: '大社小学校', name_en: 'Taisha Elementary', lat: 34.7420, lng: 135.3200, address: '西宮市大社町10-15', types: ['earthquake', 'flood', 'fire'] },
  { name: '鳴尾小学校', name_en: 'Naruo Elementary', lat: 34.7180, lng: 135.3730, address: '西宮市鳴尾町3-6-20', types: ['earthquake', 'flood', 'tsunami', 'fire'] },
  { name: '関西学院大学', name_en: 'Kwansei Gakuin University', lat: 34.7700, lng: 135.3510, address: '西宮市上ヶ原一番町1-155', types: ['earthquake', 'fire'] },

  // === ASHIYA (芦屋市) ===
  { name: '芦屋市役所', name_en: 'Ashiya City Hall', lat: 34.7267, lng: 135.3050, address: '芦屋市精道町7-6', types: ['earthquake', 'flood'] },
  { name: '芦屋公園', name_en: 'Ashiya Park', lat: 34.7230, lng: 135.3070, address: '芦屋市浜町', types: ['earthquake', 'tsunami'] },
  { name: '精道中学校', name_en: 'Seido Junior High', lat: 34.7250, lng: 135.3040, address: '芦屋市精道町6-1', types: ['earthquake', 'flood', 'fire'] },

  // === AKASHI (明石市) ===
  { name: '明石市役所', name_en: 'Akashi City Hall', lat: 34.6430, lng: 134.9970, address: '明石市中崎1-5-1', types: ['earthquake', 'flood'] },
  { name: '明石公園', name_en: 'Akashi Park', lat: 34.6510, lng: 134.9970, address: '明石市明石公園1-27', types: ['earthquake', 'fire'] },
  { name: '大蔵中学校', name_en: 'Okura Junior High', lat: 34.6400, lng: 134.9910, address: '明石市大蔵八幡町1-25', types: ['earthquake', 'flood', 'tsunami', 'fire'] },

  // === OSAKA — Central (中央区) ===
  { name: '大阪城公園', name_en: 'Osaka Castle Park', lat: 34.6873, lng: 135.5262, address: '大阪市中央区大阪城', types: ['earthquake', 'fire'] },
  { name: '中央区役所', name_en: 'Chuo Ward Office (Osaka)', lat: 34.6808, lng: 135.5066, address: '大阪市中央区久太郎町1-2-27', types: ['earthquake', 'flood'] },
  { name: '南大江小学校', name_en: 'Minami-Ooe Elementary', lat: 34.6780, lng: 135.5100, address: '大阪市中央区南船場3-2-19', types: ['earthquake', 'flood', 'fire'] },

  // === OSAKA — Kita Ward (北区) ===
  { name: '扇町公園', name_en: 'Ogimachi Park', lat: 34.7030, lng: 135.5100, address: '大阪市北区扇町1', types: ['earthquake', 'fire'] },
  { name: '大阪市北区役所', name_en: 'Kita Ward Office (Osaka)', lat: 34.7070, lng: 135.5110, address: '大阪市北区扇町2-1-27', types: ['earthquake', 'flood'] },

  // === OSAKA — Tennoji/Abeno ===
  { name: '天王寺公園', name_en: 'Tennoji Park', lat: 34.6506, lng: 135.5089, address: '大阪市天王寺区茶臼山町', types: ['earthquake', 'fire'] },

  // === OSAKA — Naniwa Ward ===
  { name: '難波宮跡公園', name_en: 'Naniwa Palace Ruins Park', lat: 34.6798, lng: 135.5225, address: '大阪市中央区法円坂1', types: ['earthquake', 'fire'] },

  // === OSAKA — Nishi/Minato ===
  { name: '靭公園', name_en: 'Utsubo Park', lat: 34.6850, lng: 135.4900, address: '大阪市西区靱本町', types: ['earthquake', 'fire'] },

  // === AMAGASAKI (尼崎市) ===
  { name: '尼崎市役所', name_en: 'Amagasaki City Hall', lat: 34.7332, lng: 135.4080, address: '尼崎市東七松町1-23-1', types: ['earthquake', 'flood'] },
  { name: '記念公園', name_en: 'Kinen Park', lat: 34.7340, lng: 135.4100, address: '尼崎市東七松町', types: ['earthquake', 'fire'] },

  // === TAKARAZUKA (宝塚市) ===
  { name: '宝塚市役所', name_en: 'Takarazuka City Hall', lat: 34.7994, lng: 135.3570, address: '宝塚市東洋町1-1', types: ['earthquake', 'flood', 'landslide'] },

  // === ITAMI (伊丹市) ===
  { name: '伊丹市役所', name_en: 'Itami City Hall', lat: 34.7847, lng: 135.4000, address: '伊丹市千僧1-1-1', types: ['earthquake', 'flood'] },
];
