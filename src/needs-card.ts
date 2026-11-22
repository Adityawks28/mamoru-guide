import type { Language } from './types';
import type { PlanNeeds } from './plan-model';
import { hasNeeds } from './plan-model';
import { loadPlanV2 } from './plan-storage';
import { currentLang } from './lang';
import { t } from './i18n';
import { trapFocus, type TrapHandle } from './focus-trap';
import { CONTACT_RELATIONS, DIET_NEEDS, FOOD_ALLERGENS, NEED_LANGUAGES, type NeedOption } from './data/needs';

type SecKey = 'allergies' | 'otherAllergies' | 'medicines' | 'diet' | 'languages' | 'contact' | 'notes';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Japanese line first, then the user's language below it. No second line when the UI is Japanese.
function pair(tag: 'div' | 'span' | 'p', ja: string, sub: string, lang: Language): HTMLElement[] {
  const jaEl = el(tag, 'needs-ja', ja);
  jaEl.lang = 'ja';
  const out = [jaEl];
  if (lang !== 'ja') {
    const subEl = el(tag, 'needs-sub', sub);
    subEl.lang = lang;
    out.push(subEl);
  }
  return out;
}

const label = (o: NeedOption, lang: Language): string => (lang === 'id' ? o.label_id : o.label_en);

function section(key: SecKey, lang: Language): HTMLElement {
  const sec = el('section', 'needs-sec');
  sec.dataset.sec = key;
  const head = el('div', 'needs-head');
  head.append(...pair('div', t(`needs.card.${key}`, 'ja'), t(`needs.card.${key}`, lang), lang));
  sec.append(head);
  return sec;
}

function items(options: readonly NeedOption[], keys: string[], lang: Language): HTMLElement {
  const list = el('ul', 'needs-list');
  for (const key of keys) {
    const o = options.find(x => x.key === key);
    if (!o) continue;
    const li = el('li', 'needs-item');
    li.append(...pair('span', o.label_ja, label(o, lang), lang));
    list.append(li);
  }
  return list;
}

const free = (text: string): HTMLElement => el('div', 'needs-free', text);

// Keeps digits and plus so a typed quote or space cannot change the link.
function phoneLink(phone: string): HTMLElement {
  const digits = phone.replace(/[^\d+]/g, '');
  if (!digits) return el('span', 'needs-free', phone);
  const a = el('a', 'needs-phone', phone);
  a.href = `tel:${digits}`;
  return a;
}

export function buildNeedsCard(needs: PlanNeeds, lang: Language): HTMLElement {
  const card = el('article', 'needs-card');
  const title = el('header', 'needs-title');
  title.append(...pair('div', t('needs.card.title', 'ja'), t('needs.card.title', lang), lang));
  title.append(...pair('p', t('needs.card.lead', 'ja'), t('needs.card.lead', lang), lang));
  card.append(title);

  if (!hasNeeds(needs)) {
    card.append(el('p', 'needs-empty', t('needs.card.empty', lang)));
    return card;
  }

  if (needs.foodAllergies.length) {
    const s = section('allergies', lang);
    s.append(items(FOOD_ALLERGENS, needs.foodAllergies, lang));
    card.append(s);
  }
  if (needs.otherAllergies.trim()) {
    const s = section('otherAllergies', lang);
    s.append(free(needs.otherAllergies));
    card.append(s);
  }
  if (needs.medicines.trim()) {
    const s = section('medicines', lang);
    s.append(free(needs.medicines));
    card.append(s);
  }
  if (needs.diet.length || needs.dietOther.trim()) {
    const s = section('diet', lang);
    s.append(items(DIET_NEEDS, needs.diet, lang));
    if (needs.dietOther.trim()) s.append(free(needs.dietOther));
    card.append(s);
  }
  if (needs.languages.length || needs.languagesOther.trim()) {
    const s = section('languages', lang);
    s.append(items(NEED_LANGUAGES, needs.languages, lang));
    if (needs.languagesOther.trim()) s.append(free(needs.languagesOther));
    card.append(s);
  }
  if (needs.contactName.trim() || needs.contactPhone.trim() || needs.contactRelation) {
    const s = section('contact', lang);
    if (needs.contactName.trim()) s.append(free(needs.contactName));
    const rel = CONTACT_RELATIONS.find(r => r.key === needs.contactRelation);
    if (rel) {
      const line = el('div', 'needs-item');
      line.append(...pair('span', rel.label_ja, label(rel, lang), lang));
      s.append(line);
    }
    if (needs.contactPhone.trim()) s.append(phoneLink(needs.contactPhone));
    card.append(s);
  }
  if (needs.notes.trim()) {
    const s = section('notes', lang);
    s.append(free(needs.notes));
    card.append(s);
  }
  return card;
}

let trap: TrapHandle | null = null;
export function closeNeedsCard(): void {
  document.querySelector('.needs-card-overlay')?.remove();
  document.body.style.overflow = '';
  trap?.release();
  trap = null;
}

export function showNeedsCard(): void {
  closeNeedsCard();
  const lang = currentLang;
  const overlay = el('div', 'needs-card-overlay');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', t('needs.card.title', lang));

  const bar = el('div', 'needs-bar');
  const close = el('button', 'needs-btn needs-close');
  close.type = 'button';
  close.append(...pair('span', t('needs.card.close', 'ja'), t('needs.card.close', lang), lang));
  close.addEventListener('click', closeNeedsCard);
  const print = el('button', 'needs-btn needs-print');
  print.type = 'button';
  print.append(...pair('span', t('needs.card.print', 'ja'), t('needs.card.print', lang), lang));
  print.addEventListener('click', printNeedsCard);
  bar.append(close, print);

  overlay.append(bar, buildNeedsCard(loadPlanV2().needs, lang));
  document.body.append(overlay);
  document.body.style.overflow = 'hidden';
  trap = trapFocus(overlay, closeNeedsCard);
  close.focus();
}

export function printNeedsCard(): void {
  if (!document.querySelector('.needs-card-overlay')) showNeedsCard();
  document.body.classList.add('print-needs-only');
  window.print();
}

let initialised = false;

export function initNeedsCard(): void {
  if (initialised) return;
  initialised = true;
  // Delegated, so the button works whenever emergency mode renders it.
  document.addEventListener('click', e => {
    if ((e.target as Element | null)?.closest('#emNeedsBtn')) showNeedsCard();
  });
  // Ctrl+P while the card is open prints the card, not the page behind it.
  window.addEventListener('beforeprint', () => {
    if (document.querySelector('.needs-card-overlay')) document.body.classList.add('print-needs-only');
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('print-needs-only'));
}
