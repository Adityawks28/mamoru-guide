import { bagItems, MAX_BAG_WEIGHT } from './data';
import { showToast } from './toast';
import { currentLang } from './lang';

let packedItems = new Set<number>();

function getCurrentWeight(): number {
  let w = 0;
  packedItems.forEach(i => w += bagItems[i].weight);
  return Math.round(w * 100) / 100;
}

function toggleBagItem(idx: number): void {
  const el = document.getElementById('bagItem' + idx);
  if (!el) return;

  if (packedItems.has(idx)) {
    packedItems.delete(idx);
    el.classList.remove('packed', 'rejected');
    showToast('↩ Removed');
  } else {
    const newWeight = getCurrentWeight() + bagItems[idx].weight;
    if (newWeight > MAX_BAG_WEIGHT) {
      el.classList.add('rejected');
      setTimeout(() => el.classList.remove('rejected'), 800);
      showToast('⚠ Too heavy! Remove something first.');
      return;
    }
    packedItems.add(idx);
    el.classList.add('packed');
    showToast('✓ Packed!');
  }
  updateBagStats();
}

export function renderBagItems(): void {
  const grid = document.getElementById('bagItemsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  bagItems.forEach((item, i) => {
    const d = document.createElement('div');
    d.className = 'bag-item' + (packedItems.has(i) ? ' packed' : '');
    d.id = 'bagItem' + i;
    d.setAttribute('tabindex', '0');
    d.setAttribute('role', 'button');
    const prClass = item.priority >= 8 ? 'priority-high' : item.priority >= 6 ? 'priority-med' : 'priority-low';
    const prLabel = item.priority >= 8 ? '★★★' : item.priority >= 6 ? '★★' : '★';
    d.innerHTML = `
      <div class="bag-item-emoji">${item.e}</div>
      <div class="bag-item-info">
        <div class="bag-item-name"><span data-lang="en">${item.en}</span><span data-lang="ja">${item.ja}</span><span data-lang="id">${item.id}</span></div>
        <div class="bag-item-detail"><span data-lang="en">${item.det_en}</span><span data-lang="ja">${item.det_ja}</span><span data-lang="id">${item.det_id}</span></div>
        <div class="bag-item-meta">
          <span class="bag-meta-tag weight">⚖ ${item.weight}kg</span>
          <span class="bag-meta-tag ${prClass}">${prLabel}</span>
        </div>
      </div>`;
    d.onclick = () => toggleBagItem(i);
    d.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleBagItem(i); }
    });
    grid.appendChild(d);
  });
  // Re-apply language visibility after rendering
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);
}

export function updateBagStats(): void {
  const weight = getCurrentWeight();
  const pct = (weight / MAX_BAG_WEIGHT) * 100;
  const fill = document.getElementById('weightBarFill');
  if (fill) {
    fill.style.width = Math.min(pct, 100) + '%';
    fill.className = 'weight-bar-fill' + (pct > 90 ? ' danger' : pct > 70 ? ' warning' : '');
  }
  const barText = document.getElementById('weightBarText');
  if (barText) barText.textContent = weight.toFixed(1) + ' / ' + MAX_BAG_WEIGHT.toFixed(1) + ' kg';
  const itemCount = document.getElementById('bagItemCount');
  if (itemCount) itemCount.textContent = packedItems.size + ' / ' + bagItems.length;

  let score = 0;
  packedItems.forEach(i => score += bagItems[i].priority);
  const scoreEl = document.getElementById('bagScore');
  if (scoreEl) scoreEl.textContent = String(score);
}

function loadBestScore(): number {
  const saved = localStorage.getItem('mamoru-best-score');
  return saved ? parseInt(saved, 10) : 0;
}

export function checkBag(): void {
  let score = 0;
  packedItems.forEach(i => score += bagItems[i].priority);
  const maxScore = bagItems.reduce((s, item) => s + item.priority, 0);
  const result = document.getElementById('bagResult');
  if (!result) return;
  result.classList.add('show');
  const finalScore = document.getElementById('bagFinalScore');
  if (finalScore) finalScore.textContent = score + ' / ' + maxScore;

  let best = loadBestScore();
  if (score > best) {
    best = score;
    localStorage.setItem('mamoru-best-score', String(best));
  }
  const bestEl = document.getElementById('bagBestScore');
  if (bestEl) bestEl.textContent = best + ' / ' + maxScore;

  let title: string, msg: string;
  const pctScore = score / maxScore;
  if (pctScore >= 0.85) { title = '🏆 Expert Packer!'; msg = 'You prioritized perfectly — ready for any emergency!'; }
  else if (pctScore >= 0.65) { title = '👍 Well Prepared!'; msg = 'Good choices! Consider swapping low-priority items for essentials you missed.'; }
  else if (pctScore >= 0.4) { title = '🤔 Needs Improvement'; msg = 'You have some basics, but missing critical items. Focus on water, food, and medical supplies.'; }
  else { title = '⚠ Underprepared'; msg = 'Your bag is missing essential survival items. Prioritize: water, food, first aid, medications, and documents.'; }

  const titleEl = document.getElementById('bagResultTitle');
  if (titleEl) titleEl.textContent = title;
  const msgEl = document.getElementById('bagResultMsg');
  if (msgEl) msgEl.textContent = msg;
}

export function resetBag(): void {
  packedItems.clear();
  const result = document.getElementById('bagResult');
  if (result) result.classList.remove('show');
  renderBagItems();
  updateBagStats();
  showToast('🔄 Bag reset!');
}
