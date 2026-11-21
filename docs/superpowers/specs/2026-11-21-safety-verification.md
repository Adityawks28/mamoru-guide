# Safety verification of the actions and the alert names

- Date: 2026-11-21
- Scope: every safety action (what to do) in `src/earthquake-now.ts`, `src/drill.ts`, the typhoon and earthquake tips in `src/character/tips.ts`, the alert cards and the typhoon panels in `index.html`, and the alert names in `index.html`, `src/quiz.ts` and `src/data.ts`. Facts and numbers about past disasters are out of scope; the history verification (Task 5) checks them. First-aid steps are out of scope; the medical verification (Task 4) checks them.
- Why it matters: people can follow these actions during a real earthquake, tsunami or typhoon. An action stays only when an official source gives it.
- Evidence: two independent AI research passes on 2026-11-21. The first pass compared each action with official sources and quoted them. The second pass (the audit) downloaded the sources again, checked the quotes, and corrected some rows. When the two passes disagreed, the audit decided. For this change, the key quotes were checked a third time from fresh downloads (Kantei 警戒レベル page, JMA multilingual dictionary, JMA Kumagaya, TFD, METI, Nagano Prefecture, MLIT, TEPCO, JMA Nagasaki, JMA 2026 pages).
- Source rule: Lines that no official source certifies are removed. Japanese official sources come first (Ruling R15). Two rows use a utility or a carrier, because each is the primary source for its own service: TEPCO for fallen power lines (B42) and NTT docomo for the phone alarm (B46).
- Line numbers are for this commit (after the change).

## Key

- Verdict: the result after the audit. `match` = the source gives the action. `differs` = the source gives a different action or scope. `not found` = no checked official source gives it.
- Status: the value in `CLAIMS` (`src/data/sources.ts`). `verified` = the action was already right. `changed` = we corrected the text. "no claim" = `index.html` text and some tips have no claim ID; this table is their record. "kept" = no claim, text not changed.
- Source IDs are the keys in `SOURCES` (`src/data/sources.ts`). The Sources section at the end gives the publisher, title and URL of each.

## Results

| Outcome | Rows |
|---|---|
| Action already right (no text change by this task) | 26 |
| Corrected by this task | 23 (B1, B2, B3, B6, B7, B14, B17, B19, B20, B23, B25, B27, B28, B30, B39, B41, B42, B46, B47, B49, B50, B51, B52) |
| Removed, because no official source certifies the line | 3 (B38, B43, B44) |
| Total | 52 |

Alert names (Part C): 9 rows. Changed 6 (C2, C3, C4, C5, C6, C8), new line 1 (C7), unchanged 2 (C1, C9).

Claim statuses set by this change: verified 3 (`eqnow-4`, `typhoon-prep-4`, `typhoon-prep-5`), changed 14 (`typhoon-prep-1`, `eqnow-1`, `eqnow-2`, `eqnow-3`, `eqnow-6`, `eqnow-7`, `drill-step-2`, `drill-step-5`, `drill-step-6`, `typhoon-prep-2`, `typhoon-prep-3`, and the new `tip-shoes-glass`, `tip-routes`, `tip-window-film`), removed 0. No claim is `pending` after this change. `drill-step-3` (head wound) stays `needs-medical-review`; it is a first-aid item.

## Actions that were removed or replaced

| Old text | Why |
|---|---|
| "Get on your hands and knees" (earthquake-now step 1) | US ShakeOut wording. Japanese sources say 「まず低く、頭を守り、動かない！」 (JMA Kumagaya). |
| "If there is no table, crouch next to an inside wall" (earthquake-now step 2) | No Japanese source names an inside wall. It also contradicted the aftershock drill, which said "Inside walls give no special protection". Both now use the TFD rule: a place where nothing can fall, tip over or move. |
| "If the table moves, move with it" (earthquake-now step 3) | Not in any Japanese source. JMA Kumagaya says the opposite: hold the table legs so that the table does not move (「机が動かないように机の足をしっかりにぎる」). |
| "The doorway idea is out of date. Inside walls give no special protection." (aftershock drill) | No Japanese source discusses doorways or inside walls. Replaced by the TFD rule. "Stand in the doorway" stays as a wrong answer option. |
| "Tape an X on the windows" (two tips) | No source gives an X shape. JMA Fukuoka says film or tape, and close the curtains. |
| "Typhoon: stay home if you can" | Staying home (屋内安全確保) is only for homes that meet 3 hazard-map conditions. In a danger area, leave early. |
| "Run to high ground immediately" for all 3 tsunami levels | Wrong for a Tsunami Advisory. JMA: get out of the water and leave the coast. |
| "Level 4: evacuate NOW" and "Level 4 means EVERYONE must evacuate now" | Level 4 is for everyone **in a danger area** (「危険な場所から全員避難」). |
| "Evacuation Order" | The official English is "Evacuation Instruction". |
| "Your phone makes a loud alarm sound, even in silent mode" | It depends on the phone and its settings (NTT docomo). |

## Table, Part B: safety actions

### Earthquake: what to do now (`src/earthquake-now.ts`)

| Row | File:line | Action before (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status (claim ID) | Final text (English) |
|---|---|---|---|---|---|---|---|
| B1 | earthquake-now.ts:19-24 | DROP to the ground. "Get on your hands and knees. Then the shaking cannot knock you down." | jma-kumagaya-edu (防災教育教材 Ver.5); kantei-jishin | 「まず低く、頭を守り、動かない！」 / Get low, protect your head, do not move. "Hands and knees" is not in Japanese sources. | differs | changed (eqnow-1) | DROP to the ground. Get down low. Protect your head. Do not move. |
| B2 | earthquake-now.ts:28-33 | Take COVER under a strong table. "If there is no table, crouch next to an inside wall and cover your head." | kantei-jishin 家庭で屋内にいるとき; tfd-quake-10-points point 1 | 「頭を保護しながら大きな家具から離れ、丈夫な机の下などに隠れる」; 「丈夫なテーブルの下や、物が『落ちてこない』『倒れてこない』『移動してこない』空間に身を寄せ」 / Get under a strong table, or into a space where nothing can fall, tip over or move. No source names an inside wall. | differs | changed (eqnow-2) | Take COVER under a strong table. Protect your head and neck. If there is no table, go where nothing can fall, tip over or move. |
| B3 | earthquake-now.ts:37-42 | HOLD ON until the shaking stops. "Stay under cover. If the table moves, move with it." | tfd-quake-10-points point 1; jma-kumagaya-edu | 「揺れがおさまるまで様子を見る」; 「机の下にもぐる。机が動かないように机の足をしっかりにぎる。」 / Stay until the shaking stops. Hold the table legs firmly so that the table does not move. | differs | changed (eqnow-3) | HOLD ON until the shaking stops. Stay under the table until the shaking stops. Hold the table legs firmly. |
| B4 | earthquake-now.ts:46-51 | When the shaking stops: OPEN THE DOOR. The door frame can bend and lock the door. | kantei-jishin; tfd-quake-10-points point 4; tfd-mansion-quake | 「扉を開けて避難路を確保する」; 「揺れがおさまった時に、避難ができるよう出口を確保する。」; 「ドアがゆがんだり…閉じ込められた」 / Open the door to keep an exit. A bent door can trap people. | match | verified (eqnow-4) | (No change.) When the shaking stops: OPEN THE DOOR. After an earthquake, the door frame can bend and lock the door. Open it now, while you can. |
| B5 | earthquake-now.ts:55-60 | Switch off the BREAKER and the gas before you leave. | tfd-quake-10-points point 9 | 「ブレーカーを切り、ガスの元栓を締めてから避難する。」 / Switch off the breaker and close the gas valve before you leave. | match | changed (eqnow-5) by Task 5 for the detail; action kept | (No change by this task.) Switch off the BREAKER and the gas before you leave. |
| B6 | earthquake-now.ts:64-69 | Put on SHOES before you move. "There is broken glass everywhere." | gov-online-bousai-8072 §2; tfd-quake-10-points point 3 | 「スリッパは割れたガラスなどの破片で足をけがをするのを防ぎます。」 / Slippers protect your feet from broken glass. | match (wording) | changed (eqnow-6) | Put on SHOES before you move. There can be broken glass on the floor. Do not walk barefoot. |
| B7 | earthquake-now.ts:73-78 | Check for a TSUNAMI warning. "If you are near the coast, go to high ground IMMEDIATELY. Do not wait for sirens." | kantei-tsunami; jma-tsunami-info | 「強い揺れや弱くても長い揺れを感じたときは、すぐに避難を開始しましょう。」 / Strong shaking, or weak but long shaking, means start to evacuate at once. | match | changed (eqnow-7) | Check for a TSUNAMI warning. If you are near the coast and feel strong or long shaking, go to high ground now. Do not wait for a warning. |

### Earthquake tips (`src/character/tips.ts`)

| Row | File:line | Action before (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status (claim ID) | Final text (English) |
|---|---|---|---|---|---|---|---|
| B8 | tips.ts:6 | Drop, Cover, Hold On. Get under a strong table quickly. | jma-kumagaya-edu; kantei-jishin | As B1 and B2. | match | kept (no claim) | (No change.) |
| B9 | tips.ts:7 | Stay away from windows. Broken glass can cut you badly. | gov-online-bousai-8072; kantei-jishin | 「窓ガラス…家の中には凶器になるものがたくさんあります」 / Window glass is one of many dangerous things at home. | match | kept (no claim) | (No change.) |
| B10 | tips.ts:8 | Do not run outside during the shaking. Falling roof tiles can kill. | tfd-quake-10-points point 3 | 「瓦、窓ガラス、看板などが落ちてくるので外に飛び出さない。」 / Roof tiles, glass and signs fall, so do not run outside. | match | kept (no claim) | (No change.) |
| B11 | tips.ts:9 | When the shaking stops, open the door. | as B4 | As B4. | match | kept (no claim) | (No change.) |
| B12 | tips.ts:12 | If you are outside, crouch in an open area. Stay away from walls and vending machines. | kantei-jishin 屋外にいるとき | 「ブロック塀の倒壊や自動販売機の転倒などに注意し、これらのそばから離れる」 / Stay away from block walls and vending machines. | match | kept (no claim) | (No change.) |
| B13 | tips.ts:13 | Switch off the breaker when you leave. | tfd-quake-10-points point 9 | As B5. | match | changed (tip-breaker-fire) by Task 5 for the detail; action kept | (No change by this task.) |
| B14 | tips.ts:14 | Wear shoes. "After a big earthquake, there is broken glass everywhere." | gov-online-bousai-8072; tfd-quake-10-points point 3 | As B6. | match (wording) | changed (tip-shoes-glass, new) | Wear shoes. After a big earthquake, there can be broken glass on the floor. |
| B15 | tips.ts:15 | A tsunami can come after the earthquake. Go to high ground. Do not wait for sirens. | kantei-tsunami; jma-tsunami-info | As B7. | match | kept (no claim) | (No change.) |
| B16 | tips.ts:31 | Walk. Do not drive. | kantei-jishin 地震で起こる身近な影響 | 「歩行者や自動車が集中したりして、大渋滞で避難が困難になることが予想されます。」 / Heavy traffic makes evacuation hard. | match | changed (tip-kobe-traffic) by Task 5 for the number; action kept | (No change by this task.) |
| B17 | tips.ts:32 | "Use the route you practiced. On a new route, you can get lost." | kantei-jishin | 「避難経路等を複数検討しておきましょう。」 / Plan more than one evacuation route. | match | changed (tip-routes, new) | Use a route you practiced. Know more than one route. |

### Typhoon tips (`src/character/tips.ts`)

| Row | File:line | Action before (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status (claim ID) | Final text (English) |
|---|---|---|---|---|---|---|---|
| B18 | tips.ts:51 | Tropical Storm: secure items on the balcony. Charge your devices. Check the forecast. | jma-fukuoka-typhoon 台風への備え | 「風で飛ばされそうな物は飛ばないように固定したり、屋内へ移しましょう。」; 「気象情報をよく把握する」 / Tie down or bring in things that the wind can blow away. Follow the weather information. "Charge your devices": the CAO checklist lists 「予備電池・携帯充電器」 and a CAO lesson page says 「大規模災害時は、バッテリーが命」 (cao-checklist-sonae, cao-ichinitimae-battery). No page says "charge before a typhoon" in those words. | match (partial) | changed (typhoon-prep-1) | Tropical Storm: secure balcony items. Keep spare batteries and a phone charger. Check the forecast. |
| B19 | tips.ts:52 | Severe Tropical Storm: "tape an X on the windows. Fill the bathtub. Store more water." | jma-fukuoka-typhoon; gov-online-bousai-8072 | 「必要に応じて窓ガラスに飛散防止フィルムやテープなどを張ったり、カーテンやブラインドを下ろすなど」; 「断水に備えて飲料水を確保したり、浴槽に水を張って生活用水を確保するなど」 / Film or tape on the windows, close the curtains, store drinking water, fill the bathtub. No source gives an X shape. | differs | changed (typhoon-prep-2) | Severe Tropical Storm: put film or tape on the windows. Close the curtains. Fill the bathtub. Store water. |
| B20 | tips.ts:53 | Typhoon: "stay home if you can. Evacuate before the wind is at its strongest." | kantei-hinan 屋内安全確保; kantei-taifu | 「洪水や高潮に関しては、ハザードマップ等で次の３つの条件を確認し、自宅が安全だと判断できる場合は、自宅に留まること（屋内安全確保）も考えてみましょう。」; 「天候が荒れてからでは移動も大変になります」 / Stay home only if the hazard map shows that the home is safe. Moving is hard after the weather turns bad. | differs | changed (typhoon-prep-3) | Typhoon: check the hazard map. If you live in a danger area, leave before the wind and rain get strong. |
| B21 | tips.ts:54 | Very Strong Typhoon: the power can be off for days. Prepare cash, food, and batteries. | kantei-jishin; gov-online-bousai-8072 | 「停電、都市ガスの停止、水道の断水が起こり、復旧まで時間がかかる場合があります。」; supplies list 「現金」「予備電池」 / Power cuts can take time to fix. Keep cash and spare batteries. | match | verified (typhoon-prep-4) | (No change.) |
| B22 | tips.ts:55 | Violent Typhoon: stay indoors. Do not go out, not even for a short time. | jma-fukuoka-typhoon | 「台風接近中は不要な外出は控え、危険な場所へは近づかないようにしましょう。」 / Do not go out without need while the typhoon is near. | match | verified (typhoon-prep-5) | (No change.) |
| B23 | tips.ts:72 | "In a typhoon, tape an X on your windows. This stops glass from flying into the room." | jma-fukuoka-typhoon; gov-online-bousai-8072 | As B19; also 「カーテンを閉めておくことでも室内への飛散防止に効果があります。」 / Closed curtains also help stop glass from flying in. | differs | changed (tip-window-film, new) | Before a typhoon, put film or tape on the windows. Close the curtains. This helps stop glass from flying in. |

### Drill (`src/drill.ts`)

| Row | File:line | Action before (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status (claim ID) | Final text (English) |
|---|---|---|---|---|---|---|---|
| B24 | drill.ts:30 | Classroom: Drop, Cover, Hold On under the desk. Running is dangerous. | kantei-jishin; tfd-quake-10-points | As B1 to B3 and B10. | match | changed (drill-step-1) by Task 5 for the injury fact; action kept | (No change by this task.) |
| B25 | drill.ts:47 | Gas smell: "Open the windows to let air in. Leave by the stairs. After an earthquake, NEVER use elevators, electric switches, or open flames. A gas leak can cause an explosion." | meti-gas-smell; tfd-mansion-quake | 「ガスの臭いがしたら、火気を使用したり換気扇や電気のスイッチには絶対に触らないでください。窓を開けて換気をし、器具栓・ガス栓とガスメーターの元栓を閉め、すぐにガス事業者へ連絡してください。」; 「震度４程度以上の地震が発生した場合、エレベーターが停止し、閉じ込められる。」 / No fire, no switches; open the windows; close the gas valves; call the gas company. At about shindo 4 or more, an elevator can stop and trap people. | differs (missing steps) | changed (drill-step-2) | Open the windows. Do not use fire or electric switches. Close the gas valve. Use the stairs: an elevator can stop and trap you. Call the gas company. |
| B26 | drill.ts:79 | Tsunami: move inland to high ground at once; never go toward the water or into a basement. | kantei-tsunami; jma-tsunami-info | 「いち早く海岸から離れ、可能な限り高い場所へ避難してください。」 / Leave the coast fast and go as high as you can. | match | changed (drill-step-4) by Task 5 ("3rd floor" removed); action kept | (No change by this task.) |
| B27 | drill.ts:95 | Aftershock: "Always do the same thing: Drop, Cover, Hold On. The doorway idea is out of date. Inside walls give no special protection." | tfd-quake-10-points point 1; jma-kumagaya-edu; jma-aftershock-ja | As B2: 「物が『落ちてこない』『倒れてこない』『移動してこない』空間に身を寄せ」. No Japanese source discusses doorways or inside walls. | not found (doorway, inside walls) | changed (drill-step-5) | (Task 5 fact kept.) Do the same as in the first earthquake: drop, cover and hold on. Go where nothing can fall, tip over or move. |
| B28 | drill.ts:112 | Go back only when the authorities say it is safe. Check NHK or city announcements. | kantei-tsunami | 「津波警報・注意報が解除され安全が確認されるまでは決して被災地域には立ち入らないでください。」 / Do not enter the area until the warning ends and safety is confirmed. "A building can have damage that you cannot see" and "check NHK or city announcements" have no official quote (removed). | match | changed (drill-step-6) | Go back only when the authorities say it is safe. Do not go back while a warning is in effect. |

### Typhoon panels (`index.html`, no claim IDs)

| Row | File:line | Action before (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|---|
| B29 | index.html:833 | Store water and food for 3 days or more. | kantei-sonae | 「最低3日分の水・食料の備蓄」 / At least 3 days. | match | no claim; changed by Task 5 | (No change by this task.) Store water and food for at least 3 days. One week is better |
| B30 | index.html:834 | Charge all devices and batteries. | cao-checklist-sonae; cao-ichinitimae-battery | Checklist: 「予備電池・携帯充電器」. Lesson page: 「大規模災害時は、バッテリーが命であると思い知らされました。」 / Keep spare batteries and a phone charger; battery power is vital in a large disaster. No page says "charge before a typhoon" in those words. | differs (partial) | changed (typhoon-prep-1 for the tip; no claim for the panel) | Keep spare batteries and a phone charger ready. (Tip and typhoon BEFORE panel, en/ja/id.) |
| B31 | index.html:835 | Bring in or tie down outdoor items (bikes, laundry). | jma-fukuoka-typhoon | 「風で飛ばされそうな物は飛ばないように固定したり、屋内へ移しましょう。」 | match | kept | (No change.) |
| B32 | index.html:836 | Close all storm shutters (雨戸). | jma-fukuoka-typhoon | 「窓や雨戸を閉め、しっかりと鍵をかけしましょう。」 | match | kept | (No change.) |
| B33 | index.html:837 | Fill the bathtub with water to flush the toilet. | jma-fukuoka-typhoon | 「浴槽に水を張って生活用水を確保」 | match | kept | (No change.) |
| B34 | index.html:838 | Know your evacuation route. | jma-fukuoka-typhoon | 「避難場所として指定されている場所への避難経路を確認しましょう。」 | match | kept | (No change.) |
| B35 | index.html:848 | Stay indoors, away from windows. | jma-fukuoka-typhoon; gov-online-bousai-8072 | As B22 and B9. | match | kept | (No change.) |
| B36 | index.html:849 | Never go outside "to check". | kantei-taifu | 「雨で増水した川や田んぼを見に行って流されてしまったり」 / People who go to look at rivers or rice fields are swept away. | match | kept | (No change.) |
| B37 | index.html:850 | Stay away from rivers, canals, and underpasses. | kantei-taifu | 「道路のアンダーパス等の地下空間の水没」 / Underpasses fill with water. | match | kept | (No change.) |
| B38 | index.html:851 | Check NHK / Yahoo! 防災速報. | none | Official pages point to JMA キキクル, not to these apps. Low risk. | not found | removed (no claim) | (Removed from index.html in en/ja/id.) |
| B39 | index.html:852 | "If there is flooding: go to an upper floor" | kantei-hinan; kantei-taifu | 「立退き避難が危険な場合は、自宅の上の階や崖から離れた部屋など、少しでも安全な場所へ移動し」; 「崖から離れた２階の部屋で待機」 / Upstairs, away from slopes, is the last option when leaving is dangerous. | differs | no claim; changed | If it is too late to leave, go to an upper floor, away from slopes |
| B40 | index.html:853 | Be careful of the "eye": calm does not mean over. | jma-typhoon-wind | 「眼が通過した後は風向きが反対の強い風が吹き返します。」 / After the eye passes, strong wind comes back from the other side. | match | kept | (No change.) |
| B41 | index.html:863 | "Watch for landslides: the risk stays high" | nagano-sabo-after-rain; mlit-sabo-long-rain; kantei-dosha | 「雨が止んだ後でも土砂災害発生の可能性がある」; 「雨の強さや今後の雨の降り方（弱くなる、雨が止む）に関わらず」; signs 「がけや地面にひび割れができる」「小石がバラバラと落ちてくる」「井戸や川の水が濁る」 / Landslides can happen after the rain stops. Signs: cracks, small falling stones, muddy water. | differs | no claim; changed | Landslides can still happen after the rain stops. Watch for cracks, small falling stones or muddy water on slopes |
| B42 | index.html:864 | Stay away from flooded roads and fallen power lines. | kantei-taifu; tepco-typhoon | 「浸水した道路で側溝の境界が見えにくいために転落」; 「切れてたれ下がっている電線には、絶対に手を触れないでください。」 / Flooded roads hide ditches. Never touch a fallen power line. | match | no claim; changed (sentence added) | Stay away from flooded roads and fallen power lines. Do not touch a fallen power line |
| B43 | index.html:865 | Check if trains and buses run before you go out. | none | No source. Low risk. | not found | removed (no claim) | (Removed from index.html in en/ja/id.) |
| B44 | index.html:866 | Tell your landlord or university about damage. | none | No source. Low risk. | not found | removed (no claim) | (Removed from index.html in en/ja/id.) |
| B45 | index.html:867 | Take photos of the damage for insurance. | gov-online-damage-9034 | 「家の被害状況を写真に撮っておきましょう。…損害保険を請求する際などに、たいへん役に立ちます。」 | match | kept | (No change.) |

### Alert cards and quiz (`index.html`, `src/quiz.ts`, no claim IDs)

| Row | File:line | Action before (EN) | Source and section | Source says (JA quote / EN gist) | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|---|
| B46 | index.html:750 | "Your phone makes a loud alarm sound, even in silent mode." | docomo-areamail | 「マナーモード・公共（ドライブ）モード時での専用ブザー音…の鳴動は、携帯電話で設定できます。」; for phones without that setting 「マナーモード設定中はエリアメールの専用ブザー音、専用着信音は鳴りません。」 / In silent mode, the alarm depends on the phone and its settings. | differs | no claim; changed | Your phone can make a loud alarm, even in silent mode. This depends on your phone and its settings. Check them now. Do not panic. Here is what each alert means. |
| B47 | index.html:760 | J-Alert: "A national instant alert for missiles, large earthquakes, and tsunamis. Phones in the affected area get it. Some older phones cannot get it." | fdma-jalert | 「弾道ミサイル情報、緊急地震速報、大津波警報など、対処に時間的余裕のない事態に関する情報を携帯電話等に配信される緊急速報メール、市町村防災行政無線等により、国から住民まで瞬時に伝達するシステム」 / Urgent national information, such as missiles, Earthquake Early Warnings and Major Tsunami Warnings, sent at once to phones and town loudspeakers. | match | no claim; changed | J-Alert sends urgent national alerts, such as missiles, Earthquake Early Warnings and Major Tsunami Warnings, to phones and town loudspeakers. |
| B48 | index.html:766 | EEW: Drop and cover IMMEDIATELY. | kantei-jishin | 「地震の揺れを感じた場合、あるいは緊急地震速報を見聞きした場合は、あわてずにまずは身の安全を確保してください。」 | match | kept (timing text changed by Task 5) | (No change, except the Indonesian term "peringatan dini gempa bumi", see C2.) |
| B49 | index.html:772-774 | Tsunami: "Run to high ground immediately." (for all 3 levels) | jma-tsunami-info; jma-multilingual | Warning and Major Warning: 「ただちに高台や避難ビルなど安全な場所へ避難」 (JMA English: "Evacuate immediately to a safer place such as high ground or an evacuation building."). Advisory: 「海の中にいる人はただちに海から上がって、海岸から離れて」 (JMA English: "Get out of the water and leave coastal regions immediately."). | differs | no claim; changed | For a Tsunami Warning or a Major Tsunami Warning, go to high ground or an evacuation building now. For a Tsunami Advisory, get out of the water and leave the coast. |
| B50 | index.html:780-783; quiz.ts:101 | "Level 4: evacuate NOW. Level 5: a disaster is happening or is about to happen." Quiz: "Level 4 means EVERYONE must evacuate now." | kantei-keihou | 「『警戒レベル４避難指示』が出されたら、危険な場所から全員避難すること」; 「すでに災害が発生又は差し迫った状況ですので、直ちに命を守る行動をとってください。警戒レベル５は、安全な避難が難しい状況です。」; 「『警戒レベル５緊急安全確保』を待つことなく、『警戒レベル４避難指示』までに避難することが必要です。」 | differs (scope) | no claim; changed | Level 4, Evacuation Instruction (避難指示): everyone in a danger area must leave now. Level 5, Emergency Safety Measures (緊急安全確保): a disaster is happening or is about to happen. Act now to save your life. Leave by Level 4. Do not wait for Level 5. Quiz: At Level 4, everyone in a danger area must leave now. At Level 5, a disaster is happening or is about to happen. It may be too late to leave safely. |
| B51 | quiz.ts:96 (correct answer) | Level 4 quiz answer: "Go to a shelter immediately" / 「すぐに避難所へ行く」 / "Segera mengungsi ke tempat pengungsian" | kantei-keihou; kantei-hinan | 「『警戒レベル４避難指示』が出されたら、危険な場所から全員避難すること」; 「『避難』とは、『難』を『避』けることであり、学校や公民館といった指定緊急避難場所への移動だけが避難というわけではありません。」 / Level 4 means leave the danger area. A shelter is only one place to go. | differs | no claim; changed | Leave the danger area now (JA 「危ない場所から、すぐに避難する」, ID "Segera mengungsi dari daerah berbahaya"). The wrong options stay wrong: "Start preparing to leave" and "Only elderly people must evacuate" are Level 3 actions; "Wait until Level 5" is what Kantei says not to do. |
| B52 | quiz.ts:71 | Gas smell quiz: "Open the windows to let air in, then leave. Do not use flames, electric switches, or fans. They can set the gas on fire." | meti-gas-smell | 「窓を開けて換気をし、器具栓・ガス栓とガスメーターの元栓を閉め、すぐにガス事業者へ連絡してください。」 / Close the gas valves and call the gas company. Same steps as drill-step-2. | differs (missing steps) | no claim; changed | Open the windows to let air in, then leave. Do not use flames, electric switches, or fans. They can set the gas on fire. Close the gas valve. Call the gas company. |

## Table, Part C: alert names

Key dates:
- **2021-05-20:** the revised 災害対策基本法 came into force (令和3年法律第30号, 「同年5月10日公布、同年5月20日施行」, cao-kouhou-r03). 避難勧告 and 避難指示 became one: 避難指示 (CAO English leaflet: "Evacuation Recommendations will no longer be issued. Instead, Evacuation Instructions will be issued."). 緊急安全確保 replaced 災害発生情報 at Level 5.
- **2026-05-29:** JMA started the new weather information (press release 令和8年4月14日: 「５月29日（金）から、新たな防災気象情報の運用を開始します ～情報名称にレベルの数字をつけて発表します～」; 「新たな防災気象情報の運用開始日について、令和８年５月29日（金）としますので、お知らせします。」). The change covers only 河川氾濫, 大雨, 土砂災害 and 高潮. Tsunami and earthquake names did not change.
- The city evacuation names (高齢者等避難, 避難指示, 緊急安全確保) and their English did not change in 2026. The Cabinet Office guideline revision of 令和8年3月 only added the new JMA names.

| # | Where | App text before (EN / JA / ID) | Official JA today | Official EN today (source) | Effective date | Final app text (EN / JA / ID) |
|---|---|---|---|---|---|---|
| C1 | index.html:758-760 | J-Alert / 全国瞬時警報システム | 全国瞬時警報システム（Jアラート） (fdma-jalert) | J-Alert | unchanged | No change to the name. Card text: see B47. |
| C2 | index.html:764-766 | EEW / 緊急地震速報 / "Peringatan dini gempa" | 緊急地震速報 | Earthquake Early Warning (EEW); ID "peringatan dini gempa bumi" (jma-multilingual) | unchanged | EEW / 緊急地震速報 / "Peringatan dini gempa bumi" |
| C3 | index.html:770-774 | "Tsunami Warning" card. "3 levels: Advisory, Warning, and Major Warning" / 注意報、警報、大津波警報 / "Waspada, Peringatan, dan Peringatan Besar" | 津波注意報 / 津波警報 / 大津波警報 (jma-tsunami-info) | Tsunami Advisory / Tsunami Warning / Major Tsunami Warning; ID "pemberitahuan tsunami" / "peringatan bahaya tsunami (skala kecil)" / "peringatan bahaya tsunami skala besar" (jma-multilingual) | unchanged in 2026 | EN: "There are 3 levels: Tsunami Advisory, Tsunami Warning and Major Tsunami Warning." JA: 「3つのレベルがあります：津波注意報、津波警報、大津波警報。」 ID: "Ada 3 tingkat: pemberitahuan tsunami, peringatan bahaya tsunami, dan peringatan bahaya tsunami skala besar." Card title ID: "Peringatan Bahaya Tsunami". |
| C4 | index.html:778 (card title) | "Evacuation Order" / 避難指示 / "Perintah Evakuasi" | 警戒レベル４ 避難指示 (kantei-keihou) | Evacuation Instruction (jma-nagasaki-levels-en); "Evacuation Instructions" (cao-evac-leaflet-en) | 2021-05-20 | "Evacuation Instruction (Level 4)" / 避難指示（レベル4） / "Perintah Evakuasi (Tingkat 4)". Indonesian uses "Tingkat" for every level number in the alert card and the quiz. |
| C5 | index.html:780-781 | Only Level 4 and Level 5 named; Level 3 missing | 警戒レベル３ 高齢者等避難. 「警戒レベル１・２の情報は気象庁などから、警戒レベル３～５の情報は市町村から発表されます。」 (kantei-keihou) | Evacuation of the Elderly, Etc. (jma-nagasaki-levels-en) | 2021-05-20 | "There are 5 alert levels. Levels 1 and 2 come from JMA. Levels 3 to 5 come from your city." "Level 3, Evacuation of the Elderly, etc. (高齢者等避難): older people and people who need more time leave a danger area. Other people get ready to leave." |
| C6 | index.html:784; data.ts:25 | No JMA level names in the alert section. Vocabulary card: 大雨警報 "Heavy rain warning" | レベル５大雨特別警報, レベル４大雨危険警報, レベル３大雨警報, レベル２大雨注意報; the same pattern for 氾濫, 土砂災害, 高潮. 土砂災害警戒情報 became レベル４土砂災害危険警報. (jma-warning-2026, jma-warning-2026-outline) | "Level 5 Emergency Warning (Heavy Rain)", "Level 4 Urgent Warning (Heavy Rain)", "Level 3 Warning (Heavy Rain)", "Level 2 Advisory (Heavy Rain)"; Flood, Landslide, Storm Surge in the same pattern. 「危険警報の英語表記は "Urgent Warning" とします。」 (jma-warning-2026-english). ID: "Peringatan Darurat Hujan Lebat Tingkat 4" (jma-multilingual) | 2026-05-29 | Alert card: "From 29 May 2026, JMA warnings for heavy rain, floods, landslides and storm surges show the same level number. Example: Level 4 Urgent Warning (Heavy Rain), レベル４大雨危険警報." Vocabulary card: レベル４大雨危険警報 / "Level 4 Urgent Warning (Heavy Rain)" / "Peringatan Darurat Hujan Lebat Tingkat 4". Glossary: new term 危険警報 = "Urgent Warning" / "Peringatan Darurat". |
| C7 | index.html:783 (new line) | Not in the app | 警戒レベル５ 緊急安全確保; 「命の危険 直ちに安全確保」 (kantei-keihou) | Emergency Safety Measures (jma-nagasaki-levels-en) | 2021-05-20 | "Level 5, Emergency Safety Measures (緊急安全確保): a disaster is happening or is about to happen. Act now to save your life. Do not wait for Level 5." |
| C8 | quiz.ts:91 | "You get a Level 4 evacuation order." | as C4 | as C4 | 2021-05-20 | "You get a Level 4 Evacuation Instruction. What do you do?" ID: "perintah evakuasi Tingkat 4". Correct answer: see B51. |
| C9 | typhoon.ts:15-19 | Tropical Storm / Severe Tropical Storm / Typhoon / Very Strong Typhoon / Violent Typhoon | 強い / 非常に強い / 猛烈な (jma-typhoon-strength) | TS / STS / TY (jma-typhoon-terms); "Very Strong Typhoon (TY)", "Violent Typhoon (TY)" (jma-multilingual) | unchanged | No change. |

Glossary (`src/data/glossary.ts`): the source of 高齢者等避難 is now the JMA Nagasaki English sheet (jma-nagasaki-levels-en), because the JMA dictionary rows with this term are in the volcanic warning section. Two terms were added for the alert text. 津波注意報 = "Tsunami Advisory" / "pemberitahuan tsunami" (JMA dictionary). 危険警報 = "Urgent Warning" / "Peringatan Darurat" (JMA English names page; JMA dictionary).

## Limits

- Three lines had no official quote and are removed: "Check NHK / Yahoo! 防災速報", "Check if trains and buses run" and "Tell your landlord or university about damage". "Charge your devices" had only a partial source, so it now says what the checklist says: keep spare batteries and a phone charger (B18, B30). "A building can have damage that you cannot see" (drill-step-6) has no official quote and is removed: I checked the MLIT and Cabinet Office pages on 被災建築物応急危険度判定 and the 被害認定基準運用指針 (令和8年6月), and none says it in those words.
- The typhoon scene no longer draws strips of tape on the window, because no source supports taping an X. At the Typhoon level the character now walks to the shelter without the wind prop, because the tip says to leave before the wind gets strong.
- The JMA Fukuoka page (jma-fukuoka-typhoon) still uses the old term 避難勧告等. We use it only for the household steps.
- The JMA Nagasaki English sheet predates the 2026 JMA names, but the city-issued names on it did not change.

## Sources

| ID | Publisher | Title (section) | URL | Checked |
|---|---|---|---|---|
| jma-kumagaya-edu | 気象庁 熊谷地方気象台 | 防災教育教材 (Ver.5)「まず低く、頭を守り、動かない！」 | https://www.data.jma.go.jp/kumagaya/shosai/chishiki/1ststep.pdf | 2026-11-21 |
| kantei-jishin | 首相官邸 | 防災の手引き: 地震への備えと身の守り方 | https://www.kantei.go.jp/jp/headline/bousai/jishin.html | 2026-11-21 |
| kantei-sonae | 首相官邸 | 防災の手引き: 災害への備え 事前にできること | https://www.kantei.go.jp/jp/headline/bousai/sonae.html | 2026-11-21 |
| kantei-tsunami | 首相官邸 | 防災の手引き: 津波 | https://www.kantei.go.jp/jp/headline/bousai/tsunami.html | 2026-11-21 |
| kantei-taifu | 首相官邸 | 防災の手引き: 大雨・台風 | https://www.kantei.go.jp/jp/headline/bousai/taifu_ooame.html | 2026-11-21 |
| kantei-keihou | 首相官邸 | 防災の手引き: 防災気象情報と警戒レベル (最終更新 令和8年10月) | https://www.kantei.go.jp/jp/headline/bousai/keihou.html | 2026-11-21 |
| kantei-hinan | 首相官邸 | 防災の手引き: 避難のタイミングと避難場所 | https://www.kantei.go.jp/jp/headline/bousai/hinan.html | 2026-11-21 |
| kantei-dosha | 首相官邸 | 防災の手引き: 土砂災害 | https://www.kantei.go.jp/jp/headline/bousai/doshyasaigai.html | 2026-11-21 |
| tfd-quake-10-points | 東京消防庁 (TFD) | 地震 その時10のポイント | https://www.tfd.metro.tokyo.lg.jp/lfe/bou_topic/jisin/point10.html | 2026-11-21 |
| tfd-mansion-quake | 東京消防庁 (TFD) | マンションの地震対策 | https://www.tfd.metro.tokyo.lg.jp/lfe/bou_topic/mansion_jisin.html | 2026-11-21 |
| gov-online-bousai-8072 | 内閣府政府広報室 | 政府広報オンライン: 災害時に命を守る一人ひとりの防災対策 | https://www.gov-online.go.jp/article/201108/entry-8072.html | 2026-11-21 |
| gov-online-damage-9034 | 内閣府政府広報室 | 政府広報オンライン: 住まいが被害を受けたとき 最初にすること | https://www.gov-online.go.jp/article/202003/entry-9034.html | 2026-11-21 |
| meti-gas-smell | 経済産業省 (METI) | ガス臭いと感じた時の対応 | https://www.meti.go.jp/policy/safety_security/industrial_safety/sangyo/citygas/anzen_torikumi/file_jisyuhoan/study/fireaccident/gas_smell.html | 2026-11-21 |
| jma-tsunami-info | 気象庁 (JMA) | 津波警報・注意報、津波情報、津波予報について | https://www.jma.go.jp/jma/kishou/know/jishin/joho/tsunamiinfo.html | 2026-11-21 |
| jma-aftershock-ja | 気象庁 (JMA) | 大地震後の地震活動（余震等）について | https://www.jma.go.jp/jma/kishou/know/jishin/aftershocks/mitoshi_aftershock.html | 2026-11-21 |
| jma-fukuoka-typhoon | 気象庁 福岡管区気象台 | 気象災害に備える: 台風への備え | https://www.data.jma.go.jp/fukuoka/yoho/kisyousaigai_sonae_typhoon.html | 2026-11-21 |
| jma-typhoon-wind | 気象庁 (JMA) | 台風に伴う風の特性 | https://www.jma.go.jp/jma/kishou/know/typhoon/2-1.html | 2026-11-21 |
| jma-typhoon-strength | 気象庁 (JMA) | 台風の大きさと強さ | https://www.jma.go.jp/jma/kishou/know/typhoon/1-3.html | 2026-11-21 |
| jma-typhoon-terms | 気象庁 (JMA) | 予報用語: 台風に関する用語 | https://www.jma.go.jp/jma/kishou/know/yougo_hp/haichi2.html | 2026-11-21 |
| nagano-sabo-after-rain | 長野県 砂防課 | 雨が上がった後でも、土砂災害が発生することがあります | https://www.pref.nagano.lg.jp/sabo/manabu/ame-ato.html | 2026-11-21 |
| mlit-sabo-long-rain | 国土交通省 砂防部 (MLIT) | 土砂災害と降雨の特徴 (長時間の降雨) | https://www.mlit.go.jp/river/sabo/tyojikankouu.pdf | 2026-11-21 |
| tepco-typhoon | 東京電力ホールディングス (TEPCO) | 台風・降雪のときは？ | https://www.tepco.co.jp/disaster/taifu_kousetu.html | 2026-11-21 |
| docomo-areamail | NTT docomo | 緊急速報「エリアメール」ご注意事項 | https://www.docomo.ne.jp/service/areamail/notice/index.html | 2026-11-21 |
| fdma-jalert | 総務省消防庁 (FDMA) | 全国瞬時警報システム（Jアラート）の概要 | https://www.fdma.go.jp/about/organization/post-18.html | 2026-11-21 |
| cao-checklist-sonae | 内閣府 政策統括官（防災担当）監修, hosted by 首相官邸 | 災害の「備え」チェックリスト | https://www.kantei.go.jp/jp/content/000182715.pdf | 2026-11-21 |
| cao-ichinitimae-battery | 内閣府（防災担当） 一日前プロジェクト | ワンセグや災害優先携帯もバッテリーが命 | https://www.bousai.go.jp/kyoiku/keigen/ichinitimae/thh25002.html | 2026-11-21 |
| jma-multilingual | 気象庁 (JMA) | 多言語辞書データ (xlsx updated 2026-11-12) | https://www.data.jma.go.jp/developer/multilingual.html | 2026-11-21 |
| jma-nagasaki-levels-en | 長崎地方気象台 (JMA Nagasaki) | List of evacuation actions (English) | https://www.data.jma.go.jp/nagasaki-c/kikikuru/image/List%20of%20evacuation%20actions_EN.pdf | 2026-11-21 |
| cao-evac-leaflet-en | 内閣府（防災担当） | Evacuation information leaflet, English, back side (2021) | https://www.bousai.go.jp/oukyu/hinanjouhou/r3_hinanjouhou_guideline/pdf/EN_ura.pdf | 2026-11-21 |
| cao-evac-guideline-r8 | 内閣府（防災担当） | 避難情報に関するガイドラインの改定（令和８年３月） | https://www.bousai.go.jp/oukyu/hinanjouhou/r3_hinanjouhou_guideline/ | 2026-11-21 |
| jma-warning-2026-press | 気象庁 (JMA) | 報道発表: ５月29日（金）から、新たな防災気象情報の運用を開始します（令和8年4月14日） | https://www.jma.go.jp/jma/press/2604/14b/20260414_taikeiseiri.html | 2026-11-21 |
| jma-warning-2026 | 気象庁 (JMA) | 新たな防災気象情報について（令和８年～） | https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/index.html | 2026-11-21 |
| jma-warning-2026-outline | 国土交通省・気象庁 | 防災気象情報の改善について（令和7年12月、令和8年4月更新） | https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/pdf/outline_info2026.pdf | 2026-11-21 |
| jma-warning-2026-english | 気象庁 (JMA) | 警戒レベル相当情報の英語表記について | https://www.jma.go.jp/jma/kishou/know/bosai/keiho-update2026/pdf/english_info2026.pdf | 2026-11-21 |
| cao-kouhou-r03 | 内閣府（防災担当） | 広報ぼうさい r03 防災の動き: 災害対策基本法等の改正 (令和3年法律第30号) | https://www.bousai.go.jp/kohou/kouhoubousai/r03/101/news_01.html | 2026-11-21 |
