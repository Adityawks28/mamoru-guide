# Medical verification of the first-aid steps

- Date: 2026-11-21
- Scope: the 8 first-aid cards in `src/first-aid.ts`. The table has one row for each of the 40 old steps, plus 1 new step.
- Evidence: two independent AI research passes against official sources: `research-medical.md` (first pass) and `research-medical-audit.md` (second pass, the audit). Both files are in `.superpowers/sdd/2026-11-21-content-quality/`. When the two passes disagree, the audit decides.
- Reviewer status: no medical professional reviewed these steps. Each card shows this note in English, Japanese and Indonesian (Decision D-4).
- Source rule: Japanese official sources come first. A non-Japanese government source supports a step only when no Japanese source covers it (Ruling R15). Two steps use this rule: Burns 5 (face burns, NHS) and Smoke 3 (door check, Ready.gov).

## Limits

1. The JRC 2025 first-aid chapter (第8章) is in a book only. The newest first-aid text that we can read is JRC 2020 第8章. If JRC 2025 changed the advice on shock position, tourniquets, burn dressings or crush injury, this check cannot see it.
2. For CPR, the 2025 citizen rules come from the FDMA notice 消防救第385号 (2026-10-23). It summarizes 「救急蘇生法の指針 2025（市民用）」. The 指針 2025 text itself is not online.
3. The 指針 2020（市民用） PDF is a copy on a city fire department site (光市消防本部).

## Key

- Verdict: the first-pass result, after the audit. `match` = the source agrees. `differs` = the source says something different. `not found` = no checked source says it. `missing` = the source has a step that the card did not have.
- Status: the value in `CLAIMS` (`src/data/sources.ts`). `verified` = the text already matched, no change. `changed` = we corrected the text, or added it. `removed` = no source, so the step is gone.
- Step: the old step number. The new card order is in `src/first-aid.ts`.
- Source IDs point to the Sources section at the end.

## Results

| Status | Steps |
|---|---|
| verified | 13 |
| changed | 24 |
| removed | 3 |
| added (status changed) | 1 |
| Total rows | 41 |

## Table

### Bleeding

| Step | Claim ID | Old claim | Source and section | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|
| 1 | fa-bleeding-1 | Gloves, or a cloth between hand and blood | shishin-2020-citizen VI-10 出血 p.50; fdma-387-phone-guidance 参考1-3 | match | changed | Put on gloves. If you have no gloves, use a plastic bag. |
| 2 | fa-bleeding-2 | Press on the wound; 10 minute timer | shishin-2020-citizen p.49-50 ("press until the ambulance arrives"); fdma-387-phone-guidance 参考1-3; jrc-2020-first-aid FA-1 p.355 | differs (timer) | changed | Press firmly on the wound with a clean cloth. Keep pressing until paramedics arrive. (Timer removed.) |
| 3 | fa-bleeding-3 | Do not remove a soaked cloth; add more | tfd-bfc-instructor-cp11 2 止血法; tfd-bleeding-advanced | match | verified | If blood comes through the cloth, do NOT remove the cloth. Put more cloth on top. Warning: If you stop the pressure, the bleeding starts again. |
| 4 | fa-bleeding-4 | Raise the injured part above the heart | jrc-2020-first-aid FA-1 p.354-355 (reviewed, not recommended); shishin-2020-citizen and jrcs-bleed do not mention it | not found | removed | (Step removed.) |
| 5 | fa-bleeding-5 | Tourniquet 5 to 7 cm above the wound; note the time | shishin-2020-citizen p.50 (get training first); fdma-387-phone-guidance 参考1-3 (no thin string or wire); jrc-2020-first-aid FA-2 p.358; jrcs-bleed | differs | changed | If the bleeding does not stop, press harder with both hands. Keep pressing until paramedics arrive. Warning: Use a tourniquet (a tight band) only if you have training. Do not tie the arm or leg with thin string or wire. |

### Burns

| Step | Claim ID | Old claim | Source and section | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|
| 1 | fa-burns-1 | Cool under cool (not cold) running water; 10 minute timer | shishin-2020-citizen VI-13 p.52 (tap water 10 to 20 minutes, no ice); fdma-387-phone-guidance 参考1-4; tfd-bfc-instructor-cp11 やけど (large burns: do not cool long) | differs (minor) | changed | Cool the burn at once under running tap water for 10 to 20 minutes. Do not use ice or ice water. Warning: If the burn is large, do not cool it for a long time. The person can become too cold. (10 minute timer kept.) |
| 2 | fa-burns-2 | Remove jewelry and tight clothes before swelling | fdma-387-phone-guidance 参考1-4 (cool through the clothes); jrcs-burn (do not pull clothes off) | not found (jewelry) | changed | If clothes cover the burn, cool the burn through the clothes. |
| 3 | fa-burns-3 | Do not remove stuck clothes or break blisters; no ice, butter, toothpaste | fdma-387-phone-guidance 参考1-4 (do not break blisters); tfd-bfc-instructor-cp11 よくないこと (no oil, miso, medicine); shishin-2020-citizen p.52 | match | verified | Do NOT remove clothing that is stuck to the burn. Do NOT break blisters. Warning: Never use ice, butter, or toothpaste on a burn. |
| 4 | fa-burns-4 | Cover loosely; food wrap works well | jrcs-burn (clean or washed cloth); jrc-2020-first-aid FA-9 p.367-368 (no dressing recommendation; food wrap is a research topic) | differs | changed | Cover the burn loosely with a clean cloth. |
| 5 | fa-burns-5 | Medical help for large burns or burns on face, hands, joints | tfd-bfc-instructor-cp11 熱傷の深さ (blisters bigger than a fingertip; a burn a towel cannot cover; airway burns); nhs-burns (face burns go to hospital; non-Japanese, Ruling R15) | differs (partial); audit: keep the face | changed | See a doctor if the burn has blisters and is bigger than a fingertip. Get medical help at once if a towel cannot cover the burn, or if the face is burned. |

### Fractures and sprains

| Step | Claim ID | Old claim | Source and section | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|
| 1 | fa-fractures-1 | Do not move the injured limb | tfd-bfc-instructor-cp11 骨折・捻挫・打撲; jrcs-fracture | match | verified | Do NOT move the injured arm or leg. Keep the person still. |
| 2 | fa-fractures-2 | Splint from magazines or cardboard | tfd-bfc-instructor-cp11 (5) 雑誌等を使用した固定 (long enough for the joints above and below) | match | changed | Use a splint (a stiff support) to hold the injured area still. Make it from magazines, cardboard, or other stiff material. Use a splint long enough to reach the joints above and below the injury. |
| 3 | fa-fractures-3 | Pad the splint; tie above and below | tfd-bfc-instructor-cp11 (5) (上・下・上・下); no source mentions padding | match; audit: differs (padding) | changed | Tie the splint above and below the injury. |
| 4 | fa-fractures-4 | Ice in cloth, 20 minutes on, 20 minutes off | tfd-bfc-instructor-cp11 (2) (not more than 20 minutes at a time); shishin-2020-citizen VI-11 p.51 (thin cloth between pack and skin) | differs (minor) | changed | Cool the injury with an ice pack in a thin cloth. Do not cool it for more than 20 minutes at a time. |
| 5 | fa-fractures-5 | Check blood flow below the injury | jrcs-fracture (watch the fingers and toes) | match | verified | Check the blood flow below the injury. The fingers or toes should be warm and not pale. |

### Crush syndrome (card title was "Crush Injury")

| Step | Claim ID | Old claim | Source and section | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|
| 1 | fa-crush-1 | Trapped more than 15 minutes: do not free them yourself | tfd-bfc-highschool-cp10 (do not drag out carelessly); tfd-bfc-instructor-cp15; fdma-ecollege-rescue (free with care, then a doctor); fdma-crush-rescue 第3章 (do not judge by time alone). No source gives 15 minutes. | differs | changed | Call 119. Tell them that a person is trapped. Free the person slowly and carefully. Do not pull them out by force. Warning: A person who was trapped for a long time can become very ill after rescue. Get a doctor, even if they look well. |
| 2 | fa-crush-2 | Call 119; say crush injury (圧挫傷) | fdma-ecollege-rescue; fdma-crush-rescue (term 圧挫症候群) | match (term fix) | changed | Tell the 119 operator that it can be crush syndrome (圧挫症候群 / あつざしょうこうぐん). |
| 3 | fa-crush-3 | Give water if conscious and able to swallow | Only a community disaster plan (people trapped more than 2 hours); no official medical source | not found | removed | (Step removed.) |
| 4 | fa-crush-4 | Keep warm; watch for confusion or sleepiness | jrcs-rest (wrap in a blanket); tfd-bfc-highschool-cp10 (dark red urine, swelling, numbness: see a doctor); mhlw-crush-research | differs | changed | Keep the person warm with a blanket. Look for dark red urine, swelling, or numbness. If you see these, tell a doctor at once. |
| 5 | fa-crush-5 | Write down the time they were trapped | mhlw-crush-research (time is a key sign); fdma-crush-rescue | match | verified | Write down the time they were trapped. This information is important for paramedics. |

### CPR

| Step | Claim ID | Old claim | Source and section | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|
| 1 | fa-cpr-1 | Tap the shoulders and shout | fdma-385-cpr-2025 別紙 p.4 | match | verified | Check if the person responds. Tap their shoulders and shout "Are you OK?" |
| 2 | fa-cpr-2 | Call 119; ask for an AED | fdma-385-cpr-2025 別紙 p.4 | match | verified | Call 119, or ask a person near you to call. Ask someone to bring an AED (a machine that gives the heart an electric shock). |
| new (after 2) | fa-cpr-6 | Breathing check (was missing) | fdma-385-cpr-2025 別紙 p.4 (look at chest and belly for 10 seconds or less; if not sure, start pushes) | missing | changed (added) | Check if the person breathes normally. Look at the chest and belly for up to 10 seconds. If the breathing is not normal, or you are not sure, start chest pushes. If the person breathes normally, stay with them and watch the breathing. |
| 3 | fa-cpr-3 | Heel of one hand on the chest center, other hand on top | fdma-385-cpr-2025 別紙 p.5 (adults and children: two hands; babies: one arm) | match; audit: differs (baby) | changed | Put the heel of one hand (the base of your palm) on the center of the chest. Put your other hand on top. For a baby, use the heel of one hand only. |
| 4 | fa-cpr-4 | 100 to 120 per minute; adults 5 to 6 cm; infants two fingers | fdma-385-cpr-2025 p.2 (2025 change: babies use the heel of one hand, not two fingers), 別紙 p.5 (adults about 5 cm; children and babies about 1/3 of chest depth) | differs | changed | Push hard and fast, 100 to 120 times each minute. Adults: push about 5 cm deep. Children and babies: push about one third of the chest depth. Babies: push with the heel of one hand. Let the chest come fully back up after each push. |
| 5 | fa-cpr-5 | Do not stop until paramedics arrive or an AED is ready; green heart sign | fdma-385-cpr-2025 別紙 p.6 (push while pads go on; do not touch during analysis; restart at once after the shock; continue until paramedics take over, or normal breathing or purposeful movement); jfem-aed-placement-ja (stations, schools, convenience stores). No source has a "green heart sign". | differs; audit: use "moves on purpose" | changed | Do not stop chest pushes until paramedics take over, or the person breathes normally or moves on purpose. When the AED arrives, turn it on. Keep pushing while someone puts on the pads. Do not touch the person while the AED checks the heart. After the shock, or if no shock is needed, start pushing again at once. Warning: Many stations, schools, and some convenience stores have an AED. Look for the AED sign. |

### Shock

| Step | Claim ID | Old claim | Source and section | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|
| 1 | fa-shock-1 | Signs of shock | fdma-web-shock (signs; call 119 at once); yokohama-first-aid | match | changed | Look for these signs: pale, cold, or damp skin; fast breathing; confusion; weakness. If you see these signs, call 119 at once. |
| 2 | fa-shock-2 | Lie flat, raise legs 20 to 30 cm; half sitting; side if vomiting | jrc-2020-first-aid FA-10 p.351 (supine; leg raise is an open research question); fdma-web-shock (lie on the back); sendai-shock; jrcs-rest (most comfortable position if conscious); shishin-2020-citizen VI-1 p.45 (recovery position against vomit) | differs | changed | Lay the person flat on their back. If the person has trouble breathing, let them take the position that is easiest. If the person vomits, turn them on their side. |
| 3 | fa-shock-3 | Blanket; keep off the cold ground | fdma-web-shock (cover to keep warm); yokohama-first-aid (thicker layer under the body) | match | verified | Cover the person with a blanket or jacket to keep them warm. Do not let the cold ground take their body heat. |
| 4 | fa-shock-4 | No food or drink; wet the lips | No shock source covers it. The first pass used the Red Cross heart attack page; the audit rejected that. | not found | removed | (Step removed.) |
| 5 | fa-shock-5 | Stay, talk calmly, watch breathing | yokohama-first-aid (talk to them); sendai-shock (keep watching); shishin-2020-citizen VI-1 p.45 | match | verified | Stay with the person. Talk to them calmly. Watch their breathing until help arrives. |

### Breathing smoke

| Step | Claim ID | Old claim | Source and section | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|
| 1 | fa-smoke-1 | Keep low; crawl | tfd-evacuation-smoke 煙の特性 2/2; fdma-quake-manual-fire; ready-gov-home-fires ("crawl low"; non-Japanese, Ruling R15) | match | verified | Keep your body low. Crawl on your hands and knees. Smoke goes up, so the air near the floor is cleaner. |
| 2 | fa-smoke-2 | Wet cloth over nose and mouth | nrifd-smoke-towel (do not lose time to wet it; a wet cloth filters less) | differs | changed | Cover your nose and mouth with a cloth. Do not lose time to make it wet. |
| 3 | fa-smoke-3 | Test the handle with the back of your hand | No Japanese source. ready-gov-home-fires: feel the doorknob and door; if hot, keep it closed (non-Japanese, Ruling R15) | not found; audit: use Ready.gov | changed | Before you open a door, feel the door and the handle. Warning: If the door is hot, keep it closed. Use another way out. |
| 4 | fa-smoke-4 | Follow green exit signs | fdma-exit-sign-standard (green exit sign); tfd-bfc-leader-cp9 | match | verified | Go to the nearest exit. Follow the emergency exit signs (they are green in Japan). |
| 5 | fa-smoke-5 | Sit them upright, loosen clothes, call 119 | jrcs-poison ガス中毒 (fresh air; do not let them walk; do not raise the body; keep warm; call 119) | differs | changed | If a person breathed in smoke, move them to fresh air. Do not let them walk. Loosen their clothes. Keep them warm. Call 119, even if they feel better. |

### Psychological first aid

| Step | Claim ID | Old claim | Source and section | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|
| 1 | fa-psychological-1 | Say "You are safe now. I am here to help." | who-pfa-ja ch.3 p.33 (say you are there to help; remind them they are safe if that is true), p.25 (no empty comfort) | differs (minor) | changed | Go to the person calmly. Say: "I am here to help." If the person is safe now, tell them so. |
| 2 | fa-psychological-2 | Breathe in 4 s, hold 4 s, out 4 s | who-pfa-ja p.33 (encourage slow breathing); jrcs-news-2026-11 (calm voice, comfortable position, loosen clothes; no paper bag) | differs | changed | If the person breathes too fast, speak in a calm voice. Ask them to breathe slowly. Help them sit in a comfortable position. Loosen tight clothes. |
| 3 | fa-psychological-3 | 5-4-3 grounding | who-pfa-ja p.33 (feel the feet on the floor; say what they see and hear; no numbers) | differs | changed | If the person feels unreal or far away, ask them to feel their feet on the floor. Ask them to tell you what they can see and hear. |
| 4 | fa-psychological-4 | Listen; do not say "Calm down"; say "I understand" | who-pfa-ja p.24-25 (do not force, do not judge), p.54 (example: お気持ちはわかります) | match | verified | Listen without judging. Let them talk or cry. Do not say "Calm down." Say "I understand." |
| 5 | fa-psychological-5 | Help with practical needs | who-pfa-ja p.34 (basic needs; connect with family and support) | match | verified | Help with practical needs, like water, a blanket, or contacting their family. Small actions help them feel safe. |

## Choices on optional texts

The audit lists some first-pass texts as "optional". These are the choices:

- Applied: Bleeding 1 (plastic bag), Fractures 2 (splint length), Shock 1 (call 119 at once), the CPR breathing-check third sentence (stay and watch if the breathing is normal).
- Not applied: Bleeding 3 "press harder with both hands" (Bleeding 5 now says it, so it would repeat). Burns 3 new warning "ice, oil, butter, or medicine" (the old warning matched; the new one drops toothpaste). Optional additions to Fractures 1, CPR 1, CPR 2, Shock 3, Smoke 1, Psych 4 (the audit lists these rows as safe without the optional text, and the old text matches).
- Not applied: the jewelry sentence from NHS for Burns 2. The audit's final list removes the jewelry clause.

## Sources

All checked on 2026-11-21. The IDs are the keys in `SOURCES` in `src/data/sources.ts`.

| ID | Publisher | Title | URL |
|---|---|---|---|
| fdma-385-cpr-2025 | 総務省消防庁 救急企画室 (FDMA) | 消防救第385号 (2026-10-23)「救急蘇生法の指針 2025（市民用）」への対応について, 別紙 | https://www.fdma.go.jp/laws/tutatsu/items/20261023_kyuuki_01.pdf |
| fdma-387-phone-guidance | 総務省消防庁 (FDMA) | 消防救第387号 (2026-10-23)「口頭指導に関する実施基準」の一部改正 | https://www.fdma.go.jp/laws/tutatsu/items/20261023_kyuuki_03.pdf |
| jrc-2020-first-aid | 日本蘇生協議会 (JRC) | JRC蘇生ガイドライン2020 第8章 ファーストエイド | https://www.jrc-cpr.org/wp-content/uploads/2022/07/JRC_0327-0382_FA.pdf |
| shishin-2020-citizen | 日本救急医療財団 心肺蘇生法委員会 (監修); copy on 光市消防本部 site | 改訂6版 救急蘇生法の指針2020（市民用） | https://www.119.city.hikari.lg.jp/asset/00032/yousiki/keibou/shishin2020_shimin_hp.pdf |
| fdma-web-shock | 総務省消防庁 (FDMA) | 応急手当WEB講習（上級）「ショック時の対応」 | https://www.fdma.go.jp/relocation/kyukyukikaku/oukyu/02jokyu/10shock/02_10_01.html |
| tfd-bfc-instructor-cp11 | 東京消防庁 | 消防少年団 指導者 第11章 救急 | https://www.tfd.metro.tokyo.lg.jp/ts/bfc_manual/instructor/cp11.html |
| tfd-bfc-highschool-cp10 | 東京消防庁 | 消防少年団 高校生 第10章「4 クラッシュシンドローム」 | https://www.tfd.metro.tokyo.lg.jp/ts/bfc_manual/high_school/cp10.html |
| tfd-bfc-instructor-cp15 | 東京消防庁 | 消防少年団 指導者 第15章 救助 | https://www.tfd.metro.tokyo.lg.jp/ts/bfc_manual/instructor/cp15.html |
| tfd-evacuation-smoke | 東京消防庁 | 電子学習室「避難のしかた」煙の特性 2/2 | https://www.tfd.metro.tokyo.lg.jp/learning/contents/evacuation/contents03_2.html |
| tfd-bfc-leader-cp9 | 東京消防庁 | 消防少年団 リーダー 第9章 避難 | https://www.tfd.metro.tokyo.lg.jp/ts/bfc_manual/leader/cp9.html |
| tfd-bleeding-advanced | 東京消防庁 | 電子学習室 上級救命講習「出血の応急手当」 | https://www.tfd.metro.tokyo.lg.jp/learning/contents/lifesaving_jou/contents06_1.html |
| jrcs-burn | 日本赤十字社 | 講習の内容「熱傷（やけど）」 | https://www.jrc.or.jp/study/safety/burn/ |
| jrcs-bleed | 日本赤十字社 | 講習の内容「多量の出血」 | https://www.jrc.or.jp/study/safety/bleed/ |
| jrcs-fracture | 日本赤十字社 | 講習の内容「骨折」 | https://www.jrc.or.jp/study/safety/fracture/ |
| jrcs-rest | 日本赤十字社 | 講習の内容「傷病者の安静」 | https://www.jrc.or.jp/study/safety/rest/ |
| jrcs-poison | 日本赤十字社 | 講習の内容「中毒」 | https://www.jrc.or.jp/study/safety/poison/ |
| jrcs-news-2026-11 | 日本赤十字社 | 赤十字NEWS 2026年11月号「応急手当の知識をアップデート」 | https://www.jrc.or.jp/about/publication/news/202611_topics02.html |
| who-pfa-ja | WHO; Japanese translation by 国立精神・神経医療研究センター (on the MHLW site) | 心理的応急処置（PFA）フィールド・ガイド | https://www.mhlw.go.jp/content/000805675.pdf |
| fdma-crush-rescue | 総務省消防庁 (FDMA) | 検討会 第2回 資料4 第3章 救護救出要領 | https://www.fdma.go.jp/singi_kento/kento/items/post-68/02/shiryou4.pdf |
| fdma-ecollege-rescue | 総務省消防庁 (FDMA) | 防災危機管理eカレッジ「2.倒壊家屋からの救助」 | https://www.fdma.go.jp/relocation/e-college/cat65/cat65/cat46/2-17.html |
| nrifd-smoke-towel | 消防庁 消防研究センター | タオルやハンカチ等の除煙効果に係わる実験 (2014-03-03) | https://nrifd.fdma.go.jp/news/20140304/handkerchief.pdf |
| fdma-quake-manual-fire | 総務省消防庁 (FDMA) | 地震防災マニュアル「火災に遭遇した場合」 | https://www.fdma.go.jp/relocation/bousai_manual/lat/later32.html |
| fdma-exit-sign-standard | 総務省消防庁 (FDMA) | 誘導灯及び誘導標識の基準 (平成11年消防庁告示第2号) | https://www.fdma.go.jp/laws/kokuji/assets/h11_kokuji2.pdf |
| mhlw-crush-research | 厚生労働行政推進調査事業 (MHLW-funded research) | 分担研究報告書「クラッシュ症候群に関する研究」 | See `SOURCES['mhlw-crush-research'].url` (long encoded URL on mhlw-grants.niph.go.jp) |
| yokohama-first-aid | 横浜市消防局 | 救命処置以外の応急手当 | https://www.city.yokohama.lg.jp/bousai-kyukyu-bohan/kyukyu/okyu/20130314173519.html |
| sendai-shock | 仙台市消防局 | ショック | https://www.city.sendai.jp/kyukyukanri/kurashi/anzen/tobani/joho/syokku.html |
| jfem-aed-placement-ja | 日本救急医療財団 (on the MHLW site) | AEDの適正配置に関するガイドライン | https://www.mhlw.go.jp/content/10800000/000748008.pdf |
| ready-gov-home-fires | FEMA Ready.gov (US government; non-Japanese, Ruling R15) | Home Fires | https://www.ready.gov/home-fires |
| nhs-burns | NHS (UK government health service; non-Japanese, Ruling R15) | Burns and scalds | https://www.nhs.uk/conditions/burns-and-scalds/ |
