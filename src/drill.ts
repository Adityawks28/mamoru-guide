import { showToast } from './toast';
import { currentLang } from './lang';

interface DrillScenario {
  situation_en: string;
  situation_ja: string;
  situation_id: string;
  options: { en: string; ja: string; id: string }[];
  correct: number;
  explain_en: string;
  explain_ja: string;
  explain_id: string;
  shake?: boolean;
}

const scenarios: DrillScenario[] = [
  {
    situation_en: 'Strong shaking! You\'re at your desk in a 4th floor classroom. What do you do?',
    situation_ja: '強い揺れ！4階の教室の机にいます。どうしますか？',
    situation_id: 'Guncangan kuat! Anda di meja di kelas lantai 4. Apa yang Anda lakukan?',
    options: [
      { en: 'Run to the exit immediately', ja: 'すぐに出口に走る', id: 'Lari ke pintu keluar segera' },
      { en: 'Drop, Cover, Hold On under the desk', ja: '机の下で身を守る（DROP, COVER, HOLD ON）', id: 'Merunduk, berlindung di bawah meja' },
      { en: 'Look out the window to see what\'s happening', ja: '窓の外を見て何が起きているか確認', id: 'Lihat keluar jendela untuk melihat apa yang terjadi' },
      { en: 'Call a friend to ask what to do', ja: '友達に電話してどうすればいいか聞く', id: 'Telepon teman untuk bertanya apa yang harus dilakukan' },
    ],
    correct: 1,
    explain_en: 'DROP to the ground, take COVER under sturdy furniture, and HOLD ON. Running during shaking is dangerous — falling objects and broken glass injure more people than collapsing buildings.',
    explain_ja: '地面に伏せ（DROP）、丈夫な家具の下に隠れ（COVER）、しっかりつかまる（HOLD ON）。揺れている間に走るのは危険です。',
    explain_id: 'MERUNDUK ke tanah, BERLINDUNG di bawah furniture kokoh, dan BERTAHAN. Berlari saat guncangan berbahaya — benda jatuh dan kaca pecah melukai lebih banyak orang.',
    shake: true,
  },
  {
    situation_en: 'The shaking has stopped. The building seems intact but you smell something strange. What\'s your next move?',
    situation_ja: '揺れが止まりました。建物は無事のようですが、何か変な匂いがします。次に何をしますか？',
    situation_id: 'Guncangan berhenti. Bangunan tampak utuh tapi Anda mencium bau aneh. Langkah selanjutnya?',
    options: [
      { en: 'Turn on the lights to check the room', ja: '電気をつけて部屋を確認', id: 'Nyalakan lampu untuk memeriksa ruangan' },
      { en: 'Open windows and carefully evacuate — it could be gas', ja: '窓を開けて慎重に避難 — ガスかもしれない', id: 'Buka jendela dan evakuasi dengan hati-hati — bisa jadi gas' },
      { en: 'Take the elevator to exit quickly', ja: 'エレベーターで素早く出る', id: 'Naik elevator untuk keluar cepat' },
      { en: 'Light a candle to see better', ja: 'ロウソクをつけてよく見る', id: 'Nyalakan lilin untuk melihat lebih jelas' },
    ],
    correct: 1,
    explain_en: 'Open windows for ventilation and evacuate via stairs. NEVER use elevators, electrical switches, or open flames after an earthquake — a gas leak can cause an explosion.',
    explain_ja: '換気のため窓を開け、階段で避難。地震後はエレベーター、電気スイッチ、火気を絶対に使わない — ガス漏れで爆発の危険。',
    explain_id: 'Buka jendela untuk ventilasi dan evakuasi lewat tangga. JANGAN gunakan elevator, saklar listrik, atau api terbuka — kebocoran gas bisa menyebabkan ledakan.',
  },
  {
    situation_en: 'You\'re outside now. Someone nearby is bleeding from a head wound. What do you do?',
    situation_ja: '外に出ました。近くで頭から出血している人がいます。どうしますか？',
    situation_id: 'Anda sudah di luar. Seseorang di dekat Anda berdarah dari luka di kepala. Apa yang Anda lakukan?',
    options: [
      { en: 'Apply direct pressure with a clean cloth and call 119', ja: '清潔な布で直接圧迫し119に電話', id: 'Tekan langsung dengan kain bersih dan hubungi 119' },
      { en: 'Move them to a different location first', ja: 'まず別の場所に移動させる', id: 'Pindahkan mereka ke lokasi lain dulu' },
      { en: 'Pour water on the wound to clean it', ja: '傷口に水をかけて洗う', id: 'Tuangkan air pada luka untuk membersihkan' },
      { en: 'Leave them — professionals will come', ja: '放っておく — プロが来る', id: 'Tinggalkan mereka — profesional akan datang' },
    ],
    correct: 0,
    explain_en: 'Apply firm, direct pressure with the cleanest cloth available and call 119 for help. Don\'t move an injured person unless they\'re in immediate danger.',
    explain_ja: '最も清潔な布で強く直接圧迫し、119に電話。負傷者は差し迫った危険がない限り動かさない。',
    explain_id: 'Tekan langsung dan kuat dengan kain terbersih yang tersedia dan hubungi 119. Jangan pindahkan orang yang terluka kecuali dalam bahaya langsung.',
  },
  {
    situation_en: 'Your phone buzzes with a tsunami warning! You\'re 500m from the coast. What do you do?',
    situation_ja: 'スマホに津波警報！海岸から500mです。どうしますか？',
    situation_id: 'Ponsel Anda berbunyi dengan peringatan tsunami! Anda 500m dari pantai. Apa yang Anda lakukan?',
    options: [
      { en: 'Go to the beach to see if a wave is coming', ja: '波が来るか海岸に見に行く', id: 'Pergi ke pantai untuk melihat apakah ombak datang' },
      { en: 'Wait for more details before deciding', ja: '詳しい情報を待ってから判断', id: 'Tunggu detail lebih lanjut sebelum memutuskan' },
      { en: 'Immediately move inland to high ground or upper floors (3F+)', ja: 'すぐに内陸の高台または上階（3階以上）へ移動', id: 'Segera pindah ke daratan tinggi atau lantai atas (3+)' },
      { en: 'Go to the basement for shelter', ja: '地下に避難する', id: 'Pergi ke ruang bawah tanah untuk berlindung' },
    ],
    correct: 2,
    explain_en: 'Move to high ground IMMEDIATELY. Tsunamis can arrive within minutes. Go at least 3 floors up or to the highest ground nearby. NEVER go toward the water or to a basement.',
    explain_ja: 'すぐに高台へ。津波は数分で到達することがある。3階以上か近くの最も高い場所へ。絶対に海や地下に行かない。',
    explain_id: 'Pindah ke tempat tinggi SEGERA. Tsunami bisa tiba dalam hitungan menit. Naik minimal 3 lantai atau ke daratan tertinggi. JANGAN mendekati air atau ke basement.',
  },
  {
    situation_en: 'You\'re at the evacuation shelter. An aftershock hits — the ground starts shaking again!',
    situation_ja: '避難所にいます。余震が来た — また地面が揺れ始めました！',
    situation_id: 'Anda di tempat pengungsian. Gempa susulan terjadi — tanah mulai bergoyang lagi!',
    options: [
      { en: 'Panic and run outside the building', ja: 'パニックになって建物の外に走る', id: 'Panik dan lari keluar bangunan' },
      { en: 'Drop, Cover, Hold On — same as the first earthquake', ja: '身を守る — 最初の地震と同じ対応', id: 'Merunduk, berlindung, bertahan — sama seperti gempa pertama' },
      { en: 'Stand in the doorway', ja: 'ドアの前に立つ', id: 'Berdiri di pintu' },
      { en: 'It\'s just an aftershock, ignore it', ja: '余震だから無視する', id: 'Itu hanya gempa susulan, abaikan' },
    ],
    correct: 1,
    explain_en: 'Aftershocks can be nearly as strong as the main quake. Always respond the same way: Drop, Cover, Hold On. The doorway myth is outdated — interior walls provide no special protection.',
    explain_ja: '余震は本震とほぼ同じ強さになることがある。常に同じ対応：身を伏せ、隠れ、つかまる。ドアの前が安全というのは誤りです。',
    explain_id: 'Gempa susulan bisa hampir sekuat gempa utama. Selalu respons sama: Merunduk, Berlindung, Bertahan. Mitos pintu sudah usang — dinding interior tidak memberikan perlindungan khusus.',
    shake: true,
  },
  {
    situation_en: 'The disaster is over. When should you return to your apartment?',
    situation_ja: '災害が終わりました。いつアパートに戻るべき？',
    situation_id: 'Bencana sudah berakhir. Kapan Anda harus kembali ke apartemen?',
    options: [
      { en: 'Go back immediately to check on your belongings', ja: 'すぐに荷物を確認しに戻る', id: 'Kembali segera untuk memeriksa barang-barang' },
      { en: 'Wait until authorities announce it\'s safe to return', ja: '当局が安全と発表するまで待つ', id: 'Tunggu sampai otoritas mengumumkan aman untuk kembali' },
      { en: 'Go back when the shaking stops completely', ja: '揺れが完全に止まったら戻る', id: 'Kembali ketika guncangan benar-benar berhenti' },
      { en: 'Wait 1 hour then go back', ja: '1時間待ってから戻る', id: 'Tunggu 1 jam lalu kembali' },
    ],
    correct: 1,
    explain_en: 'Only return when authorities confirm it\'s safe. Buildings may have hidden structural damage. Check NHK, local city announcements, or ask shelter staff before leaving.',
    explain_ja: '当局が安全を確認するまで戻らない。建物に目に見えない構造的損傷がある可能性。NHK、自治体の発表、避難所スタッフに確認。',
    explain_id: 'Hanya kembali ketika otoritas mengkonfirmasi aman. Bangunan mungkin memiliki kerusakan struktural tersembunyi. Periksa NHK, pengumuman kota, atau tanya staf pengungsian.',
  },
];

let currentScenario = 0;
let drillScore = 0;
let drillAnswered = false;
let countdownTimer: ReturnType<typeof setInterval> | null = null;

function getLangText(en: string, ja: string, id: string): string {
  if (currentLang === 'ja') return ja;
  if (currentLang === 'id') return id;
  return en;
}

function reapplyLang(): void {
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);
}

function triggerShake(container: HTMLElement): void {
  container.classList.add('shaking');
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100, 50, 200]);
  }
  setTimeout(() => container.classList.remove('shaking'), 2000);
}

function startCountdown(): void {
  const container = document.getElementById('drillContainer');
  const startBtn = document.getElementById('drillStartBtn');
  if (!container || !startBtn) return;

  startBtn.style.display = 'none';
  let count = 3;

  container.innerHTML = `<div class="drill-countdown" id="drillCountdown">${count}</div>`;

  countdownTimer = setInterval(() => {
    count--;
    const el = document.getElementById('drillCountdown');
    if (!el) return;

    if (count > 0) {
      el.textContent = String(count);
      el.classList.add('pulse');
      setTimeout(() => el.classList.remove('pulse'), 300);
    } else {
      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = null;
      startDrill();
    }
  }, 1000);
}

function startDrill(): void {
  const container = document.getElementById('drillContainer');
  if (!container) return;

  // Show mock alert
  container.innerHTML = `
    <div class="drill-alert">
      <div class="drill-alert-icon">🚨</div>
      <div class="drill-alert-text">
        <span data-lang="en">EARTHQUAKE DETECTED — Emergency Drill Active</span>
        <span data-lang="ja">地震検知 — 防災訓練実施中</span>
        <span data-lang="id">GEMPA TERDETEKSI — Latihan Darurat Aktif</span>
      </div>
    </div>
  `;
  reapplyLang();

  triggerShake(container);

  setTimeout(() => {
    renderScenario();
  }, 2500);
}

function renderScenario(): void {
  const container = document.getElementById('drillContainer');
  if (!container) return;
  drillAnswered = false;

  const s = scenarios[currentScenario];

  container.innerHTML = `
    <div class="drill-alert mini">
      <div class="drill-alert-icon">🚨</div>
      <span data-lang="en">DRILL IN PROGRESS</span>
      <span data-lang="ja">訓練中</span>
      <span data-lang="id">LATIHAN BERLANGSUNG</span>
    </div>
    <div class="drill-progress">${currentScenario + 1} / ${scenarios.length}</div>
    <div class="drill-scenario">
      <span data-lang="en">${s.situation_en}</span>
      <span data-lang="ja">${s.situation_ja}</span>
      <span data-lang="id">${s.situation_id}</span>
    </div>
    <div class="drill-options" id="drillOptions">
      ${s.options.map((opt, i) => `
        <button class="drill-option" data-idx="${i}">
          <span class="drill-option-letter">${String.fromCharCode(65 + i)}</span>
          <span data-lang="en">${opt.en}</span>
          <span data-lang="ja">${opt.ja}</span>
          <span data-lang="id">${opt.id}</span>
        </button>
      `).join('')}
    </div>
    <div class="drill-explain" id="drillExplain"></div>
  `;

  if (s.shake) triggerShake(container);

  container.querySelectorAll<HTMLButtonElement>('.drill-option').forEach(btn => {
    btn.addEventListener('click', () => handleDrillAnswer(parseInt(btn.dataset.idx!, 10)));
  });

  reapplyLang();
}

function handleDrillAnswer(idx: number): void {
  if (drillAnswered) return;
  drillAnswered = true;

  const s = scenarios[currentScenario];
  const isCorrect = idx === s.correct;
  if (isCorrect) drillScore++;

  const options = document.querySelectorAll<HTMLButtonElement>('.drill-option');
  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === s.correct) btn.classList.add('correct');
    if (i === idx && !isCorrect) btn.classList.add('wrong');
  });

  const explain = document.getElementById('drillExplain');
  if (explain) {
    explain.innerHTML = `
      <div class="drill-explain-text ${isCorrect ? 'correct' : 'wrong'}">
        <strong>${isCorrect ? '✅' : '❌'}</strong>
        <span data-lang="en">${s.explain_en}</span>
        <span data-lang="ja">${s.explain_ja}</span>
        <span data-lang="id">${s.explain_id}</span>
      </div>
      <button class="drill-next-btn" id="drillNextBtn">
        ${currentScenario < scenarios.length - 1
          ? getLangText('Next Scenario →', '次のシナリオ →', 'Skenario Berikutnya →')
          : getLangText('See Results', '結果を見る', 'Lihat Hasil')}
      </button>
    `;
    reapplyLang();

    document.getElementById('drillNextBtn')?.addEventListener('click', () => {
      if (currentScenario < scenarios.length - 1) {
        currentScenario++;
        renderScenario();
      } else {
        showDrillResults();
      }
    });
  }
}

function showDrillResults(): void {
  const container = document.getElementById('drillContainer');
  if (!container) return;

  const pct = drillScore / scenarios.length;
  let title: string, msg: string;
  if (pct >= 0.9) { title = '🏆'; msg = getLangText('Survival Expert!', 'サバイバルエキスパート！', 'Ahli Bertahan Hidup!'); }
  else if (pct >= 0.7) { title = '🛡️'; msg = getLangText('Well Prepared!', 'よく準備できています！', 'Persiapan Baik!'); }
  else if (pct >= 0.5) { title = '📖'; msg = getLangText('Review the guide sections', 'ガイドをもう一度復習', 'Tinjau bagian panduan'); }
  else { title = '🔄'; msg = getLangText('Practice makes perfect — try again!', '練習あるのみ — もう一度！', 'Latihan membuat sempurna — coba lagi!'); }

  let best = parseInt(localStorage.getItem('mamoru-drill-best') || '0', 10);
  if (drillScore > best) {
    best = drillScore;
    localStorage.setItem('mamoru-drill-best', String(best));
  }

  container.innerHTML = `
    <div class="drill-result">
      <div class="drill-result-icon">${title}</div>
      <div class="drill-result-score">${drillScore} / ${scenarios.length}</div>
      <div class="drill-result-msg">${msg}</div>
      <div class="drill-result-best">
        <span data-lang="en">Personal Best: ${best} / ${scenarios.length}</span>
        <span data-lang="ja">自己ベスト: ${best} / ${scenarios.length}</span>
        <span data-lang="id">Skor Terbaik: ${best} / ${scenarios.length}</span>
      </div>
      <button class="drill-retry-btn" id="drillRetryBtn">
        <span data-lang="en">🔄 Try Again</span>
        <span data-lang="ja">🔄 もう一度</span>
        <span data-lang="id">🔄 Coba Lagi</span>
      </button>
    </div>
  `;

  reapplyLang();

  document.getElementById('drillRetryBtn')?.addEventListener('click', () => {
    currentScenario = 0;
    drillScore = 0;
    startCountdown();
    showToast(getLangText('🔄 Drill restarted!', '🔄 訓練再開！', '🔄 Latihan dimulai ulang!'));
  });
}

export function initDrill(): void {
  const startBtn = document.getElementById('drillStartBtn');
  if (!startBtn) return;
  startBtn.addEventListener('click', () => {
    currentScenario = 0;
    drillScore = 0;
    startCountdown();
  });
}
