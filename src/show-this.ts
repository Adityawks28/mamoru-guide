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
  { id: 'shelter', icon: '🏠', label_en: 'Shelter', label_ja: '避難', label_id: 'Pengungsian' },
  { id: 'police', icon: '👮', label_en: 'Police', label_ja: '警察', label_id: 'Polisi' },
  { id: 'communication', icon: '📞', label_en: 'Communication', label_ja: '通信', label_id: 'Komunikasi' },
];

const phrases: Record<ShowThisCategory, ShowThisPhrase[]> = {
  emergency: [
    { jp: '助けてください！', rom: 'Tasukete kudasai!', en: 'Please help me!', id: 'Tolong saya!', context_en: 'Use this to ask for help.', context_ja: '助けがほしいときに使います。', context_id: 'Pakai ini untuk minta tolong.' },
    { jp: '日本語がわかりません', rom: 'Nihongo ga wakarimasen', en: 'I do not understand Japanese', id: 'Saya tidak mengerti bahasa Jepang', context_en: 'Tell people that language is a problem for you.', context_ja: '言葉がわからないことを伝えます。', context_id: 'Beri tahu orang lain bahwa Anda punya kendala bahasa.' },
    { jp: '救急車を呼んでください', rom: 'Kyūkyūsha wo yonde kudasai', en: 'Please call an ambulance', id: 'Tolong panggil ambulans', context_en: 'For a medical emergency: call 119.', context_ja: '急な病気やけがのとき：119番に電話します。', context_id: 'Untuk keadaan darurat medis: hubungi 119.' },
    { jp: '警察を呼んでください', rom: 'Keisatsu wo yonde kudasai', en: 'Please call the police', id: 'Tolong panggil polisi', context_en: 'When your safety is in danger: call 110.', context_ja: '身の危険があるとき：110番に電話します。', context_id: 'Jika keselamatan Anda terancam: hubungi 110.' },
    { jp: '地震です！安全な場所はどこですか？', rom: 'Jishin desu! Anzen na basho wa doko desu ka?', en: 'Earthquake! Where is a safe place?', id: 'Gempa! Di mana tempat yang aman?', context_en: 'Ask for the nearest safe place during an earthquake.', context_ja: '地震のとき、いちばん近い安全な場所を聞きます。', context_id: 'Tanyakan tempat aman terdekat saat gempa.' },
    { jp: '火事です！逃げてください！', rom: 'Kaji desu! Nigete kudasai!', en: 'Fire! Please run away!', id: 'Kebakaran! Tolong lari!', context_en: 'Warn other people about a fire.', context_ja: 'まわりの人に火事を知らせます。', context_id: 'Peringatkan orang lain tentang bahaya kebakaran.' },
  ],
  medical: [
    { jp: 'けがをしました', rom: 'Kega wo shimashita', en: 'I am injured', id: 'Saya terluka', context_en: 'Tell people that you are hurt.', context_ja: 'けがをしたことを伝えます。', context_id: 'Beri tahu orang lain bahwa Anda terluka.' },
    { jp: 'アレルギーがあります', rom: 'Arerugī ga arimasu', en: 'I have allergies', id: 'Saya punya alergi', context_en: 'Tell doctors and nurses about your allergies.', context_ja: '医者や看護師にアレルギーを伝えます。', context_id: 'Beri tahu dokter dan perawat tentang alergi Anda.' },
    { jp: '薬が必要です', rom: 'Kusuri ga hitsuyō desu', en: 'I need medicine', id: 'Saya butuh obat', context_en: 'Use this when you need your prescription medicine.', context_ja: '病院でもらった薬が必要なときに使います。', context_id: 'Pakai ini saat Anda butuh obat resep.' },
    { jp: '病院はどこですか？', rom: 'Byōin wa doko desu ka?', en: 'Where is the hospital?', id: 'Di mana rumah sakit?', context_en: 'Ask the way to the nearest hospital.', context_ja: 'いちばん近い病院への行き方を聞きます。', context_id: 'Tanyakan jalan ke rumah sakit terdekat.' },
    { jp: '頭が痛いです / お腹が痛いです', rom: 'Atama ga itai desu / Onaka ga itai desu', en: 'I have a headache / stomachache', id: 'Saya sakit kepala / sakit perut', context_en: 'Tell people where you have pain.', context_ja: 'どこが痛いかを伝えます。', context_id: 'Beri tahu bagian tubuh yang sakit.' },
    { jp: '意識がありません！AEDはどこですか？', rom: 'Ishiki ga arimasen! AED wa doko desu ka?', en: 'This person is unconscious! Where is the AED?', id: 'Orang ini tidak sadar! Di mana AED?', context_en: 'For a heart emergency. Most public buildings have an AED.', context_ja: '心臓の緊急のときに使います。AEDは、ほとんどの公共の建物にあります。', context_id: 'Untuk keadaan darurat jantung. Kebanyakan gedung umum punya AED.' },
  ],
  shelter: [
    { jp: '避難所はどこですか？', rom: 'Hinanjo wa doko desu ka?', en: 'Where is the evacuation shelter?', id: 'Di mana tempat pengungsian?', context_en: 'Ask where the nearest shelter is.', context_ja: 'いちばん近い避難所の場所を聞きます。', context_id: 'Tanyakan lokasi tempat pengungsian terdekat.' },
    { jp: 'ここは安全ですか？', rom: 'Koko wa anzen desu ka?', en: 'Is this place safe?', id: 'Apakah tempat ini aman?', context_en: 'Ask if the place where you are now is safe.', context_ja: '今いる場所が安全か聞きます。', context_id: 'Tanyakan apakah tempat Anda sekarang aman.' },
    { jp: '水をください', rom: 'Mizu wo kudasai', en: 'Please give me water', id: 'Tolong beri saya air', context_en: 'Ask for drinking water at a shelter.', context_ja: '避難所で飲み水をたのみます。', context_id: 'Minta air minum di tempat pengungsian.' },
    { jp: '食べ物はありますか？', rom: 'Tabemono wa arimasu ka?', en: 'Is there any food?', id: 'Apakah ada makanan?', context_en: 'Ask if the shelter has food.', context_ja: '避難所に食べ物があるか聞きます。', context_id: 'Tanyakan apakah ada makanan di tempat pengungsian.' },
    { jp: '毛布をください', rom: 'Mōfu wo kudasai', en: 'Please give me a blanket', id: 'Tolong beri saya selimut', context_en: 'Ask for a blanket to keep warm.', context_ja: '体を温めるために、毛布をたのみます。', context_id: 'Minta selimut untuk menghangatkan badan.' },
    { jp: 'トイレはどこですか？', rom: 'Toire wa doko desu ka?', en: 'Where is the toilet?', id: 'Di mana toilet?', context_en: 'Ask where the toilet is.', context_ja: 'トイレの場所を聞きます。', context_id: 'Tanyakan di mana toilet.' },
  ],
  police: [
    { jp: 'パスポートをなくしました', rom: 'Pasupōto wo nakushimashita', en: 'I lost my passport', id: 'Saya kehilangan paspor', context_en: 'Tell the police that you lost your passport.', context_ja: 'パスポートをなくしたことを警察に伝えます。', context_id: 'Laporkan paspor hilang ke polisi.' },
    { jp: '道に迷いました', rom: 'Michi ni mayoimashita', en: 'I am lost', id: 'Saya tersesat', context_en: 'Ask for directions, or for help to find your way.', context_ja: '道を教えてもらうときに使います。', context_id: 'Minta petunjuk arah atau bantuan mencari jalan.' },
    { jp: '在留カードを持っています', rom: 'Zairyū kādo wo motte imasu', en: 'I have my residence card', id: 'Saya membawa kartu izin tinggal', context_en: 'Show your ID when the police or officials ask for it.', context_ja: '見せるように言われたら、身分証明書を見せます。', context_id: 'Tunjukkan kartu identitas saat polisi atau petugas memintanya.' },
    { jp: '大使館に連絡したいです', rom: 'Taishikan ni renraku shitai desu', en: 'I want to contact my embassy', id: 'Saya ingin menghubungi kedutaan saya', context_en: 'Ask to contact your embassy for help.', context_ja: '大使館に助けてもらうため、連絡したいと伝えます。', context_id: 'Minta untuk menghubungi kedutaan agar mendapat bantuan.' },
    { jp: '盗まれました', rom: 'Nusumaremashita', en: 'I was robbed / Something was stolen', id: 'Saya dirampok / Barang saya dicuri', context_en: 'Tell the police about a theft.', context_ja: '物を盗まれたことを警察に伝えます。', context_id: 'Laporkan pencurian ke polisi.' },
  ],
  communication: [
    { jp: '電話を貸してください', rom: 'Denwa wo kashite kudasai', en: 'Please lend me your phone', id: 'Tolong pinjamkan telepon Anda', context_en: 'Use this when your phone has no power or you lost it.', context_ja: '携帯電話が使えないときや、なくしたときに使います。', context_id: 'Saat ponsel Anda mati atau hilang.' },
    { jp: 'この番号に電話してください', rom: 'Kono bangō ni denwa shite kudasai', en: 'Please call this number', id: 'Tolong hubungi nomor ini', context_en: 'Show the number of your emergency contact.', context_ja: '緊急連絡先の番号を見せます。', context_id: 'Tunjukkan nomor kontak darurat Anda.' },
    { jp: '通訳が必要です', rom: 'Tsūyaku ga hitsuyō desu', en: 'I need an interpreter', id: 'Saya butuh penerjemah', context_en: 'Ask for an interpreter.', context_ja: '通訳をたのみます。', context_id: 'Minta penerjemah.' },
    { jp: 'Wi-Fiはありますか？', rom: 'Wi-Fi wa arimasu ka?', en: 'Is there Wi-Fi?', id: 'Apakah ada Wi-Fi?', context_en: 'Free Wi-Fi in a disaster: 00000JAPAN', context_ja: '災害のときの無料Wi-Fi：00000JAPAN', context_id: 'Wi-Fi gratis saat bencana: 00000JAPAN' },
    { jp: '家族に連絡を取りたいです', rom: 'Kazoku ni renraku wo toritai desu', en: 'I want to contact my family', id: 'Saya ingin menghubungi keluarga saya', context_en: 'Tell people that you need to contact your family.', context_ja: '家族に連絡したいことを伝えます。', context_id: 'Beri tahu orang lain bahwa Anda perlu menghubungi keluarga.' },
    { jp: '英語を話せる人はいますか？', rom: 'Eigo wo hanaseru hito wa imasu ka?', en: 'Is there anyone who speaks English?', id: 'Apakah ada orang yang bisa berbahasa Inggris?', context_en: 'Ask if a person near you speaks English.', context_ja: '近くに英語を話せる人がいるか聞きます。', context_id: 'Tanyakan apakah ada orang di dekat Anda yang bisa berbahasa Inggris.' },
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

  let touchStartX = 0;
  container.addEventListener('touchstart', (e) => {
    touchStartX = (e as TouchEvent).touches[0].clientX;
  }, { passive: true });
  container.addEventListener('touchend', (e) => {
    const diff = touchStartX - (e as TouchEvent).changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const list = phrases[currentCat];
      if (diff > 0 && currentIndex < list.length - 1) { currentIndex++; renderCard(); }
      else if (diff < 0 && currentIndex > 0) { currentIndex--; renderCard(); }
    }
  }, { passive: true });
}
