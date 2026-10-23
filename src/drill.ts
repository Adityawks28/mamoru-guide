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
    situation_en: 'Strong shaking! You are at your desk in a classroom on the 4th floor. What do you do?',
    situation_ja: '強い揺れです！あなたは4階の教室で、机の所にいます。どうしますか？',
    situation_id: 'Guncangan kuat! Anda di meja di kelas lantai 4. Apa yang Anda lakukan?',
    options: [
      { en: 'Run to the exit immediately', ja: 'すぐに出口へ走る', id: 'Segera lari ke pintu keluar' },
      { en: 'Drop, Cover, Hold On under the desk', ja: '机の下で身を低くし、頭を守り、動かない（DROP, COVER, HOLD ON）', id: 'Merunduk, berlindung, bertahan di bawah meja' },
      { en: 'Look out the window to see what is happening', ja: '窓の外を見て、何が起きているか確かめる', id: 'Lihat ke luar jendela untuk melihat apa yang terjadi' },
      { en: 'Call a friend to ask what to do', ja: '友達に電話して、どうすればいいか聞く', id: 'Telepon teman untuk bertanya apa yang harus dilakukan' },
    ],
    correct: 1,
    explain_en: 'DROP to the ground. Take COVER under strong furniture. HOLD ON. Running during the shaking is dangerous. Falling objects and broken glass injure more people than collapsing buildings.',
    explain_ja: '床に体を低くし（DROP）、じょうぶな家具の下に入り（COVER）、しっかりつかまります（HOLD ON）。揺れている間に走るのは危険です。たおれる建物より、落ちてくる物や割れたガラスでけがをする人のほうが多いです。',
    explain_id: 'MERUNDUK ke lantai, BERLINDUNG di bawah perabot yang kuat, dan BERTAHAN. Berlari saat guncangan itu berbahaya. Benda jatuh dan kaca pecah melukai lebih banyak orang daripada bangunan runtuh.',
    shake: true,
  },
  {
    situation_en: 'The shaking has stopped. The building looks OK, but you smell something strange. What do you do next?',
    situation_ja: '揺れが止まりました。建物はこわれていないようですが、変なにおいがします。次に何をしますか？',
    situation_id: 'Guncangan sudah berhenti. Bangunan tampak utuh, tetapi Anda mencium bau aneh. Apa yang Anda lakukan berikutnya?',
    options: [
      { en: 'Turn on the lights to check the room', ja: '電気をつけて、部屋を確かめる', id: 'Nyalakan lampu untuk memeriksa ruangan' },
      { en: 'Open the windows and leave carefully. It could be gas.', ja: '窓を開けて、気をつけて避難する。ガスかもしれない', id: 'Buka jendela dan keluar dengan hati-hati. Mungkin itu gas.' },
      { en: 'Take the elevator to get out fast', ja: 'エレベーターで早く外に出る', id: 'Naik elevator agar cepat keluar' },
      { en: 'Light a candle to see better', ja: 'ろうそくをつけて、よく見る', id: 'Nyalakan lilin agar lebih jelas' },
    ],
    correct: 1,
    explain_en: 'Open the windows to let air in. Leave by the stairs. After an earthquake, NEVER use elevators, electric switches, or open flames. A gas leak can cause an explosion.',
    explain_ja: '窓を開けて空気を入れかえ、階段で避難してください。地震のあとは、エレベーター、電気のスイッチ、火を絶対に使わないでください。ガス漏れで爆発することがあります。',
    explain_id: 'Buka jendela agar udara masuk. Keluar lewat tangga. Setelah gempa, JANGAN pakai elevator, saklar listrik, atau api terbuka. Kebocoran gas bisa menyebabkan ledakan.',
  },
  {
    situation_en: 'You are outside now. A person near you is bleeding from a head wound. What do you do?',
    situation_ja: '外に出ました。近くに、頭から血が出ている人がいます。どうしますか？',
    situation_id: 'Anda sudah di luar. Orang di dekat Anda berdarah dari luka di kepala. Apa yang Anda lakukan?',
    options: [
      { en: 'Press a clean cloth directly on the wound and call 119', ja: 'きれいな布で傷口を直接押さえて、119番に電話する', id: 'Tekan luka langsung dengan kain bersih dan hubungi 119' },
      { en: 'Move the person to a different place first', ja: 'まず別の場所に動かす', id: 'Pindahkan orang itu ke tempat lain dulu' },
      { en: 'Pour water on the wound to clean it', ja: '傷口に水をかけて洗う', id: 'Siram luka dengan air untuk membersihkannya' },
      { en: 'Leave the person. Professionals will come.', ja: '何もしない。救急隊が来るから', id: 'Tinggalkan saja. Petugas akan datang.' },
    ],
    correct: 0,
    explain_en: 'Press firmly and directly on the wound with the cleanest cloth you have. Call 119 for help. Do not move an injured person unless they are in immediate danger.',
    explain_ja: 'いちばんきれいな布で、傷口を強く直接押さえてください。119番に電話してください。すぐ近くに危険がないときは、けがをした人を動かさないでください。',
    explain_id: 'Tekan luka dengan kuat menggunakan kain paling bersih yang ada. Hubungi 119. Jangan pindahkan orang yang terluka, kecuali ia dalam bahaya langsung.',
  },
  {
    situation_en: 'Your phone buzzes with a tsunami warning. You are 500 m from the coast. What do you do?',
    situation_ja: 'スマホに津波警報が出ました。海から500mの所にいます。どうしますか？',
    situation_id: 'Ponsel Anda berbunyi: peringatan tsunami. Anda 500 m dari pantai. Apa yang Anda lakukan?',
    options: [
      { en: 'Go to the beach to see if a wave is coming', ja: '波が来るか、海を見に行く', id: 'Pergi ke pantai untuk melihat apakah ombak datang' },
      { en: 'Wait for more details before you decide', ja: 'もっと情報が出るまで待ってから決める', id: 'Tunggu informasi lebih lanjut sebelum memutuskan' },
      { en: 'Immediately move inland to high ground or to an upper floor (3rd floor or higher)', ja: 'すぐに、海から離れた高い所か、建物の上の階（3階以上）へ行く', id: 'Segera pindah ke tempat tinggi jauh dari pantai, atau ke lantai atas (lantai 3 atau lebih)' },
      { en: 'Go to the basement for shelter', ja: '地下に逃げる', id: 'Berlindung di ruang bawah tanah' },
    ],
    correct: 2,
    explain_en: 'Go to high ground IMMEDIATELY. A tsunami can arrive in minutes. Go at least 3 floors up, or to the highest ground near you. NEVER go toward the water or into a basement.',
    explain_ja: 'すぐに高い所へ逃げてください。津波は数分で来ることがあります。3階以上か、近くで一番高い場所へ行ってください。海や地下には絶対に行かないでください。',
    explain_id: 'SEGERA pergi ke tempat tinggi. Tsunami bisa tiba dalam hitungan menit. Naik minimal 3 lantai, atau ke tempat tertinggi di dekat Anda. JANGAN mendekati air atau masuk ke ruang bawah tanah.',
  },
  {
    situation_en: 'You are at the evacuation shelter. An aftershock starts. The ground shakes again.',
    situation_ja: '避難所にいます。余震（あとから来る地震）です。また地面が揺れ始めました。',
    situation_id: 'Anda di tempat pengungsian. Terjadi gempa susulan. Tanah berguncang lagi.',
    options: [
      { en: 'Panic and run out of the building', ja: 'あわてて建物の外へ走る', id: 'Panik dan lari keluar gedung' },
      { en: 'Drop, Cover, Hold On, the same as in the first earthquake', ja: '身を低くし、頭を守る。最初の地震と同じ', id: 'Merunduk, berlindung, bertahan, sama seperti gempa pertama' },
      { en: 'Stand in the doorway', ja: 'ドアの所に立つ', id: 'Berdiri di ambang pintu' },
      { en: 'It is only an aftershock. Ignore it.', ja: '余震だから気にしない', id: 'Itu hanya gempa susulan. Abaikan.' },
    ],
    correct: 1,
    explain_en: 'An aftershock can be almost as strong as the main earthquake. Always do the same thing: Drop, Cover, Hold On. The doorway idea is out of date. Inside walls give no special protection.',
    explain_ja: '余震は、最初の地震と同じくらい強いことがあります。いつも同じように、身を低くし、頭を守り、動かないでください。ドアの所や内側の壁の近くが、特に安全ということはありません。',
    explain_id: 'Gempa susulan bisa hampir sekuat gempa utama. Selalu lakukan hal yang sama: merunduk, berlindung, bertahan. Mitos berdiri di ambang pintu sudah usang. Dinding dalam tidak memberi perlindungan khusus.',
    shake: true,
  },
  {
    situation_en: 'The disaster is over. When do you go back to your apartment?',
    situation_ja: '災害が終わりました。いつアパートに戻りますか？',
    situation_id: 'Bencana sudah berakhir. Kapan Anda kembali ke apartemen?',
    options: [
      { en: 'Go back immediately to check your things', ja: 'すぐに戻って、荷物を確かめる', id: 'Segera kembali untuk memeriksa barang-barang' },
      { en: 'Wait until the authorities say it is safe to go back', ja: '市や国が「安全です」と発表するまで待つ', id: 'Tunggu sampai pihak berwenang mengumumkan aman untuk kembali' },
      { en: 'Go back when the shaking stops completely', ja: '揺れが完全に止まったら戻る', id: 'Kembali saat guncangan benar-benar berhenti' },
      { en: 'Wait 1 hour, then go back', ja: '1時間待ってから戻る', id: 'Tunggu 1 jam, lalu kembali' },
    ],
    correct: 1,
    explain_en: 'Go back only when the authorities say it is safe. A building can have damage that you cannot see. Before you leave, check NHK or city announcements, or ask the shelter staff.',
    explain_ja: '市や国が安全だと言うまで、戻らないでください。建物には、見えないこわれた所があるかもしれません。出る前に、NHKや市のお知らせを確認するか、避難所のスタッフに聞いてください。',
    explain_id: 'Kembali hanya jika pihak berwenang menyatakan aman. Bangunan mungkin punya kerusakan yang tidak terlihat. Sebelum pergi, cek NHK atau pengumuman kota, atau tanya petugas pengungsian.',
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
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
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
        <span data-lang="en">EARTHQUAKE DETECTED · THIS IS A DRILL</span>
        <span data-lang="ja">地震を検知 · これは訓練です</span>
        <span data-lang="id">GEMPA TERDETEKSI · INI LATIHAN</span>
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
  else if (pct >= 0.5) { title = '📖'; msg = getLangText('Read the guide sections again', 'ガイドをもう一度読んでください', 'Baca lagi bagian panduan'); }
  else { title = '🔄'; msg = getLangText('Practice more. Try again.', 'もっと練習しましょう。もう一度やってみてください。', 'Latihan lagi. Coba sekali lagi.'); }

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
    showToast(getLangText('🔄 Drill restarted', '🔄 訓練をやり直します', '🔄 Latihan dimulai ulang'));
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
