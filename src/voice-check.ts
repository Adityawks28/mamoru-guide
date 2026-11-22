import { t, applyTranslations } from './i18n';
import { SPEECH_LANG, SPEECH_RATE, findJapaneseVoice, getSynth, isJapaneseVoice, loadVoices } from './speech';

const TEST_PHRASE = 'けがをしました';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function speak(synth: SpeechSynthesis, voice: SpeechSynthesisVoice): void {
  const u = new SpeechSynthesisUtterance(TEST_PHRASE);
  u.lang = SPEECH_LANG;
  u.voice = voice;
  u.rate = SPEECH_RATE;
  synth.cancel();
  synth.speak(u);
}

function buildTable(synth: SpeechSynthesis, voices: SpeechSynthesisVoice[]): HTMLTableElement {
  const tbl = el('table', 'vc-table');
  const head = el('tr');
  ['name', 'lang', 'localService', 'default', ''].forEach(h => head.append(el('th', undefined, h)));
  const thead = el('thead');
  thead.append(head);
  tbl.append(thead);
  const body = el('tbody');
  voices.forEach(v => {
    const row = el('tr');
    [v.name, v.lang, String(v.localService), String(v.default)].forEach(c => row.append(el('td', undefined, c)));
    const btn = el('button', 'vc-speak');
    btn.type = 'button';
    btn.dataset.i18n = 'vc.speak';
    btn.addEventListener('click', () => speak(synth, v));
    const action = el('td');
    action.append(btn);
    row.append(action);
    body.append(row);
  });
  tbl.append(body);
  return tbl;
}

export function initVoiceCheck(root: HTMLElement | null = document.getElementById('voiceCheckContainer')): void {
  if (!root) return;
  const check = el('button', 'vc-check');
  check.type = 'button';
  check.dataset.i18n = 'vc.check';
  const output = el('div', 'vc-output');
  output.setAttribute('aria-live', 'polite');
  root.replaceChildren(check, output);

  check.addEventListener('click', async () => {
    const synth = getSynth();
    if (!synth) {
      output.textContent = t('vc.missing');
      return;
    }
    const japanese = (await loadVoices(synth)).filter(isJapaneseVoice);
    const picked = findJapaneseVoice(japanese);
    const selected = el('p', 'vc-selected', `${t('vc.selected')} ${picked ? picked.name : t('vc.none')}`);
    output.replaceChildren(selected, buildTable(synth, japanese));
    applyTranslations(output);
  });
  applyTranslations(root);
}
