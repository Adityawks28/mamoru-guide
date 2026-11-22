# Warning words verification

- Date: 2026-11-22
- Scope: the candidate words for the "Warnings" flashcard tab (W1 to W16) and the "避難場所 vs 避難所" shelter card (S1) of the warning words plan (`docs/superpowers/plans/2026-11-21-warning-words.md`). For each word: the official English name, the official Indonesian name, and one "what to do" line with an official quote.
- Why it matters: people see these words on TV, phone alerts and signs during a real disaster. A word stays only when an official source gives its English name, its Indonesian name and the action.
- Evidence: fresh downloads on 2026-11-22 with `curl` (raw HTML and PDF files, not summaries). Every Japanese quote below was confirmed on the raw downloaded page or file; on the Kantei and JMA pages some quotes contain `<strong>` tags in the HTML, which the quotes leave out. The JMA multilingual dictionary (`jma_multilingual.xlsx`, updated 2026-11-12, SHA-256 `3406514e…8c75`) was read with a script (openpyxl, `python3 -I`); "row" is the Excel row in sheet 多言語辞書（本体）, and "No." is the dictionary number (`=ROW()-1`).
- Source rule: Japanese official sources come first (Ruling R15). A row is `drop` when the English name, the Indonesian name or the action has no official quote, or when official sources use the same word for both 避難場所 and 避難所 and no source separates them (owner rule: "it is better to erase uncertified information rather than false, ambiguous, untrustable one"). A line that a source supports only in part is cut to the source.
- Reuse: where the alert card already has a verified line (safety record rows B47, B49, B50, C5, C7), the final line reuses its en, ja and id text word for word or as a shorter cut. Exceptions, cut to the source instead: W13 (not B48) and W6, W7 (B50 without "now", Ruling R8). Added kana readings (for example 避難（ひなん）) are the only additions to reused Japanese text.

## Key

- Verdict: `keep` = all three (English name, Indonesian name, action) have an official quote. `drop` = at least one has none.
- Claim: the `CLAIMS` ID (`src/data/sources.ts`) that Task 2 adds for the row, status `verified`.
- Source IDs are the keys in `SOURCES` (`src/data/sources.ts`). The Sources section at the end gives the publisher, title and URL of each. Documents that are not in `SOURCES` are listed by URL in "Other documents checked"; no kept line depends on them.
- Final term: the glossary entry (ja, kana reading, en, id) that the flashcard shows. Final line: the "what to do" line in en / ja / id.

## Results

| Outcome | Rows |
|---|---|
| Kept | 14 (W1, W3, W4, W5, W6, W7, W8, W9, W10, W11, W12, W13, W14, W15) |
| Dropped | 3 (W2, W16, S1) |
| Total | 17 |

- W2 早期注意情報: no official Indonesian name, and the only English name ("Early Advisory") is on a leaflet with no Japanese text that names 早期注意情報.
- W16 避難所 and S1 (shelter card): no official source gives an Indonesian word for 避難所 that differs from the word for 避難場所. The official English is also mixed. Details in "Dropped rows".

## Table: warning words

| Row | Term (JA) | Reading | Official EN (source ID + quote) | Official ID (source ID + quote) | What to do (source ID, JA quote / EN gist) | Verdict | Claim | Final line (en / ja / id) |
|---|---|---|---|---|---|---|---|---|
| W1 | 警戒レベル | けいかいレベル | jma-multilingual row 7 (No. 6), term 警戒レベル: "Alert level". jma-nagasaki-levels-en column head: "Alert level". cao-countermeasures: 「5段階の警戒レベル」 / "The Five Alert Levels". | jma-multilingual row 7: "tingkat peringatan". jma-nagasaki-levels-id column head: "tingkat peringatan". | kantei-keihou: 「※警戒レベル１・２の情報は気象庁などから、警戒レベル３～５の情報は市町村から発表されます。」; 「「警戒レベル４避難指示」までに必ず避難！」 / Levels 1 and 2 come from JMA and others; Levels 3 to 5 come from the municipality. Always evacuate by Level 4. | keep | warn-alert-level | en: Levels 1 and 2 come from JMA and others, and Levels 3 to 5 come from your city. Leave by Level 4. / ja: レベル1と2は、気象庁（きしょうちょう）などが出します。レベル3から5は、市町村（しちょうそん）が出します。レベル4までに避難（ひなん）してください。 / id: Tingkat 1 dan 2 berasal dari JMA dan lainnya, dan Tingkat 3 sampai 5 berasal dari kota tempat tinggalmu. Mengungsilah paling lambat di Tingkat 4. |
| W2 | 早期注意情報 | そうきちゅういじょうほう | None in jma-multilingual (0 rows contain 早期注意). JMA writes 「早期注意情報（警報級の可能性）」 (JMA 早期注意情報の変更について, see Other documents); the dictionary has only 警報級の可能性, row 178 (No. 177): "Probability of warnings", a different name. The JMA English leaflet (Other documents) says "Level 1: Early Advisory", with no Japanese text. | None. jma-multilingual row 178: "kemungkinan peringatan yang diumunkan" is for 警報級の可能性. jma-nagasaki-levels-id gives no Level 1 name. | kantei-keihou: 「警戒レベル１は、災害への心構えを高める」 (action exists) | drop | (none) | (none) |
| W3 | レベル２大雨注意報 | レベルにおおあめちゅういほう | jma-warning-2026-english: "Level 2 Advisory (Heavy rain)". jma-multilingual row 7284 (No. 7283): "Level 2 Advisory (Heavy Rain)". | jma-multilingual row 7284: "Pemberitahuan Hujan Lebat Tingkat 2". | kantei-keihou, heading 「警戒レベル２は、ハザードマップなどで避難行動を確認」, text 「レベル２大雨注意報やレベル２氾濫注意報などの「注意報」が出ており気象状況が悪化した段階です。ハザードマップで災害の危険性のある区域や避難場所、避難経路、避難のタイミングの再確認など、避難に備え、自らの避難行動を確認しておきましょう。」 / At Level 2 (for example レベル２大雨注意報), check on the hazard map the danger areas, the evacuation sites, the routes and the timing. Check your own evacuation actions. | keep | warn-level-2-advisory | en: Check your hazard map and how you will evacuate. / ja: ハザードマップで、避難（ひなん）のしかたを確認（かくにん）してください。 / id: Cek peta bahaya dan cara kamu akan mengungsi. |
| W4 | 高齢者等避難 | こうれいしゃとうひなん | jma-nagasaki-levels-en: "Evacuation of the Elderly, Etc.". cao-countermeasures (Japanese and English side by side): 高齢者等避難 / "Evacuation of the Elderly, etc.". | jma-nagasaki-levels-id: "Proses Evakuasi Lansia, dll.". jma-multilingual row 686 (No. 685, volcanic warning section): 高齢者等避難 / "Proses Evakuasi Lansia, dll.". | kantei-keihou: 「「警戒レベル３高齢者等避難」が出されたら、高齢の方や障がいのある方、妊産婦、乳幼児連れの方など避難に時間のかかる方やその支援者の方は危険な場所から避難し、それ以外の人は避難の準備をすること。」 / Older people and others who need time to evacuate leave the danger area; other people get ready. (Safety row C5.) | keep | warn-level-3-elderly | en: Older people and people who need more time leave a danger area. Other people get ready to leave. / ja: お年寄りや、避難（ひなん）に時間がかかる人は、危ない場所から避難します。ほかの人は、避難の準備をします。 / id: Lansia dan orang yang butuh waktu lebih lama mengungsi dari daerah berbahaya. Orang lain bersiap mengungsi. |
| W5 | レベル３大雨警報 | レベルさんおおあめけいほう | jma-warning-2026-english: "Level 3 Warning (Heavy rain)", in the line "Equivalent to Alert Level３". jma-multilingual row 7280 (No. 7279): "Level 3 Warning (Heavy Rain)". | jma-multilingual row 7280: "Peringatan Hujan Lebat Tingkat 3". | jma-warning-2026: 「例えば、これまでの大雨警報は、「レベル３大雨警報」という名称に変更になり、レベルの数字と一緒に情報が伝えられます。」; 「住民がとるべき行動を直感的に理解しやすくなるよう、５段階の警戒レベルにあわせた数字を付して防災情報が提供されることとなっています。」 / The level number matches the 5 alert levels, so that people know the action. Action for Level 3: kantei-keihou, as W4. | keep | warn-level-3-warning | en: Do the same as for alert level 3. Older people and people who need more time leave a danger area. / ja: 警戒レベル（けいかいレベル）3と同じことをしてください。お年寄りや、避難（ひなん）に時間がかかる人は、危ない場所から避難します。 / id: Lakukan hal yang sama seperti tingkat peringatan 3. Lansia dan orang yang butuh waktu lebih lama mengungsi dari daerah berbahaya. |
| W6 | 避難指示 | ひなんしじ | jma-nagasaki-levels-en: "Evacuation Instruction". cao-countermeasures (side by side): 避難指示（注） / "Evacuation Instruction（note）". cao-evac-leaflet-en: "Instead, Evacuation Instructions will be issued." | jma-multilingual row 389 (No. 388): 「※ 危険度分布に関わらず、「避難指示」が発令された場合は、速やかに避難を開始」 / "jika perintah evakuasi telah dikeluarkan, mulailah untuk mengungsi dengan segera". isa-guidebook-id: "Perintah Evakuasi". (jma-nagasaki-levels-id says "Instruksi Evakuasi"; the glossary keeps the national form, see `src/data/glossary.ts`.) | kantei-keihou: 「「警戒レベル４避難指示」が出されたら、危険な場所から全員避難することです。」 / At Level 4, everyone leaves the danger area. The quote gives no time word, so the line has no "now" (Ruling R8: cut to the source, not B50's "must leave now"). | keep | warn-level-4-instruction | en: Everyone in a danger area must leave. / ja: 危ない場所にいる人は、全員（ぜんいん）避難（ひなん）してください。 / id: Semua orang di daerah berbahaya harus mengungsi. |
| W7 | レベル４大雨危険警報 | レベルよんおおあめきけんけいほう | jma-warning-2026-english: 「気象庁においては、危険警報の英語表記は ”Urgent Warning” とします。」 and "Level 4 Urgent Warning (Heavy rain)" for "Equivalent to Alert Level ４". jma-multilingual row 7276 (No. 7275): "Level 4 Urgent Warning (Heavy Rain)". | jma-multilingual row 7276: "Peringatan Darurat Hujan Lebat Tingkat 4". | jma-warning-2026, as W5 (level number = alert level). kantei-keihou, as W6 (no time word, Ruling R8). | keep | warn-level-4-urgent | en: Do the same as for alert level 4. Everyone in a danger area must leave. / ja: 警戒レベル（けいかいレベル）4と同じことをしてください。危ない場所にいる人は、全員（ぜんいん）避難（ひなん）してください。 / id: Lakukan hal yang sama seperti tingkat peringatan 4. Semua orang di daerah berbahaya harus mengungsi. |
| W8 | 緊急安全確保 | きんきゅうあんぜんかくほ | jma-nagasaki-levels-en: "Emergency Safety Measures". cao-countermeasures (side by side, level table): 緊急安全確保※１ / "Emergency Safety Measures*1". (The prose of the same pamphlet says "emergency safety securement"; the level table and JMA Nagasaki agree.) | jma-nagasaki-levels-id: "Tindakan keselamatan darurat". | kantei-keihou: 「すでに災害が発生又は差し迫った状況ですので、直ちに命を守る行動をとってください。」 / A disaster is happening or is about to happen. Act now to protect your life. (Safety row C7.) | keep | warn-level-5-safety | en: A disaster is already here or will come very soon. Act now to save your life. / ja: 災害（さいがい）が起きているか、すぐに起きそうです。すぐに命を守る行動をしてください。 / id: Bencana sedang atau akan segera terjadi. Segera lindungi nyawamu. |
| W9 | レベル５大雨特別警報 | レベルごおおあめとくべつけいほう | jma-warning-2026-english: "Level 5 Emergency Warning (Heavy rain)" for "Equivalent to Alert Level ５". jma-multilingual row 7272 (No. 7271): "Level 5 Emergency Warning (Heavy Rain)". | jma-multilingual row 7272: "Peringatan Khusus Hujan Lebat Tingkat 5". | jma-warning-2026, as W5. kantei-keihou, as W8. | keep | warn-level-5-emergency | en: Do the same as for alert level 5. Act now to save your life. / ja: 警戒レベル（けいかいレベル）5と同じことをしてください。すぐに命を守る行動をしてください。 / id: Lakukan hal yang sama seperti tingkat peringatan 5. Segera lindungi nyawamu. |
| W10 | 津波注意報 | つなみちゅういほう | jma-multilingual row 923 (No. 922): "Tsunami Advisory". | jma-multilingual row 923: "pemberitahuan tsunami". | jma-tsunami-info: 「海の中にいる人はただちに海から上がって、海岸から離れてください。」; kantei-tsunami: 「海水浴等により海岸付近にいる人は、「津波注意報」でも避難が必要です。」; jma-multilingual row 965 (No. 964) en: "Get out of the water and leave coastal regions immediately." / Get out of the water and leave the coast now. (Safety row B49.) | keep | warn-tsunami-advisory | en: If you are in the sea, get out of the water and leave the coast. / ja: 海の中にいる人は、海から上がってください。海岸（かいがん）から離れてください。 / id: Kalau kamu ada di laut, keluar dari air dan jauhi pantai. |
| W11 | 津波警報 | つなみけいほう | jma-multilingual row 922 (No. 921): "Tsunami Warning". | jma-multilingual row 922: "peringatan bahaya tsunami skala kecil"; row 964 (No. 963, the warning message): "Peringatan bahaya tsunami <nama area perkiraan 1, …>". The glossary uses the message form "peringatan bahaya tsunami", which keeps it inside 大津波警報. | jma-tsunami-info: 「沿岸部や川沿いにいる人は、ただちに高台や避難ビルなど安全な場所へ避難してください。」; jma-multilingual row 964 en: "Evacuate immediately to a safer place such as high ground or an evacuation building." (Safety row B49.) | keep | warn-tsunami-warning | en: Go to high ground or an evacuation building now. / ja: すぐに逃げてください。高台（たかだい）や避難（ひなん）ビルへ行ってください。 / id: Segera pergi ke tempat tinggi atau gedung evakuasi. |
| W12 | 大津波警報 | おおつなみけいほう | jma-multilingual row 921 (No. 920): "Major Tsunami Warning". | jma-multilingual row 921: "peringatan bahaya tsunami skala besar". | jma-tsunami-info: 「津波の高さを「巨大」と予想する大津波警報が発表された場合は、東日本大震災のような巨大な津波が襲うおそれがあります。ただちにできる限りの避難をしましょう。」 and, as W11, 「ただちに高台や避難ビルなど安全な場所へ避難してください。」; kantei-tsunami: the same 大津波警報 action. / A huge tsunami can strike; evacuate at once to high ground or an evacuation building. | keep | warn-tsunami-major | en: A huge tsunami can come. Go to high ground or an evacuation building now. / ja: 巨大（きょだい）な津波が来るおそれがあります。すぐに高台（たかだい）や避難（ひなん）ビルへ逃げてください。 / id: Tsunami yang sangat besar bisa datang. Segera pergi ke tempat tinggi atau gedung evakuasi. |
| W13 | 緊急地震速報 | きんきゅうじしんそくほう | jma-multilingual row 749 (No. 748): "Earthquake Early Warning (EEW)". | jma-multilingual row 749: "peringatan dini gempa bumi". | kantei-jishin: 「地震の揺れを感じた場合、あるいは緊急地震速報を見聞きした場合は、あわてずにまずは身の安全を確保してください。」; jma-multilingual row 773 (No. 772) en: "Stay calm and seek shelter nearby." / Stay calm and protect yourself first. The line is cut to this quote. It does not reuse B48's "Drop and cover IMMEDIATELY": "immediately" goes against あわてずに (do not rush), and the quote does not say "drop and cover". | keep | warn-eew | en: Stay calm and protect yourself first. / ja: あわてずに、まず身の安全（あんぜん）を確保（かくほ）してください。 / id: Tetap tenang dan lindungi dirimu dulu. |
| W14 | Jアラート | ジェイアラート | fdma-jalert: 「全国瞬時警報システム（Jアラート）」 and 「全国瞬時警報システム（J-ALERT）による放送内容（例）」 / The Latin-letter name is "J-ALERT". The app writes "J-Alert" (same name, only the letter case differs). | Decision W-6: the proper name "J-Alert". No Indonesian official source gives another form; isa-guidebook-id has no entry for it. The name rests on the FDMA Latin-letter form above. | fdma-jalert: 「全国瞬時警報システム（Jアラート）とは、弾道ミサイル情報、緊急地震速報、大津波警報など、対処に時間的余裕のない事態に関する情報を携帯電話等に配信される緊急速報メール、市町村防災行政無線等により、国から住民まで瞬時に伝達するシステムです。」 / A system that sends urgent national information (missiles, Earthquake Early Warnings, Major Tsunami Warnings) at once to phones and town loudspeakers. (Safety row B47; the line says what the alert carries.) | keep | warn-jalert | en: J-Alert sends urgent national alerts, such as missiles, Earthquake Early Warnings and Major Tsunami Warnings, to phones and town loudspeakers. / ja: Jアラートは、国からの急ぎの情報を、すぐに携帯電話や町のスピーカーに送ります。たとえば、ミサイルや緊急地震速報（きんきゅうじしんそくほう）の情報です。大津波警報（おおつなみけいほう）も送ります。 / id: J-Alert mengirim peringatan nasional yang mendesak, seperti rudal, peringatan dini gempa bumi, dan peringatan bahaya tsunami skala besar, ke ponsel dan pengeras suara kota. |
| W15 | 避難場所 | ひなんばしょ | jma-multilingual row 368 (No. 367): 「あらかじめ決めておいた避難場所まで移動することが…」 / "If moving to an evacuation site may be hazardous, …". cao-countermeasures (side by side): 「指定緊急避難場所等へ向かうなどの屋外移動は危険かもしれない」 / "going outside to designated emergency evacuation sites may be dangerous". | isa-guidebook-id, chapter heading "Tempat Evakuasi": "Tempat evakuasi adalah tempat atau fasilitas sementara untuk menyelamatkan diri dari bencana." The Japanese edition (Other documents) has the same heading 避難場所: 「避難場所は、災害から身を守るために一時的に避難する場所や施設のことです。」 jma-multilingual row 368 id: "lokasi evakuasi". | kantei-hinan: 「避難場所は災害の危険から緊急的に逃れるための場所で、災害の種類ごとに市町村が指定しています。」 / An evacuation site is a place to escape to from danger at once. The municipality designates sites for each type of disaster. | keep | warn-evac-site | en: This is a place to escape to from danger now. Your city chooses sites for each type of disaster. / ja: 災害（さいがい）の危険から、すぐに逃げるための場所です。市町村（しちょうそん）が、災害の種類ごとに決めています。 / id: Ini tempat untuk menyelamatkan diri dari bahaya sekarang. Kota tempat tinggalmu menentukan tempat ini untuk tiap jenis bencana. |
| W16 | 避難所 | ひなんじょ | Mixed. cao-countermeasures (side by side): 「可能な限り多くの避難所の開設」 / "Opening as many evacuation shelters as possible", but in the same pamphlet 「避難所における感染症対策を徹底する必要があります」 / "thorough infection control measures are taken at evacuation sites". cao-evacuation-points-en uses "evacuation shelter" for 避難場所, not 避難所 (see "Dropped rows"). | None that separates it from 避難場所. cao-evacuation-points-id: "tempat pengungsian" translates 避難場所. isa-guidebook-id: "Tempat Evakuasi" translates 避難場所. Ibaraki Prefecture (Other documents): 「避難所の感染症は予防が大切」 / "Penting Mencegah Infeksi di Tempat Evakuasi!", that is, the same word for 避難所. | kantei-hinan: 「避難所は自宅に戻れなくなった場合に一定期間滞在する施設です。」 (action exists) | drop | (none) | (none) |

## Table: shelter card

| Row | Card | Official EN | Official ID | What it says (source ID, JA quote / EN gist) | Verdict | Claim | Final lines |
|---|---|---|---|---|---|---|---|
| S1 | 避難場所 vs 避難所 | evacuation site (as W15); evacuation shelter (mixed, as W16) | No official Indonesian pair that separates the two words (as W16). | kantei-hinan: 「避難先には「避難場所」と「避難所」の2種類があります。避難場所は災害の危険から緊急的に逃れるための場所で、災害の種類ごとに市町村が指定しています。避難所は自宅に戻れなくなった場合に一定期間滞在する施設です。」 / There are two kinds: the evacuation site, to escape to from danger, chosen by the city for each type of disaster, and the evacuation shelter, to stay in for a time when you cannot go home. | drop | (none) | (none) |

## Dropped rows

### W2 早期注意情報

The Japanese term and the Level 1 action are official (kantei-keihou names 「レベル1早期注意情報」 in its level chart; the action is 「警戒レベル１は、災害への心構えを高める」). The names in other languages are not:

- The JMA multilingual dictionary has no row with 早期注意. JMA writes the full name as 「早期注意情報（警報級の可能性）」. The dictionary row 警報級の可能性 (row 178) gives "Probability of warnings" / "kemungkinan peringatan yang diumunkan", which is a different name and has a spelling error ("diumunkan").
- The JMA English leaflet calls Level 1 "Early Advisory". The leaflet has no Japanese text that ties this name to 早期注意情報, and no Indonesian edition.
- jma-nagasaki-levels-en and jma-nagasaki-levels-id give no name for Level 1 ("Check weather bulletin" / "Perhatikan informasi selanjutnya").

### W16 避難所 and S1 shelter card

Official sources use the same English and Indonesian words for both 避難場所 and 避難所:

| Source | Japanese | English | Indonesian |
|---|---|---|---|
| cao-evacuation-points-en / cao-evacuation-points-id, Japanese original 「知っておくべき5つのポイント」 (Other documents; cao-countermeasures calls it the 5-point flyer in 14 languages) | 「安全な場所にいる人まで避難場所に行く必要はありません。」 | "If you are in a safe place, you do not need to go to an evacuation shelter." | "Jika telah berada di tempat yang aman, Anda tidak perlu pindah ke tempat pengungsian." |
| same | 「警戒レベル３が出たら、市区町村が指定している指定緊急避難場所に避難しましょう」 | "When an alert level 3 is issued, evacuate to an evacuation shelter designated by your local government." | "Jika muncul peringatan level 3, mengungsilah ke pusat pengungsian yang telah ditentukan oleh pemerintah setempat." |
| isa-guidebook-en / isa-guidebook-id, Japanese edition (Other documents) | 避難場所 (chapter heading) | "Evacuation shelters" | "Tempat Evakuasi" |
| jma-multilingual row 368 | 避難場所 | "evacuation site" | "lokasi evakuasi" |
| cao-countermeasures | 避難所 / 避難所 | "evacuation shelters" / "evacuation sites" | (no Indonesian) |
| Ibaraki Prefecture (Other documents) | 避難所 | (no English) | "Tempat Evakuasi" |

So no official source maps 避難所 to "tempat pengungsian", and the only Indonesian source with 避難所 uses the word that the ISA guidebook uses for 避難場所. A card that teaches the difference in Indonesian would rest on our own choice of words. The Japanese definitions (kantei-hinan) are official and clear.

What would let Task 2 or Task 4 keep W16 and S1 (an owner decision, not made here):

1. An official Japanese source that pairs 避難所 with one Indonesian word and 避難場所 with another. The Council of Local Authorities for International Relations (CLAIR) uses "tempat pengungsian" for 避難所, but CLAIR is a foundation of local governments, not a government body.
2. A native-speaker decision by Aditya, as the glossary already does for 通電火災.

Note for the controller: the current glossary entry 避難所 (`src/data/glossary.ts`) cites cao-evacuation-points-en for "evacuation shelter" and cao-evacuation-points-id for "tempat pengungsian". In those leaflets both words translate 避難場所 (table above). This task records the finding and does not change the glossary.

## Notes for Task 2

- New glossary term 警戒レベル (en "Alert level", id "tingkat peringatan"): `index.html:791` says "Ada 5 tingkat siaga." in Indonesian for 「警戒レベル（けいかいレベル）は5つあります。」. The glossary test will list it. The official form is "tingkat peringatan" (jma-multilingual row 7, jma-nagasaki-levels-id). jma-nagasaki-levels-id also uses "Level siaga" in one column; the JMA dictionary is the national form.
- Japanese lines write the level digit half-width (レベル4), like the alert card. Decision W-5 (full-width) applies to glossary `ja` values; no final line contains a full-width level name.
- Done in Task 2: `index.html:791` now says "Ada 5 tingkat peringatan." (was "tingkat siaga"), the glossary term for 警戒レベル.
- W13 does not reuse B48. Its line is cut to the Kantei quote 「あわてずにまずは身の安全を確保してください」 (stay calm, protect yourself first). B48's "Drop and cover IMMEDIATELY" on the alert card is out of scope here.
- W6 and W7 do not reuse B50's "must leave now". Kantei says 「危険な場所から全員避難」 with no time word, so the lines say "must leave" / 全員避難 / "harus mengungsi" (Ruling R8).

## Other documents checked (not in `SOURCES`)

These support only the dropped rows or confirm a pairing. No kept line depends on them.

| Publisher | Title | URL | Checked |
|---|---|---|---|
| 気象庁 (JMA) | 早期注意情報の変更について (令和7年12月) | https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/pdf/earlycaution_info2026.pdf | 2026-11-22 |
| 気象庁 (JMA) | Staying Safe During Heavy Rain Disasters (English leaflet) | https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/pdf/info2026_english_leaflet.pdf | 2026-11-22 |
| 内閣府（防災担当）・消防庁 | 「自らの命は自らが守る」意識を持ち、適切な避難行動をとりましょう (知っておくべき5つのポイント, Japanese original) | https://www.bousai.go.jp/pdf/colonapoint.pdf | 2026-11-22 |
| 出入国在留管理庁 | 生活・就労ガイドブック (Japanese edition) | https://www.moj.go.jp/isa/content/930004717.pdf | 2026-11-22 |
| 茨城県 | 【インドネシア語】避難所の感染症は予防が大切 | https://www.pref.ibaraki.jp/seikatsukankyo/bousaikiki/bousai/documents/4indonesianhinanzyokansensyou.docx | 2026-11-22 |

## Sources

| ID | Publisher | Title (section) | URL | Checked |
|---|---|---|---|---|
| jma-multilingual | 気象庁 (JMA) | 多言語辞書データ (xlsx updated 2026-11-12) | https://www.data.jma.go.jp/developer/multilingual.html | 2026-11-22 |
| jma-nagasaki-levels-en | 長崎地方気象台 (JMA Nagasaki) | List of evacuation actions (English) | https://www.data.jma.go.jp/nagasaki-c/kikikuru/image/List%20of%20evacuation%20actions_EN.pdf | 2026-11-22 |
| jma-nagasaki-levels-id | 長崎地方気象台 (JMA Nagasaki) | List of evacuation actions (Indonesian) | https://www.data.jma.go.jp/nagasaki-c/kikikuru/image/List%20of%20evacuation%20actions_ID.pdf | 2026-11-22 |
| jma-warning-2026 | 気象庁 (JMA) | 新たな防災気象情報について（令和８年～） | https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/index.html | 2026-11-22 |
| jma-warning-2026-english | 気象庁 (JMA) | 警戒レベル相当情報の英語表記について | https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/pdf/english_info2026.pdf | 2026-11-22 |
| jma-tsunami-info | 気象庁 (JMA) | 津波警報・注意報、津波情報、津波予報について | https://www.jma.go.jp/jma/kishou/know/jishin/joho/tsunamiinfo.html | 2026-11-22 |
| kantei-keihou | 首相官邸 | 防災の手引き: 防災気象情報と警戒レベル (最終更新 令和8年10月) | https://www.kantei.go.jp/jp/headline/bousai/keihou.html | 2026-11-22 |
| kantei-hinan | 首相官邸 | 防災の手引き: 避難のタイミングと避難場所 (最終更新 令和8年10月) | https://www.kantei.go.jp/jp/headline/bousai/hinan.html | 2026-11-22 |
| kantei-jishin | 首相官邸 | 防災の手引き: 地震への備えと身の守り方 | https://www.kantei.go.jp/jp/headline/bousai/jishin.html | 2026-11-22 |
| kantei-tsunami | 首相官邸 | 防災の手引き: 津波 | https://www.kantei.go.jp/jp/headline/bousai/tsunami.html | 2026-11-22 |
| fdma-jalert | 総務省消防庁 (FDMA) | 全国瞬時警報システム（Jアラート）の概要 | https://www.fdma.go.jp/about/organization/post-18.html | 2026-11-22 |
| cao-countermeasures | 内閣府 防災担当 | Disaster Countermeasures: Disaster Emergency Response and Preparedness (災害応急対応とその備え), Japanese and English | https://www.bousai.go.jp/pdf/pam3-2.pdf | 2026-11-22 |
| cao-evac-leaflet-en | 内閣府（防災担当） | Evacuation information leaflet, English, back side (2021) | https://www.bousai.go.jp/oukyu/hinanjouhou/r3_hinanjouhou_guideline/pdf/EN_ura.pdf | 2026-11-22 |
| cao-evacuation-points-en | 内閣府（防災担当）・消防庁 | Evacuation Essentials Under COVID-19 Crisis: 5 points to keep in mind (English) | https://www.bousai.go.jp/kokusai/evacuation_points/pdf/point_en.pdf | 2026-11-22 |
| cao-evacuation-points-id | 内閣府（防災担当）・消防庁 | Poin Evakuasi Di Bawah COVID-19 Crisis (Indonesian) | https://www.bousai.go.jp/kokusai/evacuation_points/pdf/point_id.pdf | 2026-11-22 |
| isa-guidebook-en | 出入国在留管理庁 (ISA) | Guidebook on Living and Working, 7th edition (English) | https://www.moj.go.jp/isa/content/001450885.pdf | 2026-11-22 |
| isa-guidebook-id | 出入国在留管理庁 (ISA) | Buku Panduan Hidup dan Bekerja, edisi ke-7 (Indonesian) | https://www.moj.go.jp/isa/content/001450893.pdf | 2026-11-22 |
