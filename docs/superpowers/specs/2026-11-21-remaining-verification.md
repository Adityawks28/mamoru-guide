# Verification of the remaining content

- Date: 2026-11-21
- Scope: the factual lines that the medical, history and safety verifications do not cover. These are the quiz (`src/quiz.ts`), the shindo scale, the bag items (`src/data.ts`), drill step 3 (`src/drill.ts`), the earthquake and bag scene captions (`src/character/`), the Show This card (`src/show-this.ts`), the contacts (`src/contacts.ts`), the locale fact keys (`src/locales/*.ts`) and the remaining page text in `index.html`. The check has 98 rows (R1 to R98) and 1 extra row (X1).
- Evidence: two independent AI research passes on 2026-11-21. The first pass compared each line with official sources and quoted them. The second pass (the audit) loaded the sources again, checked the quotes and corrected some rows. When the two passes disagreed, the audit decided. The owner checked one page in a browser (R73).
- Source rule: Lines that no official source certifies are removed. A line stays only when an official page, or the service's own page for its own service, says the same thing.
- Line numbers are for this commit (after the change). A removed line shows the line where it was.

## Key

- Verdict: `match` = the source says the same thing. `partial` = the source says part of it, or says it with a smaller scope. `wrong` = the source says something different. `not found` = no checked official source says it.
- Final English: the new English text, or "removed". Japanese and Indonesian have the same meaning.
- Source IDs are the keys in `SOURCES` (`src/data/sources.ts`). The Sources section at the end gives the publisher, title and URL of each.
- Claims: only `drill-step-3` is in `CLAIMS`. It stays `needs-medical-review`; this change adds `shishin-2020-citizen` to its sources. The quiz, the scale, the bag items, the captions and the contacts have no claim IDs; this table is their record.

## Results

| Outcome | Rows |
|---|---|
| Kept, no text change | 38 (R1, R3, R4, R5, R6, R8, R11, R13, R17, R27, R28, R29, R35, R42, R51, R52, R53, R55, R60, R61, R64, R67, R69, R70, R72, R73, R75, R76, R78, R79, R80, R85, R88, R91, R92, R93, R95, R98) |
| Cut to a sourced text | 54 (53 rows and X1) |
| Removed (whole line, option or detail) | 7 (R38, R39, R43, R47, R48, R54, R82) |

R51 needed no change: an earlier commit already gave the code comment the Osaka wording. R60 is kept, and its text now also replaces R57 to R59.

Some cut rows also lose part of their text: R10 (the survival-days sentence and the option "Umbrella"), R74 (the area text), R94 ("Use this time to prepare.") and R96 (two sentences).

## Changed and removed lines

### Quiz (`src/quiz.ts`)

Every question keeps exactly one correct, sourced answer.

| ID | File:line | Claim (old English) | Source | Source says (JA quote / EN gist) | Verdict | Final English |
|---|---|---|---|---|---|---|
| R2 | quiz.ts:27 | Q1 explanation: "...Never use an elevator during an earthquake." | fdma-hakusho-r5; edogawa-elevator | 「全ての階のボタンを押し、最初に停止した階で降りる。」; 「強い揺れがあった後にマンションや高層ビルから避難するとき…稼働していたとしてもエレベーターを使用してはいけません。」 / Do not use an elevator to leave after strong shaking. | partial | Drop, Cover, and Hold On is the recommended action. After strong shaking, do not use an elevator to leave. |
| R7 | quiz.ts:56 | Q3 explanation: "...the other side of the storm hits with the same or more force. Stay indoors." | jma-typhoon-wind; jma-fukuoka-typhoon | 「決して台風が去ったわけではありません。」「眼が通過した後は風向きが反対の強い風が吹き返します。」; 「台風接近中は不要な外出は控え、危険な場所へは近づかないようにしましょう。」 / No source says "the same or more force". JMA Fukuoka says not to go out without need, so "Stay indoors" is cut to that rule. | partial | The eye of a typhoon is calm, but the typhoon is not over. After the eye passes, strong wind blows again from the other direction. Do not go out unless you need to. |
| R9 | quiz.ts:86 | Q5 explanation: "...118 is for the coast guard. 911 does NOT work in Japan." | jnto-mi-guide; keishicho-110; kaiho-118 | 119: "When there is a fire or traffic accident. When someone is seriously sick or injured."; 「110番は、事件・事故等、緊急時に警察に通報するための緊急通報ダイヤルです。」; 「海上における事件・事故の緊急通報用電話番号」. No official page says anything about 911. The option "911" stays as a wrong option. | partial | 119 is for fire and ambulance. 110 is for police. 118 is for accidents and incidents at sea (Japan Coast Guard). |
| R10 | quiz.ts:106 | Q7 question: "What is the most important item in your emergency bag?" | osaka-pref-bag; gov-online-bousai-8072 | Osaka bag list starts with 貴重品 「現金(公衆電話用に10円玉も）」; 「飲料水（500mlペットボトル）」 is under 飲料水・非常食. No source ranks one item as "most important". | not found | Which item is on the official emergency bag lists? |
| R10 | quiz.ts:112 (was 113) | Q7 option "Umbrella" | osaka-pref-bag | 「雨具」 is on the Osaka home-stock list, so "Umbrella" is not a clearly wrong option. | removed | removed (options: Laptop, Water, Books; `correct` stays 1) |
| R10 | quiz.ts:115 | Q7 explanation: "Water comes first. You can live for weeks without food, but only 3 days without water." | osaka-pref-bag; kantei-sonae | 「飲料水（500mlペットボトル）」; 「飲料水（1人一日3ℓを目安に）」. No go.jp page gives survival days. | not found | Drinking water is on the official lists of items to take when you evacuate. Plan for about 3 L per person per day. (Survival-days sentence removed.) |
| R12 | quiz.ts:129 | Q8 explanation: "...New elevators have earthquake sensors that do this automatically." | fdma-hakusho-r5; kanagawa-highrise | 「行先階のボタンをすべて押し、最初に停止した階で降りる」; 「感知器が地震の初期波を感知して、エレベーターを自動的に最寄りの階に停止させ…平成21年度以降に新設されたエレベーターには設置が義務付けられています」 / 平成21年度 is fiscal year 2009. | partial | Press all the floor buttons. Get out at the first floor where it stops. Elevators newly installed from fiscal year 2009 must have a device that stops them at the nearest floor in an earthquake. |
| R14 | quiz.ts:143 | Q9 explanation: "...It is free from NTT landlines. Other phones may pay a call charge." | ntt-east-171-intro; ntt-east-171-rec | 「つながりにくい状況になった場合に提供が開始される」; 「録音される方は1（いち）、再生される方は2（に）」; 「NTT東日本・NTT西日本の電話サービスから…通話料は無料です。他通信事業者の電話…各通信事業者にお問い合せください。」 | partial | 171 is the disaster voice message service in Japan. It starts when a disaster makes calls to the area hard to connect. Call 171. Press 1 to record and 2 to listen. Calls from NTT East or NTT West phones are free. From other phones, ask your phone company. |
| R15 | quiz.ts:153 | Q10 correct option: "National emergency: missile, major earthquake, or tsunami" | fdma-jalert | 「弾道ミサイル情報、緊急地震速報、大津波警報など、対処に時間的余裕のない事態に関する情報を…国から住民まで瞬時に伝達するシステム」 | partial | Urgent national alert: a missile, an Earthquake Early Warning or a Major Tsunami Warning |
| R16 | quiz.ts:157 | Q10 explanation: "...missiles, major earthquakes, and tsunamis. Take it seriously every time." | fdma-jalert | As R15. "Take it seriously every time" has no source. | partial | J-Alert sends urgent national alerts when there is no time to wait, such as missiles, Earthquake Early Warnings and Major Tsunami Warnings. |

### Shindo scale (`src/data.ts:5-13`)

Source for all rows: jma-shindo-table (気象庁震度階級関連解説表). JMA uses 木造建物（住宅）「耐震性が低い」, so the text says "low earthquake resistance" (ja 耐震性の低い木造住宅), not "weak".

| ID | File:line | Claim (old English) | Source | Source says (JA quote / EN gist) | Verdict | Final English |
|---|---|---|---|---|---|---|
| R18 | data.ts:5 | 1: People indoors feel a slight shake. | jma-shindo-table | 「屋内で静かにしている人の中には、揺れをわずかに感じる人がいる。」 | partial | Some people who are quiet indoors feel a slight shake. |
| R19 | data.ts:6 | 2: Many people indoors feel it. | jma-shindo-table | 「屋内で静かにしている人の大半が、揺れを感じる。」 | partial | Most people who are quiet indoors feel it. |
| R20 | data.ts:7 | 3: Most people feel it. Dishes shake and make noise. | jma-shindo-table | 「屋内にいる人のほとんどが、揺れを感じる。」「棚にある食器類が音を立てることがある。」 | partial | Almost everyone indoors feels it. Dishes on shelves can rattle. |
| R21 | data.ts:8 | 4: Strong shaking. Objects fall. | jma-shindo-table | 「ほとんどの人が驚く。」「電灯などのつり下げ物は大きく揺れ」「座りの悪い置物が、倒れることがある。」 | partial | Most people are startled. Hanging lights swing a lot. Unstable ornaments can fall over. |
| R22 | data.ts:9 | 5-: Very strong shaking. Furniture moves. | jma-shindo-table | 「大半の人が、恐怖を覚え、物につかまりたいと感じる。」「固定していない家具が移動することがあり」 | partial | Most people are afraid and want to hold on to something. Furniture that is not fixed can move. |
| R23 | data.ts:10 | 5+: ...Walls crack. | jma-shindo-table | 「大半の人が、物につかまらないと歩くことが難しい」; 耐震性が低い 「壁などにひび割れ・亀裂がみられることがある。」 | partial | Most people find it hard to walk without holding on. Walls of wooden houses with low earthquake resistance can crack. |
| R24 | data.ts:11 | 6-: ...Buildings are damaged. | jma-shindo-table | 「立っていることが困難になる。」; 耐震性が低い 「瓦が落下したり、建物が傾いたりすることがある。倒れるものもある。」 | partial | It is hard to keep standing. Wooden houses with low earthquake resistance can lean, and some fall down. |
| R25 | data.ts:12 | 6+: ...Buildings can collapse over a large area. | jma-shindo-table | 「立っていることができず、はわないと動くことができない。」; 耐震性が低い 「傾くものや、倒れるものが多くなる。」 / "広い地域" is only about gas, water and power. | partial | You cannot stand. You can only move by crawling. Many wooden houses with low earthquake resistance lean or fall down. |
| R26 | data.ts:13 | 7: Very severe damage. This is the highest level. | jma-shindo-table | 耐震性が低い 「傾くものや、倒れるものがさらに多くなる。」 | partial | This is the highest level. Even more wooden houses with low earthquake resistance lean or fall down. |

### Bag items (`src/data.ts:61-83`) and bag text

Sources: osaka-pref-bag (大阪府 非常持ち出し品リスト例 and 備蓄品), gov-online-bousai-8072 §4 (非常持ち出し品の例), kantei-sonae. A detail text is left out when no list supports it; the bag UI then shows the item name only.

| ID | File:line | Claim (old English) | Source | Source says (JA quote / EN gist) | Verdict | Final English |
|---|---|---|---|---|---|---|
| R30 | data.ts:62 | Emergency food (3 days): "Alpha rice (dried instant rice), crackers, energy bars." | osaka-pref-bag; gov-online-bousai-8072 | Bag lists: 「缶入り乾パン」; 「ビスケット、チョコレート」. アルファ米 and "3 days" are on the home-stock list only. No "energy bars". | partial | Name: Emergency food. Detail: Canned dry bread (乾パン), biscuits, chocolate. |
| R31 | data.ts:63 | Flashlight: "A hand crank or solar flashlight is also OK." | osaka-pref-bag | 「懐中電灯（できれば1人に1つ）」; 「ラジオ・懐中電灯などは壊れていないか確認しておきましょう。」 / No source on hand crank or solar. | partial | Check that it works. |
| R32 | data.ts:64 | Radio: "NHK broadcasts in many languages." | tfd-quake-10-points | 「行政、放送局、鉄道会社などから発信される正しい情報を得る。」 / No NHK page says this about domestic radio. | not found | Use it to get correct information. |
| R33 | data.ts:65 | First aid kit: "Bandages, antiseptic, pain medicine." | osaka-pref-bag; gov-online-bousai-8072 | 「消毒薬」「包帯」「ばんそうこう」; 「救急用品（ばんそうこう、包帯、消毒液、常備薬など）」 / No pain medicine. | partial | Plasters, bandages, antiseptic. |
| R34 | data.ts:66 | Personal medicine (5+ days): "Add a copy of your prescription if you have one." | osaka-pref-bag | 「常備薬・持病薬など」; 「お薬手帳」 / No number of days, no prescription copy. | partial | Name: Personal medicine. Detail: Add your medicine notebook (お薬手帳). |
| R36 | data.ts:68 | Cash: "ATMs may not work." | osaka-pref-bag | 「現金(公衆電話用に10円玉も）」 | partial | Include 10-yen coins for public phones. |
| R37 | data.ts:69 | Charger: "Keep it charged." | osaka-pref-bag | 「携帯電話の充電器・モバイルバッテリー」 / "Keep it charged" is advice with no source. | partial | Phone charger or mobile battery. |
| R38 | data.ts:70 | Gloves + mask: "Use them to move debris safely." | gov-online-bousai-8072 | 「マスク」「軍手」 / No source on debris. | partial | removed (detail) |
| R39 | data.ts:71 | Warm clothes + poncho: "You need them most in winter." | gov-online-bousai-8072; osaka-pref-bag | 「衣類」「使い捨てカイロ」; 「雨具」 is home stock only. No source for "most in winter". | partial | removed (detail) |
| R40 | data.ts:72 | Hazard map: "Mark your evacuation route on it." | kantei-sonae | 「防災マップやハザードマップを入手し、避難場所、避難経路を事前に確認しておきましょう。」 | partial | Check your evacuation site and route on it. |
| R41 | data.ts:73 | Contacts (paper): "Your phone can stop working." | kantei-jishin | 「電話やインターネットが使えなくなったり、つながりにくくなったりします。」 | partial | Phones may not connect after a disaster. |
| R43 | data.ts:75 | Foil blanket: "It folds to the size of your palm. It keeps your body heat in." | osaka-pref-bag | 「サバイバルブランケット」 / No source on size or heat. | partial | removed (detail) |
| R44 | data.ts:76 | Shoes: "...from broken glass and debris." | gov-online-bousai-8072 §2 | 「スリッパは割れたガラスなどの破片で足をけがをするのを防ぎます。」 | partial | They protect your feet from broken glass. |
| R45 | data.ts:77 | Multitool: "For cutting, opening cans, and repairs." | osaka-pref-bag | 「十徳ナイフ」 | partial | A knife with several tools (十徳ナイフ). |
| R46 | data.ts:81 | Extra water: "Water for day 2. It is heavy, but it is hard to replace." | osaka-pref-bag; kantei-sonae | 「飲料水（1人一日3ℓを目安に）」 / "hard to replace" has no source. | partial | More drinking water. Plan for 3 L per person per day. |
| R47 | data.ts:82 | Canned food: "It is heavy. Light alpha rice can replace it." | gov-online-bousai-8072 | 「缶詰」 is on the list. No source compares weights. | partial | removed (detail) |
| R48 | data.ts:83 | Laptop: "Your phone is enough for news and maps." | osaka-pref-bag; gov-online-bousai-8072 | Neither bag list has a laptop. No source for the old sentence. A sentence "It is not on the government lists" would suggest that every other item is on an official list, which is not true for all of them. | not found | removed (detail) |
| R49 | en/ja/id.ts:67; index.html:681 | "Each item has a typical real weight." / "Each item shows its usual real weight" | osaka-pref-bag | No official source gives item weights. The 15 kg / 10 kg sentence on the same line is the Osaka guide: 「重さの目安は男性で15Kg、女性で10kg程度。※あくまで目安です。」 | not found | Each weight is an estimate. |
| R50 | bag-scene.ts:30 | "It is getting heavy. You may walk for an hour to the shelter." | none | No source for the walking time. | not found | It is getting heavy. |
| X1 | bag-scene.ts:31 | "Hah… hah… Too heavy to run. Take something out." | osaka-pref-bag | 「自分で持って避難できる量にしましょう。」 / An amount that you can carry when you evacuate; no "run". | partial | Hah… hah… Too heavy. Take something out. |

### Drill step 3 (`src/drill.ts`, claim `drill-step-3`)

| ID | File:line | Claim (old English) | Source | Source says (JA quote / EN gist) | Verdict | Final English |
|---|---|---|---|---|---|---|
| R54 | drill.ts:58 (was 59) | Wrong option: "Pour water on the wound to clean it" | shishin-2020-citizen VI-9 | 「可能であれば、すみやかに傷口を水道水など清潔な流水で十分に洗ってください。」 / For cuts and scrapes, washing is the official advice, so this is not a clearly wrong option. | wrong | removed (3 options stay; `correct` stays 0; no new option) |

### Earthquake scene captions (`src/character/earthquake-scene.ts:179-184`)

No source ties an action to each shindo level. The caption list keeps 10 entries: index 0 is the JMA shindo 0 text, and indexes 1 to 9 use the R60 text. Before any shaking, the caption is empty. The actor's pose follows the caption: she stands at shindo 0 and gets under the table at every felt level. The door glow (open a door to keep a way out) shows only after the shaking stops (tfd-quake-10-points point 4, as R81).

| ID | File:line | Claim (old English) | Source | Source says (JA quote / EN gist) | Verdict | Final English |
|---|---|---|---|---|---|---|
| R56 | earthquake-scene.ts:179 (index 0) | "→ stay calm and watch" | jma-shindo-table | 0: 「人は揺れを感じない」 / "stay calm and watch" is advice with no source. | partial | → people do not feel it |
| R57 | earthquake-scene.ts:180 (index 1, 2) | "→ stay calm and watch" while people feel shaking | tfd-quake-10-points point 1 | 「揺れを感じたり、緊急地震速報を受けた時は、身の安全を最優先に行動する。」 | wrong | → protect yourself · get under a strong table · wait until the shaking stops |
| R58 | earthquake-scene.ts:180 (index 3) | "→ move away from windows" | tfd-quake-10-points point 1 | Same rule: protect yourself first. No source ties windows to shindo 3. | partial | → protect yourself · get under a strong table · wait until the shaking stops |
| R59 | earthquake-scene.ts:180 (index 4) | "→ steady yourself · open the door" during shaking | tfd-quake-10-points point 4 | 「揺れがおさまった時に、避難ができるよう出口を確保する。」 / Open the door after the shaking stops. | wrong | → protect yourself · get under a strong table · wait until the shaking stops |

R60 (indexes 5 to 9, kept, `match`): fdma-hakusho-r5 「丈夫な机やテーブルなどの下にもぐり…」「頭を座布団などで保護し、揺れが収まるのを待つ。」

### Show This card (`src/show-this.ts`)

| ID | File:line | Claim (old English) | Source | Source says (JA quote / EN gist) | Verdict | Final English |
|---|---|---|---|---|---|---|
| R62 | show-this.ts:28 | "When your safety is in danger: call 110." | keishicho-110 | 「事件・事故等、緊急時に警察に通報するための緊急通報ダイヤル」 | partial | For a crime or an accident that needs the police now: call 110. |
| R63 | show-this.ts:38 | "For a heart emergency. Most public buildings have an AED." | jfem-aed-placement-ja | 「駅や空港、学校、官公庁などの公共施設への設置が進み」 / Placement is spreading; no "most". | partial | For a heart emergency. Many stations and schools have an AED. |

### Contacts (`src/contacts.ts`)

| ID | File:line | Claim (old English) | Source | Source says (JA quote / EN gist) | Verdict | Final English |
|---|---|---|---|---|---|---|
| R65 | contacts.ts:21 | 119: "Fire, medical emergencies, rescue" | jnto-mi-guide | "When there is a fire or traffic accident. When someone is seriously sick or injured. 119" / "rescue" is not on the checked pages. | partial | Fire and ambulance |
| R66 | contacts.ts:22 | 110: "Crime, accidents, lost property" | keishicho-110 | 「110番は、事件・事故等、緊急時に警察に通報するための緊急通報ダイヤルです。」 / About 33万件 non-urgent calls are a problem. Lost property is not an emergency. | wrong | Crimes and accidents that need the police now |
| R68 | contacts.ts:26 | AMDA: "Medical advice for foreigners in many languages" | amda-activities; amda-indonesia | "We help you to find medical institutions … provide information on healthcare and welfare systems"; "10:00～16:00" / Not medical advice. | partial | Help to find a hospital, and information on the health and welfare systems, in many languages. 10:00 to 16:00 |
| R71 | contacts.ts:31 | Immigration Info: "Questions about visas, residence status, and the zairyu card" | isa-info-center | 「出入国手続、在留手続等に関する一般的なご案内」; 「午前8:30~午後5:15(土日・祝日・年末年始(12/29~1/3)を除く)」. The number 0570-013904 is confirmed (ナビダイヤル). | partial | General questions about entry and residence procedures. Weekdays 8:30 to 17:15 |
| R73 | contacts.ts:35 | Indonesian Embassy Tokyo, 03-3441-4201 | mofa-emblist-asia | The MOFA page blocks automated access, so the owner opened it in a browser on 2026-11-21. It lists the Embassy of the Republic of Indonesia: 「東京都品川区東五反田5-2-9」(移転 2023-12-01)「電話：03-3441-4201」. | match | kept (no text change) |
| R74 | contacts.ts:36 | Indonesian Consulate Osaka, 06-6449-9898: "Serves the Kansai region (Kobe, Osaka, Kyoto)" | osaka-pref-consulates; hyogo-pref-consulates | 「在大阪インドネシア共和国総領事館」「06-6449-9898」 on both prefecture lists. Neither list gives the consulate's area. | partial | Number kept. Consular help for Indonesian citizens (area text removed) |

### Locales and page text (`src/locales/*.ts`, `index.html`)

| ID | File:line | Claim (old English) | Source | Source says (JA quote / EN gist) | Verdict | Final English |
|---|---|---|---|---|---|---|
| R77 | en/ja/id.ts:50; index.html:510 | "Shindo measures the shaking that you feel. It does not measure the energy of the earthquake." | jma-faq-27 | 「震度は、ある場所での地震による揺れの強さをあらわし、マグニチュードは地震そのものの大きさ（規模）をあらわします。」 / Shindo is measured by instruments, not by feeling. | partial | Shindo (seismic intensity) is the strength of the shaking at a place. Magnitude is the size of the earthquake itself. |
| R81 | index.html:528 | DO: "Open a door to keep a way out" | tfd-quake-10-points point 4 | 「揺れがおさまった時に、避難ができるよう出口を確保する。」 | partial | When the shaking stops, open a door to keep a way out |
| R82 | index.html:529 (removed) | DO: "Stay calm: most buildings stay standing" | jma-shindo-table | No source says "most buildings stay standing". At 6+ and 7: 耐震性が低い 「傾くものや、倒れるものが多くなる」. | not found | removed |
| R83 | index.html:529 | DO: "Turn on NHK for news" | kantei-jishin; tfd-quake-10-points point 8 | 「テレビやラジオ、インターネットなど、様々な手段を使って正確な情報の把握に努めましょう。」; 「行政、放送局、鉄道会社などから発信される正しい情報を得る。」 / No source names NHK. | partial | Get correct information from TV, radio or the internet |
| R84 | index.html:530 | DO: "Near the coast: run to high ground" | kantei-tsunami; tfd-quake-10-points point 10 | 「沿岸部や川沿いでは、大きな揺れを感じたり、津波警報が出されたら、高台などの安全な場所に素早く避難する。」 | partial | Near the coast: if you feel strong shaking or get a tsunami warning, go to high ground |
| R86 | index.html:541 | DON'T: "Use fire or gas appliances" | tfd-quake-10-points point 2; meti-gas-smell | 「火を使っている時は揺れがおさまってから、あわてずに火の始末をする。」; 「ガスの臭いがしたら、火気を使用したり換気扇や電気のスイッチには絶対に触らないでください。」 / No general ban. | partial | Use fire or electric switches if you smell gas |
| R87 | index.html:542 | DON'T: "Use elevators" | edogawa-elevator | As R2: the ban is for leaving after strong shaking. | partial | Use elevators to leave after strong shaking |
| R89 | index.html:544 | DON'T: "Drive a car if you do not have to" | npa-quake-driver | 「津波から避難するためやむを得ない場合を除き、避難のために車を使用しないこと。」 | partial | Use a car to evacuate (unless you must, to escape a tsunami) |
| R90 | index.html:626 | "Official announcements are hard to understand." | none | Opinion. No source. | not found | Here is a simple version with furigana and romaji: (first sentence removed) |
| R94 | index.html:810 | "A typhoon usually gives you some days of warning. An earthquake does not. Use this time to prepare." | kantei-taifu | 「大雨や台風は、地震災害のように突然襲ってくるものではなく、いつ、どこで、どのくらいの規模のものがやってくるのかなど、ある程度予測することができます。」 / No "days"; no "use this time to prepare" in the checked quotes. | partial | Unlike an earthquake, a typhoon can be forecast to some degree. ("Use this time to prepare." removed.) |
| R96 | index.html:1000 | "Most disaster information in Japan is only in Japanese. ...international students often miss important safety information..." | jma-multilingual-page; kankocho-safety-tips | JMA publishes weather, earthquake, tsunami and volcano information in 14 languages besides Japanese, including Bahasa Indonesia. 「対応言語は15言語です。」 (Safety tips). No source for "students often miss". | wrong | This guide gives disaster information in three languages, with interactive content. (First two sentences removed.) |
| R97 | index.html:1015 | "...official sources: JMA, FDMA, Cabinet Office Disaster Prevention, and NHK World safety guidelines." | the verification docs; npa-quake-driver | The checked sources are mainly 首相官邸, 内閣府（防災担当）, 気象庁, 総務省消防庁, 東京消防庁, 警察庁 (R89), prefecture and city pages, and NTT. No "NHK World safety guidelines" were used. | wrong | The information in this guide comes from official sources. These include the Prime Minister's Office (首相官邸) and the Cabinet Office (内閣府 防災). They also include the Japan Meteorological Agency (JMA), the Fire and Disaster Management Agency (FDMA), the Tokyo Fire Department and the National Police Agency. |

## Lines checked and kept on request

- R92, index.html:796, Yahoo! 防災速報 "Live alerts for your location": kept. The service's own page (yahoo-bousai) says 「さまざまな防災情報を迅速にプッシュ通知」 and 「現在地と国内3地点まで 設定可能」. It is the primary source for its own service.
- R73, the Tokyo embassy card: kept after the owner's browser check (see the Contacts table).
- Q1 option "Stand in a doorway": kept as a wrong option, as the safety verification decided. It states no fact.

## Open points

- R76: Yorisoi changed its phone guidance on 2026-04-01. The English and Indonesian pages still say "press 2". A test call or a browser check is advised.
- R70: The World Helpline's site news stops in 2020. A test call is advised.
- R71: 0570-013904 is a ナビダイヤル (charged call). The card does not say this.
- Bag item names with no list entry stay as game choices: "Printed hazard map", "Strong shoes", "Emergency contacts (paper)", "Laminated phrase card". The owner decides if they stay.

## Sources

All checked 2026-11-21. Sources that are already in `SOURCES` from earlier tasks: osaka-pref-bag, gov-online-bousai-8072, kantei-sonae, kantei-jishin, kantei-tsunami, kantei-taifu, tfd-quake-10-points, meti-gas-smell, jma-typhoon-wind, jma-fukuoka-typhoon, fdma-jalert, shishin-2020-citizen, jfem-aed-placement-ja.

New in `SOURCES` with this change:

| ID | Publisher | Title | URL | Checked |
|---|---|---|---|---|
| jma-shindo-table | 気象庁 (JMA) | 気象庁震度階級関連解説表 | https://www.jma.go.jp/jma/kishou/know/shindo/kaisetsu.html | 2026-11-21 |
| jma-faq-27 | 気象庁 (JMA) | よくある質問集: 震度とマグニチュードはどう違うのですか？ | https://www.jma.go.jp/jma/kishou/know/faq/faq27.html | 2026-11-21 |
| jma-multilingual-page | 気象庁 (JMA) | Multilingual Information on Disaster Risk Reduction | https://www.jma.go.jp/jma/kokusai/multi.html | 2026-11-21 |
| fdma-hakusho-r5 | 総務省消防庁 (FDMA) | 令和5年版 消防白書 特集7 2. 地震への備え | https://www.fdma.go.jp/publication/hakusho/r5/report7/68437.html | 2026-11-21 |
| edogawa-elevator | 江戸川区 | 大地震のときエレベーターは使用禁止 | https://www.city.edogawa.tokyo.jp/e008/bosaianzen/bosai/jijo/elevatorisprohibited.html | 2026-11-21 |
| kanagawa-highrise | 神奈川県 | 高層ビル・マンションの防災対策 (エレベーター) | https://www.pref.kanagawa.jp/docs/j8g/bousai/1_6921_9_7.html | 2026-11-21 |
| keishicho-110 | 警視庁 | こんなときこそ110番 | https://www.keishicho.metro.tokyo.lg.jp/jiken_jiko/110/110_110.html | 2026-11-21 |
| kaiho-118 | 海上保安庁 | 海の「事件・事故」は118番 | https://www.kaiho.mlit.go.jp/doc/tel118.html | 2026-11-21 |
| jnto-mi-guide | 日本政府観光局 (JNTO) | Guide for when you are ill | https://www.jnto.go.jp/emergency/eng/mi_guide.html | 2026-11-21 |
| ntt-east-171-intro | NTT東日本 | 災害用伝言ダイヤル（171）: 概要とご提供のしくみ | https://www.ntt-east.co.jp/saigai/voice171s/intro.html | 2026-11-21 |
| ntt-east-171-rec | NTT東日本 | 災害用伝言ダイヤル（171）: 伝言の録音方法 | https://www.ntt-east.co.jp/saigai/voice171s/rec.html | 2026-11-21 |
| amda-activities | AMDA国際医療情報センター | Our Activities | https://www.amdamedicalcenter.com/activities | 2026-11-21 |
| amda-indonesia | AMDA国際医療情報センター | Kegiatan Kami (Indonesian) | https://www.amdamedicalcenter.com/indonesia-top | 2026-11-21 |
| isa-info-center | 出入国在留管理庁 | 外国人在留総合インフォメーションセンター等 | https://www.moj.go.jp/isa/consultation/center/index.html | 2026-11-21 |
| mofa-emblist-asia | 外務省 (MOFA Japan) | 駐日外国公館リスト（アジア） | https://www.mofa.go.jp/mofaj/link/emblist/asia.html | 2026-11-21 (owner, in a browser) |
| osaka-pref-consulates | 大阪府 | 在関西（総）領事館リスト | https://www.pref.osaka.lg.jp/o070090/kanko/consulates/index.html | 2026-11-21 |
| hyogo-pref-consulates | 兵庫県 | 関西管轄（総）領事館リスト | https://web.pref.hyogo.lg.jp/sr13/ie13_000000025.html | 2026-11-21 |
| npa-quake-driver | 警察庁 | 大地震が発生したときに運転者がとるべき措置 | https://www.npa.go.jp/bureau/traffic/seibi2/saigaiji/daizisinnunntennsya.html | 2026-11-21 |
| kankocho-safety-tips | 観光庁 | 訪日外国人旅行者の安全確保: ツール (Safety tips) | https://www.mlit.go.jp/kankocho/seisaku_seido/kihonkeikaku/jizoku_kankochi/anzenkakuho/inbound/tool.html | 2026-11-21 |
| yahoo-bousai | LINEヤフー | Yahoo!防災速報 | https://emg.yahoo.co.jp/ | 2026-11-21 |

cao-ichinitimae-battery stays in `SOURCES`: no app line uses it, but the safety verification cites it as evidence for B18 and B30.
