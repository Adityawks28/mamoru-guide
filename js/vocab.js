// === VOCAB ===
// Bug #2 fix: replaced hardcoded index mapping with data-tab attribute lookup
function renderVocab(cat, containerId) {
  const c = document.getElementById(containerId);
  vocabData[cat].forEach(v => {
    const d = document.createElement('div');
    d.className = `vocab-card cat-${cat}`;
    d.innerHTML = `<div class="vocab-jp">${v.jp}</div>
      <div class="vocab-romaji">${v.rom}</div>
      <div class="vocab-meaning"><span class="flag">🇬🇧</span>${v.en}</div>
      <div class="vocab-meaning"><span class="flag">🇮🇩</span>${v.id}</div>`;
    c.appendChild(d);
  });
}

function switchTab(tabId, group) {
  document.querySelectorAll(`.tab-content[data-group="${group}"]`).forEach(t => t.classList.remove('active'));
  const target = document.querySelector(`.tab-content[data-tab="${tabId}"][data-group="${group}"]`);
  if (target) target.classList.add('active');

  const section = target ? target.closest('.section') : null;
  if (section) {
    section.querySelectorAll('.tab-btn').forEach(b => {
      const btnTab = b.getAttribute('data-tab');
      b.classList.toggle('active', btnTab === tabId);
    });
  }
}

function initVocab() {
  renderVocab('danger', 'vocabDanger');
  renderVocab('action', 'vocabAction');
  renderVocab('places', 'vocabPlaces');
  renderVocab('help', 'vocabHelp');
}
