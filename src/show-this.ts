import { currentLang } from './lang';

interface ShowThisPhrase {
  jp: string;
  rom: string;
  en: string;
  id: string;
  context_en?: string;
  context_ja?: string;
  context_id?: string;
}

type ShowThisCategory = 'emergency' | 'medical' | 'shelter' | 'police' | 'communication';

const categoryMeta: { id: ShowThisCategory; icon: string; label_en: string; label_ja: string; label_id: string }[] = [
  { id: 'emergency', icon: '🆘', label_en: 'Emergency', label_ja: '緊急', label_id: 'Darurat' },
  { id: 'medical', icon: '🏥', label_en: 'Medical', label_ja: '医療', label_id: 'Medis' },
  { id: 'shelter', icon: '🏠', label_en: 'Shelter', label_ja: '避難', label_id: 'Shelter' },
  { id: 'police', icon: '👮', label_en: 'Police', label_ja: '警察', label_id: 'Polisi' },
  { id: 'communication', icon: '📞', label_en: 'Communication', label_ja: '通信', label_id: 'Komunikasi' },
];

const phrases: Record<ShowThisCategory, ShowThisPhrase[]> = {
  emergency: [
    { jp: '助けてください！', rom: 'Tasukete kudasai!', en: 'Please help me!', id: 'Tolong saya!', context_en: 'General cry for help', context_ja: '一般的な助けを求める表現', context_id: 'Permintaan bantuan umum' },
    { jp: '日本語がわかりません', rom: 'Nihongo ga wakarimasen', en: "I don't understand Japanese", id: 'Saya tidak mengerti bahasa Jepang', context_en: 'Let them know about the language barrier', context_ja: '言語の壁を伝える', context_id: 'Beritahu mereka tentang kendala bahasa' },
    { jp: '救急車を呼んでください', rom: 'Kyūkyūsha wo yonde kudasai', en: 'Please call an ambulance', id: 'Tolong panggil ambulans', context_en: 'For medical emergencies — dial 119', context_ja: '医療緊急時 — 119番', context_id: 'Untuk keadaan darurat medis — hubungi 119' },
    { jp: '警察を呼んでください', rom: 'Keisatsu wo yonde kudasai', en: 'Please call the police', id: 'Tolong panggil polisi', context_en: 'For safety threats — dial 110', context_ja: '安全上の脅威 — 110番', context_id: 'Untuk ancaman keamanan — hubungi 110' },
    { jp: '地震です！安全な場所はどこですか？', rom: 'Jishin desu! Anzen na basho wa doko desu ka?', en: 'Earthquake! Where is a safe place?', id: 'Gempa! Di mana tempat yang aman?', context_en: 'Ask for the nearest safe spot during an earthquake', context_ja: '地震時に最寄りの安全な場所を尋ねる', context_id: 'Tanyakan tempat aman terdekat saat gempa' },
    { jp: '火事です！逃げてください！', rom: 'Kaji desu! Nigete kudasai!', en: 'Fire! Please run away!', id: 'Kebakaran! Tolong lari!', context_en: 'Alert others about fire danger', context_ja: '火災の危険を周囲に知らせる', context_id: 'Peringatkan orang lain tentang bahaya kebakaran' },
  ],
  medical: [
    { jp: 'けがをしました', rom: 'Kega wo shimashita', en: "I'm injured", id: 'Saya terluka', context_en: 'General injury statement', context_ja: '怪我を伝える一般的な表現', context_id: 'Pernyataan cedera umum' },
    { jp: 'アレルギーがあります', rom: 'Arerugī ga arimasu', en: 'I have allergies', id: 'Saya punya alergi', context_en: 'Tell medical staff about your allergies', context_ja: '医療スタッフにアレルギーを伝える', context_id: 'Beritahu staf medis tentang alergi Anda' },
    { jp: '薬が必要です', rom: 'Kusuri ga hitsuyō desu', en: 'I need medication', id: 'Saya butuh obat', context_en: 'When you need your prescription medicine', context_ja: '処方薬が必要な時', context_id: 'Ketika Anda butuh obat resep' },
    { jp: '病院はどこですか？', rom: 'Byōin wa doko desu ka?', en: 'Where is the hospital?', id: 'Di mana rumah sakit?', context_en: 'Ask for directions to the nearest hospital', context_ja: '最寄りの病院への道順を尋ねる', context_id: 'Tanyakan arah ke rumah sakit terdekat' },
    { jp: '頭が痛いです / お腹が痛いです', rom: 'Atama ga itai desu / Onaka ga itai desu', en: 'I have a headache / stomachache', id: 'Saya sakit kepala / sakit perut', context_en: 'Describe common pain symptoms', context_ja: '一般的な痛みの症状を伝える', context_id: 'Jelaskan gejala nyeri umum' },
    { jp: '意識がありません！AEDはどこですか？', rom: 'Ishiki ga arimasen! AED wa doko desu ka?', en: "They're unconscious! Where is the AED?", id: 'Dia tidak sadar! Di mana AED?', context_en: 'For cardiac emergencies — AEDs are in most public buildings', context_ja: '心臓の緊急事態 — AEDはほとんどの公共施設にあります', context_id: 'Untuk keadaan darurat jantung — AED ada di kebanyakan gedung publik' },
  ],
  shelter: [
    { jp: '避難所はどこですか？', rom: 'Hinanjo wa doko desu ka?', en: 'Where is the evacuation shelter?', id: 'Di mana tempat pengungsian?', context_en: 'Ask for the nearest shelter location', context_ja: '最寄りの避難所の場所を尋ねる', context_id: 'Tanyakan lokasi tempat pengungsian terdekat' },
    { jp: 'ここは安全ですか？', rom: 'Koko wa anzen desu ka?', en: 'Is this place safe?', id: 'Apakah tempat ini aman?', context_en: 'Confirm if your current location is safe', context_ja: '現在地が安全か確認する', context_id: 'Konfirmasi apakah lokasi Anda saat ini aman' },
    { jp: '水をください', rom: 'Mizu wo kudasai', en: 'Please give me water', id: 'Tolong beri saya air', context_en: 'Request drinking water at a shelter', context_ja: '避難所で飲料水を求める', context_id: 'Minta air minum di tempat pengungsian' },
    { jp: '食べ物はありますか？', rom: 'Tabemono wa arimasu ka?', en: 'Is there food available?', id: 'Apakah ada makanan?', context_en: 'Ask about food supplies at the shelter', context_ja: '避難所の食料について尋ねる', context_id: 'Tanyakan tentang persediaan makanan di pengungsian' },
    { jp: '毛布をください', rom: 'Mōfu wo kudasai', en: 'Please give me a blanket', id: 'Tolong beri saya selimut', context_en: 'Request a blanket to keep warm', context_ja: '暖を取るために毛布を求める', context_id: 'Minta selimut untuk menghangatkan diri' },
    { jp: 'トイレはどこですか？', rom: 'Toire wa doko desu ka?', en: 'Where is the toilet?', id: 'Di mana toilet?', context_en: 'Ask for restroom location', context_ja: 'トイレの場所を尋ねる', context_id: 'Tanyakan lokasi toilet' },
  ],
  police: [
    { jp: 'パスポートをなくしました', rom: 'Pasupōto wo nakushimashita', en: 'I lost my passport', id: 'Saya kehilangan paspor', context_en: 'Report lost passport to police', context_ja: 'パスポート紛失を警察に届ける', context_id: 'Laporkan paspor hilang ke polisi' },
    { jp: '道に迷いました', rom: 'Michi ni mayoimashita', en: "I'm lost", id: 'Saya tersesat', context_en: 'Ask for directions or help finding your way', context_ja: '道順や道案内を求める', context_id: 'Minta petunjuk arah atau bantuan menemukan jalan' },
    { jp: '在留カードを持っています', rom: 'Zairyū kādo wo motte imasu', en: 'I have my residence card', id: 'Saya membawa kartu izin tinggal', context_en: 'Show ID to authorities when asked', context_ja: '求められた時に身分証明書を提示する', context_id: 'Tunjukkan ID saat diminta pihak berwenang' },
    { jp: '大使館に連絡したいです', rom: 'Taishikan ni renraku shitai desu', en: 'I want to contact my embassy', id: 'Saya ingin menghubungi kedutaan saya', context_en: 'Request embassy contact for consular assistance', context_ja: '領事支援のために大使館への連絡を求める', context_id: 'Minta kontak kedutaan untuk bantuan konsuler' },
    { jp: '盗まれました', rom: 'Nusumaremashita', en: 'I was robbed / Something was stolen', id: 'Saya dirampok / Barang saya dicuri', context_en: 'Report theft to police', context_ja: '窃盗を警察に届ける', context_id: 'Laporkan pencurian ke polisi' },
  ],
  communication: [
    { jp: '電話を貸してください', rom: 'Denwa wo kashite kudasai', en: 'Please lend me your phone', id: 'Tolong pinjamkan telepon Anda', context_en: 'When your phone is dead or lost', context_ja: '携帯が使えない・紛失した時', context_id: 'Saat ponsel Anda mati atau hilang' },
    { jp: 'この番号に電話してください', rom: 'Kono bangō ni denwa shite kudasai', en: 'Please call this number', id: 'Tolong hubungi nomor ini', context_en: 'Show your emergency contact number', context_ja: '緊急連絡先の番号を見せる', context_id: 'Tunjukkan nomor kontak darurat Anda' },
    { jp: '通訳が必要です', rom: 'Tsūyaku ga hitsuyō desu', en: 'I need an interpreter', id: 'Saya butuh penerjemah', context_en: 'Request interpretation service', context_ja: '通訳サービスを求める', context_id: 'Minta layanan penerjemah' },
    { jp: 'Wi-Fiはありますか？', rom: 'Wi-Fi wa arimasu ka?', en: 'Is there Wi-Fi?', id: 'Apakah ada Wi-Fi?', context_en: 'Free disaster Wi-Fi: 00000JAPAN', context_ja: '無料災害Wi-Fi: 00000JAPAN', context_id: 'Wi-Fi bencana gratis: 00000JAPAN' },
    { jp: '家族に連絡を取りたいです', rom: 'Kazoku ni renraku wo toritai desu', en: 'I want to contact my family', id: 'Saya ingin menghubungi keluarga saya', context_en: 'Let others know you need to reach family', context_ja: '家族に連絡を取りたいことを伝える', context_id: 'Beritahu orang lain Anda perlu menghubungi keluarga' },
    { jp: '英語を話せる人はいますか？', rom: 'Eigo wo hanaseru hito wa imasu ka?', en: 'Is there anyone who speaks English?', id: 'Apakah ada orang yang bisa berbicara bahasa Inggris?', context_en: 'Ask for an English speaker nearby', context_ja: '近くに英語を話せる人がいるか尋ねる', context_id: 'Tanyakan apakah ada yang bisa berbahasa Inggris' },
  ],
};

let currentCat: ShowThisCategory = 'emergency';
let currentIndex = 0;

function renderTabs(container: HTMLElement): void {
  const tabBar = document.createElement('div');
  tabBar.className = 'tab-bar';
  categoryMeta.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `tab-btn showthis-tab${cat.id === currentCat ? ' active' : ''}`;
    btn.setAttribute('data-cat', cat.id);
    btn.innerHTML = `${cat.icon} <span data-lang="en">${cat.label_en}</span><span data-lang="ja">${cat.label_ja}</span><span data-lang="id">${cat.label_id}</span>`;
    btn.addEventListener('click', () => {
      currentCat = cat.id;
      currentIndex = 0;
      renderCard();
      container.querySelectorAll('.showthis-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    tabBar.appendChild(btn);
  });
  container.appendChild(tabBar);
}

function renderCard(): void {
  const cardContainer = document.getElementById('showThisCard');
  if (!cardContainer) return;

  const list = phrases[currentCat];
  const phrase = list[currentIndex];
  const total = list.length;

  cardContainer.innerHTML = `
    <div class="showthis-card">
      <div class="showthis-jp">${phrase.jp}</div>
      <div class="showthis-rom">${phrase.rom}</div>
      <div class="showthis-translations">
        <div class="showthis-en">🇬🇧 ${phrase.en}</div>
        <div class="showthis-id">🇮🇩 ${phrase.id}</div>
      </div>
      ${phrase.context_en ? `<div class="showthis-context">💡 <span data-lang="en">${phrase.context_en}</span><span data-lang="ja">${phrase.context_ja || ''}</span><span data-lang="id">${phrase.context_id || ''}</span></div>` : ''}
      <div class="showthis-nav">
        <button class="showthis-nav-btn" id="showThisPrev" ${currentIndex === 0 ? 'disabled' : ''}>
          ← <span data-lang="en">Prev</span><span data-lang="ja">前へ</span><span data-lang="id">Sblm</span>
        </button>
        <span class="showthis-counter">${currentIndex + 1} / ${total}</span>
        <button class="showthis-nav-btn" id="showThisNext" ${currentIndex === total - 1 ? 'disabled' : ''}>
          <span data-lang="en">Next</span><span data-lang="ja">次へ</span><span data-lang="id">Slnjt</span> →
        </button>
      </div>
    </div>
  `;

  // Reapply lang visibility
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);

  document.getElementById('showThisPrev')?.addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; renderCard(); }
  });
  document.getElementById('showThisNext')?.addEventListener('click', () => {
    if (currentIndex < list.length - 1) { currentIndex++; renderCard(); }
  });

  // Swipe support
  let touchStartX = 0;
  const card = cardContainer.querySelector('.showthis-card');
  if (card) {
    card.addEventListener('touchstart', (e) => {
      touchStartX = (e as TouchEvent).touches[0].clientX;
    }, { passive: true });
    card.addEventListener('touchend', (e) => {
      const diff = touchStartX - (e as TouchEvent).changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < list.length - 1) { currentIndex++; renderCard(); }
        else if (diff < 0 && currentIndex > 0) { currentIndex--; renderCard(); }
      }
    }, { passive: true });
  }
}

export function initShowThis(): void {
  const container = document.getElementById('showThisContainer');
  if (!container) return;

  container.innerHTML = '<div id="showThisCard"></div>';
  renderTabs(container);
  // Move tabs before the card
  const tabBar = container.querySelector('.tab-bar');
  const cardEl = document.getElementById('showThisCard');
  if (tabBar && cardEl) container.insertBefore(tabBar, cardEl);

  renderCard();
}
