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
    explain_en: 'Drop, Cover, and Hold On is the recommended action. After strong shaking, do not use an elevator to leave.',
    explain_ja: '机の下で身を低くし、頭を守るのが、すすめられている行動です。強い揺れのあと、避難にエレベーターを使わないでください。',
    explain_id: 'Merunduk, berlindung, dan bertahan adalah tindakan yang dianjurkan. Setelah guncangan kuat, jangan pakai elevator untuk mengungsi.',
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
    explain_en: 'The eye of a typhoon is calm, but the typhoon is not over. After the eye passes, strong wind blows again from the other direction. Do not go out unless you need to.',
    explain_ja: '台風の目の中は静かですが、台風は終わっていません。目が通りすぎると、反対の向きから、また強い風がふきます。必要がなければ、外に出ないでください。',
    explain_id: 'Mata topan itu tenang, tetapi topannya belum selesai. Setelah mata topan lewat, angin kencang bertiup lagi dari arah sebaliknya. Jangan keluar kecuali perlu.',
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
    explain_en: 'Open the windows to let air in, then leave. Do not use flames, electric switches, or fans. They can set the gas on fire. Close the gas valve. Call the gas company.',
    explain_ja: '窓を開けて空気を入れかえ、外に出てください。火、電気のスイッチ、換気扇は使わないでください。ガスに火がつくことがあります。ガスの元栓（もとせん）を閉めてください。ガス会社に連絡してください。',
    explain_id: 'Buka jendela agar udara masuk, lalu keluar. Jangan pakai api, saklar listrik, atau kipas. Semua itu bisa membuat gas terbakar. Tutup katup gas. Hubungi perusahaan gas.',
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
    explain_en: '119 is for fire and ambulance. 110 is for police. 118 is for accidents and incidents at sea (Japan Coast Guard).',
    explain_ja: '119は消防と救急車です。110は警察です。118は、海での事件や事故のときの番号です（海上保安庁）。',
    explain_id: '119 untuk pemadam kebakaran dan ambulans. 110 untuk polisi. 118 untuk kecelakaan dan kejadian di laut (Penjaga Pantai Jepang).',
  },
  {
    q_en: 'You get a Level 4 Evacuation Instruction. What do you do?',
    q_ja: 'レベル4の避難指示が出ました。どうしますか？',
    q_id: 'Kamu menerima perintah evakuasi Tingkat 4. Apa yang kamu lakukan?',
    options: [
      {en:'Start preparing to leave',ja:'避難の準備を始める',id:'Mulai bersiap untuk pergi'},
      {en:'Leave the danger area now',ja:'危ない場所から、すぐに避難する',id:'Segera mengungsi dari daerah berbahaya'},
      {en:'Wait until Level 5',ja:'レベル5まで待つ',id:'Tunggu sampai Tingkat 5'},
      {en:'Only elderly people must evacuate',ja:'高齢者だけが避難する',id:'Hanya lansia yang perlu mengungsi'},
    ],
    correct: 1,
    explain_en: 'At Level 4, everyone in a danger area must leave now. At Level 5, a disaster is happening or is about to happen. It may be too late to leave safely.',
    explain_ja: 'レベル4では、危ない場所にいる人は、全員すぐに避難します。レベル5は、災害が起きているか、すぐに起きそうです。安全に避難するのは、もうむずかしいかもしれません。',
    explain_id: 'Pada Tingkat 4, semua orang di daerah berbahaya harus segera mengungsi. Pada Tingkat 5, bencana sedang atau akan segera terjadi. Mungkin sudah terlambat untuk mengungsi dengan aman.',
  },
  {
    q_en: 'Which item is on the official emergency bag lists?',
    q_ja: '非常持ち出し品のリストにある物は、どれですか？',
    q_id: 'Barang mana yang ada di daftar resmi tas darurat?',
    options: [
      {en:'Laptop',ja:'ノートパソコン',id:'Laptop'},
      {en:'Water',ja:'水',id:'Air'},
      {en:'Books',ja:'本',id:'Buku'},
    ],
    correct: 1,
    explain_en: 'Drinking water is on the official lists of items to take when you evacuate. Plan for about 3 L per person per day.',
    explain_ja: '飲み水は、非常持ち出し品のリストにあります。1人1日3リットルを目安にしてください。',
    explain_id: 'Air minum ada di daftar resmi barang yang dibawa saat mengungsi. Siapkan sekitar 3 L per orang per hari.',
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
    explain_en: 'Press all the floor buttons. Get out at the first floor where it stops. Elevators newly installed from fiscal year 2009 must have a device that stops them at the nearest floor in an earthquake.',
    explain_ja: 'すべての階のボタンを押して、最初に止まった階で降りてください。2009年度以降に新しく付けたエレベーターには、地震のとき、近くの階に止める装置（そうち）が必要です。',
    explain_id: 'Tekan semua tombol lantai. Keluar di lantai pertama tempat elevator berhenti. Elevator yang baru dipasang sejak tahun fiskal 2009 wajib punya alat yang menghentikannya di lantai terdekat saat gempa.',
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
    explain_en: '171 is the disaster voice message service in Japan. It starts when a disaster makes calls to the area hard to connect. Call 171. Press 1 to record and 2 to listen. Calls from NTT East or NTT West phones are free. From other phones, ask your phone company.',
    explain_ja: '171は災害用伝言ダイヤルです。災害で、その地域への電話がつながりにくくなったときに始まります。171に電話して、1を押すと録音、2を押すと再生です。NTT東日本・NTT西日本の電話からは無料です。ほかの電話からかけるときは、電話会社に聞いてください。',
    explain_id: '171 adalah layanan pesan suara bencana di Jepang. Layanan ini dimulai saat bencana membuat telepon ke daerah itu sulit tersambung. Hubungi 171. Tekan 1 untuk merekam dan 2 untuk mendengar. Panggilan dari telepon NTT East atau NTT West gratis. Dari telepon lain, tanyakan ke perusahaan teleponmu.',
  },
  {
    q_en: 'What does the J-Alert siren mean?',
    q_ja: 'Jアラートのサイレンは、何のお知らせですか？',
    q_id: 'Apa arti sirene J-Alert?',
    options: [
      {en:'Lunch break',ja:'昼休み',id:'Istirahat makan siang'},
      {en:'Urgent national alert: a missile, an Earthquake Early Warning or a Major Tsunami Warning',ja:'国からの緊急のお知らせ：ミサイル、緊急地震速報、大津波警報',id:'Peringatan nasional yang mendesak: rudal, peringatan dini gempa bumi, atau peringatan bahaya tsunami skala besar'},
      {en:'Monthly test. Ignore it.',ja:'毎月のテスト。気にしなくてよい',id:'Tes bulanan. Abaikan saja.'},
    ],
    correct: 1,
    explain_en: 'J-Alert sends urgent national alerts when there is no time to wait, such as missiles, Earthquake Early Warnings and Major Tsunami Warnings.',
    explain_ja: 'Jアラートは、ミサイル、緊急地震速報、大津波警報など、対応する時間の余裕がない情報を、国からすぐに知らせます。',
    explain_id: 'J-Alert mengirim peringatan nasional yang mendesak saat tidak ada waktu untuk menunggu, seperti rudal, peringatan dini gempa bumi, dan peringatan bahaya tsunami skala besar.',
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
