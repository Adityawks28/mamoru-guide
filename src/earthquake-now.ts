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
  claimId: string;
}

export const STEPS: NowStep[] = [
  {
    claimId: 'eqnow-1',
    en: 'DROP to the ground',
    ja: '体を低くしてください (DROP)',
    id: 'MERUNDUK ke lantai',
    detail_en: 'Get down low. Protect your head. Do not move.',
    detail_ja: '体を低くして、頭を守り、動かないでください。',
    detail_id: 'Rendahkan badanmu. Lindungi kepalamu. Jangan bergerak.',
  },
  {
    claimId: 'eqnow-2',
    en: 'Take COVER under a strong table',
    ja: 'じょうぶな机の下に入ってください (COVER)',
    id: 'BERLINDUNG di bawah meja yang kuat',
    detail_en: 'Protect your head and neck. If there is no table, go where nothing can fall, tip over or move.',
    detail_ja: '頭と首を守ってください。机がないときは、安全な場所へ行ってください。物が「落ちてこない」「倒れてこない」「移動してこない」場所です。',
    detail_id: 'Lindungi kepala dan lehermu. Jika tidak ada meja, pergilah ke tempat tanpa benda yang bisa jatuh, roboh, atau bergeser.',
  },
  {
    claimId: 'eqnow-3',
    en: 'HOLD ON until the shaking stops',
    ja: 'ゆれが止まるまで動かないでください (HOLD ON)',
    id: 'BERTAHAN sampai guncangan berhenti',
    detail_en: 'Stay under the table until the shaking stops. Hold the table legs firmly.',
    detail_ja: 'ゆれがおさまるまで、机の下にいてください。机の脚（あし）を、しっかりにぎってください。',
    detail_id: 'Tetap di bawah meja sampai guncangan berhenti. Pegang kaki meja dengan kuat.',
  },
  {
    claimId: 'eqnow-4',
    en: 'When the shaking stops: OPEN THE DOOR',
    ja: 'ゆれが止まったら：ドアを開けてください',
    id: 'Saat guncangan berhenti: BUKA PINTU',
    detail_en: 'After an earthquake, the door frame can bend and lock the door. Open it now, while you can.',
    detail_ja: '地震のあと、ドアの枠（わく）がゆがんで、開かなくなることがあります。開けられるうちに、今開けてください。',
    detail_id: 'Setelah gempa, kusen pintu bisa bengkok dan pintu macet. Buka sekarang selagi bisa.',
  },
  {
    claimId: 'eqnow-5',
    en: 'Switch off the BREAKER and the gas before you leave',
    ja: '家を出る前に、ブレーカーを切って、ガスを止めてください',
    id: 'Matikan BREAKER listrik dan gas sebelum keluar',
    detail_en: 'Electrical fires can start when the power comes back on. In 1995, fires burned down about 7,000 buildings.',
    detail_ja: '電気がもどったときに、火事になることがあります。これを通電火災（つうでんかさい）といいます。1995年の地震では、火事で約7,000の建物が焼けました。',
    detail_id: 'Kebakaran listrik bisa terjadi saat listrik menyala lagi. Pada 1995, api membakar habis sekitar 7.000 bangunan.',
  },
  {
    claimId: 'eqnow-6',
    en: 'Put on SHOES before you move',
    ja: '動く前に、靴をはいてください',
    id: 'Pakai SEPATU sebelum bergerak',
    detail_en: 'There can be broken glass on the floor. Do not walk barefoot.',
    detail_ja: '床に、ガラスの破片（はへん）が落ちていることがあります。はだしで歩かないでください。',
    detail_id: 'Bisa ada pecahan kaca di lantai. Jangan berjalan tanpa alas kaki.',
  },
  {
    claimId: 'eqnow-7',
    en: 'Check for a TSUNAMI warning',
    ja: '津波警報（つなみけいほう）が出ているか、確かめてください',
    id: 'Cek peringatan bahaya TSUNAMI',
    detail_en: 'If you are near the coast and feel strong or long shaking, go to high ground now. Do not wait for a warning.',
    detail_ja: '海の近くで、強いゆれや長いゆれを感じたら、すぐに高い所へ逃げてください。警報（けいほう）を待たないでください。',
    detail_id: 'Jika kamu dekat pantai dan merasakan guncangan kuat atau lama, segera pergi ke tempat tinggi. Jangan tunggu peringatan.',
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
