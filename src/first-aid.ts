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
    title_en: 'Bleeding Control', title_ja: '止血', title_id: 'Pengendalian Pendarahan',
    steps: [
      { instruction_en: 'Put on gloves or use a clean cloth as a barrier.', instruction_ja: '手袋をするか、清潔な布をバリアとして使う。', instruction_id: 'Gunakan sarung tangan atau kain bersih sebagai pelindung.' },
      { instruction_en: 'Apply firm, direct pressure to the wound with a clean cloth or bandage.', instruction_ja: '清潔な布や包帯で傷口を強く直接押さえる。', instruction_id: 'Tekan langsung pada luka dengan kain bersih atau perban.', timer_seconds: 600 },
      { instruction_en: 'Do NOT remove the cloth if it soaks through — add more layers on top.', instruction_ja: '布が血で浸みても外さない — 上に重ねる。', instruction_id: 'JANGAN lepas kain jika sudah basah — tambahkan lapisan di atasnya.', warning_en: 'Removing pressure restarts bleeding.', warning_ja: '圧迫を外すと出血が再開します。', warning_id: 'Melepas tekanan memulai ulang pendarahan.' },
      { instruction_en: 'If possible, elevate the injured area above the heart.', instruction_ja: '可能であれば、負傷部位を心臓より高く上げる。', instruction_id: 'Jika memungkinkan, angkat area yang terluka di atas jantung.' },
      { instruction_en: 'For severe limb bleeding that won\'t stop: apply a tourniquet 5-7cm above the wound. Note the time.', instruction_ja: '止まらない四肢の重度出血：傷口の5〜7cm上にターニケットを巻く。時間を記録。', instruction_id: 'Untuk pendarahan parah di anggota tubuh: pasang torniket 5-7cm di atas luka. Catat waktunya.', warning_en: 'Only use tourniquet as last resort. Never loosen once applied.', warning_ja: 'ターニケットは最後の手段。一度巻いたら緩めない。', warning_id: 'Gunakan torniket hanya sebagai pilihan terakhir. Jangan longgarkan setelah dipasang.' },
    ],
  },
  {
    id: 'burns', icon: '🔥',
    title_en: 'Burns', title_ja: 'やけど', title_id: 'Luka Bakar',
    steps: [
      { instruction_en: 'Cool the burn under cool (not cold) running water immediately.', instruction_ja: 'すぐに流水（冷水ではなく涼しい水）でやけどを冷やす。', instruction_id: 'Dinginkan luka bakar di bawah air mengalir yang sejuk (bukan dingin).', timer_seconds: 600 },
      { instruction_en: 'Remove jewelry, watches, or tight clothing near the burn before swelling starts.', instruction_ja: '腫れる前に、やけどの近くのアクセサリーや時計、きつい衣服を外す。', instruction_id: 'Lepaskan perhiasan, jam tangan, atau pakaian ketat di dekat luka sebelum bengkak.' },
      { instruction_en: 'Do NOT remove clothing stuck to the burn. Do NOT pop blisters.', instruction_ja: 'やけどに張り付いた衣服を剥がさない。水ぶくれを潰さない。', instruction_id: 'JANGAN lepas pakaian yang menempel di luka. JANGAN pecahkan lepuh.', warning_en: 'Never use ice, butter, or toothpaste on burns.', warning_ja: '氷、バター、歯磨き粉をやけどに使わない。', warning_id: 'Jangan gunakan es, mentega, atau pasta gigi pada luka bakar.' },
      { instruction_en: 'Cover loosely with a clean, non-fluffy material (cling film works well).', instruction_ja: '清潔で毛羽立ちのない素材で緩く覆う（ラップが効果的）。', instruction_id: 'Tutup longgar dengan bahan bersih yang tidak berbulu (plastik wrap efektif).' },
      { instruction_en: 'For large burns or burns on face/hands/joints: seek medical help immediately.', instruction_ja: '広範囲のやけど、顔・手・関節のやけどは直ちに医療機関へ。', instruction_id: 'Untuk luka bakar besar atau di wajah/tangan/sendi: segera cari bantuan medis.' },
    ],
  },
  {
    id: 'fractures', icon: '🦴',
    title_en: 'Fractures & Sprains', title_ja: '骨折・捻挫', title_id: 'Patah Tulang & Keseleo',
    steps: [
      { instruction_en: 'Do NOT move the injured limb. Keep the person still.', instruction_ja: '負傷した手足を動かさない。患者を安静にする。', instruction_id: 'JANGAN gerakkan anggota tubuh yang cedera. Biarkan orang tersebut diam.' },
      { instruction_en: 'Immobilize the area using a splint — use magazines, cardboard, or stiff material.', instruction_ja: '副木で固定する — 雑誌、段ボール、硬い素材を使う。', instruction_id: 'Imobilisasi area menggunakan bidai — gunakan majalah, kardus, atau bahan kaku.' },
      { instruction_en: 'Pad the splint with cloth and tie it above and below the injury (not on it).', instruction_ja: '副木を布で包み、負傷箇所の上下で固定する（負傷箇所の上には縛らない）。', instruction_id: 'Lapisi bidai dengan kain dan ikat di atas dan bawah cedera (bukan di atasnya).' },
      { instruction_en: 'Apply ice wrapped in cloth to reduce swelling. 20 minutes on, 20 minutes off.', instruction_ja: '布に包んだ氷で冷やして腫れを抑える。20分冷やし、20分休む。', instruction_id: 'Tempelkan es yang dibungkus kain untuk mengurangi bengkak. 20 menit tempel, 20 menit lepas.' },
      { instruction_en: 'Check circulation below the injury — fingers/toes should be warm and have color.', instruction_ja: '負傷部位より先の血流を確認 — 指先は温かく色があるか。', instruction_id: 'Periksa sirkulasi di bawah cedera — jari harus hangat dan berwarna.' },
    ],
  },
  {
    id: 'crush', icon: '⚠️',
    title_en: 'Crush Injury', title_ja: '圧挫症候群', title_id: 'Cedera Himpitan',
    steps: [
      { instruction_en: 'If someone is trapped under debris for more than 15 minutes: DO NOT free them yourself.', instruction_ja: '15分以上がれきの下に挟まれている場合：自分で助け出さない。', instruction_id: 'Jika seseorang terjebak di bawah puing lebih dari 15 menit: JANGAN bebaskan sendiri.', warning_en: 'Releasing a crushed limb can release toxins into the bloodstream, causing sudden cardiac arrest.', warning_ja: '圧挫された四肢を解放すると毒素が血流に入り、突然の心停止を引き起こす可能性があります。', warning_id: 'Membebaskan anggota tubuh yang terhimpit bisa melepaskan racun ke aliran darah, menyebabkan henti jantung mendadak.' },
      { instruction_en: 'Call 119 immediately. Tell them it\'s a crush injury (圧挫 / あつざ).', instruction_ja: 'すぐに119に電話。圧挫傷（あつざしょう）と伝える。', instruction_id: 'Hubungi 119 segera. Katakan ini cedera himpitan (圧挫 / atsuza).' },
      { instruction_en: 'Keep the person calm. Give water if conscious and able to swallow.', instruction_ja: '患者を落ち着かせる。意識があり飲み込めるなら水を与える。', instruction_id: 'Tenangkan korban. Beri air jika sadar dan bisa menelan.' },
      { instruction_en: 'Keep the person warm with blankets. Monitor for confusion or drowsiness.', instruction_ja: '毛布で保温する。混乱や眠気がないか観察する。', instruction_id: 'Jaga korban tetap hangat dengan selimut. Awasi kebingungan atau kantuk.' },
      { instruction_en: 'Mark the time they were trapped. This information is critical for paramedics.', instruction_ja: '挟まれていた時間を記録。救急隊にとって重要な情報。', instruction_id: 'Catat waktu mereka terjebak. Informasi ini penting untuk paramedis.' },
    ],
  },
  {
    id: 'cpr', icon: '💓',
    title_en: 'CPR Basics', title_ja: '心肺蘇生法', title_id: 'Dasar CPR',
    steps: [
      { instruction_en: 'Check if the person is responsive: tap their shoulders and shout "Are you OK?"', instruction_ja: '反応を確認：肩を叩いて「大丈夫ですか？」と呼びかける。', instruction_id: 'Periksa respons: tepuk bahu mereka dan teriak "Apakah Anda baik-baik saja?"' },
      { instruction_en: 'Call 119 (or ask someone nearby). Ask someone to bring an AED.', instruction_ja: '119に電話（または近くの人に頼む）。AEDを持ってきてもらう。', instruction_id: 'Hubungi 119 (atau minta orang di sekitar). Minta seseorang membawa AED.' },
      { instruction_en: 'Place the heel of one hand on the center of the chest. Put your other hand on top.', instruction_ja: '片手のかかとを胸の中央に置く。もう一方の手を重ねる。', instruction_id: 'Letakkan pangkal telapak tangan di tengah dada. Letakkan tangan lainnya di atas.' },
      { instruction_en: 'Push hard and fast: 5-6cm deep, 100-120 pushes per minute. Let the chest fully recoil.', instruction_ja: '強く速く押す：5〜6cm深く、1分間に100〜120回。胸を完全に戻す。', instruction_id: 'Tekan keras dan cepat: 5-6cm dalam, 100-120 tekanan per menit. Biarkan dada kembali sepenuhnya.' },
      { instruction_en: 'Do NOT stop compressions until paramedics arrive or an AED is ready.', instruction_ja: '救急隊が到着するかAEDが準備できるまで圧迫を止めない。', instruction_id: 'JANGAN hentikan kompresi sampai paramedis tiba atau AED siap.', warning_en: 'AEDs are common in Japan: train stations, convenience stores, schools. Look for the green heart sign.', warning_ja: 'AEDは日本では一般的：駅、コンビニ、学校。緑のハートマークを探す。', warning_id: 'AED umum di Jepang: stasiun kereta, minimarket, sekolah. Cari tanda hati hijau.' },
    ],
  },
  {
    id: 'shock', icon: '😰',
    title_en: 'Shock Management', title_ja: 'ショック対応', title_id: 'Penanganan Syok',
    steps: [
      { instruction_en: 'Look for signs: pale/cold/clammy skin, rapid breathing, confusion, weakness.', instruction_ja: '症状を確認：青白く冷たい湿った肌、速い呼吸、混乱、脱力。', instruction_id: 'Cari tanda: kulit pucat/dingin/berkeringat, napas cepat, bingung, lemas.' },
      { instruction_en: 'Lay the person flat on their back. Elevate legs 20-30cm if no spinal injury suspected.', instruction_ja: '仰向けに寝かせる。脊椎損傷の疑いがなければ足を20〜30cm上げる。', instruction_id: 'Baringkan orang terlentang. Angkat kaki 20-30cm jika tidak dicurigai cedera tulang belakang.' },
      { instruction_en: 'Cover them with a blanket or jacket to keep warm. Prevent heat loss from the ground.', instruction_ja: '毛布やジャケットで保温する。地面からの熱の喪失を防ぐ。', instruction_id: 'Selimuti dengan selimut atau jaket agar tetap hangat. Cegah kehilangan panas dari tanah.' },
      { instruction_en: 'Do NOT give food or drink. Moisten their lips with water if requested.', instruction_ja: '飲食物を与えない。求められたら唇を水で湿らせる。', instruction_id: 'JANGAN beri makanan atau minuman. Basahi bibir dengan air jika diminta.' },
      { instruction_en: 'Stay with them, talk calmly, and monitor breathing until help arrives.', instruction_ja: 'そばにいて、落ち着いて話しかけ、助けが来るまで呼吸を監視する。', instruction_id: 'Tetap bersama mereka, bicara dengan tenang, dan pantau pernapasan sampai bantuan tiba.' },
    ],
  },
  {
    id: 'smoke', icon: '💨',
    title_en: 'Smoke Inhalation', title_ja: '煙の吸入', title_id: 'Menghirup Asap',
    steps: [
      { instruction_en: 'Get low — crawl on your hands and knees. Smoke rises, cleaner air is near the floor.', instruction_ja: '低い姿勢で — 四つん這いで移動。煙は上昇し、床近くの空気がきれい。', instruction_id: 'Merendahlah — merangkak. Asap naik, udara bersih ada di dekat lantai.' },
      { instruction_en: 'Cover your nose and mouth with a wet cloth if available. Breathe through it.', instruction_ja: '可能であれば濡れた布で鼻と口を覆い、その布を通して呼吸する。', instruction_id: 'Tutup hidung dan mulut dengan kain basah jika tersedia. Bernapas melaluinya.' },
      { instruction_en: 'Before opening doors: touch the handle with the back of your hand. Hot = fire behind it.', instruction_ja: 'ドアを開ける前：手の甲でハンドルに触れる。熱い＝向こうに火がある。', instruction_id: 'Sebelum membuka pintu: sentuh gagang dengan punggung tangan. Panas = ada api di baliknya.', warning_en: 'Never open a hot door. Find another exit route.', warning_ja: '熱いドアは絶対に開けない。別の出口を探す。', warning_id: 'Jangan pernah buka pintu yang panas. Cari rute keluar lain.' },
      { instruction_en: 'Move toward the nearest exit. Follow emergency exit signs (green in Japan).', instruction_ja: '最寄りの出口に向かう。非常口のサインに従う（日本では緑色）。', instruction_id: 'Bergerak menuju pintu keluar terdekat. Ikuti tanda exit darurat (hijau di Jepang).' },
      { instruction_en: 'Once outside, if someone inhaled smoke: sit them upright, loosen clothing, call 119.', instruction_ja: '外に出たら、煙を吸った人は：座らせ、衣服を緩め、119に電話。', instruction_id: 'Setelah di luar, jika seseorang menghirup asap: dudukkan tegak, longgarkan pakaian, hubungi 119.' },
    ],
  },
  {
    id: 'psychological', icon: '🧠',
    title_en: 'Psychological First Aid', title_ja: '心のケア', title_id: 'Pertolongan Psikologis',
    steps: [
      { instruction_en: 'Approach calmly. Say: "You are safe now. I\'m here to help."', instruction_ja: '落ち着いて近づく。「もう安全です。助けに来ました。」と言う。', instruction_id: 'Dekati dengan tenang. Katakan: "Anda aman sekarang. Saya di sini untuk membantu."' },
      { instruction_en: 'For panic/hyperventilation: guide them to breathe slowly. In for 4, hold for 4, out for 4.', instruction_ja: 'パニック・過呼吸の場合：ゆっくり呼吸するよう導く。4秒吸い、4秒止め、4秒吐く。', instruction_id: 'Untuk panik/hiperventilasi: arahkan bernapas perlahan. Tarik 4 detik, tahan 4 detik, buang 4 detik.' },
      { instruction_en: 'Grounding technique: ask them to name 5 things they can see, 4 they can touch, 3 they can hear.', instruction_ja: 'グラウンディング：見えるもの5つ、触れるもの4つ、聞こえるもの3つを挙げてもらう。', instruction_id: 'Teknik grounding: minta mereka sebutkan 5 hal yang dilihat, 4 yang disentuh, 3 yang didengar.' },
      { instruction_en: 'Listen without judging. Let them talk or cry. Don\'t say "calm down" — say "I understand."', instruction_ja: '批判せず聞く。話したり泣いたりさせる。「落ち着いて」ではなく「わかります」と言う。', instruction_id: 'Dengarkan tanpa menghakimi. Biarkan mereka bicara atau menangis. Jangan bilang "tenang" — katakan "Saya mengerti."' },
      { instruction_en: 'Help with practical needs: water, a blanket, contacting family. Small actions build safety.', instruction_ja: '実際的なニーズを手伝う：水、毛布、家族への連絡。小さな行動が安心感を作る。', instruction_id: 'Bantu kebutuhan praktis: air, selimut, menghubungi keluarga. Tindakan kecil membangun rasa aman.' },
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
      currentCategory = parseInt(btn.dataset.idx!, 10);
      currentStep = 0;
      renderSteps();
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

      timerInterval = setInterval(() => {
        timerRemaining--;
        display.textContent = formatTime(timerRemaining);
        if (timerRemaining <= 0) {
          stopTimer();
          timer.classList.remove('running');
          timer.classList.add('done');
          display.textContent = getLangText('Time\'s up!', '時間です！', 'Waktu habis!');
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
