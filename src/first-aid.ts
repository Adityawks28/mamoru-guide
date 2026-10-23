import { currentLang } from './lang';

interface FirstAidStep {
  instruction_en: string;
  instruction_ja: string;
  instruction_id: string;
  warning_en?: string;
  warning_ja?: string;
  warning_id?: string;
  timer_seconds?: number;
}

interface FirstAidCategory {
  id: string;
  icon: string;
  title_en: string;
  title_ja: string;
  title_id: string;
  steps: FirstAidStep[];
}

const categories: FirstAidCategory[] = [
  {
    id: 'bleeding', icon: '🩸',
    title_en: 'Bleeding Control', title_ja: '血を止める', title_id: 'Menghentikan Pendarahan',
    steps: [
      { instruction_en: 'Put on gloves, or use a clean cloth between your hand and the blood.', instruction_ja: '手袋をしてください。または、きれいな布を手と血の間に入れてください。', instruction_id: 'Pakai sarung tangan, atau pakai kain bersih di antara tangan Anda dan darah.' },
      { instruction_en: 'Press firmly and directly on the wound with a clean cloth or a bandage.', instruction_ja: 'きれいな布や包帯で、傷口を直接、強く押さえてください。', instruction_id: 'Tekan luka secara langsung dan kuat dengan kain bersih atau perban.', timer_seconds: 600 },
      { instruction_en: 'If blood comes through the cloth, do NOT remove the cloth. Put more cloth on top.', instruction_ja: '布に血がしみても、布を外さないでください。上に布を重ねてください。', instruction_id: 'Jika darah tembus ke kain, JANGAN lepas kainnya. Tambahkan kain lagi di atasnya.', warning_en: 'If you stop the pressure, the bleeding starts again.', warning_ja: '押さえるのをやめると、また血が出ます。', warning_id: 'Jika tekanan dilepas, darah akan keluar lagi.' },
      { instruction_en: 'If possible, raise the injured area above the heart.', instruction_ja: 'できれば、けがをした所を心臓より高く上げてください。', instruction_id: 'Jika bisa, angkat bagian yang terluka lebih tinggi dari jantung.' },
      { instruction_en: 'If an arm or leg bleeds severely and the bleeding does not stop, use a tourniquet (a tight band). Put it 5 to 7 cm above the wound. Write down the time.', instruction_ja: '腕や足から血がたくさん出て止まらないときは、ターニケット（止血帯）を使ってください。傷口から5〜7cm上に巻いてください。時間を書いておいてください。', instruction_id: 'Jika lengan atau kaki berdarah parah dan darah tidak berhenti, pakai torniket (ikatan kencang). Pasang 5 sampai 7 cm di atas luka. Catat waktunya.', warning_en: 'Use a tourniquet only when nothing else stops the bleeding. Never loosen it after you put it on.', warning_ja: 'ターニケットは、ほかの方法で血が止まらないときだけ使ってください。一度巻いたら、緩めないでください。', warning_id: 'Pakai torniket hanya jika cara lain tidak bisa menghentikan darah. Jangan longgarkan setelah dipasang.' },
    ],
  },
  {
    id: 'burns', icon: '🔥',
    title_en: 'Burns', title_ja: 'やけど', title_id: 'Luka Bakar',
    steps: [
      { instruction_en: 'Cool the burn immediately under cool running water (not cold water).', instruction_ja: 'すぐに、流れる水でやけどを冷やしてください。冷たすぎる水は使わないでください。', instruction_id: 'Segera dinginkan luka bakar dengan air mengalir yang sejuk (bukan air dingin).', timer_seconds: 600 },
      { instruction_en: 'Remove jewelry, watches, or tight clothing near the burn before swelling starts.', instruction_ja: '腫れる前に、やけどの近くのアクセサリー、時計、きつい服を外してください。', instruction_id: 'Lepaskan perhiasan, jam tangan, atau pakaian ketat di dekat luka sebelum mulai bengkak.' },
      { instruction_en: 'Do NOT remove clothing that is stuck to the burn. Do NOT break blisters.', instruction_ja: 'やけどにくっついた服は、はがさないでください。水ぶくれは、つぶさないでください。', instruction_id: 'JANGAN lepas pakaian yang menempel di luka. JANGAN pecahkan lepuh.', warning_en: 'Never use ice, butter, or toothpaste on a burn.', warning_ja: '氷、バター、歯みがき粉を、やけどに使わないでください。', warning_id: 'Jangan pakai es, mentega, atau pasta gigi pada luka bakar.' },
      { instruction_en: 'Cover the burn loosely with a clean material that does not leave fibers. Plastic food wrap (cling film) works well.', instruction_ja: 'きれいで、糸くずが出ない物で、やけどをゆるく覆ってください。食品用のラップがよいです。', instruction_id: 'Tutup luka dengan longgar memakai bahan bersih yang tidak berbulu. Plastik pembungkus makanan cocok untuk ini.' },
      { instruction_en: 'Get medical help immediately if the burn is large, or if it is on the face, hands, or joints.', instruction_ja: 'やけどが大きいときや、顔・手・関節のやけどは、すぐに医療機関（病院など）に行ってください。', instruction_id: 'Segera cari bantuan medis jika luka bakar besar, atau ada di wajah, tangan, atau sendi.' },
    ],
  },
  {
    id: 'fractures', icon: '🦴',
    title_en: 'Fractures & Sprains', title_ja: '骨折・捻挫', title_id: 'Patah Tulang & Keseleo',
    steps: [
      { instruction_en: 'Do NOT move the injured arm or leg. Keep the person still.', instruction_ja: 'けがをした手や足を動かさないでください。けがをした人が動かないようにしてください。', instruction_id: 'JANGAN gerakkan lengan atau kaki yang cedera. Jaga agar orang itu tetap diam.' },
      { instruction_en: 'Use a splint (a stiff support) to hold the injured area still. Make it from magazines, cardboard, or other stiff material.', instruction_ja: '副木（そえぎ：かたい支え）で、けがをした所を固定してください。雑誌、段ボール、かたい物で作れます。', instruction_id: 'Pakai bidai (penyangga kaku) agar bagian yang cedera tidak bergerak. Buat bidai dari majalah, kardus, atau bahan kaku lain.' },
      { instruction_en: 'Put cloth on the splint as padding. Tie the splint above and below the injury, not on the injury.', instruction_ja: '副木を布で包んでください。けがをした所より上と下で結んでください。けがをした所では結ばないでください。', instruction_id: 'Lapisi bidai dengan kain. Ikat bidai di atas dan di bawah bagian yang cedera, bukan tepat di bagian yang cedera.' },
      { instruction_en: 'Put ice wrapped in cloth on the injury to reduce swelling. Keep it on for 20 minutes, then remove it for 20 minutes.', instruction_ja: '布で包んだ氷で冷やして、腫れをおさえてください。20分冷やしたら、20分休みます。', instruction_id: 'Tempelkan es yang dibungkus kain untuk mengurangi bengkak. Tempelkan 20 menit, lalu lepas 20 menit.' },
      { instruction_en: 'Check the blood flow below the injury. The fingers or toes should be warm and not pale.', instruction_ja: 'けがをした所より先の血の流れを確認してください。指先が温かく、色が悪くないかを見ます。', instruction_id: 'Periksa aliran darah di bawah cedera. Jari tangan atau kaki harus hangat dan tidak pucat.' },
    ],
  },
  {
    id: 'crush', icon: '⚠️',
    title_en: 'Crush Injury', title_ja: '圧挫症候群', title_id: 'Cedera Himpitan',
    steps: [
      { instruction_en: 'If a person is trapped under debris for more than 15 minutes, DO NOT free them yourself.', instruction_ja: 'がれきの下に15分以上はさまれている人を、自分で助け出さないでください。', instruction_id: 'Jika seseorang terjebak di bawah puing lebih dari 15 menit, JANGAN keluarkan dia sendiri.', warning_en: 'If you free a crushed arm or leg, toxins (harmful substances) can go into the blood. This can suddenly stop the heart.', warning_ja: 'はさまれた手や足を出すと、毒（体に悪い物）が血に入ることがあります。急に心臓が止まるかもしれません。', warning_id: 'Jika lengan atau kaki yang terhimpit dibebaskan, racun bisa masuk ke darah. Ini bisa membuat jantung tiba-tiba berhenti.' },
      { instruction_en: 'Call 119 immediately. Tell them it is a crush injury (圧挫 / あつざ).', instruction_ja: 'すぐに119に電話してください。「圧挫傷（あつざしょう）です」と伝えてください。', instruction_id: 'Segera hubungi 119. Katakan bahwa ini cedera himpitan (圧挫 / atsuza).' },
      { instruction_en: 'Keep the person calm. If the person is conscious and can swallow, give them water.', instruction_ja: 'けがをした人を落ち着かせてください。意識があって、飲みこめるなら、水をあげてください。', instruction_id: 'Tenangkan korban. Jika korban sadar dan bisa menelan, beri dia air.' },
      { instruction_en: 'Keep the person warm with blankets. Watch for confusion or sleepiness.', instruction_ja: '毛布で体を温めてください。混乱していないか、眠そうでないか、よく見てください。', instruction_id: 'Jaga korban tetap hangat dengan selimut. Perhatikan apakah korban bingung atau mengantuk.' },
      { instruction_en: 'Write down the time they were trapped. This information is important for paramedics.', instruction_ja: 'はさまれていた時間をメモしてください。救急隊にとって大切な情報です。', instruction_id: 'Catat waktu korban terjebak. Informasi ini penting untuk paramedis.' },
    ],
  },
  {
    id: 'cpr', icon: '💓',
    title_en: 'CPR Basics', title_ja: '心肺蘇生法', title_id: 'Dasar CPR',
    steps: [
      { instruction_en: 'Check if the person responds. Tap their shoulders and shout "Are you OK?"', instruction_ja: '反応があるか確認してください。肩をたたいて「大丈夫ですか？」と大きな声で呼びかけます。', instruction_id: 'Periksa apakah orang itu merespons. Tepuk bahunya dan teriakkan "Apakah Anda baik-baik saja?"' },
      { instruction_en: 'Call 119, or ask a person near you to call. Ask someone to bring an AED (a machine that gives the heart an electric shock).', instruction_ja: '119に電話してください。または、近くの人に電話をたのんでください。AED（心臓に電気ショックをあたえる機械）を持ってきてもらってください。', instruction_id: 'Hubungi 119, atau minta orang di dekat Anda untuk menelepon. Minta seseorang membawa AED (alat kejut jantung).' },
      { instruction_en: 'Put the heel of one hand (the base of your palm) on the center of the chest. Put your other hand on top.', instruction_ja: '片方の手のひらの付け根を、胸の真ん中に置いてください。もう片方の手を上に重ねてください。', instruction_id: 'Letakkan pangkal telapak tangan di tengah dada. Letakkan tangan lainnya di atasnya.' },
      { instruction_en: 'Push hard and fast: 100 to 120 pushes per minute. Adults: 5 to 6 cm deep. Children: about 1/3 of the chest depth (about 5 cm). Infants: about 1/3 of the chest depth (about 4 cm, use two fingers). Let the chest come fully back up after each push.', instruction_ja: '強く、速く押してください。1分間に100〜120回です。大人：5〜6cmの深さ。子ども：胸の厚さの約3分の1（約5cm）。赤ちゃん：胸の厚さの約3分の1（約4cm、指2本で押す）。押したあと、胸を完全に元にもどしてください。', instruction_id: 'Tekan dengan kuat dan cepat: 100 sampai 120 kali per menit. Dewasa: sedalam 5 sampai 6 cm. Anak: sekitar 1/3 tebal dada (sekitar 5 cm). Bayi: sekitar 1/3 tebal dada (sekitar 4 cm, pakai dua jari). Biarkan dada kembali naik sepenuhnya setiap kali.' },
      { instruction_en: 'Do NOT stop the chest pushes until paramedics arrive or an AED is ready.', instruction_ja: '救急隊が来るまで、またはAEDの準備ができるまで、胸を押すのをやめないでください。', instruction_id: 'JANGAN berhenti menekan dada sampai paramedis tiba atau AED siap.', warning_en: 'Japan has many AEDs, for example in train stations, convenience stores, and schools. Look for the green heart sign.', warning_ja: '日本には、駅、コンビニ、学校などに、たくさんAEDがあります。緑のハートのマークをさがしてください。', warning_id: 'Di Jepang, banyak AED di stasiun kereta, minimarket, dan sekolah. Cari tanda hati berwarna hijau.' },
    ],
  },
  {
    id: 'shock', icon: '😰',
    title_en: 'Shock Management', title_ja: 'ショックへの対応', title_id: 'Penanganan Syok',
    steps: [
      { instruction_en: 'Look for these signs: pale, cold, or damp skin; fast breathing; confusion; weakness.', instruction_ja: '次のような様子がないか見てください：青白く、冷たく、しめった肌。速い呼吸。混乱。力が入らない。', instruction_id: 'Cari tanda-tanda ini: kulit pucat, dingin, atau berkeringat; napas cepat; bingung; lemas.' },
      { instruction_en: 'Shock from blood loss: lay the person flat on their back. Raise their legs 20 to 30 cm. Breathing difficulty or chest injury: keep them half sitting up. If they are vomiting, never lay them flat on their back. Turn them on their side.', instruction_ja: '出血によるショック：あおむけに寝かせて、足を20〜30cm上げてください。息が苦しいとき、胸にけががあるとき：上半身を起こして、半分すわった姿勢にしてください。吐いているときは、あおむけにしないで、横向きにしてください。', instruction_id: 'Syok karena kehilangan darah: baringkan telentang. Angkat kaki 20 sampai 30 cm. Sesak napas atau cedera dada: posisikan setengah duduk. Jika muntah, jangan baringkan telentang. Miringkan badannya ke samping.' },
      { instruction_en: 'Cover the person with a blanket or jacket to keep them warm. Do not let the cold ground take their body heat.', instruction_ja: '毛布やジャケットをかけて、体を温めてください。冷たい地面で体が冷えないようにしてください。', instruction_id: 'Selimuti dengan selimut atau jaket agar tetap hangat. Jangan biarkan tanah yang dingin menyerap panas tubuhnya.' },
      { instruction_en: 'Do NOT give food or drink. If they ask, wet their lips with water.', instruction_ja: '食べ物や飲み物をあげないでください。ほしいと言われたら、水でくちびるをぬらしてください。', instruction_id: 'JANGAN beri makanan atau minuman. Jika diminta, basahi bibirnya dengan air.' },
      { instruction_en: 'Stay with the person. Talk to them calmly. Watch their breathing until help arrives.', instruction_ja: 'そばにいてください。落ち着いて話しかけてください。助けが来るまで、呼吸をよく見ていてください。', instruction_id: 'Tetap di dekatnya. Bicara dengan tenang. Perhatikan napasnya sampai bantuan datang.' },
    ],
  },
  {
    id: 'smoke', icon: '💨',
    title_en: 'Breathing Smoke', title_ja: '煙を吸ったとき', title_id: 'Menghirup Asap',
    steps: [
      { instruction_en: 'Keep your body low. Crawl on your hands and knees. Smoke goes up, so the air near the floor is cleaner.', instruction_ja: '体を低くしてください。手とひざをついて進んでください。煙は上に行くので、床の近くの空気のほうがきれいです。', instruction_id: 'Rendahkan badan. Merangkak dengan tangan dan lutut. Asap naik ke atas, jadi udara di dekat lantai lebih bersih.' },
      { instruction_en: 'If you have a wet cloth, cover your nose and mouth with it. Breathe through the cloth.', instruction_ja: 'ぬれた布があれば、それで鼻と口を覆ってください。布を通して息をしてください。', instruction_id: 'Jika ada kain basah, tutup hidung dan mulut dengan kain itu. Bernapas melalui kain.' },
      { instruction_en: 'Before you open a door, touch the handle with the back of your hand. If it is hot, there is fire behind the door.', instruction_ja: 'ドアを開ける前に、手の甲でドアノブにさわってください。熱いときは、ドアの向こうに火があります。', instruction_id: 'Sebelum membuka pintu, sentuh gagangnya dengan punggung tangan. Jika panas, ada api di balik pintu.', warning_en: 'Never open a hot door. Find another way out.', warning_ja: '熱いドアは、絶対に開けないでください。ほかの出口をさがしてください。', warning_id: 'Jangan pernah buka pintu yang panas. Cari jalan keluar lain.' },
      { instruction_en: 'Go to the nearest exit. Follow the emergency exit signs (they are green in Japan).', instruction_ja: 'いちばん近い出口に向かってください。非常口のマーク（日本では緑色）に従ってください。', instruction_id: 'Pergi ke pintu keluar terdekat. Ikuti tanda pintu darurat (warnanya hijau di Jepang).' },
      { instruction_en: 'Outside, if a person breathed in smoke: sit them upright, loosen their clothes, and call 119.', instruction_ja: '外に出たら、煙を吸った人は、体を起こしてすわらせてください。服をゆるめて、119に電話してください。', instruction_id: 'Setelah di luar, jika ada yang menghirup asap: dudukkan dia dengan tegak, longgarkan pakaiannya, dan hubungi 119.' },
    ],
  },
  {
    id: 'psychological', icon: '🧠',
    title_en: 'Psychological First Aid', title_ja: '心のケア', title_id: 'Pertolongan Psikologis',
    steps: [
      { instruction_en: 'Go to the person calmly. Say: "You are safe now. I am here to help."', instruction_ja: '落ち着いて近づいてください。「もう安全です。助けに来ました」と言ってください。', instruction_id: 'Dekati dengan tenang. Katakan: "Anda aman sekarang. Saya di sini untuk membantu."' },
      { instruction_en: 'If the person panics or breathes too fast, help them breathe slowly. Breathe in for 4 seconds, hold for 4 seconds, and breathe out for 4 seconds.', instruction_ja: 'パニックや過呼吸（息が速くなりすぎること）のときは、ゆっくり息をするように手伝ってください。4秒吸って、4秒止めて、4秒はきます。', instruction_id: 'Jika dia panik atau napasnya terlalu cepat (hiperventilasi), bantu dia bernapas pelan. Tarik napas 4 detik, tahan 4 detik, buang 4 detik.' },
      { instruction_en: 'Use grounding to help them focus on the present. Ask them to name 5 things they can see, 4 they can touch, and 3 they can hear.', instruction_ja: 'グラウンディング（今、ここに気持ちを向ける方法）：見えるものを5つ、さわれるものを4つ、聞こえるものを3つ、言ってもらってください。', instruction_id: 'Pakai teknik grounding (cara memusatkan pikiran pada saat ini). Minta dia menyebutkan 5 hal yang bisa dilihat, 4 yang bisa disentuh, dan 3 yang bisa didengar.' },
      { instruction_en: 'Listen without judging. Let them talk or cry. Do not say "Calm down." Say "I understand."', instruction_ja: '相手を否定しないで、話を聞いてください。話したり泣いたりさせてあげてください。「落ち着いて」とは言わないでください。「わかります」と言ってください。', instruction_id: 'Dengarkan tanpa menghakimi. Biarkan dia bicara atau menangis. Jangan bilang "Tenang." Katakan "Saya mengerti."' },
      { instruction_en: 'Help with practical needs, like water, a blanket, or contacting their family. Small actions help them feel safe.', instruction_ja: '水、毛布、家族への連絡など、すぐに必要なことを手伝ってください。小さな手助けで、人は安心できます。', instruction_id: 'Bantu kebutuhan praktis, seperti air, selimut, atau menghubungi keluarga. Bantuan kecil membuat orang merasa aman.' },
    ],
  },
];

let currentCategory: number | null = null;
let currentStep = 0;
let timerInterval: ReturnType<typeof setInterval> | null = null;
let timerRemaining = 0;

function getLangText(en: string, ja: string, id: string): string {
  if (currentLang === 'ja') return ja;
  if (currentLang === 'id') return id;
  return en;
}

function reapplyLang(): void {
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);
}

function stopTimer(): void {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function renderCategories(): void {
  const container = document.getElementById('firstAidContainer');
  if (!container) return;
  stopTimer();

  container.innerHTML = `
    <div class="firstaid-grid">
      ${categories.map((cat, i) => `
        <button class="firstaid-card" data-idx="${i}">
          <div class="firstaid-card-icon">${cat.icon}</div>
          <div class="firstaid-card-title">
            <span data-lang="en">${cat.title_en}</span>
            <span data-lang="ja">${cat.title_ja}</span>
            <span data-lang="id">${cat.title_id}</span>
          </div>
          <div class="firstaid-card-count">
            <span data-lang="en">${cat.steps.length} steps</span>
            <span data-lang="ja">${cat.steps.length}ステップ</span>
            <span data-lang="id">${cat.steps.length} langkah</span>
          </div>
        </button>
      `).join('')}
    </div>
  `;

  container.querySelectorAll<HTMLButtonElement>('.firstaid-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.idx;
      if (idx === undefined) return;
      currentCategory = parseInt(idx, 10);
      currentStep = 0;
      renderSteps();
      document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', {
        detail: { step: categories[currentCategory].id },
      }));
    });
  });

  reapplyLang();
}

function renderSteps(): void {
  if (currentCategory === null) return;
  const container = document.getElementById('firstAidContainer');
  if (!container) return;
  stopTimer();

  const cat = categories[currentCategory];
  const step = cat.steps[currentStep];

  let timerHtml = '';
  if (step.timer_seconds) {
    timerRemaining = step.timer_seconds;
    timerHtml = `
      <div class="firstaid-timer" id="firstaidTimer">
        <div class="firstaid-timer-display">${formatTime(step.timer_seconds)}</div>
        <button class="firstaid-timer-btn" id="firstaidTimerBtn">
          <span data-lang="en">▶ Start Timer</span>
          <span data-lang="ja">▶ タイマー開始</span>
          <span data-lang="id">▶ Mulai Timer</span>
        </button>
      </div>
    `;
  }

  let warningHtml = '';
  if (step.warning_en) {
    warningHtml = `
      <div class="firstaid-warning">
        <strong>⚠️</strong>
        <span data-lang="en">${step.warning_en}</span>
        <span data-lang="ja">${step.warning_ja}</span>
        <span data-lang="id">${step.warning_id}</span>
      </div>
    `;
  }

  container.innerHTML = `
    <button class="firstaid-back" id="firstaidBack">
      ← <span data-lang="en">Back to categories</span><span data-lang="ja">カテゴリに戻る</span><span data-lang="id">Kembali ke kategori</span>
    </button>
    <div class="firstaid-header">
      <span class="firstaid-header-icon">${cat.icon}</span>
      <span class="firstaid-header-title">
        <span data-lang="en">${cat.title_en}</span>
        <span data-lang="ja">${cat.title_ja}</span>
        <span data-lang="id">${cat.title_id}</span>
      </span>
    </div>
    <div class="firstaid-progress">
      ${getLangText('Step', 'ステップ', 'Langkah')} ${currentStep + 1} / ${cat.steps.length}
    </div>
    <div class="firstaid-step-content">
      <div class="firstaid-step-number">${currentStep + 1}</div>
      <div class="firstaid-step-text">
        <span data-lang="en">${step.instruction_en}</span>
        <span data-lang="ja">${step.instruction_ja}</span>
        <span data-lang="id">${step.instruction_id}</span>
      </div>
    </div>
    ${warningHtml}
    ${timerHtml}
    <div class="firstaid-nav">
      ${currentStep > 0 ? `<button class="firstaid-nav-btn" id="firstaidPrev"><span data-lang="en">← Previous</span><span data-lang="ja">← 前へ</span><span data-lang="id">← Sebelumnya</span></button>` : '<div></div>'}
      ${currentStep < cat.steps.length - 1 ? `<button class="firstaid-nav-btn primary" id="firstaidNext"><span data-lang="en">Next →</span><span data-lang="ja">次へ →</span><span data-lang="id">Berikutnya →</span></button>` : `<button class="firstaid-nav-btn primary" id="firstaidDone"><span data-lang="en">✓ Done</span><span data-lang="ja">✓ 完了</span><span data-lang="id">✓ Selesai</span></button>`}
    </div>
    <div class="firstaid-dots">
      ${cat.steps.map((_, i) => `<span class="firstaid-dot${i === currentStep ? ' active' : ''}${i < currentStep ? ' completed' : ''}"></span>`).join('')}
    </div>
  `;

  document.getElementById('firstaidBack')?.addEventListener('click', () => {
    currentCategory = null;
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: null } }));
    renderCategories();
  });

  document.getElementById('firstaidPrev')?.addEventListener('click', () => {
    if (currentStep > 0) { currentStep--; renderSteps(); }
  });

  document.getElementById('firstaidNext')?.addEventListener('click', () => {
    if (currentCategory !== null && currentStep < categories[currentCategory].steps.length - 1) {
      currentStep++;
      renderSteps();
    }
  });

  document.getElementById('firstaidDone')?.addEventListener('click', () => {
    currentCategory = null;
    document.dispatchEvent(new CustomEvent('mamoru:firstaid-step', { detail: { step: null } }));
    renderCategories();
  });

  // Timer logic
  const timerBtn = document.getElementById('firstaidTimerBtn');
  if (timerBtn && step.timer_seconds) {
    timerBtn.addEventListener('click', () => {
      const display = document.querySelector('.firstaid-timer-display');
      const timer = document.getElementById('firstaidTimer');
      if (!display || !timer) return;

      if (timerInterval) {
        stopTimer();
        timerBtn.innerHTML = `<span data-lang="en">▶ Start Timer</span><span data-lang="ja">▶ タイマー開始</span><span data-lang="id">▶ Mulai Timer</span>`;
        timer.classList.remove('running');
        reapplyLang();
        return;
      }

      timer.classList.add('running');
      timerBtn.innerHTML = `<span data-lang="en">⏸ Pause</span><span data-lang="ja">⏸ 一時停止</span><span data-lang="id">⏸ Jeda</span>`;
      reapplyLang();

      stopTimer();
      timerInterval = setInterval(() => {
        timerRemaining--;
        display.textContent = formatTime(timerRemaining);
        if (timerRemaining <= 0) {
          stopTimer();
          timer.classList.remove('running');
          timer.classList.add('done');
          display.textContent = getLangText('Time is up', '時間です', 'Waktu habis');
          timerBtn.innerHTML = `<span data-lang="en">✓ Complete</span><span data-lang="ja">✓ 完了</span><span data-lang="id">✓ Selesai</span>`;
          (timerBtn as HTMLButtonElement).disabled = true;
          reapplyLang();
        }
      }, 1000);
    });
  }

  reapplyLang();
}

export function initFirstAid(): void {
  const container = document.getElementById('firstAidContainer');
  if (!container) return;
  renderCategories();
}
