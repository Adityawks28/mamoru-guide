# Needs card verification

- Date: 2026-11-22
- Scope: the fixed lists of the "My needs card" (`src/data/needs.ts`, plan `docs/superpowers/plans/2026-11-21-my-needs-card.md`): the food allergens (N1) and the languages (N2). The diet needs, the contact relations and the labels of the card are the user's own words, not facts about the world, so they have no source row.
- Evidence: fresh downloads on 2026-11-22 with `curl` (a browser User-Agent and `Accept-Language: ja`): the raw 消費者庁 page, its linked PDFs, and `jma_multilingual.xlsx`. The quotes below were read from the downloaded files with `pdftotext` and with a Python XML read of the xlsx. Nothing was filled from memory.
- Source rule: Only information that an official source states may enter the app. 特定原材料に準ずるもの (20 items, labeling only recommended) are not used.

## Key

- Verdict: `match` = the source says the same thing.
- Source IDs are the keys in `SOURCES` (`src/data/sources.ts`). The Sources section at the end gives the publisher, title and URL of each.
- Claim: the `CLAIMS` ID that the row has, status `verified`.

## Results

| Row | Verdict |
|---|---|
| N1 | match, with one change from the plan: the official list has 9 items, not 8 (カシューナッツ added on 2026-04-01) |
| N2 | match |

## Rows

| ID | Claim | Source | Source says (JA quote / EN gist) | Verdict | Claim ID |
|---|---|---|---|---|---|
| N1 | The mandatory allergen list (特定原材料) is: shrimp, cashew nut, crab, walnut, wheat, buckwheat, egg, milk, peanut. | caa-allergen-labeling | The page 「食物アレルギー表示に関する情報」 says 「特定原材料を定めています。容器包装された加工食品について、当該特定原材料を含む旨の表示を義務付けています。」 and its notice of 2026年4月1日 says 「特定原材料として、カシューナッツを追加しました。」 The list itself is in the linked handbook (令和8年4月版, p.4): 「重篤度・症例数の多い９品目（特定原材料：えび、カシューナッツ、かに、くるみ、小麦、そば、卵、乳、落花生（ピーナッツ））については、食品表示基準で表示を義務付けし」 and p.9 (table 食物アレルギー表示対象品目): 「義務 特定原材料（９品目） えび・カシューナッツ・かに・くるみ・小麦・そば・卵・乳・落花生（ピーナッツ）」. The linked leaflet 「アレルギー表示について」 (令和８年４月時点) has the same 9 names, with 「落花生」 in the table cell. / Labeling of these 9 items is mandatory on packaged processed food. The app uses the handbook wording 落花生（ピーナッツ） and the official order. | match | needs-food-allergens |
| N2 | The language presets are the languages of the JMA multilingual dictionary. | jma-multilingual | Sheet 「多言語辞書（本体）」, row 1 (header), columns D to R: 日本語, 英語, 中国語(簡体字), 中国語(繁体字), 韓国語, ポルトガル語, スペイン語, インドネシア語, ベトナム語, タガログ語, タイ語, ネパール語, クメール語, ビルマ語, モンゴル語. Row 2 (No. 1) 気象庁 gives each language its own text (for example E2 "Japan Meteorological Agency (JMA)", K2 "Badan Meteorologi Jepang"). Sheet 「更新履歴」 lists the language set per release. / The dictionary has 15 language columns. | match | none (list of names, no claim ID) |

### N1 notes

- The plan expected 8 items. The official page now lists 9: カシューナッツ became a 特定原材料 on 2026-04-01 (事務連絡 令和8年4月1日, 「今般、カシューナッツについて…特定原材料として新たにカシューナッツを追加しました。」). The type `FoodAllergen`, the data and the test have the 9th item.
- The page text itself (HTML) does not spell out the list. The list is in the PDFs it links. The `SOURCES` entry points to the page, and the title names the handbook pages.

### N2 notes

- The two Chinese columns (簡体字, 繁体字) are one preset: 中国語. The 日本語 column is the source language of the dictionary. It has no preset, because the card is read in Japanese; やさしい日本語 is the last preset (`ja-easy`, the app's own item, not a dictionary language).
- 13 presets come from the dictionary: en, zh, ko, pt, es, id, vi, tl (タガログ語), th, ne, km, my (ビルマ語), mn. The key for タガログ語 is `tl`.
- The Japanese language names are the column names as the dictionary writes them. Readings are added only for 英語, 中国語, 韓国語. Indonesian and English names are the app's own labels (Aditya reviews the Indonesian).

## Sources

| ID | Publisher | Title (section) | URL | Checked |
|---|---|---|---|---|
| caa-allergen-labeling | 消費者庁 (Consumer Affairs Agency) | 食物アレルギー表示に関する情報; 加工食品の食物アレルギー表示ハンドブック(令和8年4月版) p.4, p.9 | https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/ | 2026-11-22 |
| jma-multilingual | 気象庁 (JMA) | 多言語辞書データ (xlsx updated 2026-11-12), row 1 header | https://www.data.jma.go.jp/developer/multilingual.html | 2026-11-22 |

### Other documents checked

- https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/assets/food_labeling_cms204_260401_02.pdf (ハンドブック, p.4 and p.9)
- https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/assets/food_labeling_cms204_260401_01.pdf (アレルギー表示について)
- https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/assets/food_labeling_cms204_260401_03.pdf (事務連絡 令和8年4月1日)
