import type { DietNeed, FoodAllergen } from '../plan-model';

export interface NeedOption {
  key: string;
  label_en: string;
  label_ja: string;
  label_id: string;
}

// The 特定原材料 of 消費者庁, in its official order (April 2026). officialName is the
// official wording; label_ja adds only hiragana readings. The 特定原材料に準ずるもの are not used.
export const FOOD_ALLERGENS_CLAIM = 'needs-food-allergens';
export const FOOD_ALLERGENS: readonly (NeedOption & { key: FoodAllergen; officialName: string })[] = [
  { key: 'ebi', officialName: 'えび', label_en: 'Shrimp', label_ja: 'えび', label_id: 'Udang' },
  { key: 'kashu', officialName: 'カシューナッツ', label_en: 'Cashew nut', label_ja: 'カシューナッツ', label_id: 'Kacang mete' },
  { key: 'kani', officialName: 'かに', label_en: 'Crab', label_ja: 'かに', label_id: 'Kepiting' },
  { key: 'kurumi', officialName: 'くるみ', label_en: 'Walnut', label_ja: 'くるみ', label_id: 'Kenari (walnut)' },
  { key: 'komugi', officialName: '小麦', label_en: 'Wheat', label_ja: '小麦（こむぎ）', label_id: 'Gandum' },
  { key: 'soba', officialName: 'そば', label_en: 'Buckwheat (soba)', label_ja: 'そば', label_id: 'Soba (buckwheat)' },
  { key: 'tamago', officialName: '卵', label_en: 'Egg', label_ja: '卵（たまご）', label_id: 'Telur' },
  { key: 'nyu', officialName: '乳', label_en: 'Milk', label_ja: '乳（にゅう）', label_id: 'Susu' },
  {
    key: 'rakkasei', officialName: '落花生（ピーナッツ）', label_en: 'Peanut',
    label_ja: '落花生（らっかせい）（ピーナッツ）', label_id: 'Kacang tanah',
  },
];

export const DIET_NEEDS: readonly (NeedOption & { key: DietNeed })[] = [
  { key: 'halal', label_en: 'Halal food only', label_ja: 'ハラールの食べ物だけ食べます', label_id: 'Hanya makanan halal' },
  { key: 'vegetarian', label_en: 'Vegetarian', label_ja: 'ベジタリアンです', label_id: 'Vegetarian' },
  { key: 'vegan', label_en: 'Vegan', label_ja: 'ビーガンです', label_id: 'Vegan' },
  { key: 'no-pork', label_en: 'No pork', label_ja: '豚肉（ぶたにく）を食べません', label_id: 'Tidak makan daging babi' },
  { key: 'no-beef', label_en: 'No beef', label_ja: '牛肉（ぎゅうにく）を食べません', label_id: 'Tidak makan daging sapi' },
  { key: 'no-alcohol', label_en: 'No alcohol', label_ja: 'アルコールをとりません', label_id: 'Tanpa alkohol' },
];

// One entry per language column of the JMA multilingual dictionary (jma-multilingual,
// header row, columns E to R; Chinese once; Japanese is the source column), then easy Japanese.
export const NEED_LANGUAGES: readonly NeedOption[] = [
  { key: 'en', label_en: 'English', label_ja: '英語（えいご）', label_id: 'Bahasa Inggris' },
  { key: 'zh', label_en: 'Chinese', label_ja: '中国語（ちゅうごくご）', label_id: 'Bahasa Tionghoa' },
  { key: 'ko', label_en: 'Korean', label_ja: '韓国語（かんこくご）', label_id: 'Bahasa Korea' },
  { key: 'pt', label_en: 'Portuguese', label_ja: 'ポルトガル語', label_id: 'Bahasa Portugis' },
  { key: 'es', label_en: 'Spanish', label_ja: 'スペイン語', label_id: 'Bahasa Spanyol' },
  { key: 'id', label_en: 'Indonesian', label_ja: 'インドネシア語', label_id: 'Bahasa Indonesia' },
  { key: 'vi', label_en: 'Vietnamese', label_ja: 'ベトナム語', label_id: 'Bahasa Vietnam' },
  { key: 'tl', label_en: 'Tagalog', label_ja: 'タガログ語', label_id: 'Bahasa Tagalog' },
  { key: 'th', label_en: 'Thai', label_ja: 'タイ語', label_id: 'Bahasa Thai' },
  { key: 'ne', label_en: 'Nepali', label_ja: 'ネパール語', label_id: 'Bahasa Nepal' },
  { key: 'km', label_en: 'Khmer', label_ja: 'クメール語', label_id: 'Bahasa Khmer' },
  { key: 'my', label_en: 'Burmese', label_ja: 'ビルマ語', label_id: 'Bahasa Myanmar' },
  { key: 'mn', label_en: 'Mongolian', label_ja: 'モンゴル語', label_id: 'Bahasa Mongolia' },
  { key: 'ja-easy', label_en: 'Easy Japanese', label_ja: 'やさしい日本語ならわかります', label_id: 'Bahasa Jepang sederhana' },
];

export const CONTACT_RELATIONS: readonly NeedOption[] = [
  { key: 'family', label_en: 'Family', label_ja: '家族（かぞく）', label_id: 'Keluarga' },
  { key: 'friend', label_en: 'Friend', label_ja: '友（とも）だち', label_id: 'Teman' },
  { key: 'school', label_en: 'School', label_ja: '学校（がっこう）', label_id: 'Sekolah' },
  { key: 'work', label_en: 'Work', label_ja: '会社（かいしゃ）', label_id: 'Kantor' },
  { key: 'other', label_en: 'Other', label_ja: 'その他（ほか）', label_id: 'Lainnya' },
];
