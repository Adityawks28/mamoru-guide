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
  {icon:'🚒',name:'Fire / Ambulance',name_ja:'消防・救急',name_id:'Pemadam / Ambulans',number:'119',desc_en:'Fire and ambulance',desc_ja:'火事、救急',desc_id:'Kebakaran dan ambulans',category:'emergency'},
  {icon:'👮',name:'Police',name_ja:'警察',name_id:'Polisi',number:'110',desc_en:'Crimes and accidents that need the police now',desc_ja:'すぐに警察が必要な事件や事故',desc_id:'Kejahatan dan kecelakaan yang perlu polisi segera',category:'emergency'},
  {icon:'⚓',name:'Coast Guard',name_ja:'海上保安庁',name_id:'Penjaga Pantai',number:'118',desc_en:'Accidents and emergencies at sea',desc_ja:'海での事故や緊急のとき',desc_id:'Kecelakaan dan keadaan darurat di laut',category:'emergency'},

  // Medical
  {icon:'🏥',name:'AMDA Medical Info',name_ja:'AMDA国際医療情報',name_id:'AMDA Info Medis',number:'03-6233-9266',desc_en:'Help to find a hospital, and information on the health and welfare systems, in many languages. 10:00 to 16:00',desc_ja:'病院さがしの手伝いと、医療や福祉の制度の情報です。いろいろな言葉で相談できます。10時から16時まで',desc_id:'Bantuan mencari rumah sakit dan informasi tentang sistem kesehatan dan kesejahteraan, dalam berbagai bahasa. Pukul 10.00 sampai 16.00',category:'medical',url:'https://www.amdamedicalcenter.com/'},
  {icon:'💊',name:'Japan Visitor Hotline (JNTO)',name_ja:'Japan Visitor Hotline（JNTO）',name_id:'Japan Visitor Hotline (JNTO)',number:'050-3816-2787',desc_en:'Help with illness and disasters. Help to find a hospital that speaks your language. English, Chinese, Korean. Open 24 hours, every day',desc_ja:'病気や災害のときの相談と、外国語で受診できる病院の案内です。英語・中国語・韓国語。24時間、毎日',desc_id:'Bantuan saat sakit dan bencana, dan mencari rumah sakit yang bisa berbahasa asing. Bahasa Inggris, Mandarin, Korea. Buka 24 jam setiap hari',category:'medical',url:'https://www.jnto.go.jp/emergency/eng/mi_guide.html'},

  // Support / Multilingual
  {icon:'🌐',name:'The World Helpline (Japan Helpline)',name_ja:'ワールドヘルプライン（ジャパンヘルプライン）',name_id:'The World Helpline (Japan Helpline)',number:'050-6879-9956',desc_en:'Help with any question, from small questions to emergencies. Open 24 hours, every day',desc_ja:'小さな質問から緊急のことまで、何でも相談できます。24時間、毎日',desc_id:'Bantuan untuk pertanyaan apa saja, dari hal kecil sampai keadaan darurat. Buka 24 jam setiap hari',category:'support'},
  {icon:'📞',name:'Immigration Info',name_ja:'入管インフォメーション',name_id:'Info Imigrasi',number:'0570-013904',desc_en:'General questions about entry and residence procedures. Weekdays 8:30 to 17:15',desc_ja:'出入国や在留の手続きについての、一般的な質問ができます。平日8時30分から17時15分まで',desc_id:'Pertanyaan umum tentang prosedur masuk dan izin tinggal. Hari kerja pukul 08.30 sampai 17.15',category:'support'},
  {icon:'🏢',name:'Disaster Emergency Message Dial (171)',name_ja:'災害用伝言ダイヤル',name_id:'Papan Pesan Bencana',number:'171',desc_en:'After a disaster, leave or listen to voice messages for your family',desc_ja:'災害のあと、家族への伝言を録音したり、聞いたりできます',desc_id:'Setelah bencana, tinggalkan atau dengarkan pesan suara untuk keluarga',category:'support'},

  // Embassy and consulate for Indonesian citizens
  {icon:'🇮🇩',name:'Indonesian Embassy Tokyo',name_ja:'インドネシア大使館',name_id:'KBRI Tokyo',number:'03-3441-4201',desc_en:'Consular help for Indonesian citizens',desc_ja:'インドネシア国民のための領事支援です',desc_id:'Bantuan konsuler untuk WNI',category:'embassy',url:'https://kemlu.go.id/tokyo/'},
  {icon:'🇮🇩',name:'Indonesian Consulate Osaka',name_ja:'在大阪インドネシア総領事館',name_id:'KJRI Osaka',number:'06-6449-9898',desc_en:'Consular help for Indonesian citizens',desc_ja:'インドネシア国民のための領事支援です',desc_id:'Bantuan konsuler untuk WNI',category:'embassy'},

  // Mental Health
  {icon:'🧠',name:'TELL Lifeline',name_ja:'TELLジャパン',name_id:'TELL Lifeline',number:'0800-300-8355',desc_en:'Crisis support in English. Free call. Not open 24 hours. Check telljp.com/lifeline for the times',desc_ja:'英語で、つらいときの相談ができます。無料です。24時間ではありません（時間はtelljp.com/lifelineで確認してください）',desc_id:'Dukungan krisis dalam bahasa Inggris. Gratis. Tidak buka 24 jam: cek jamnya di telljp.com/lifeline',category:'mental',url:'https://telljp.com/lifeline/'},
  {icon:'💛',name:'Yorisoi Hotline',name_ja:'よりそいホットライン',name_id:'Yorisoi Hotline',number:'0120-279-338',desc_en:'Free help in many languages. Press 2 for foreign languages, every day from 10:00 to 22:00',desc_ja:'無料です。外国語の相談は2番を押します。毎日10時から22時までです',desc_id:'Gratis, dalam berbagai bahasa. Tekan 2 untuk bahasa asing, setiap hari pukul 10.00 sampai 22.00',category:'mental'},
];

const categoryLabels: Record<ContactCategory, Record<Language, string>> = {
  emergency: {en:'Emergency',ja:'緊急',id:'Darurat'},
  medical: {en:'Medical',ja:'医療',id:'Medis'},
  support: {en:'Support and Info',ja:'サポート・情報',id:'Dukungan & Info'},
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
