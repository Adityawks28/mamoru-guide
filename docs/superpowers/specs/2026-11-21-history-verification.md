# History verification of the facts and numbers

- Date: 2026-11-21
- Scope: every fact or number about past disasters and every statistic in `src/character/tips.ts`, `src/earthquake-now.ts`, `src/data.ts`, `src/drill.ts`, `src/typhoon.ts` and `index.html` (41 rows, A1 to A41). Safety actions and alert names are out of scope. Task 6 checks them.
- Project rule: a number stays only with a recorded official source. If no source supports a fact, we remove the fact.
- Evidence: two independent AI research passes on 2026-11-21. The first pass compared each fact with official sources and quoted them. The second pass (the audit) downloaded every source again, checked every quote, and corrected the text of some rows. When the two passes disagreed, the audit decided. The quotes below are verbatim from the sources, with the audit's corrections.
- Source rule: Lines that no official source certifies are removed. Japanese official sources come first (Ruling R15). One row (A31) uses the NHK WORLD-JAPAN app page, because NHK is the primary source for its own app.
- Line numbers are for this commit (after the change). "(deleted)" marks a tip that this change removed.

## Key

- Verdict: the result after the audit. `match` = the source agrees. `differs` = the source gives a different number, scope or meaning. `not found` = no checked official source says it.
- Status: the value in `CLAIMS` (`src/data/sources.ts`). `verified` = the fact was already right (the wording can change). `changed` = we corrected the text. `removed` = no source, so the tip is gone. `pending` = another task still owns part of the item. "no claim" = `index.html` text and bag items have no claim ID; this table is their record.
- Source IDs are the keys in `SOURCES` (`src/data/sources.ts`). The Sources section at the end gives the publisher, title and URL of each.
- An old claim ID in brackets was renamed because the old ID named a wrong number.

## Results

| Outcome | Rows |
|---|---|
| Fact already right (kept) | 13 (A1, A2, A3, A8, A19, A20, A24, A27, A29, A33, A36, A40, A41) |
| Corrected, or number replaced with a sourced fact | 26 |
| Removed | 2 (A17, A23) |
| Total | 41 |

Claim statuses set by this change: verified 5, changed 23, removed 2, pending 1 (`drill-step-5`, because Task 6 still owns its doorway and inside-wall lines).

## Numbers that were removed

| Old text | Why |
|---|---|
| "ATMs did not work for 5 days" (two tips) | No source gives a duration. The Cabinet Office record gives 450 closed bank branches and 1 February. |
| "100 km of roads were jammed" | No source. The only length in the record is a 20 km jam on one expressway. |
| "Three whistle blasts mean SOS" (two tips) | Not in any Japanese official source. Only shops and blogs say it. |
| "Rescue often arrives on day 3" | No source. The Kantei page says rescue is busy for about 3 days. |
| "Most earthquake injuries happen to people who run outside" | No source gives a share. |
| "first wave 8 to 25 min after the warning" | Wrong. The first waves came 12 to 54 minutes after the 14:49 warning. |
| "teens" have the most casualties | The source names older people, people in their 20s and foreign residents. |
| "Buildings now bend and do not break" | No source. |
| "Mt. Rokko granite" (two tips) | No source compares Kobe and Tokyo shaking by rock type. |
| "schools drill every month" | No source gives a drill frequency. |
| "3rd floor or higher" (tsunami drill) | The old 3-storey guideline was abolished in 2017. |
| "about 30%" of injuries from furniture | The source says 30% to 50%. |

## Table

### 1995 Great Hanshin-Awaji Earthquake

| Row | File:line | Old claim (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status (claim ID) | Final text (English) |
|---|---|---|---|---|---|---|---|
| A1 | tips.ts:10 | "The 1995 earthquake took 6,434 lives." | fdma-hanshin-final §2(1) 人的被害; cao-kyokun-1-1-2 教訓情報01 | 「死者 ６,４３４人」; 「震災による死者は6，434人に及び」 / 6,434 deaths (final FDMA report, 2006-05-19). About 900 of them are recognised 震災関連死. | match | verified (tip-kobe-deaths) | The 1995 earthquake killed 6,434 people. In Kobe City, 4,571 people died. |
| A2 | tips.ts:10, tips.ts:60 | "In Kobe City alone, 4,571 people died." | kobe-city-damage (被害の状況) | 「震災により神戸市内で死者4,571人（2005年12月22日時点）」 / 4,571 deaths in Kobe City as of 2005-12-22. | match | verified (tip-kobe-deaths) | In Kobe City, 4,571 people died. |
| A3 | tips.ts:60 | "The 1995 Hanshin-Awaji earthquake reached shindo 7." | fdma-hanshin-final §1(6) 注 | 「気象庁が地震機動観測班を派遣し現地調査を実施した結果、以下の地域は震度７であった。神戸市須磨区鷹取・長田区大橋…」 / A JMA field survey found shindo 7 in parts of Kobe, Ashiya, Nishinomiya, Takarazuka and north Awaji. | match | verified (tip-kobe-deaths) | The 1995 Great Hanshin-Awaji Earthquake reached shindo 7 in parts of Kobe. In Kobe City, 4,571 people died. |
| A4 | tips.ts:13; earthquake-now.ts:58 | "Switch off the breaker when you leave. In Kobe in 1995, fire burned about 7,000 buildings." | fdma-hanshin-final §2(2) 火災; kobe-city-damage; cao-kyokun-1-9-2 | 「全焼 ７，０３６棟」, all burn damage 「合計 ７，５７４棟」; Kobe City only: 全焼 6,965棟 / About 7,000 buildings burned down, in all areas (7,036) and in Kobe City (6,965). The number is right. Next to "switch off the breaker", it suggested that returning power caused the 7,000; no source gives that share (see A5). | match (number); differs (framing) | changed (tip-breaker-fire) [tip-kobe-fire] | Switch off the breaker when you leave. Electrical fires can start when the power comes back on. (The 7,000 stays in earthquake-now step 5, worded as in A5.) |
| A5 | earthquake-now.ts:58 (ja :59, id :60) | "Many fires start when the power comes back on. Kobe 1995: fire burned about 7,000 buildings." | cao-kyokun-1-9-2 【02】電力事業者の緊急対応; tfd-quake-10-points point 9; fdma-hanshin-final | 「送電回復に伴って『電気火災』が起こるという問題も発生した。」; 「通電火災が発生する可能性」 / Fires from returning power did occur. No source gives the share of the 7,000 that came from returning power. The old two sentences suggested that most of the 7,000 did. | differs (framing) | changed (eqnow-5) | Electrical fires can start when the power comes back on. In 1995, fires burned down about 7,000 buildings. |
| A6 | tips.ts:25, tips.ts:71 | "In Kobe in 1995, ATMs did not work for 5 days." | cao-kyokun-1-11-4 【04】治安・金融維持対策 | 「銀行については、最大450店舗が休業（兵庫県下607店舗中75％）、各種オンライン機能も麻痺したが、2月1日までには全店舗業務再開した。」 The PDF quotes Kobe Shimbun: 兵庫銀行 「全店舗のＣＤ、ＡＴＭが使用不能に」, with no duration. / Up to 450 branches closed. All reopened by 1 February. No source says "5 days". | not found | changed (tip-kobe-banks) [tip-kobe-atm] | Pack cash. In 1995, up to 450 bank branches in Hyogo closed. All of them opened again by 1 February. / In 1995, up to 450 bank branches in Hyogo closed. All opened again by 1 February. Always keep some cash. |
| A7 | tips.ts:31 | "In Kobe in 1995, 100 km of roads were jammed." | cao-kyokun-1-6-1 【01】道路交通; cao-kyokun-2-5-6 【06】道路交通規制と道路復旧 | 「…交通渋滞が発生し、緊急通行車両の通行に著しい支障を来したところである。」; 「終日20kmに及ぶ渋滞が発生」 (Chugoku Expressway after it reopened) / Severe jams blocked emergency vehicles. No source gives 100 km. | not found | changed (tip-kobe-traffic) | Walk. Do not drive. In 1995, traffic jams in Kobe blocked fire engines and ambulances. |
| A8 | tips.ts:64 | "In 1995, most people who died were crushed under houses or furniture." | cao-kyokun-1-1-2 教訓情報詳述02; kantei-sonae 家具の固定 | 「死因のほとんどは、家屋の倒壊や家具などの転倒による圧迫死だった」; 「死者の87.8％は、家屋の倒壊や家具等の転倒による圧迫死とされている」; 「多くの方が倒れてきた家具の下敷きになって亡くなったり、大けがをしたりしました」 / Most deaths came from being crushed. The 87.8% is of the 5,502 deaths in police data, not of 6,434, so we do not write "about 9 in 10 people who died". | match | verified (tip-1995-crushed) | (No change.) In 1995, most people who died were crushed under houses or furniture. Fix furniture to the wall. |
| A9 | tips.ts:63 | "In big earthquakes, teens and elderly people have the most casualties." | cao-kyokun-1-1-2 教訓情報01 | 「震災による死者は6,434人に及び、高齢者、低所得者、外国人などが多く犠牲になった」; 「高齢者の死亡数が多く…一方で20歳代の死亡率の高さも指摘された」; 「外国人の死亡率は平均0.23％であり、日本人の死亡率0.15％と比較して高くなっている」 / Older people, people in their 20s and foreign residents had high death rates. Teens are not named. | differs | changed (tip-casualty-groups) | In 1995, many older people died. People in their 20s and foreign residents also had high death rates. |
| A15 | tips.ts:16 | "The power can be off for 3 days or more." | cao-kyokun-1-9-2; fdma-hanshin-final §2(1) | 「応急送電の完了は、地震発生後6日後の1月23日15時となった。」; 停電 「約２６０万戸」 at the peak / Some areas had no power for up to 6 days. | match | changed (tip-kobe-power) [tip-power-3days] | Charge your phone now. In 1995, some areas of Kobe had no power for up to 6 days. |
| A16 | tips.ts:11 | "Kobe rebuilt with new earthquake building rules. Buildings now bend and do not break." | mlit-whitepaper-2021 第2節 ■2 | 「…現在の耐震基準（新耐震基準）を満たさない昭和56年以前の建物に被害が集中していた。これを受けて、『建築物の耐震改修の促進に関する法律（耐震改修促進法）』が制定され…」 / Damage was concentrated in buildings from 昭和56年 (1981) or earlier ("concentrated" is not "most"). After 1995, Japan made a law to strengthen old buildings. No source says buildings "do not break". | differs | changed (tip-building-law) | In 1995, buildings from 1981 or earlier had the worst damage. Then Japan made a law to make them stronger. |
| A17 | tips.ts (deleted; was :16 and :70) | "Mt. Rokko granite makes Kobe earthquakes feel sharper than Tokyo earthquakes." | Searched JMA, CAO, GSI and NIED | No official source compares Kobe and Tokyo shaking by rock type. A NIED handout (search result only) explains the 1995 「震災の帯」 with seismic waves at the edge of the granite basement. That is a different claim. | not found | removed (tip-rokko-granite) | (Both tips deleted.) |
| A26 | data.ts:79 | "A lesson from the 1995 Kobe and 2011 East Japan earthquakes." (portable toilet) | cao-toilet-guideline pp.2-3 | 阪神: 「避難所に災害用トイレが設置されたのは早いところでも3日目以降となり、中には11日目に設置されたという事例もあった。」 東日本: 「発災から数日間で、トイレが排泄物の山になり、劣悪な衛生状態となったところも少なくない。」 / In 1995, even the fastest shelters got disaster toilets only on day 3 or later. | match | no claim (bag item) | In 1995, even the fastest evacuation shelters got disaster toilets only on day 3 or later. Pack your own portable toilet. |
| A27 | index.html:424 | "...Kobe, the city that rebuilt itself after 1995." | kobe-city-damage | Kobe City records the damage and the recovery. No number. | match | no claim | (No change. Task 5b rewrites the PPI Kobe wording in this line.) |
| A28 | index.html:983 (id :985); tips.ts:60 | "In 1995, the Great Hanshin Earthquake caused great damage in Kobe." | fdma-hanshin-final; kobe-city-damage | The official name is 阪神・淡路大震災. The app used "Great Hanshin Earthquake" and "Hanshin-Awaji earthquake". | match (name fix) | no claim (index.html); tip-kobe-deaths (tips.ts) | In 1995, the Great Hanshin-Awaji Earthquake caused great damage in Kobe. (Indonesian: Gempa Besar Hanshin-Awaji.) One name everywhere. |

### 2011 Great East Japan Earthquake and tsunami

| Row | File:line | Old claim (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status (claim ID) | Final text (English) |
|---|---|---|---|---|---|---|---|
| A10 | tips.ts:65 | "In the 2011 Tōhoku tsunami, waves reached 40 meters in some bays." | jma-faq-tsunami (「日本で一番大きな津波は何ですか？」) | 「岩手県大船渡市の綾里湾で局所的に40.1mの遡上高（海岸から内陸へ津波がかけ上がった高さ）が観測されました」; 「記録に残っている中では、1896年の明治三陸津波（遡上高で約38.2ｍと推定：同じく岩手県大船渡市）を上回り、これまでに日本で記録された最大の津波となりました。」 / 40.1 m is a run-up height (how high the water climbed on land) at one place. It is not a wave height and not "some bays". It is the largest tsunami recorded in Japan; the FAQ adds that the records cover about 100 years. | differs | changed (tip-tohoku-40m) | In 2011, the tsunami ran up the land to 40.1 m at Ryori Bay in Ōfunato. It is the highest on record in Japan. |
| A11 | tips.ts:69 | "Tōhoku 2011: the first wave came 8 to 25 min after the tsunami warning." | jma-tsunami-kaizen-2012 p.5-6, p.24 表4 | Warning: 「3/11 14:49 津波警報の発表」. 表4 first-wave arrival: 宮古 15:01, いわき市小名浜 15:08, 銚子 15:13, 大洗 15:17, 八戸 15:21, 釧路 15:35, 根室市花咲 15:43. 「第１波が最大とは限らず、第２波、第３波がより大きくなることが多くある」; 「第１波が小さく第２波以降が第１波の 10 倍を超えるなど著しく大きくなる場合」 / The first waves came 12 to 54 minutes after the warning. "8" and "25" look like numbers from the first-wave-to-largest-wave column. Later waves were often bigger. At 根室市花咲 the first wave was the largest, so "the first wave was often small" overstates. | differs | changed (tip-tohoku-later-waves) [tip-tohoku-wave-timing] | In 2011, later tsunami waves were often bigger than the first. Stay high until the warning ends. |

### Injuries, supplies and everyday facts

| Row | File:line | Old claim (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status (claim ID) | Final text (English) |
|---|---|---|---|---|---|---|---|
| A12 | tips.ts:61 | "Falling furniture causes about 30% of earthquake injuries." | tfd-furniture | 「東京消防庁が実施した近年の地震被害調査では、負傷者の3～5割の方々が、屋内における家具類の転倒・落下・移動によって負傷していました。」 / 30% to 50% of injured people were hurt by furniture that fell or moved indoors. | differs | changed (tip-furniture-injuries) [tip-furniture-30pct] | Falling or moving furniture hurt 30 to 50% of injured people in recent earthquakes. Fix furniture to the wall. |
| A13 | tips.ts:68 | "Most earthquake injuries happen to people who run outside." | tfd-furniture; tfd-quake-10-points point 3 | 「瓦、窓ガラス、看板などが落ちてくるので外に飛び出さない。」 / Running outside is dangerous, but no source says that it causes most injuries. | not found | changed (tip-run-outside) | Do not run outside during the shaking. Roof tiles, glass and signs can fall on you. Drop, cover and hold on. |
| A14 | tips.ts:67 | "Pack supplies for 72 hours. Rescue often arrives on day 3." | kantei-sonae 備蓄; kantei-jishin 大都市で地震に遭遇した時 | 「最低3日分の水・食料の備蓄」, 「大規模災害発生時には、『1週間分』の備蓄が望ましいとされています」; 「発生3日程度は火災の発生や救助・救急活動優先のため、混乱状態が続きます」 / Store at least 3 days, better 1 week. Rescue is busy for about 3 days; no source says rescue "arrives on day 3". | differs | changed (tip-stock-days) [tip-72h] | Store food and water for at least 3 days. For a very large disaster, store enough for 1 week. |
| A18 | tips.ts:21 | "Keep the bag under 10 kg." | osaka-pref-bag | 「重さの目安は男性で15Kg、女性で10kg程度。※あくまで目安です。」 / About 15 kg for men and 10 kg for women, as a guide. | differs | changed (tip-bag-weight) [tip-bag-10kg] | A guide: about 15 kg for men and 10 kg for women. (All languages. The bag game keeps 10 kg as its own game rule and says so.) |
| A19 | tips.ts:22 | "Plan for 3 L per person per day." | kantei-sonae; gov-online-bousai-8072 | 「飲料水 3日分（1人1日3リットルが目安）」; 「飲料水…一人1日3リットルを目安に、3日分を用意」 | match | verified (tip-water-3l) | (No change.) Pack water first. Plan for 3 L per person per day. |
| A20 | tips.ts:23 | "Pack copies of your residence card and passport." | osaka-pref-bag (必需品・貴重品類) | 「パスポート・在留カード・特別永住者証明書等）のコピー」 | match | verified (tip-id-copies) | (No change.) |
| A21 | tips.ts:24, tips.ts:70 | "A whistle saves your voice. Three blasts mean SOS." | gov-online-bousai-8072 §2 | 「ホイッスルは建物や家具の下敷きになった場合に救助を求めるためのもので、少しの息でもホイッスル音が出る」 / A whistle needs little breath and helps rescuers find you. "Three blasts = SOS" is not in any Japanese official source; a search found only shops and blogs. | not found (3 blasts) | changed (tip-whistle) [tip-whistle-sos] | A whistle needs only a little breath. Blow it to call for help if you are trapped. / If you are trapped, blow a whistle to call for help. A whistle needs only a little breath. |
| A22 | tips.ts:66 | "SMS gets through when calls do not." | gov-online-bousai-8072 §5; kantei-jishin | 「安否確認には、『災害用伝言ダイヤル（171）』、携帯電話のインターネットサービスを利用した『災害用伝言板』などのサービスを利用しましょう。」; 「電話やインターネットが使えなくなったり、つながりにくくなったり」 / Use 171 or the carrier message board. No source says that SMS gets through. | not found | changed (tip-safety-message) | After a disaster, calls may not connect. Use 171 or your carrier's 災害用伝言板 to say you are safe. |
| A23 | tips.ts (deleted; was :74) | "Japanese schools have earthquake drills every month." | mext-school-safety-r6 (Q25-Q31) | The only monthly figure: 「月に１回以上、学校施設及び設備の安全点検を実施している学校の割合…72.3%」 / This is building safety checks, not drills. No drill frequency was found. | not found | removed (tip-school-drills) | (Tip deleted.) |
| A24 | tips.ts:62 | "Japan has free hazard maps online." | kantei-taifu (also kantei-tsunami, kantei-hinan) | All three pages link 「ハザードマップポータルサイト（国土交通省）」. | match | verified (tip-hazard-maps) | (No change.) |
| A25 | tips.ts:30 | "Schools are the main shelters. Look for the 避難所 sign." | kantei-hinan | 「避難場所は災害の危険から緊急的に逃れるための場所…避難所は自宅に戻れなくなった場合に一定期間滞在する施設です。」; 「学校や公民館といった指定緊急避難場所」 / 避難場所 (evacuation site) and 避難所 (evacuation shelter) are different. Schools are often both. | differs (term) | changed (tip-shelter-types) | Schools are often evacuation sites and evacuation shelters. Find your 避難場所 and 避難所 on the city map. (Community halls dropped for the 110-character limit; the terms follow the glossary.) |

### Typhoons

| Row | File:line | Old claim (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status (claim ID) | Final text (English) |
|---|---|---|---|---|---|---|---|
| A29 | index.html:805 | "About 25 typhoons form each year. About 12 come near Japan, and about 3 hit land. Most come from July to October." | jma-typhoon-normals; kantei-taifu | 平年値 (1991-2020): 発生数 25.1, 接近数 11.7, 上陸数 3.0; 「７月から１０月にかけては日本に接近・上陸する台風が多くなり」 | match | no claim | (No change. JMA average 1991-2020.) |
| A30 | index.html:827 | "Store water and food for 3 days or more" | kantei-sonae | 「最低3日分の水・食料の備蓄」; 1 week for large disasters | match | no claim | Store water and food for at least 3 days. One week is better |
| A33 | typhoon.ts:15-19 (wind bands) | 34-47, 48-63, 64-84, 85-104, 105+ knots | jma-typhoon-terms; jma-typhoon-strength; jma-multilingual rows 197-199 | TS 「17m/s（34ノット）以上25m/s（48ノット）未満」, STS 「25m/s（48ノット）以上33m/s（64ノット）未満」, TY 「33m/s（64ノット）以上」; 強い 64-85 kt未満, 非常に強い 85-105 kt未満, 猛烈な 105 kt以上; JMA dictionary: 非常に強い台風 "Very Strong Typhoon (TY)", 猛烈な台風 "Violent Typhoon (TY)" | match | changed with A34 (typhoon-level-1 to typhoon-level-5) | (Numbers and names unchanged.) |
| A34 | typhoon.ts:15-19 (descriptions) | "Light damage. Some trains stop." / "Medium damage. Flooding can happen." / "Serious damage. Evacuation is likely." / "Severe damage. Large areas lose power." / "Very severe damage. Stay inside a building..." | jma-wind-scale (風の強さと吹き方) | 強い風 (15 to 20 m/s), people: 「風に向かって歩けなくなり、転倒する人も出る」; 非常に強い風 (20 to 30 m/s), people: 「何かにつかまっていないと立っていられない。飛来物によって負傷するおそれがある。」; 猛烈な風 (30 m/s or more), people: 「屋外での行動は極めて危険。」, outdoors and trees: 「多くの樹木が倒れる。電柱や街灯で倒れるものがある。ブロック壁で倒壊するものがある。」, moving vehicles: 「走行中のトラックが横転する。」; buildings, 40 m/s or more: 「住家で倒壊するものがある。」 / No source links the JMA classes to the old damage words. A class is the maximum wind near the centre. Tropical Storm starts at 17 m/s, so "cannot stand" is true only at the top of that class. | not found | changed (typhoon-level-1 to typhoon-level-5) | TS: Near the center, people cannot walk into the wind. Some people fall. / STS: Near the center, people cannot stand without holding on. Flying objects can hurt people. / TY: Near the center, it is extremely dangerous to be outside. Many trees fall. / Very Strong and Violent: Near the center, moving trucks can turn over. Some houses can collapse. (Method: each class gets the effect of the wind table band that holds its lowest wind. See Limits 2.) |

### Earthquake and tsunami facts in the drill and the alert cards

| Row | File:line | Old claim (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status (claim ID) | Final text (English) |
|---|---|---|---|---|---|---|---|
| A35 | drill.ts:30 | "Falling objects and broken glass injure more people than collapsing buildings." | tfd-furniture | Same quote as A12. No source compares this with collapsing buildings. | not found | changed (drill-step-1) | In recent earthquakes, furniture that fell or moved hurt 30% to 50% of injured people. |
| A36 | drill.ts:79 | "A tsunami can arrive in minutes." | kantei-tsunami; jma-tsunami-info | 「震源が陸地に近いと津波警報・注意報が津波の襲来に間に合わないことがあります。」 | match | changed with A38 (drill-step-4) | (No change to this sentence.) |
| A37 | drill.ts:95 | "An aftershock can be almost as strong as the main earthquake." | jma-aftershock-ja | 「最初の大地震と同程度の地震への注意の呼びかけを１週間程度行うことが基本となります。」; 「まれに規模の大きな地震が発生することがあること」 / JMA calls for caution for about 1 week. It does not say that the second earthquake "often" comes within 1 week. | match (text change) | pending (drill-step-5): Task 6 still owns the doorway and inside-wall lines | After a big earthquake, another earthquake of the same size can come. JMA asks people to stay alert for about 1 week. |
| A38 | drill.ts:75, drill.ts:79 | "...or to an upper floor (3rd floor or higher)"; "Go at least 3 floors up" | kantei-tsunami; jma-tsunami-info; cao-tsunami-building-advice | 「いち早く海岸から離れ、可能な限り高い場所へ避難してください」; 「近くの高台や津波避難タワー、津波避難ビルなどに向かってください」; 「局所的に予想より高くなる場合があります。ここなら安心と思わず、より高い場所を目指して」; 2005 guideline (3 storeys for 2 m inundation): 「ガイドラインは廃止するものとします」 (H29.7.5) / Go as high as you can. The old 3-storey rule was abolished. | differs | changed (drill-step-4) | Option: Go at once to high ground or a tsunami evacuation building. Explanation: Go to high ground IMMEDIATELY. A tsunami can arrive in minutes. Go as high as you can. A tsunami can be higher than the forecast. NEVER go toward the water or into a basement. |
| A39 | index.html:766 | EEW "comes a few seconds before the shaking. Near the epicenter, it can come after the shaking starts." | jma-eew-limits | 「数秒から長くても数十秒程度と極めて短く…震源に近いところでは速報が間に合いません。」 | differs (range) | no claim | An earthquake early warning. It comes a few seconds to a few tens of seconds before strong shaking. Near the epicenter, it can come too late. Drop and cover IMMEDIATELY. |
| A40 | index.html:772 | Tsunami: "3 levels" | jma-tsunami-info | 大津波警報, 津波警報, 津波注意報. 津波予報 is separate, not a fourth level. | match (count) | no claim | (No change. Task 6 checks the level names.) |
| A41 | index.html:778 | Evacuation: "There are 5 levels." | kantei-keihou | 「5段階の『警戒レベル』」 | match (count) | no claim | (No change. Task 6 checks the level wording.) |

### Apps and page date

| Row | File:line | Old claim (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status (claim ID) | Final text (English) |
|---|---|---|---|---|---|---|---|
| A31 | index.html:788 | "NHK World: News and alerts in 19 languages." | nhk-world-app | "19 languages available" for content. Notifications: "Earthquake, Tsunami and Weather Emergency Warning notification" in 11 languages (English, Chinese, French, Hindi, Indonesian, Korean, Portuguese, Russian, Spanish, Thai, Vietnamese). | differs (partial) | no claim | NHK World: News in 19 languages. Earthquake, tsunami and weather emergency warnings in 11 languages, including Indonesian |
| A32 | index.html:1028-1030 | "Last updated March 2026... We check the content against the latest official guidelines." | jma-warning-2026-press; bda-launch; cao-evac-guideline-r8 | 「新たな防災気象情報の運用開始日について、令和８年５月29日（金）としますので、お知らせします。」 / JMA changed its warning names on 2026-05-29. 防災庁 started on 2026-11-02. The evacuation guideline was revised in 令和8年3月. "March 2026" is older than these changes. | differs | no claim | The date is now the build date (`__BUILD_DATE__`, set by `define` in `vite.config.ts`), shown in English, Japanese and Indonesian. "We check the content against the latest official guidelines" is removed until Task 6 updates the alert names. Text: "<build date>. We update this guide regularly." |

## Limits

1. The two research passes are the evidence. In review fix round 1, the JMA wind table PDF (A34) and the JMA tsunami FAQ (A10) were read again to confirm the bands and the "largest recorded" sentence. No other fact was added.
2. A34 (typhoon descriptions): each class gets the effect of the JMA wind table band that holds its lowest wind: Tropical Storm (from 17 m/s) 強い風, Severe Tropical Storm (from 25 m/s) 非常に強い風, Typhoon (from 33 m/s) 猛烈な風. The table's top band is 40 m/s or more. Very Strong (from 44 m/s) and Violent (from 54 m/s) are both above it, so they share one text.
3. A16 and A25: the audit wording was shortened to fit the 110-character tip limit. A11 uses a shorter form of the source sentence 「第２波、第３波がより大きくなることが多くある」. The meaning stays inside the quoted source.

## Sources

| ID | Publisher | Title (section) | URL | Checked |
|---|---|---|---|---|
| fdma-hanshin-final | 総務省消防庁 (FDMA) | 阪神・淡路大震災について（確定報）, 平成18年5月19日 | https://www.fdma.go.jp/disaster/info/assets/post1.pdf | 2026-11-21 |
| kobe-city-damage | 神戸市 (Kobe City) | 阪神・淡路大震災被害の状況 | https://www.city.kobe.lg.jp/a21572/bosai/shobo/hanshinawaji/higai2.html | 2026-11-21 |
| cao-kyokun-1-1-2 | 内閣府（防災担当） | 阪神・淡路大震災教訓情報資料集【02】人的被害 | https://www.bousai.go.jp/kyoiku/kyokun/hanshin_awaji/data/detail/1-1-2.html | 2026-11-21 |
| cao-kyokun-1-11-4 | 内閣府（防災担当） | 阪神・淡路大震災教訓情報資料集【04】治安・金融維持対策 | https://www.bousai.go.jp/kyoiku/kyokun/hanshin_awaji/data/detail/1-11-4.html | 2026-11-21 |
| cao-kyokun-1-6-1 | 内閣府（防災担当） | 阪神・淡路大震災教訓情報資料集【01】道路交通 | https://www.bousai.go.jp/kyoiku/kyokun/hanshin_awaji/data/detail/1-6-1.html | 2026-11-21 |
| cao-kyokun-2-5-6 | 内閣府（防災担当） | 阪神・淡路大震災教訓情報資料集【06】道路交通規制と道路復旧 | https://www.bousai.go.jp/kyoiku/kyokun/hanshin_awaji/download/pdf/2-5-6.pdf | 2026-11-21 |
| cao-kyokun-1-9-2 | 内閣府（防災担当） | 阪神・淡路大震災教訓情報資料集【02】電力事業者の緊急対応 | https://www.bousai.go.jp/kyoiku/kyokun/hanshin_awaji/data/detail/1-9-2.html | 2026-11-21 |
| mlit-whitepaper-2021 | 国土交通省 (MLIT) | 国土交通白書2021 第2節 ■2 阪神・淡路大震災 | https://www.mlit.go.jp/hakusyo/mlit/r02/hakusho/r03/html/n1122000.html | 2026-11-21 |
| cao-toilet-guideline | 内閣府（防災担当） | 避難所におけるトイレの確保・管理ガイドライン（令和6年12月改定） pp.2-3 | https://www.bousai.go.jp/taisaku/hinanjo/pdf/2412hinanjo_toilet_guideline.pdf | 2026-11-21 |
| jma-tsunami-kaizen-2012 | 気象庁 (JMA) | 東北地方太平洋沖地震による津波被害を踏まえた津波警報の改善（平成24年3月） p.5-6, p.24 表4 | https://www.jma.go.jp/jma/kishou/shingikai/jishin/tsunami-kaizen/20tsunami_keihou_kaizen_all.pdf | 2026-11-21 |
| jma-faq-tsunami | 気象庁 (JMA) | よくある質問集: 津波について | https://www.jma.go.jp/jma/kishou/know/faq/faq26.html | 2026-11-21 |
| jma-tsunami-info | 気象庁 (JMA) | 津波警報・注意報、津波情報、津波予報について | https://www.jma.go.jp/jma/kishou/know/jishin/joho/tsunamiinfo.html | 2026-11-21 |
| jma-eew-limits | 気象庁 (JMA) | 緊急地震速報の特性や限界、利用上の注意 | https://www.jma.go.jp/jma/kishou/know/jishin/eew/shikumi/tokusei.html | 2026-11-21 |
| jma-aftershock-ja | 気象庁 (JMA) | 大地震後の地震活動（余震等）について | https://www.jma.go.jp/jma/kishou/know/jishin/aftershocks/mitoshi_aftershock.html | 2026-11-21 |
| jma-typhoon-normals | 気象庁 (JMA) | 台風の平年値 (1991-2020) | https://www.data.jma.go.jp/yoho/typhoon/statistics/average/average.html | 2026-11-21 |
| jma-typhoon-strength | 気象庁 (JMA) | 台風の大きさと強さ | https://www.jma.go.jp/jma/kishou/know/typhoon/1-3.html | 2026-11-21 |
| jma-typhoon-terms | 気象庁 (JMA) | 予報用語: 台風に関する用語 | https://www.jma.go.jp/jma/kishou/know/yougo_hp/haichi2.html | 2026-11-21 |
| jma-wind-scale | 気象庁 (JMA) | 風の強さと吹き方 (PDF table) | https://www.jma.go.jp/jma/kishou/know/yougo_hp/kazehyo.pdf | 2026-11-21 |
| jma-multilingual | 気象庁 (JMA) | 多言語辞書データ (xlsx updated 2026-11-12), rows 197-199 | https://www.data.jma.go.jp/developer/multilingual.html | 2026-11-21 |
| jma-warning-2026-press | 気象庁 (JMA) | 報道発表: ５月29日（金）から、新たな防災気象情報の運用を開始します（令和8年4月14日） | https://www.jma.go.jp/jma/press/2604/14b/20260414_taikeiseiri.html | 2026-11-21 |
| cao-evac-guideline-r8 | 内閣府（防災担当） | 避難情報に関するガイドラインの改定（令和８年３月） | https://www.bousai.go.jp/oukyu/hinanjouhou/r3_hinanjouhou_guideline/ | 2026-11-21 |
| bda-launch | 防災庁 (Disaster Management Agency) | 防災庁が発足しました（看板掛け・発足式）令和8年11月2日 | https://www.bousai.go.jp/juyou/hossokushiki.html | 2026-11-21 |
| kantei-jishin | 首相官邸 | 防災の手引き: 地震への備えと身の守り方 | https://www.kantei.go.jp/jp/headline/bousai/jishin.html | 2026-11-21 |
| kantei-sonae | 首相官邸 | 防災の手引き: 災害への備え 事前にできること | https://www.kantei.go.jp/jp/headline/bousai/sonae.html | 2026-11-21 |
| kantei-tsunami | 首相官邸 | 防災の手引き: 津波 | https://www.kantei.go.jp/jp/headline/bousai/tsunami.html | 2026-11-21 |
| kantei-taifu | 首相官邸 | 防災の手引き: 大雨・台風 | https://www.kantei.go.jp/jp/headline/bousai/taifu_ooame.html | 2026-11-21 |
| kantei-keihou | 首相官邸 | 防災の手引き: 防災気象情報と警戒レベル | https://www.kantei.go.jp/jp/headline/bousai/keihou.html | 2026-11-21 |
| kantei-hinan | 首相官邸 | 防災の手引き: 避難のタイミングと避難場所 | https://www.kantei.go.jp/jp/headline/bousai/hinan.html | 2026-11-21 |
| gov-online-bousai-8072 | 内閣府政府広報室 | 政府広報オンライン: 災害時に命を守る一人ひとりの防災対策 (§2, §5) | https://www.gov-online.go.jp/article/201108/entry-8072.html | 2026-11-21 |
| cao-tsunami-building-advice | 内閣府（防災担当） | 津波避難ビル等に係るガイドライン廃止の技術的助言（平成29年7月5日） | https://www.bousai.go.jp/jishin/tsunami/hinan/pdf/sanko_6.pdf | 2026-11-21 |
| tfd-quake-10-points | 東京消防庁 (TFD) | 地震 その時10のポイント (points 3, 9) | https://www.tfd.metro.tokyo.lg.jp/lfe/bou_topic/jisin/point10.html | 2026-11-21 |
| tfd-furniture | 東京消防庁 (TFD) | 地震から命を守る家具転倒対策 | https://www.tfd.metro.tokyo.lg.jp/lfe/bou_topic/kaguten/index.html | 2026-11-21 |
| osaka-pref-bag | 大阪府 (Osaka Prefecture) | 備蓄品や非常持ち出し品などの準備 | https://www.pref.osaka.lg.jp/o020080/kikikanri/bousaiportal_hp/hizyoumotidasihin.html | 2026-11-21 |
| mext-school-safety-r6 | 文部科学省 (MEXT) | 令和6年度 学校安全の推進に関する計画に係る取組状況調査 報告書 | https://www.mext.go.jp/content/20250331-mxt_kyousei02-000032240.pdf | 2026-11-21 |
| nhk-world-app | NHK WORLD-JAPAN (primary source for its own app) | Download app | https://www3.nhk.or.jp/nhkworld/en/app/ | 2026-11-21 |
