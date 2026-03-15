import { showToast } from './toast';
import { currentLang } from './lang';

interface QuizQuestion {
  q_en: string;
  q_ja: string;
  q_id: string;
  options: { en: string; ja: string; id: string }[];
  correct: number;
  explain_en: string;
  explain_ja: string;
  explain_id: string;
}

const questions: QuizQuestion[] = [
  {
    q_en: 'You feel strong shaking while on the 5th floor. What do you do first?',
    q_ja: '5階で強い揺れを感じました。最初に何をしますか？',
    q_id: 'Anda merasakan guncangan kuat di lantai 5. Apa yang Anda lakukan pertama?',
    options: [
      {en:'Run to the elevator',ja:'エレベーターに走る',id:'Lari ke elevator'},
      {en:'Drop, Cover, Hold on under a desk',ja:'机の下で身を守る',id:'Merunduk, berlindung di bawah meja'},
      {en:'Jump out the window',ja:'窓から飛び降りる',id:'Melompat dari jendela'},
      {en:'Stand in a doorway',ja:'ドアの前に立つ',id:'Berdiri di pintu'},
    ],
    correct: 1,
    explain_en: 'Drop, Cover, and Hold On is the recommended action. Never use elevators during earthquakes.',
    explain_ja: '机の下で身を守るのが推奨行動です。地震中にエレベーターは使わないで。',
    explain_id: 'Merunduk, berlindung, dan bertahan adalah tindakan yang direkomendasikan. Jangan gunakan elevator saat gempa.',
  },
  {
    q_en: 'Your phone shows a tsunami warning. You are near the coast. What should you do?',
    q_ja: 'スマホに津波警報が表示。海岸近くにいます。どうすべき？',
    q_id: 'Ponsel Anda menunjukkan peringatan tsunami. Anda dekat pantai. Apa yang harus dilakukan?',
    options: [
      {en:'Go to the beach to watch',ja:'海を見に行く',id:'Pergi ke pantai untuk melihat'},
      {en:'Wait for more information',ja:'追加情報を待つ',id:'Tunggu informasi lebih lanjut'},
      {en:'Immediately move to high ground',ja:'すぐに高台へ移動',id:'Segera pindah ke tempat tinggi'},
      {en:'Go to the basement',ja:'地下に行く',id:'Pergi ke ruang bawah tanah'},
    ],
    correct: 2,
    explain_en: 'Move to high ground immediately. Tsunamis can arrive within minutes. Never go toward the water.',
    explain_ja: 'すぐに高台へ。津波は数分で到達することがあります。絶対に海に近づかないで。',
    explain_id: 'Segera pindah ke tempat tinggi. Tsunami bisa tiba dalam hitungan menit. Jangan mendekati air.',
  },
  {
    q_en: 'During a typhoon, the wind suddenly stops and the sky clears. What does this mean?',
    q_ja: '台風中、急に風が止み空が晴れました。これは何を意味しますか？',
    q_id: 'Selama topan, angin tiba-tiba berhenti dan langit cerah. Apa artinya?',
    options: [
      {en:'The typhoon is over — safe to go out',ja:'台風は終わった — 外出OK',id:'Topan sudah selesai — aman keluar'},
      {en:'You are in the eye — more wind is coming',ja:'台風の目にいる — さらに風が来る',id:'Anda di mata topan — angin lebih kuat akan datang'},
      {en:'It was a false alarm',ja:'誤報だった',id:'Itu alarm palsu'},
    ],
    correct: 1,
    explain_en: 'The eye of a typhoon is calm, but the other side of the storm will hit soon with equal or greater force. Stay indoors!',
    explain_ja: '台風の目は穏やかですが、反対側の暴風がすぐに来ます。屋内にいてください！',
    explain_id: 'Mata topan tenang, tetapi sisi lain badai akan segera menerjang dengan kekuatan yang sama atau lebih besar. Tetap di dalam!',
  },
  {
    q_en: 'You smell gas after an earthquake. What should you do?',
    q_ja: '地震後にガスの匂いがします。どうすべき？',
    q_id: 'Anda mencium bau gas setelah gempa. Apa yang harus dilakukan?',
    options: [
      {en:'Light a match to check',ja:'マッチを点けて確認する',id:'Nyalakan korek api untuk memeriksa'},
      {en:'Open windows and leave immediately',ja:'窓を開けてすぐに避難する',id:'Buka jendela dan segera keluar'},
      {en:'Turn on the fan to ventilate',ja:'換気扇をつける',id:'Nyalakan kipas untuk ventilasi'},
      {en:'Ignore it — it will pass',ja:'無視する — そのうち消える',id:'Abaikan — akan hilang sendiri'},
    ],
    correct: 1,
    explain_en: 'Open windows for ventilation and evacuate. Never use flames, electrical switches, or fans — they can ignite gas.',
    explain_ja: '窓を開けて換気し、避難してください。火気、電気スイッチ、換気扇は使わないで — ガスに引火します。',
    explain_id: 'Buka jendela untuk ventilasi dan evakuasi. Jangan gunakan api, saklar listrik, atau kipas — bisa menyalakan gas.',
  },
  {
    q_en: 'What number do you call for an ambulance in Japan?',
    q_ja: '日本で救急車を呼ぶ番号は？',
    q_id: 'Nomor berapa yang Anda hubungi untuk ambulans di Jepang?',
    options: [
      {en:'110',ja:'110',id:'110'},
      {en:'911',ja:'911',id:'911'},
      {en:'119',ja:'119',id:'119'},
      {en:'118',ja:'118',id:'118'},
    ],
    correct: 2,
    explain_en: '119 is for fire and ambulance. 110 is police. 118 is coast guard. 911 does NOT work in Japan.',
    explain_ja: '119は消防・救急。110は警察。118は海上保安庁。911は日本では使えません。',
    explain_id: '119 untuk pemadam dan ambulans. 110 untuk polisi. 118 untuk penjaga pantai. 911 TIDAK berfungsi di Jepang.',
  },
  {
    q_en: 'You receive a Level 4 evacuation order. What should you do?',
    q_ja: 'レベル4の避難指示を受けました。どうすべき？',
    q_id: 'Anda menerima perintah evakuasi Level 4. Apa yang harus dilakukan?',
    options: [
      {en:'Start preparing to leave',ja:'避難の準備を始める',id:'Mulai bersiap untuk pergi'},
      {en:'Evacuate immediately to a shelter',ja:'すぐに避難所へ避難する',id:'Segera evakuasi ke tempat perlindungan'},
      {en:'Wait until Level 5',ja:'レベル5まで待つ',id:'Tunggu sampai Level 5'},
      {en:'Only elderly need to evacuate',ja:'高齢者のみ避難が必要',id:'Hanya lansia yang perlu evakuasi'},
    ],
    correct: 1,
    explain_en: 'Level 4 means EVERYONE must evacuate immediately. Level 5 means disaster is already happening — it may be too late.',
    explain_ja: 'レベル4は全員がすぐに避難。レベル5は災害がすでに発生中 — 手遅れの可能性があります。',
    explain_id: 'Level 4 berarti SEMUA ORANG harus segera evakuasi. Level 5 berarti bencana sudah terjadi — mungkin sudah terlambat.',
  },
  {
    q_en: 'What is the most critical item to have in your emergency bag?',
    q_ja: '非常持ち出し袋で最も重要なアイテムは？',
    q_id: 'Barang apa yang paling penting dalam tas darurat Anda?',
    options: [
      {en:'Laptop',ja:'ノートパソコン',id:'Laptop'},
      {en:'Water',ja:'水',id:'Air'},
      {en:'Books',ja:'本',id:'Buku'},
      {en:'Umbrella',ja:'傘',id:'Payung'},
    ],
    correct: 1,
    explain_en: 'Water is the #1 priority. You can survive weeks without food but only 3 days without water.',
    explain_ja: '水が最優先。食料なしでも数週間生きられますが、水なしでは3日しか持ちません。',
    explain_id: 'Air adalah prioritas #1. Anda bisa bertahan berminggu-minggu tanpa makanan tapi hanya 3 hari tanpa air.',
  },
  {
    q_en: 'You are in an elevator when an earthquake hits. What should you do?',
    q_ja: '地震発生時にエレベーター内にいます。どうすべき？',
    q_id: 'Anda di dalam elevator saat gempa terjadi. Apa yang harus dilakukan?',
    options: [
      {en:'Press all floor buttons and exit at the first stop',ja:'全階のボタンを押し、最初に止まった階で降りる',id:'Tekan semua tombol lantai dan keluar di pemberhentian pertama'},
      {en:'Force the doors open',ja:'ドアを無理にこじ開ける',id:'Paksa buka pintu'},
      {en:'Do nothing and wait',ja:'何もせず待つ',id:'Tidak melakukan apa-apa dan menunggu'},
    ],
    correct: 0,
    explain_en: 'Press all buttons so the elevator stops at the nearest floor. Exit immediately. Modern elevators have earthquake sensors that do this automatically.',
    explain_ja: '全階のボタンを押して最寄りの階で停止させ、すぐに降りてください。最新のエレベーターには地震感知器があります。',
    explain_id: 'Tekan semua tombol agar elevator berhenti di lantai terdekat. Segera keluar. Elevator modern memiliki sensor gempa.',
  },
  {
    q_en: 'After a disaster, how can you leave a voice message for your family in Japan?',
    q_ja: '災害後、日本で家族に伝言を残す方法は？',
    q_id: 'Setelah bencana, bagaimana Anda meninggalkan pesan suara untuk keluarga di Jepang?',
    options: [
      {en:'Call 171 (Disaster Message Dial)',ja:'171にかける（災害用伝言ダイヤル）',id:'Hubungi 171 (Pesan Bencana)'},
      {en:'Send a fax',ja:'FAXを送る',id:'Kirim faks'},
      {en:'Call 110',ja:'110にかける',id:'Hubungi 110'},
    ],
    correct: 0,
    explain_en: '171 is Japan\'s disaster voice message service. Dial 171 → press 1 to record, 2 to listen. Free during disasters.',
    explain_ja: '171は災害用伝言ダイヤル。171 → 1で録音、2で再生。災害時は無料。',
    explain_id: '171 adalah layanan pesan suara bencana Jepang. Tekan 171 → 1 untuk merekam, 2 untuk mendengar. Gratis saat bencana.',
  },
  {
    q_en: 'What does the J-Alert siren mean?',
    q_ja: 'Jアラートのサイレンは何を意味しますか？',
    q_id: 'Apa arti sirene J-Alert?',
    options: [
      {en:'Lunch break',ja:'昼休み',id:'Istirahat makan siang'},
      {en:'National emergency: missile, major earthquake, or tsunami',ja:'国家緊急事態：ミサイル、大地震、津波',id:'Darurat nasional: rudal, gempa besar, atau tsunami'},
      {en:'Monthly test — ignore it',ja:'月例テスト — 無視して良い',id:'Tes bulanan — abaikan saja'},
    ],
    correct: 1,
    explain_en: 'J-Alert is a national emergency warning for imminent threats: missiles, major earthquakes, tsunamis. Take it seriously every time.',
    explain_ja: 'Jアラートはミサイル、大地震、津波などの差し迫った脅威に対する国家緊急警報です。毎回真剣に対応してください。',
    explain_id: 'J-Alert adalah peringatan darurat nasional untuk ancaman yang akan segera terjadi. Tanggapi dengan serius setiap saat.',
  },
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function getLangText(en: string, ja: string, id: string): string {
  if (currentLang === 'ja') return ja;
  if (currentLang === 'id') return id;
  return en;
}

function renderQuestion(): void {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  const q = questions[currentQuestion];
  answered = false;

  container.innerHTML = `
    <div class="quiz-progress">${currentQuestion + 1} / ${questions.length}</div>
    <div class="quiz-question">
      <span data-lang="en">${q.q_en}</span>
      <span data-lang="ja">${q.q_ja}</span>
      <span data-lang="id">${q.q_id}</span>
    </div>
    <div class="quiz-options" id="quizOptions">
      ${q.options.map((opt, i) => `
        <button class="quiz-option" data-idx="${i}">
          <span class="quiz-option-letter">${String.fromCharCode(65 + i)}</span>
          <span data-lang="en">${opt.en}</span>
          <span data-lang="ja">${opt.ja}</span>
          <span data-lang="id">${opt.id}</span>
        </button>
      `).join('')}
    </div>
    <div class="quiz-explain" id="quizExplain"></div>
  `;

  container.querySelectorAll<HTMLButtonElement>('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.idx!, 10)));
  });

  // Re-apply language
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);
}

function handleAnswer(idx: number): void {
  if (answered) return;
  answered = true;

  const q = questions[currentQuestion];
  const isCorrect = idx === q.correct;
  if (isCorrect) score++;

  const options = document.querySelectorAll<HTMLButtonElement>('.quiz-option');
  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    if (i === idx && !isCorrect) btn.classList.add('wrong');
  });

  const explain = document.getElementById('quizExplain');
  if (explain) {
    explain.innerHTML = `
      <div class="quiz-explain-text ${isCorrect ? 'correct' : 'wrong'}">
        <strong>${isCorrect ? '✅' : '❌'}</strong>
        <span data-lang="en">${q.explain_en}</span>
        <span data-lang="ja">${q.explain_ja}</span>
        <span data-lang="id">${q.explain_id}</span>
      </div>
      <button class="quiz-next-btn" id="quizNextBtn">
        ${currentQuestion < questions.length - 1
          ? getLangText('Next →', '次へ →', 'Berikutnya →')
          : getLangText('See Results', '結果を見る', 'Lihat Hasil')}
      </button>
    `;
    // Re-apply language for explain section
    document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
    document.body.classList.add('lang-' + currentLang);

    document.getElementById('quizNextBtn')?.addEventListener('click', () => {
      if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
      } else {
        showResults();
      }
    });
  }
}

function showResults(): void {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  const pct = score / questions.length;
  let title: string, msg: string;
  if (pct >= 0.9) { title = '🏆'; msg = getLangText('Disaster Ready Expert!', '防災エキスパート！', 'Ahli Kesiapsiagaan!'); }
  else if (pct >= 0.7) { title = '👍'; msg = getLangText('Well Prepared!', 'よく準備できています！', 'Persiapan Baik!'); }
  else if (pct >= 0.5) { title = '🤔'; msg = getLangText('Review the guide again', 'ガイドをもう一度確認', 'Tinjau panduan lagi'); }
  else { title = '📚'; msg = getLangText('Study the guide carefully', 'ガイドをしっかり学びましょう', 'Pelajari panduan dengan seksama'); }

  // Best score tracking
  let best = parseInt(localStorage.getItem('mamoru-quiz-best') || '0', 10);
  if (score > best) {
    best = score;
    localStorage.setItem('mamoru-quiz-best', String(best));
  }

  container.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-icon">${title}</div>
      <div class="quiz-result-score">${score} / ${questions.length}</div>
      <div class="quiz-result-msg">${msg}</div>
      <div class="quiz-result-best">
        <span data-lang="en">Personal Best: ${best} / ${questions.length}</span>
        <span data-lang="ja">自己ベスト: ${best} / ${questions.length}</span>
        <span data-lang="id">Skor Terbaik: ${best} / ${questions.length}</span>
      </div>
      <button class="quiz-retry-btn" id="quizRetryBtn">
        <span data-lang="en">🔄 Try Again</span>
        <span data-lang="ja">🔄 もう一度</span>
        <span data-lang="id">🔄 Coba Lagi</span>
      </button>
    </div>
  `;

  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);

  document.getElementById('quizRetryBtn')?.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    renderQuestion();
    showToast('🔄 Quiz reset!');
  });
}

export function initQuiz(): void {
  const startBtn = document.getElementById('quizStartBtn');
  if (!startBtn) return;
  startBtn.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    startBtn.style.display = 'none';
    renderQuestion();
  });
}
