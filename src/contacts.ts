import type { Language } from './types';
import { currentLang } from './lang';

export interface Contact {
  icon: string;
  name: string;
  name_ja: string;
  name_id: string;
  number: string;
  desc_en: string;
  desc_ja: string;
  desc_id: string;
  category: ContactCategory;
  url?: string;
}

export type ContactCategory = 'emergency' | 'medical' | 'support' | 'embassy' | 'mental';

const contacts: Contact[] = [
  // Emergency
  {icon:'🚒',name:'Fire / Ambulance',name_ja:'消防・救急',name_id:'Pemadam / Ambulans',number:'119',desc_en:'Fire, medical emergencies, rescue',desc_ja:'火事、救急、救助',desc_id:'Kebakaran, darurat medis, penyelamatan',category:'emergency'},
  {icon:'👮',name:'Police',name_ja:'警察',name_id:'Polisi',number:'110',desc_en:'Crime, accidents, lost property',desc_ja:'犯罪、事故、遺失物',desc_id:'Kejahatan, kecelakaan, barang hilang',category:'emergency'},
  {icon:'⚓',name:'Coast Guard',name_ja:'海上保安庁',name_id:'Penjaga Pantai',number:'118',desc_en:'Maritime emergencies, tsunami sighting',desc_ja:'海上の緊急事態、津波目撃',desc_id:'Darurat laut, penampakan tsunami',category:'emergency'},

  // Medical
  {icon:'🏥',name:'AMDA Medical Info',name_ja:'AMDA国際医療情報',name_id:'AMDA Info Medis',number:'03-6233-9266',desc_en:'Multilingual medical consultation for foreigners',desc_ja:'外国人のための多言語医療相談',desc_id:'Konsultasi medis multibahasa untuk orang asing',category:'medical',url:'https://www.amdamedicalcenter.com/'},
  {icon:'💊',name:'Japan Healthcare Info',name_ja:'医療情報ネット',name_id:'Info Kesehatan Jepang',number:'0570-064-699',desc_en:'Find hospitals & clinics that accept foreign patients',desc_ja:'外国人患者を受け入れる病院を検索',desc_id:'Cari rumah sakit yang menerima pasien asing',category:'medical'},

  // Support / Multilingual
  {icon:'🌐',name:'Japan Helpline',name_ja:'ジャパンヘルプライン',name_id:'Japan Helpline',number:'0570-000-911',desc_en:'24/7 multilingual support for any emergency',desc_ja:'24時間多言語サポート',desc_id:'Dukungan multibahasa 24/7 untuk semua darurat',category:'support'},
  {icon:'📞',name:'Immigration Info',name_ja:'入管インフォメーション',name_id:'Info Imigrasi',number:'0570-013904',desc_en:'Visa, residence status, zairyu card questions',desc_ja:'ビザ、在留資格、在留カードの質問',desc_id:'Visa, status tinggal, pertanyaan kartu zairyu',category:'support'},
  {icon:'🏢',name:'Disaster Voice Board (171)',name_ja:'災害用伝言ダイヤル',name_id:'Papan Pesan Bencana',number:'171',desc_en:'Leave/check voice messages for family after disaster',desc_ja:'災害後に家族への伝言を録音・確認',desc_id:'Tinggalkan/periksa pesan suara untuk keluarga setelah bencana',category:'support'},

  // Embassy (Indonesian — since PPI Kobe)
  {icon:'🇮🇩',name:'Indonesian Embassy Tokyo',name_ja:'インドネシア大使館',name_id:'KBRI Tokyo',number:'03-3441-4201',desc_en:'Consular assistance for Indonesian citizens',desc_ja:'インドネシア国民のための領事支援',desc_id:'Bantuan konsuler untuk WNI',category:'embassy',url:'https://kemlu.go.id/tokyo/'},
  {icon:'🇮🇩',name:'Indonesian Consulate Osaka',name_ja:'在大阪インドネシア総領事館',name_id:'KJRI Osaka',number:'06-6449-9898',desc_en:'Covers Kansai region (Kobe, Osaka, Kyoto)',desc_ja:'関西地域をカバー（神戸、大阪、京都）',desc_id:'Melayani wilayah Kansai (Kobe, Osaka, Kyoto)',category:'embassy'},

  // Mental Health
  {icon:'🧠',name:'TELL Lifeline',name_ja:'TELLジャパン',name_id:'TELL Lifeline',number:'03-5774-0992',desc_en:'English-language counseling & crisis support',desc_ja:'英語カウンセリング＆危機支援',desc_id:'Konseling & dukungan krisis berbahasa Inggris',category:'mental',url:'https://telljp.com/'},
  {icon:'💛',name:'Yorisoi Hotline',name_ja:'よりそいホットライン',name_id:'Yorisoi Hotline',number:'0120-279-338',desc_en:'24/7 free, multilingual support (press 2 for foreign language)',desc_ja:'24時間無料、多言語対応（外国語は2番）',desc_id:'Gratis 24/7, multibahasa (tekan 2 untuk bahasa asing)',category:'mental'},
];

const categoryLabels: Record<ContactCategory, Record<Language, string>> = {
  emergency: {en:'Emergency',ja:'緊急',id:'Darurat'},
  medical: {en:'Medical',ja:'医療',id:'Medis'},
  support: {en:'Support & Info',ja:'サポート・情報',id:'Dukungan & Info'},
  embassy: {en:'Embassy',ja:'大使館',id:'Kedutaan'},
  mental: {en:'Mental Health',ja:'メンタルヘルス',id:'Kesehatan Mental'},
};

const categoryOrder: ContactCategory[] = ['emergency','medical','support','embassy','mental'];

export function initContacts(): void {
  const grid = document.getElementById('contactsGrid');
  if (!grid) return;

  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.contact-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter') as ContactCategory | 'all';
      filterBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      renderContacts(cat === 'all' ? null : cat);
    });
  });

  renderContacts(null);
}

function renderContacts(filterCat: ContactCategory | null): void {
  const grid = document.getElementById('contactsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = filterCat ? contacts.filter(c => c.category === filterCat) : contacts;
  const grouped = new Map<ContactCategory, Contact[]>();

  for (const cat of categoryOrder) {
    const items = filtered.filter(c => c.category === cat);
    if (items.length > 0) grouped.set(cat, items);
  }

  grouped.forEach((items, cat) => {
    const label = categoryLabels[cat];
    const header = document.createElement('div');
    header.className = 'contact-category-header';
    header.innerHTML = `<span data-lang="en">${label.en}</span><span data-lang="ja">${label.ja}</span><span data-lang="id">${label.id}</span>`;
    grid.appendChild(header);

    items.forEach(c => {
      const card = document.createElement('a');
      card.className = 'contact-card';
      card.href = `tel:${c.number.replace(/[^0-9+]/g, '')}`;
      card.innerHTML = `
        <div class="contact-icon">${c.icon}</div>
        <div class="contact-info">
          <div class="contact-name"><span data-lang="en">${c.name}</span><span data-lang="ja">${c.name_ja}</span><span data-lang="id">${c.name_id}</span></div>
          <div class="contact-number">${c.number}</div>
          <div class="contact-desc"><span data-lang="en">${c.desc_en}</span><span data-lang="ja">${c.desc_ja}</span><span data-lang="id">${c.desc_id}</span></div>
        </div>
        <div class="contact-call">📞</div>
      `;
      grid.appendChild(card);
    });
  });

  // Re-apply language visibility
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);
}
