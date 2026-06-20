import { currentLang } from './lang';

interface NowStep {
  en: string;
  ja: string;
  id: string;
  detail_en: string;
  detail_ja: string;
  detail_id: string;
}

const STEPS: NowStep[] = [
  {
    en: 'DROP to the ground',
    ja: '地面に伏せる (DROP)',
    id: 'MERUNDUK ke tanah',
    detail_en: 'Get on your hands and knees. This prevents you from being knocked down.',
    detail_ja: '四つん這いになる。転倒を防ぎます。',
    detail_id: 'Berlutut dengan tangan dan lutut. Ini mencegah Anda terjatuh.',
  },
  {
    en: 'Take COVER under a sturdy table',
    ja: '丈夫な机の下に隠れる (COVER)',
    id: 'BERLINDUNG di bawah meja kokoh',
    detail_en: 'Protect your head and neck. If no table: crouch against an interior wall, cover your head.',
    detail_ja: '頭と首を守る。机がなければ内壁に寄り、頭を覆う。',
    detail_id: 'Lindungi kepala dan leher. Jika tidak ada meja: berjongkok di dinding dalam, lindungi kepala.',
  },
  {
    en: 'HOLD ON until shaking stops',
    ja: '揺れがおさまるまで待機 (HOLD ON)',
    id: 'BERTAHAN sampai guncangan berhenti',
    detail_en: 'Stay under cover. Be ready to move with it if the table shifts.',
    detail_ja: 'その場を動かない。机が動いたら一緒に移動する。',
    detail_id: 'Tetap berlindung. Bersiap bergerak bersama meja jika bergeser.',
  },
  {
    en: 'When shaking stops: OPEN THE DOOR',
    ja: '揺れが止まったら: ドアを開ける',
    id: 'Saat guncangan berhenti: BUKA PINTU',
    detail_en: 'Door frames warp shut after earthquakes. Open it now while you can.',
    detail_ja: 'ドア枠が歪んで開かなくなることがある。今開ける。',
    detail_id: 'Kusen pintu bisa macet setelah gempa. Buka sekarang selagi bisa.',
  },
  {
    en: 'Turn off GAS at the meter',
    ja: 'ガスメーターを止める',
    id: 'Matikan GAS di meteran',
    detail_en: 'Gas leaks cause fires. Kobe 1995: 7,000 homes burned from gas fires.',
    detail_ja: 'ガス漏れは火災の原因。阪神大震災では7,000戸が全焼。',
    detail_id: 'Kebocoran gas menyebabkan kebakaran. Kobe 1995: 7.000 rumah terbakar.',
  },
  {
    en: 'Put on SHOES before moving',
    ja: '靴を履いてから移動',
    id: 'Pakai SEPATU sebelum bergerak',
    detail_en: 'Broken glass everywhere. Do not walk barefoot.',
    detail_ja: 'ガラスの破片が散乱。素足で歩かない。',
    detail_id: 'Pecahan kaca di mana-mana. Jangan berjalan tanpa alas kaki.',
  },
  {
    en: 'Check for TSUNAMI warning',
    ja: '津波警報を確認',
    id: 'Periksa peringatan TSUNAMI',
    detail_en: 'If near coast: move to high ground IMMEDIATELY. Do not wait for sirens.',
    detail_ja: '海岸近くなら今すぐ高台へ。サイレンを待たない。',
    detail_id: 'Jika dekat pantai: segera naik ke tempat tinggi. Jangan tunggu sirine.',
  },
];

export function initEarthquakeNow(): void {
  const overlay = document.getElementById('earthquakeNow');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="eq-now-header">
      <div class="eq-now-title">
        <span data-lang="en">EARTHQUAKE - WHAT TO DO NOW</span>
        <span data-lang="ja">地震 - 今すぐやること</span>
        <span data-lang="id">GEMPA - APA YANG HARUS DILAKUKAN SEKARANG</span>
      </div>
      <button class="eq-now-close" id="eqNowClose" aria-label="Close">X</button>
    </div>
    <div class="eq-now-steps">
      ${STEPS.map((s, i) => `
        <div class="eq-now-step">
          <div class="eq-now-step-num">${i + 1}</div>
          <div>
            <div class="eq-now-step-text">
              <span data-lang="en">${s.en}</span>
              <span data-lang="ja">${s.ja}</span>
              <span data-lang="id">${s.id}</span>
            </div>
            <div class="eq-now-step-detail">
              <span data-lang="en">${s.detail_en}</span>
              <span data-lang="ja">${s.detail_ja}</span>
              <span data-lang="id">${s.detail_id}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="eq-now-numbers">
      <div><span data-lang="en">EMERGENCY NUMBERS</span><span data-lang="ja">緊急電話番号</span><span data-lang="id">NOMOR DARURAT</span></div>
      <a href="tel:119">119</a>
      <a href="tel:110">110</a>
    </div>
  `;

  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);

  document.getElementById('eqNowClose')?.addEventListener('click', () => {
    overlay.classList.remove('active');
  });
}

export function showEarthquakeNow(): void {
  const overlay = document.getElementById('earthquakeNow');
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);
}
