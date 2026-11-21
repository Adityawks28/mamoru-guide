# Medical verification of the first-aid steps

- Date: 2026-11-21
- Scope: the 8 first-aid cards in `src/first-aid.ts` (one row for each of the 40 old steps, plus 1 new step) and the 8 first-aid tips in `src/character/tips.ts` (`FIRSTAID_TIPS`).
- Evidence: two independent AI research passes on 2026-11-21. The first pass compared each step with official sources and quoted them. The second pass (the audit) downloaded every source again, checked every quote, and corrected 6 rows. When the two passes disagreed, the audit decided. The quotes below are verbatim from the sources, with the audit's corrections.
- Reviewer status: no medical professional reviewed these steps. Each card shows this note in English, Japanese and Indonesian (Decision D-4): "A medical professional has not checked these steps yet. The steps come from official guidance."
- Source rule: Japanese official sources come first. A non-Japanese government source supports a step only when no Japanese source covers it (Ruling R15). Burns 5 (face burns, NHS), Smoke 1 ("crawl", Ready.gov) and Smoke 3 (door check, Ready.gov) use this rule.

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

| Status | Card steps |
|---|---|
| verified | 13 |
| changed | 24 |
| removed | 3 |
| added (status changed) | 1 |
| Total rows | 41 |

All 8 first-aid tips are `changed` (see "Tips" below).

## Table

### Bleeding

| Step | Claim ID | Old claim | Source and section | Source says (JA quote / EN gist) | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|---|
| 1 | fa-bleeding-1 | Gloves, or a cloth between hand and blood | shishin-2020-citizen VI-10 出血 p.50; fdma-387-phone-guidance 参考1-3 | 「可能であれば救助者はビニール手袋を着用するか、ビニール袋を手袋の代わりに使用するとよいでしょう」 / Use vinyl gloves, or a plastic bag in place of gloves. | match | changed | Put on gloves. If you have no gloves, use a plastic bag. |
| 2 | fa-bleeding-2 | Press on the wound; 10 minute timer | shishin-2020-citizen p.49-50; fdma-387-phone-guidance 参考1-3; jrc-2020-first-aid FA-1 p.355 | 「ガーゼ、ハンカチ、タオルなどを当てて、その上から直接圧迫して止血を試みてください」「救急隊が到着するまで出血部位をしっかり押さえつづけてください」 / Press directly. Keep pressing until the ambulance arrives. No 10 minute limit. | differs (timer) | changed | Press firmly on the wound with a clean cloth. Keep pressing until paramedics arrive. (Timer removed.) |
| 3 | fa-bleeding-3 | Do not remove a soaked cloth; add more | tfd-bfc-instructor-cp11 2 止血法; tfd-bleeding-advanced | 「圧迫したにもかかわらず血がにじみ出る場合は、さらにその上にガーゼやタオルなどを重ねて圧迫します。この際、はじめに当てたガーゼやタオルなどは外さないでください。」 / Add cloth on top. Do not remove the first cloth. | match | verified | If blood comes through the cloth, do NOT remove the cloth. Put more cloth on top. Warning: If you stop the pressure, the bleeding starts again. |
| 4 | fa-bleeding-4 | Raise the injured part above the heart | jrc-2020-first-aid FA-1 p.354-355; shishin-2020-citizen and jrcs-bleed do not mention it | 「CoSTR2015 では，直接圧迫止血法，局所の冷却，四肢の挙上，止血点止血法…の使用に関するエビデンスを評価した」 / Raising the limb was reviewed. JRC 2020 recommends only direct pressure. | not found | removed | (Step removed.) |
| 5 | fa-bleeding-5 | Tourniquet 5 to 7 cm above the wound; note the time | shishin-2020-citizen p.50; fdma-387-phone-guidance 参考1-3; jrc-2020-first-aid FA-2 p.358; jrcs-bleed | 「即席の止血帯で手足のつけ根側を縛る方法もありますが、神経などをいためる危険があります。実施するには訓練を受けてください。」「細いひもや針金で出血している手足を縛る方法は、血管や神経を痛める危険性があるので指導しない」 / Get training before you use a tourniquet. Do not tie a limb with thin string or wire. No source gives 5 to 7 cm for citizens. | differs | changed | If the bleeding does not stop, press harder with both hands. Keep pressing until paramedics arrive. Warning: Use a tourniquet (a tight band) only if you have training. Do not tie the arm or leg with thin string or wire. |

### Burns

| Step | Claim ID | Old claim | Source and section | Source says (JA quote / EN gist) | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|---|
| 1 | fa-burns-1 | Cool under cool (not cold) running water; 10 minute timer | shishin-2020-citizen VI-13 p.52; fdma-387-phone-guidance 参考1-4; tfd-bfc-instructor-cp11 やけど | 「服の上からでもすみやかに水道の流水で痛みが和らぐまで10〜20分程度冷やしてください。氷や氷水で冷却すると、やけどが悪化することがあります。」 TFD:「熱傷の範囲が広い場合…10分以上の冷却はしないようにします。」 / Tap water for 10 to 20 minutes, at once. No ice or ice water. Do not cool a large burn for long. | differs (minor) | changed | Cool the burn at once under running tap water for 10 to 20 minutes. Do not use ice or ice water. Warning: If the burn is large, do not cool it for a long time. The person can become too cold. (10 minute timer kept.) |
| 2 | fa-burns-2 | Remove jewelry and tight clothes before swelling | fdma-387-phone-guidance 参考1-4; jrcs-burn | 「衣服を着ている場合は、衣服ごと冷やす」; 「熱傷部が衣類で覆われている場合は、無理に脱がさずそのままの状態で急いで冷やします。」 / Cool through the clothes. Do not pull clothes off. No Japanese source mentions jewelry. | not found (jewelry) | changed | If clothes cover the burn, cool the burn through the clothes. |
| 3 | fa-burns-3 | Do not remove stuck clothes or break blisters; no ice, butter, toothpaste | fdma-387-phone-guidance 参考1-4; tfd-bfc-instructor-cp11 よくないこと; shishin-2020-citizen p.52 | 「水疱（水ぶくれ）は破らないようにする」; よくないこと:「熱傷の部分に油、味噌などを塗ること」「医師の治療を受ける前に、自分で薬剤を塗ること」 / Do not break blisters. Do not put things on the burn. | match | verified | Do NOT remove clothing that is stuck to the burn. Do NOT break blisters. Warning: Never use ice, butter, or toothpaste on a burn. |
| 4 | fa-burns-4 | Cover loosely; food wrap works well | jrcs-burn; jrc-2020-first-aid FA-9 p.367-368 | 「熱傷部を消毒した布か洗濯した布で覆い」; JRC:「…熱傷に使用すべき最適な被覆材の種類についての推奨はできない」 / Cover with a clean or washed cloth. No official source recommends food wrap. | differs | changed | Cover the burn loosely with a clean cloth. |
| 5 | fa-burns-5 | Medical help for large burns or burns on face, hands, joints | tfd-bfc-instructor-cp11 熱傷の深さ; nhs-burns (non-Japanese, Ruling R15) | 「II度熱傷は、指先などの小さなもの以外は治療が必要です。」「タオルなどで覆いきれないⅡ度熱傷またはⅢ度熱傷は、すぐに医療機関での診察が必要です。」 NHS (EN): face burns need hospital care. / Blisters bigger than a fingertip need treatment. A burn that a towel cannot cover needs care at once. The audit keeps the face (a face burn can come with an airway burn). | differs (partial) | changed | See a doctor if the burn has blisters and is bigger than a fingertip. Get medical help at once if a towel cannot cover the burn, or if the face is burned. |

### Fractures and sprains

| Step | Claim ID | Old claim | Source and section | Source says (JA quote / EN gist) | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|---|
| 1 | fa-fractures-1 | Do not move the injured limb | tfd-bfc-instructor-cp11 骨折・捻挫・打撲; jrcs-fracture | 「変形した手足を動かさず、安静に保ちます。」 / Do not move the deformed limb. Keep the person still. | match | verified | Do NOT move the injured arm or leg. Keep the person still. |
| 2 | fa-fractures-2 | Splint from magazines or cardboard | tfd-bfc-instructor-cp11 (5) 雑誌等を使用した固定 | 「副子（骨折の時に用いる添え木）として雑誌や段ボール、板等を使用して固定する方法があります。副子は、骨折部の上下の関節が固定できる長さのものを準備します。」 / Use magazines, cardboard or a board. Make the splint long enough for the joints above and below. | match | changed | Use a splint (a stiff support) to hold the injured area still. Make it from magazines, cardboard, or other stiff material. Use a splint long enough to reach the joints above and below the injury. |
| 3 | fa-fractures-3 | Pad the splint; tie above and below | tfd-bfc-instructor-cp11 (5) | 「固定する順序は、骨折部の上・下・上・下の順で固定します。」 / Tie above and below the fracture. No checked source mentions padding (audit correction). | differs (padding) | changed | Tie the splint above and below the injury. |
| 4 | fa-fractures-4 | Ice in cloth, 20 minutes on, 20 minutes off | tfd-bfc-instructor-cp11 (2); shishin-2020-citizen VI-11 p.51 | 「20分以上続けて冷やすことは避けます。」; 「冷却パックを使用するさいには、皮膚との間に薄い布などをはさんで直接当たらないようにしてください。」 / Not more than 20 minutes at a time. Put a thin cloth between the pack and the skin. No source gives "20 minutes off". | differs (minor) | changed | Cool the injury with an ice pack in a thin cloth. Do not cool it for more than 20 minutes at a time. |
| 5 | fa-fractures-5 | Check blood flow below the injury | jrcs-fracture | 「患部を固定します（骨折した手足の末梢を観察できるように、手袋や靴、靴下などを予め脱がせておきます）。」 / Keep the fingers and toes visible so you can watch them. | match | verified | Check the blood flow below the injury. The fingers or toes should be warm and not pale. |

### Crush syndrome (card title was "Crush Injury")

| Step | Claim ID | Old claim | Source and section | Source says (JA quote / EN gist) | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|---|
| 1 | fa-crush-1 | Trapped more than 15 minutes: do not free them yourself | tfd-bfc-highschool-cp10; tfd-bfc-instructor-cp15; fdma-ecollege-rescue; fdma-crush-rescue 第3章; fdma-385-cpr-2025 別紙 p.4 | 「不用意に引きずり出したり、負傷者の意思を無視して急激に動かさないように注意しましょう。」「挟まれた人を無理に引き出そうとせず、様子を見ながら救出して下さい。」「圧迫時間のみで判断しないように注意する。」; safety: 「余震などに十分に注意」(TFD 第15章),「周囲の安全を確認する。」(消防救第385号) / Free the person with care, not by force. Do not judge by time alone. Check that the place is safe. No source gives 15 minutes. | differs | changed | Call 119. Tell them that a person is trapped. Make sure that the place is safe for you. Free the person slowly and carefully. Do not pull them out by force. Warning: A person who was trapped for a long time can suddenly become very ill after rescue. Get a doctor, even if they look well. |
| 2 | fa-crush-2 | Call 119; say crush injury (圧挫傷) | fdma-ecollege-rescue; fdma-crush-rescue | 「救出後に容体が急変（クラッシュシンドローム）する場合がありますので、医師等による適切な処置が必要です。」; term:「圧挫症候群（クラッシュ・シンドローム）」 / The condition can change suddenly after rescue. A doctor must treat it. The official term is 圧挫症候群. | match (term fix) | changed | Tell the 119 operator that it can be crush syndrome (圧挫症候群 / あつざしょうこうぐん). |
| 3 | fa-crush-3 | Give water if conscious and able to swallow | Community disaster plan only (見晴台自治会, on bousai.go.jp) | 「2時間を超えて家具や建物にはさまれた人には…① 救出中、搬送中も含め、水分を摂らせる」 / Only a neighborhood plan says this, for people trapped more than 2 hours. No official medical source. | not found | removed | (Step removed.) |
| 4 | fa-crush-4 | Keep warm; watch for confusion or sleepiness | jrcs-rest; tfd-bfc-highschool-cp10; mhlw-crush-research | 「傷病者の体温が保たれるように、全身を毛布などで包みます。」; 「全身の症状が軽く見えても、暗赤色の尿が出たり、腫れたり、感覚がなくなることがあったら、速やかに医師の診察を受けることが必要です。」 / Wrap in a blanket. Dark red urine, swelling or numbness: see a doctor at once. | differs | changed | Keep the person warm with a blanket. Look for dark red urine, swelling, or numbness. If you see these, tell a doctor at once. |
| 5 | fa-crush-5 | Write down the time they were trapped | mhlw-crush-research; fdma-crush-rescue | 「CSを疑う診断の3大ポイント（長時間、四肢臀部を重量物で挟圧されたエピソード、患肢の運動知覚麻痺、黒褐色尿（ポートワイン尿）」 / A long time under a heavy object is one of the three key signs. | match | verified | Write down the time they were trapped. This information is important for paramedics. |

### CPR

| Step | Claim ID | Old claim | Source and section | Source says (JA quote / EN gist) | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|---|
| 1 | fa-cpr-1 | Tap the shoulders and shout | fdma-385-cpr-2025 別紙 p.4 | 「肩をやさしくたたきながら、大声で呼びかけて、何らかの応答や目的のある仕草がなければ「反応なし」とみなす。」 / Tap the shoulders and call out loudly. | match | verified | Check if the person responds. Tap their shoulders and shout "Are you OK?" |
| 2 | fa-cpr-2 | Call 119; ask for an AED | fdma-385-cpr-2025 別紙 p.4 | 「誰かが来たら、その人に119番通報とAEDの手配（近くにある場合）を依頼する。」 / Ask a person to call 119 and bring an AED. | match | verified | Call 119, or ask a person near you to call. Ask someone to bring an AED (a machine that gives the heart an electric shock). |
| new (after 2) | fa-cpr-6 | Breathing check (was missing) | fdma-385-cpr-2025 別紙 p.4 | 「呼吸は胸と腹部の動きを見て「普段どおりの呼吸か」を10秒以内で確認する。」「判断に迷う場合、またはわからない場合も、胸骨圧迫を開始する。」 / Watch the chest and belly for 10 seconds or less. If you are not sure, start pushes. | missing | changed (added) | Check if the person breathes normally. Look at the chest and belly for up to 10 seconds. If the breathing is not normal, or you are not sure, start chest pushes. If the person breathes normally, stay with them and watch the breathing. |
| 3 | fa-cpr-3 | Heel of one hand on the chest center, other hand on top | fdma-385-cpr-2025 別紙 p.5 | 成人・小児:「一方の手のひらの付け根をあて、その手の上にもう一方の手を重ねて、指を組む。」 乳児:「腕１本：片手の手のひらの付け根で押す。」 / Adults and children: two hands. Babies: one hand (audit correction). | differs (baby) | changed | Put the heel of one hand (the base of your palm) on the center of the chest. Put your other hand on top. For a baby, use the heel of one hand only. |
| 4 | fa-cpr-4 | 100 to 120 per minute; adults 5 to 6 cm; infants two fingers | fdma-385-cpr-2025 p.2, 別紙 p.5 | 「乳児の胸骨圧迫は２本指ではなく、片手の手のひらの付け根で行うこととされた。」「約５cm沈むまでしっかり圧迫する。」「胸の厚さの約１/３までしっかり圧迫する。」「圧迫のテンポは100～120回/分」 / 2025 change: babies get the heel of one hand, not two fingers. Adults about 5 cm. Children and babies about 1/3 of chest depth. | differs | changed | Push hard and fast, 100 to 120 times each minute. Adults: push about 5 cm deep. Children and babies: push about one third of the chest depth. Babies: push with the heel of one hand. Let the chest come fully back up after each push. |
| 5 | fa-cpr-5 | Do not stop until paramedics arrive or an AED is ready; green heart sign | fdma-385-cpr-2025 別紙 p.6; jfem-aed-placement-ja | 「AEDの電極パッドは…貼り付ける。この間も胸骨圧迫は続ける。」「AEDによる心電図解析が開始されたら、傷病者に触れないようにする。」「電気ショック後は直ちに胸骨圧迫から心肺蘇生を再開する。」「救急隊などに引き継ぐまで、または傷病者に普段どおりの呼吸や目的のある仕草が認められるまで続ける。」; AED:「駅や空港、学校、官公庁などの公共施設への設置が進み」「地方公共団体によるコンビニエンスストアへのAEDの設置が広がりつつあり」 / Push while the pads go on. Do not touch during analysis. Restart at once after the shock. Continue until paramedics take over, or normal breathing or purposeful movement. No source has a "green heart sign". | differs ("moves on purpose", audit) | changed | Do not stop chest pushes until paramedics take over, or the person breathes normally or moves on purpose. When the AED arrives, turn it on. Keep pushing while someone puts on the pads. Do not touch the person while the AED checks the heart. After the shock, or if no shock is needed, start pushing again at once. Warning: Many stations, schools, and some convenience stores have an AED. Look for the AED sign. |

### Shock

| Step | Claim ID | Old claim | Source and section | Source says (JA quote / EN gist) | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|---|
| 1 | fa-shock-1 | Signs of shock | fdma-web-shock; yokohama-first-aid | 「表情がぼんやりして反応が鈍く、顔色が青白くて唇が白っぽいか紫色（色が悪い）の傷病者がいたら、ショックの可能性があるため、ただちに119番通報する。」 / Pale, slow to respond: possible shock. Call 119 at once. | match | changed | Look for these signs: pale, cold, or damp skin; fast breathing; confusion; weakness. If you see these signs, call 119 at once. |
| 2 | fa-shock-2 | Lie flat, raise legs 20 to 30 cm; half sitting; side if vomiting | jrc-2020-first-aid FA-10 p.351; fdma-web-shock; sendai-shock; jrcs-rest; shishin-2020-citizen VI-1 p.45 | 「ショックの傷病者を立位でなく仰臥位にすることを提案する」「下肢挙上なども含めたさまざまな体位の比較検討が必要である」; 「原則として水平に寝かせます。意識がある場合本人に聞いて最も楽な体位にします。」 / Lie flat on the back. Leg raising is an open research question. If conscious, use the position the person finds easiest. | differs | changed | Lay the person flat on their back. If the person has trouble breathing, let them take the position that is easiest. If the person vomits, turn them on their side. |
| 3 | fa-shock-3 | Blanket; keep off the cold ground | fdma-web-shock; yokohama-first-aid | 「毛布や衣服をかけて保温する」; 「地面やコンクリートの床などに寝かせるときの保温は、身体の上に掛ける物より、下に敷く物を厚くする。」 / Cover to keep warm. On cold ground, put more under the body. | match | verified | Cover the person with a blanket or jacket to keep them warm. Do not let the cold ground take their body heat. |
| 4 | fa-shock-4 | No food or drink; wet the lips | No shock source covers it | Only the Red Cross heart attack page:「原則として飲食物は与えません。」 / No shock source says this. The audit rejected the heart attack page as support. | not found | removed | (Step removed.) |
| 5 | fa-shock-5 | Stay, talk calmly, watch breathing | yokohama-first-aid; sendai-shock; shishin-2020-citizen VI-1 p.45 | 「声をかけて元気づける。」; 「救急隊が到着するまでの間、観察を続けます。」 / Talk to them. Keep watching until the ambulance arrives. | match | verified | Stay with the person. Talk to them calmly. Watch their breathing until help arrives. |

### Breathing smoke

| Step | Claim ID | Old claim | Source and section | Source says (JA quote / EN gist) | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|---|
| 1 | fa-smoke-1 | Keep low; crawl | tfd-evacuation-smoke 煙の特性 2/2; fdma-quake-manual-fire; ready-gov-home-fires (non-Japanese, Ruling R15) | 「火災の煙は天井からたまっていくので、床に近い低いところは意外に見通しがきくものです。…低い姿勢で煙の下を逃げましょう。」 Ready.gov (EN): "crawl low". / Smoke collects at the ceiling. Escape low, under the smoke. | match | verified | Keep your body low. Crawl on your hands and knees. Smoke goes up, so the air near the floor is cleaner. |
| 2 | fa-smoke-2 | Wet cloth over nose and mouth | nrifd-smoke-towel | 「タオルを濡らすのに手間取り貴重な避難時間を無駄にせず、どんな物でもいいから口と鼻にあて、すぐ避難行動を開始する」「いずれも濡らすと除煙効果は低下する。」 / Do not lose time to wet the towel. Any cloth works. A wet cloth filters less smoke. | differs | changed | Cover your nose and mouth with a cloth. Do not lose time to make it wet. |
| 3 | fa-smoke-3 | Test the handle with the back of your hand | ready-gov-home-fires (non-Japanese, Ruling R15) | No Japanese source. Ready.gov (EN): "Before opening a door, feel the doorknob and door. If either is hot … leave the door closed and use your second way out." | not found (audit: use Ready.gov) | changed | Before you open a door, feel the door and the handle. Warning: If the door is hot, keep it closed. Use another way out. |
| 4 | fa-smoke-4 | Follow green exit signs | fdma-exit-sign-standard; tfd-bfc-leader-cp9 | 「避難口誘導灯にあっては、緑色の地に避難口であることを示す…シンボル」; 「誘導灯にしたがって避難しましょう。」 / Exit signs are green. Follow them. | match | verified | Go to the nearest exit. Follow the emergency exit signs (they are green in Japan). |
| 5 | fa-smoke-5 | Sit them upright, loosen clothes, call 119 | jrcs-poison ガス中毒 | 「新鮮な空気のところに傷病者を運び出し、衣類をゆるめます。」「意識があっても、歩かせてはいけません。」「体を起こしたり、ゆすったりすると、吐くことが多い」「保温します。」「直ちに119番通報します」 / Carry to fresh air. Do not let them walk. Do not raise the body. Keep warm. Call 119. | differs | changed | If a person breathed in smoke, move them to fresh air. Do not let them walk. Loosen their clothes. Keep them warm. Call 119, even if they feel better. |

### Psychological first aid

| Step | Claim ID | Old claim | Source and section | Source says (JA quote / EN gist) | Verdict | Status | Final text (English) |
|---|---|---|---|---|---|---|---|
| 1 | fa-psychological-1 | Say "You are safe now. I am here to help." | who-pfa-ja ch.3 p.33, p.25 | 「あなたが援助のためにいるということを相手に伝える。もし相手の安全が確保されている場合には、そのことを思い出してもらう」; 「できない約束や、うわべだけの気休めを言ってはなりません」 / Say that you are there to help. Say "safe" only when it is true. | differs (minor) | changed | Go to the person calmly. Say: "I am here to help." If the person is safe now, tell them so. |
| 2 | fa-psychological-2 | Breathe in 4 s, hold 4 s, out 4 s | who-pfa-ja p.33; jrcs-news-2026-11 | 「自分の呼吸に注意を集中し、ゆっくり息をするようにすすめる」; 「衣服をゆるめ、本人が楽だと感じる姿勢をとらせ、落ち着いた声で「ゆっくりと呼吸する」ことを促します。」 / Encourage slow breathing in a calm voice. Comfortable position. Loosen clothes. No count, no breath hold. | differs | changed | If the person breathes too fast, speak in a calm voice. Ask them to breathe slowly. Help them sit in a comfortable position. Loosen tight clothes. |
| 3 | fa-psychological-3 | 5-4-3 grounding | who-pfa-ja p.33 | 「床に足をつけてそれを感じる」「周囲から、苦痛をもたらさないものを選んで、注意を向けてもらう。見たり、聞いたり、感じとれるものを選び、何が見えるか、聞こえるか、教えてもらう」 / Feel the feet on the floor. Say what they see and hear. No numbers. | differs | changed | If the person feels unreal or far away, ask them to feel their feet on the floor. Ask them to tell you what they can see and hear. |
| 4 | fa-psychological-4 | Listen; do not say "Calm down"; say "I understand" | who-pfa-ja p.24-25, p.54 | 「無理に話をさせてはなりません」「価値判断をしてはなりません」; example:「お気持ちはわかります。」 / Do not force them to talk. Do not judge. "I understand how you feel." | match | verified | Listen without judging. Let them talk or cry. Do not say "Calm down." Say "I understand." |
| 5 | fa-psychological-5 | Help with practical needs | who-pfa-ja p.34 | 「生きていく上での基本的ニーズ（避難場所、食料、水や衛生的環境など）」「人びとを大切な人や社会的支援と結びつける」 / Help with basic needs. Connect people with loved ones and support. | match | verified | Help with practical needs, like water, a blanket, or contacting their family. Small actions help them feel safe. |

## Tips

The first-aid tips in `FIRSTAID_TIPS` repeat card content. Each tip now uses the audited text of its card step, so the tip and the card say the same thing. A tip is a short form of its card step: each tip must fit 110 characters in English and Indonesian (`src/character/__tests__/tips.test.ts`), so some tips keep only the main point. The sources and quotes are in the card rows above.

| Claim ID | Old tip (English) | Card row | Status | Final tip (English) |
|---|---|---|---|---|
| tip-bleeding-pressure (new) | Bleeding: press firmly on the wound. Direct pressure works better than a special bandage. | Bleeding 2 ("better than a special bandage" has no source) | changed | Bleeding: press firmly on the wound with a clean cloth. Keep pressing until paramedics arrive. |
| tip-burn-cooling | Burn: cool it in water for 10 min or more. Cover it loosely with a clean cloth. No ice, butter, or toothpaste. | Burns 1, 3 | changed | Burn: cool under running tap water for 10 to 20 minutes. Large burn: cool for less time. No ice or butter. |
| tip-cpr-depth | CPR: push hard and fast, 100 to 120 a minute. Adults 5 to 6 cm, children 1/3 of chest depth. Take a course. | CPR 4 | changed | CPR: push hard and fast, 100 to 120 a minute. Adults about 5 cm, children and babies 1/3 of chest depth. |
| tip-aed-places (new) | AEDs in Japan are in train stations, convenience stores, and schools. Look for the green heart sign. | CPR 5 warning ("green heart sign" has no source) | changed | In Japan, many stations, schools, and some convenience stores have an AED. Look for the AED sign. |
| tip-smoke-low (new) | Smoke: stay low. Cover your mouth with a wet cloth. Follow the green exit signs. | Smoke 1, 2 | changed | Smoke: stay low. Cover your nose and mouth with any cloth. Do not lose time to make it wet. |
| tip-shock-position | Blood loss shock: lay them flat, raise the legs. Hard to breathe: half sitting. Always call 119. | Shock 1, 2 | changed | Shock: lay the person flat on the back. Hard to breathe: easiest position. Vomiting: on the side. Call 119. |
| tip-crush | Crushed for more than 15 minutes: DO NOT free them yourself. Call 119 now. | Crush 1 (the 15 minute rule is gone) | changed | Trapped person: call 119. Make sure the place is safe for you. Free them slowly and carefully. |
| tip-breathing | If you panic: breathe in for 4 counts, hold for 4, breathe out for 4. | Psychological 2 (the 4-4-4 count is gone) | changed | Fast breathing from panic: speak calmly. Ask the person to breathe slowly. Help them sit comfortably. |

## Choices on optional texts

The audit lists some first-pass texts as "optional". These are the choices:

- Applied: Bleeding 1 (plastic bag), Fractures 2 (splint length), Shock 1 (call 119 at once), the CPR breathing-check third sentence (stay and watch if the breathing is normal), Crush 1 "Make sure that the place is safe for you."
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
