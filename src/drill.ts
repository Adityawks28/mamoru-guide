import { showToast } from './toast';
import { currentLang } from './lang';
import { motionAllowed } from './character/motion';
import { REVIEW_NOTE } from './first-aid';

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
  /** First-aid content: show the medical review note (Decision D-4). */
  firstAid?: boolean;
  claimId: string;
}

export const scenarios: DrillScenario[] = [
  {
    claimId: 'drill-step-1',
    situation_en: 'Strong shaking! You are at your desk in a classroom on the 4th floor. What do you do?',
    situation_ja: '強いゆれです！あなたは4階の教室で、机の所にいます。どうしますか？',
    situation_id: 'Guncangan kuat! Kamu sedang duduk di mejamu, di kelas lantai 4. Apa yang kamu lakukan?',
    options: [
      { en: 'Run to the exit immediately', ja: 'すぐに出口へ走る', id: 'Segera lari ke pintu keluar' },
      { en: 'Drop, Cover, Hold On under the desk', ja: '机の下で身を低くし、頭を守り、動かない（DROP・COVER・HOLD ON）', id: 'Merunduk, berlindung, bertahan di bawah meja' },
      { en: 'Look out the window to see what happens', ja: '窓の外を見て、何が起きているか確かめる', id: 'Lihat ke luar jendela untuk melihat apa yang terjadi' },
      { en: 'Call a friend to ask what to do', ja: '友達に電話して、どうすればいいか聞く', id: 'Telepon teman untuk bertanya apa yang harus dilakukan' },
    ],
    correct: 1,
    explain_en: 'DROP to the ground. Take COVER under strong furniture. HOLD ON. Do not run during the shaking. It is dangerous. In recent earthquakes, furniture that fell or moved hurt 30% to 50% of injured people.',
    explain_ja: '床に体を低くしてください（DROP）。じょうぶな家具の下に入ってください（COVER）。しっかりつかまってください（HOLD ON）。ゆれている間は、走らないでください。危険です。最近の地震では、けがをした人の3〜5割が、家具でけがをしました。家具がたおれたり、落ちたり、動いたりしたためです。',
    explain_id: 'MERUNDUK ke lantai. BERLINDUNG di bawah perabot yang kuat. BERTAHAN. Jangan berlari saat guncangan. Itu berbahaya. Pada gempa terkini, 30 sampai 50% korban luka terkena perabot yang jatuh atau bergeser.',
    shake: true,
  },
  {
    claimId: 'drill-step-2',
    situation_en: 'The shaking stopped. The building looks OK, but you smell something strange. What do you do next?',
    situation_ja: 'ゆれが止まりました。建物はこわれていないようですが、変なにおいがします。次に何をしますか？',
    situation_id: 'Guncangan sudah berhenti. Bangunan tampak utuh, tetapi kamu mencium bau aneh. Apa yang kamu lakukan berikutnya?',
    options: [
      { en: 'Turn on the lights to check the room', ja: '電気をつけて、部屋を確かめる', id: 'Nyalakan lampu untuk memeriksa ruangan' },
      { en: 'Open the windows. Leave carefully. The smell can come from gas.', ja: '窓を開けて、気をつけて避難する。ガスかもしれない', id: 'Buka jendela. Keluar dengan hati-hati. Bau itu bisa berasal dari gas.' },
      { en: 'Take the elevator to get out fast', ja: 'エレベーターで早く外に出る', id: 'Naik lift agar cepat keluar' },
      { en: 'Light a candle to see better', ja: 'ろうそくをつけて、よく見る', id: 'Nyalakan lilin agar lebih jelas' },
    ],
    correct: 1,
    explain_en: 'Open the windows. Do not use fire or electric switches. Close the gas valve. Use the stairs: an elevator can stop and trap you. Call the gas company.',
    explain_ja: '窓を開けてください。火や、電気のスイッチを使わないでください。ガスの元栓（もとせん）を閉めてください。階段を使ってください。エレベーターは止まって、中に閉じこめられることがあります。ガス会社に連絡してください。',
    explain_id: 'Buka jendela. Jangan pakai api atau sakelar listrik. Tutup katup gas. Pakai tangga: lift bisa berhenti dan kamu bisa terjebak di dalamnya. Hubungi perusahaan gas.',
  },
  {
    claimId: 'drill-step-3',
    situation_en: 'You are outside now. A person near you has a head wound that bleeds. What do you do?',
    situation_ja: '外に出ました。近くに、頭から血が出ている人がいます。どうしますか？',
    situation_id: 'Kamu sudah di luar. Orang di dekatmu berdarah dari luka di kepala. Apa yang kamu lakukan?',
    options: [
      { en: 'Press a clean cloth directly on the wound. Call 119.', ja: 'きれいな布で傷口（きずぐち）を直接押さえて、119番に電話する', id: 'Tekan luka langsung dengan kain bersih. Hubungi 119.' },
      { en: 'Move the person to a different place first', ja: 'まず別の場所に動かす', id: 'Pindahkan orang itu ke tempat lain dulu' },
      { en: 'Leave the person. Professionals will come.', ja: '何もしない。救急隊（きゅうきゅうたい）が来るから', id: 'Tinggalkan orang itu. Petugas akan datang.' },
    ],
    correct: 0,
    explain_en: 'Press firmly and directly on the wound with the cleanest cloth you have. Call 119 for help. Do not move an injured person unless they are in immediate danger.',
    explain_ja: 'いちばんきれいな布で、傷口（きずぐち）を強く直接押さえてください。119番に電話してください。けがをした人は、動かさないでください。動かすのは、その場所がすぐに危険なときだけです。',
    explain_id: 'Tekan luka dengan kuat menggunakan kain paling bersih yang ada. Hubungi 119 untuk minta bantuan. Jangan pindahkan orang yang terluka, kecuali dia dalam bahaya langsung.',
    firstAid: true,
  },
  {
    claimId: 'drill-step-4',
    situation_en: 'Your phone buzzes with a tsunami warning. You are 500 m from the coast. What do you do?',
    situation_ja: 'スマホに津波警報（つなみけいほう）が出ました。海から500mの所にいます。どうしますか？',
    situation_id: 'Ponselmu berbunyi: peringatan bahaya tsunami. Kamu berada 500 m dari pantai. Apa yang kamu lakukan?',
    options: [
      { en: 'Go to the beach to look for a wave', ja: '波が来るか、海を見に行く', id: 'Pergi ke pantai untuk melihat apakah ombak datang' },
      { en: 'Wait for more details before you decide', ja: 'もっと情報が出るまで待ってから決める', id: 'Tunggu informasi lebih lanjut sebelum memutuskan' },
      { en: 'Go at once to high ground or a tsunami evacuation building', ja: 'すぐに、高台（たかだい）か津波避難ビルへ行く', id: 'Segera pergi ke tempat tinggi atau gedung evakuasi tsunami' },
      { en: 'Go to the basement for shelter', ja: '地下に逃げる', id: 'Berlindung di ruang bawah tanah' },
    ],
    correct: 2,
    explain_en: 'Go to high ground IMMEDIATELY. A tsunami can arrive in minutes. Go as high as you can. A tsunami can be higher than the forecast. NEVER go toward the water or into a basement.',
    explain_ja: 'すぐに高い所へ逃げてください。津波は数分で来ることがあります。できるだけ高い所へ行ってください。津波は、予想より高くなることがあります。海や地下には絶対に行かないでください。',
    explain_id: 'SEGERA pergi ke tempat tinggi. Tsunami bisa tiba dalam hitungan menit. Naik setinggi mungkin. Tsunami bisa lebih tinggi dari perkiraan. JANGAN mendekati air atau masuk ke ruang bawah tanah.',
  },
  {
    claimId: 'drill-step-5',
    situation_en: 'You are at the evacuation shelter. An aftershock starts. The ground shakes again.',
    situation_ja: '避難所（ひなんじょ）にいます。余震（よしん：あとから来る地震）が来ました。また地面がゆれ始めました。',
    situation_id: 'Kamu ada di tempat pengungsian. Gempa susulan mulai. Tanah berguncang lagi.',
    options: [
      { en: 'Panic and run out of the building', ja: 'あわてて建物の外へ走る', id: 'Panik dan lari keluar gedung' },
      { en: 'Drop, Cover, Hold On, the same as in the first earthquake', ja: '身を低くし、頭を守る。最初の地震と同じ', id: 'Merunduk, berlindung, bertahan, sama seperti gempa pertama' },
      { en: 'Stand in the doorway', ja: 'ドアの所に立つ', id: 'Berdiri di ambang pintu' },
      { en: 'It is only an aftershock. Ignore it.', ja: '余震だから気にしない', id: 'Itu hanya gempa susulan. Abaikan.' },
    ],
    correct: 1,
    explain_en: 'After a big earthquake, another earthquake of the same size can come. JMA asks people to stay alert for about 1 week. Do the same as in the first earthquake: drop, cover and hold on. Go where nothing can fall, tip over or move.',
    explain_ja: '大きな地震のあと、同じくらいの大きさの地震が来ることがあります。気象庁（きしょうちょう）は、約1週間、注意するように呼びかけています。最初の地震と同じように、身を低くし、頭を守り、動かないでください。物が「落ちてこない」「倒れてこない」「移動してこない」場所へ行ってください。',
    explain_id: 'Setelah gempa besar, gempa lain yang sama kuatnya bisa terjadi. JMA meminta orang waspada sekitar 1 minggu. Lakukan hal yang sama seperti saat gempa pertama: merunduk, berlindung, bertahan. Pergilah ke tempat tanpa benda yang bisa jatuh, roboh, atau bergeser.',
    shake: true,
  },
  {
    claimId: 'drill-step-6',
    situation_en: 'The disaster is over. When do you go back to your apartment?',
    situation_ja: '災害が終わりました。いつアパートに戻りますか？',
    situation_id: 'Bencana sudah berakhir. Kapan kamu kembali ke apartemenmu?',
    options: [
      { en: 'Go back immediately to check your things', ja: 'すぐに戻って、荷物を確かめる', id: 'Segera kembali untuk memeriksa barang-barangmu' },
      { en: 'Wait until the authorities say it is safe to go back', ja: '市や国が「安全です」と発表（はっぴょう）するまで待つ', id: 'Tunggu sampai pihak berwenang mengumumkan aman untuk kembali' },
      { en: 'Go back when the shaking stops completely', ja: 'ゆれが完全に止まったら戻る', id: 'Kembali saat guncangan benar-benar berhenti' },
      { en: 'Wait 1 hour, then go back', ja: '1時間待ってから戻る', id: 'Tunggu 1 jam, lalu kembali' },
    ],
    correct: 1,
    explain_en: 'Go back only when the authorities say it is safe. Do not go back while a warning is in effect.',
    explain_ja: '市や国が安全だと言うまで、戻らないでください。警報（けいほう）が出ている間は、戻らないでください。',
    explain_id: 'Kembali hanya jika pihak berwenang menyatakan aman. Jangan kembali selama peringatan masih berlaku.',
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
  if (!motionAllowed()) return;
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
        <span data-lang="ja">地震が起きました · これは訓練（くんれん）です</span>
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
      <span data-lang="ja">訓練（くんれん）中</span>
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
      ${s.firstAid ? REVIEW_NOTE : ''}
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
  else if (pct >= 0.7) { title = '🛡️'; msg = getLangText('Well Prepared!', 'よく準備できています！', 'Persiapanmu Bagus!'); }
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
    showToast(getLangText('🔄 Drill restarted', '🔄 訓練（くんれん）をやり直します', '🔄 Latihan dimulai ulang'));
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
