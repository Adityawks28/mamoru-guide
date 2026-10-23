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
    q_en: 'You feel strong shaking on the 5th floor. What do you do first?',
    q_ja: '5階で強い揺れを感じました。最初に何をしますか？',
    q_id: 'Anda merasakan guncangan kuat di lantai 5. Apa yang Anda lakukan pertama kali?',
    options: [
      {en:'Run to the elevator',ja:'エレベーターまで走る',id:'Lari ke elevator'},
      {en:'Drop, Cover, Hold On under a desk',ja:'机の下で身を低くし、頭を守る',id:'Merunduk, berlindung, bertahan di bawah meja'},
      {en:'Jump out the window',ja:'窓から飛び降りる',id:'Melompat dari jendela'},
      {en:'Stand in a doorway',ja:'ドアの所に立つ',id:'Berdiri di ambang pintu'},
    ],
    correct: 1,
    explain_en: 'Drop, Cover, and Hold On is the recommended action. Never use an elevator during an earthquake.',
    explain_ja: '机の下で身を低くし、頭を守るのが、すすめられている行動です。地震のときは、エレベーターを使わないでください。',
    explain_id: 'Merunduk, berlindung, dan bertahan adalah tindakan yang dianjurkan. Jangan pakai elevator saat gempa.',
  },
  {
    q_en: 'Your phone shows a tsunami warning. You are near the coast. What do you do?',
    q_ja: 'スマホに津波警報が出ました。あなたは海の近くにいます。どうしますか？',
    q_id: 'Ponsel Anda menampilkan peringatan tsunami. Anda dekat pantai. Apa yang Anda lakukan?',
    options: [
      {en:'Go to the beach to watch',ja:'海を見に行く',id:'Pergi ke pantai untuk melihat'},
      {en:'Wait for more information',ja:'もっと情報が出るまで待つ',id:'Tunggu informasi lebih lanjut'},
      {en:'Go to high ground immediately',ja:'すぐに高い所へ逃げる',id:'Segera pergi ke tempat tinggi'},
      {en:'Go to the basement',ja:'地下に行く',id:'Pergi ke ruang bawah tanah'},
    ],
    correct: 2,
    explain_en: 'Go to high ground immediately. A tsunami can arrive in minutes. Never go toward the water.',
    explain_ja: 'すぐに高い所へ逃げてください。津波は数分で来ることがあります。絶対に海に近づかないでください。',
    explain_id: 'Segera pergi ke tempat tinggi. Tsunami bisa tiba dalam hitungan menit. Jangan pernah mendekati air.',
  },
  {
    q_en: 'During a typhoon, the wind suddenly stops and the sky clears. What does this mean?',
    q_ja: '台風のとき、急に風が止まって、空が晴れました。これはどういう意味ですか？',
    q_id: 'Saat topan, angin tiba-tiba berhenti dan langit cerah. Apa artinya?',
    options: [
      {en:'The typhoon is over. It is safe to go out.',ja:'台風が終わった。外に出ても大丈夫',id:'Topan sudah selesai. Aman untuk keluar.'},
      {en:'You are in the eye of the typhoon. More wind is coming.',ja:'台風の目の中にいる。また風が来る',id:'Anda di mata topan. Angin akan datang lagi.'},
      {en:'It was a false alarm',ja:'まちがいの警報だった',id:'Itu peringatan palsu'},
    ],
    correct: 1,
    explain_en: 'The eye of a typhoon is calm. Soon the other side of the storm hits with the same or more force. Stay indoors.',
    explain_ja: '台風の目の中は静かです。でも、すぐに反対側の風が、同じか、もっと強い力で来ます。建物の中にいてください。',
    explain_id: 'Mata topan itu tenang. Sebentar lagi sisi lain badai datang dengan kekuatan yang sama atau lebih besar. Tetap di dalam.',
  },
  {
    q_en: 'You smell gas after an earthquake. What do you do?',
    q_ja: '地震のあと、ガスのにおいがします。どうしますか？',
    q_id: 'Anda mencium bau gas setelah gempa. Apa yang Anda lakukan?',
    options: [
      {en:'Light a match to check',ja:'マッチをつけて確かめる',id:'Nyalakan korek api untuk memeriksa'},
      {en:'Open the windows and leave immediately',ja:'窓を開けて、すぐに外に出る',id:'Buka jendela dan segera keluar'},
      {en:'Turn on the fan to let air in',ja:'換気扇をつける',id:'Nyalakan kipas agar udara mengalir'},
      {en:'Ignore it. The smell will go away.',ja:'気にしない。そのうち消える',id:'Abaikan. Baunya akan hilang sendiri.'},
    ],
    correct: 1,
    explain_en: 'Open the windows to let air in, then leave. Do not use flames, electric switches, or fans. They can set the gas on fire.',
    explain_ja: '窓を開けて空気を入れかえ、外に出てください。火、電気のスイッチ、換気扇は使わないでください。ガスに火がつくことがあります。',
    explain_id: 'Buka jendela agar udara masuk, lalu keluar. Jangan pakai api, saklar listrik, atau kipas. Semua itu bisa membuat gas terbakar.',
  },
  {
    q_en: 'What number do you call for an ambulance in Japan?',
    q_ja: '日本で救急車を呼ぶ番号は何番ですか？',
    q_id: 'Nomor berapa yang Anda hubungi untuk ambulans di Jepang?',
    options: [
      {en:'110',ja:'110',id:'110'},
      {en:'911',ja:'911',id:'911'},
      {en:'119',ja:'119',id:'119'},
      {en:'118',ja:'118',id:'118'},
    ],
    correct: 2,
    explain_en: '119 is for fire and ambulance. 110 is for police. 118 is for the coast guard. 911 does NOT work in Japan.',
    explain_ja: '119は消防と救急車です。110は警察です。118は海上保安庁です。911は日本では使えません。',
    explain_id: '119 untuk pemadam kebakaran dan ambulans. 110 untuk polisi. 118 untuk penjaga pantai. 911 TIDAK berfungsi di Jepang.',
  },
  {
    q_en: 'You get a Level 4 evacuation order. What do you do?',
    q_ja: 'レベル4の避難指示が出ました。どうしますか？',
    q_id: 'Anda menerima perintah evakuasi Level 4. Apa yang Anda lakukan?',
    options: [
      {en:'Start preparing to leave',ja:'避難の準備を始める',id:'Mulai bersiap untuk pergi'},
      {en:'Go to a shelter immediately',ja:'すぐに避難所へ行く',id:'Segera mengungsi ke tempat pengungsian'},
      {en:'Wait until Level 5',ja:'レベル5まで待つ',id:'Tunggu sampai Level 5'},
      {en:'Only elderly people must evacuate',ja:'高齢者だけが避難する',id:'Hanya lansia yang perlu mengungsi'},
    ],
    correct: 1,
    explain_en: 'Level 4 means EVERYONE must evacuate now. Level 5 means the disaster is already happening. It may be too late.',
    explain_ja: 'レベル4では、全員がすぐに避難します。レベル5は、災害がもう起きています。もう間に合わないかもしれません。',
    explain_id: 'Level 4 berarti SEMUA ORANG harus segera mengungsi. Level 5 berarti bencana sudah terjadi. Mungkin sudah terlambat.',
  },
  {
    q_en: 'What is the most important item in your emergency bag?',
    q_ja: '非常持ち出し袋で、一番大事な物は何ですか？',
    q_id: 'Barang apa yang paling penting dalam tas darurat Anda?',
    options: [
      {en:'Laptop',ja:'ノートパソコン',id:'Laptop'},
      {en:'Water',ja:'水',id:'Air'},
      {en:'Books',ja:'本',id:'Buku'},
      {en:'Umbrella',ja:'傘',id:'Payung'},
    ],
    correct: 1,
    explain_en: 'Water comes first. You can live for weeks without food, but only 3 days without water.',
    explain_ja: '水が一番大事です。食べ物がなくても何週間か生きられますが、水がないと3日しか生きられません。',
    explain_id: 'Air adalah prioritas utama. Anda bisa bertahan berminggu-minggu tanpa makanan, tetapi hanya 3 hari tanpa air.',
  },
  {
    q_en: 'You are in an elevator when an earthquake starts. What do you do?',
    q_ja: '地震が起きたとき、エレベーターの中にいます。どうしますか？',
    q_id: 'Anda di dalam elevator saat gempa terjadi. Apa yang Anda lakukan?',
    options: [
      {en:'Press all the floor buttons and get out at the first stop',ja:'すべての階のボタンを押して、最初に止まった階で降りる',id:'Tekan semua tombol lantai dan keluar di lantai pertama tempat elevator berhenti'},
      {en:'Force the doors open',ja:'ドアを無理に開ける',id:'Buka pintu secara paksa'},
      {en:'Do nothing and wait',ja:'何もしないで待つ',id:'Diam saja dan menunggu'},
    ],
    correct: 0,
    explain_en: 'Press all the buttons. The elevator then stops at the nearest floor. Get out immediately. New elevators have earthquake sensors that do this automatically.',
    explain_ja: 'すべてのボタンを押すと、近い階で止まります。すぐに降りてください。新しいエレベーターには地震のセンサーがあり、自動で近い階に止まります。',
    explain_id: 'Tekan semua tombol agar elevator berhenti di lantai terdekat. Segera keluar. Elevator baru punya sensor gempa yang melakukannya secara otomatis.',
  },
  {
    q_en: 'After a disaster, how can you leave a voice message for your family in Japan?',
    q_ja: '災害のあと、日本で家族に声の伝言を残すには、どうしますか？',
    q_id: 'Setelah bencana, bagaimana Anda meninggalkan pesan suara untuk keluarga di Jepang?',
    options: [
      {en:'Call 171 (Disaster Message Dial)',ja:'171に電話する（災害用伝言ダイヤル）',id:'Hubungi 171 (Layanan Pesan Suara Bencana)'},
      {en:'Send a fax',ja:'FAXを送る',id:'Kirim faks'},
      {en:'Call 110',ja:'110に電話する',id:'Hubungi 110'},
    ],
    correct: 0,
    explain_en: '171 is the disaster voice message service in Japan. Call 171. Press 1 to record and 2 to listen. It is free from NTT landlines. Other phones may pay a call charge.',
    explain_ja: '171は災害用伝言ダイヤルです。171に電話して、1を押すと録音、2を押すと再生です。NTTの固定電話からは無料です。ほかの電話からは、通話料がかかることがあります。',
    explain_id: '171 adalah layanan pesan suara bencana di Jepang. Hubungi 171. Tekan 1 untuk merekam dan 2 untuk mendengar. Gratis dari telepon rumah NTT. Dari telepon lain, mungkin ada biaya panggilan.',
  },
  {
    q_en: 'What does the J-Alert siren mean?',
    q_ja: 'Jアラートのサイレンは、何のお知らせですか？',
    q_id: 'Apa arti sirene J-Alert?',
    options: [
      {en:'Lunch break',ja:'昼休み',id:'Istirahat makan siang'},
      {en:'National emergency: missile, major earthquake, or tsunami',ja:'国の緊急事態：ミサイル、大きな地震、津波',id:'Darurat nasional: rudal, gempa besar, atau tsunami'},
      {en:'Monthly test. Ignore it.',ja:'毎月のテスト。気にしなくてよい',id:'Tes bulanan. Abaikan saja.'},
    ],
    correct: 1,
    explain_en: 'J-Alert is a national emergency warning for threats that will come soon: missiles, major earthquakes, and tsunamis. Take it seriously every time.',
    explain_ja: 'Jアラートは、ミサイル、大きな地震、津波など、すぐに来る危険を知らせる国の緊急警報です。毎回、本気で行動してください。',
    explain_id: 'J-Alert adalah peringatan darurat nasional untuk ancaman yang segera datang: rudal, gempa besar, dan tsunami. Tanggapi dengan serius setiap kali.',
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
  if (pct >= 0.9) { title = '🏆'; msg = getLangText('You Are Disaster Ready!', '防災の準備はばっちりです！', 'Anda Siap Hadapi Bencana!'); }
  else if (pct >= 0.7) { title = '👍'; msg = getLangText('Well Prepared!', 'よく準備できています！', 'Persiapan Baik!'); }
  else if (pct >= 0.5) { title = '🤔'; msg = getLangText('Read the guide again', 'ガイドをもう一度読んでください', 'Baca panduan lagi'); }
  else { title = '📚'; msg = getLangText('Study the guide carefully', 'ガイドをよく読んで、学んでください', 'Pelajari panduan dengan teliti'); }

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
    showToast(getLangText('🔄 Quiz restarted', '🔄 クイズをやり直します', '🔄 Kuis dimulai ulang'), 'info');
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
