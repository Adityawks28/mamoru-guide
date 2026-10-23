import { currentLang } from './lang';
import { trapFocus, type TrapHandle } from './focus-trap';

let trap: TrapHandle | null = null;

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
    ja: '体を低くしてください (DROP)',
    id: 'MERUNDUK ke lantai',
    detail_en: 'Get on your hands and knees. Then the shaking cannot knock you down.',
    detail_ja: '手とひざを床につけてください。揺れでたおれないようにするためです。',
    detail_id: 'Bertumpu pada tangan dan lutut. Ini mencegah Anda terjatuh.',
  },
  {
    en: 'Take COVER under a strong table',
    ja: 'じょうぶな机の下に入ってください (COVER)',
    id: 'BERLINDUNG di bawah meja yang kuat',
    detail_en: 'Protect your head and neck. If there is no table, crouch next to an inside wall and cover your head.',
    detail_ja: '頭と首を守ってください。机がないときは、内側の壁の近くでしゃがんで、頭を守ってください。',
    detail_id: 'Lindungi kepala dan leher. Jika tidak ada meja, jongkok di dekat dinding dalam dan lindungi kepala.',
  },
  {
    en: 'HOLD ON until the shaking stops',
    ja: '揺れが止まるまで動かないでください (HOLD ON)',
    id: 'BERTAHAN sampai guncangan berhenti',
    detail_en: 'Stay under cover. If the table moves, move with it.',
    detail_ja: 'その場にいてください。机が動いたら、一緒に動いてください。',
    detail_id: 'Tetap berlindung. Jika meja bergeser, ikut bergerak bersamanya.',
  },
  {
    en: 'When the shaking stops: OPEN THE DOOR',
    ja: '揺れが止まったら：ドアを開けてください',
    id: 'Saat guncangan berhenti: BUKA PINTU',
    detail_en: 'After an earthquake, the door frame can bend and lock the door. Open it now, while you can.',
    detail_ja: '地震のあと、ドアの枠がゆがんで、開かなくなることがあります。開けられるうちに、今開けてください。',
    detail_id: 'Setelah gempa, kusen pintu bisa bengkok dan pintu macet. Buka sekarang selagi bisa.',
  },
  {
    en: 'Switch off the BREAKER and the gas before you leave',
    ja: '家を出る前に、ブレーカーを切って、ガスを止めてください',
    id: 'Matikan BREAKER listrik dan gas sebelum keluar',
    detail_en: 'Many fires start when the power comes back on. Kobe 1995: fire burned about 7,000 buildings.',
    detail_ja: '電気がもどったときに、火事が起きることがあります（通電火災）。1995年の神戸では、火事で約7,000棟が焼けました。',
    detail_id: 'Banyak kebakaran terjadi saat listrik menyala lagi. Kobe 1995: api membakar sekitar 7.000 bangunan.',
  },
  {
    en: 'Put on SHOES before you move',
    ja: '動く前に、靴をはいてください',
    id: 'Pakai SEPATU sebelum bergerak',
    detail_en: 'There is broken glass everywhere. Do not walk barefoot.',
    detail_ja: 'ガラスの破片がたくさん落ちています。はだしで歩かないでください。',
    detail_id: 'Ada pecahan kaca di mana-mana. Jangan berjalan tanpa alas kaki.',
  },
  {
    en: 'Check for a TSUNAMI warning',
    ja: '津波警報が出ていないか確認してください',
    id: 'Cek peringatan TSUNAMI',
    detail_en: 'If you are near the coast, go to high ground IMMEDIATELY. Do not wait for sirens.',
    detail_ja: '海の近くにいたら、すぐに高い所へ逃げてください。サイレンを待たないでください。',
    detail_id: 'Jika dekat pantai, SEGERA naik ke tempat tinggi. Jangan tunggu sirene.',
  },
];

export function initEarthquakeNow(): void {
  const overlay = document.getElementById('earthquakeNow');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="eq-now-header">
      <div class="eq-now-title">
        <span data-lang="en">EARTHQUAKE: WHAT TO DO NOW</span>
        <span data-lang="ja">地震：今すぐすること</span>
        <span data-lang="id">GEMPA: YANG HARUS DILAKUKAN SEKARANG</span>
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

  document.getElementById('eqNowClose')?.addEventListener('click', hideEarthquakeNow);
}

export function hideEarthquakeNow(): void {
  const overlay = document.getElementById('earthquakeNow');
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  trap?.release();
  trap = null;
}

export function showEarthquakeNow(): void {
  const overlay = document.getElementById('earthquakeNow');
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);
  document.body.style.overflow = 'hidden';
  trap = trapFocus(overlay, hideEarthquakeNow);
}
