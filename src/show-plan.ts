import { t } from './i18n';
import { loadPlanV2 } from './plan-storage';
import type { EmergencyPlan } from './plan-model';

interface ShowField {
  label: string;
  value: string;
  emphasis?: boolean;
}

function pickFields(plan: EmergencyPlan): ShowField[] {
  const fields: ShowField[] = [];
  const push = (label: string, value: string, emphasis = false) => {
    if (value && value.trim()) fields.push({ label, value, emphasis });
  };

  push('Name ・ 氏名', plan.profile.name, true);
  if (plan.profile.nameKana) push('カタカナ', plan.profile.nameKana);
  push('Nationality ・ 国籍', plan.profile.nationality);
  push('Languages ・ 話せる言語', plan.profile.languages);
  push('Blood Type ・ 血液型', plan.profile.bloodType, true);
  push('Date of Birth ・ 生年月日', plan.profile.dob);
  push('Allergies / Conditions ・ アレルギー・持病', plan.medical.conditions, true);
  push('Medications ・ 服用中の薬', plan.medical.medications, true);
  push('Address ・ 住所', plan.profile.address);
  push('Emergency Contact ・ 緊急連絡先', plan.contacts.contact1, true);
  push('Embassy ・ 大使館', plan.contacts.embassy);

  return fields;
}

let escHandler: ((e: KeyboardEvent) => void) | null = null;

function close(): void {
  document.querySelector('.plan-show-overlay')?.remove();
  if (escHandler) window.removeEventListener('keydown', escHandler);
  escHandler = null;
  document.body.style.overflow = '';
}

export function showPlan(): void {
  const plan = loadPlanV2();
  const fields = pickFields(plan);

  document.querySelector('.plan-show-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.className = 'plan-show-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', t('plan.show.title'));

  const card = document.createElement('div');
  card.className = 'plan-show-card';

  const header = document.createElement('header');
  header.className = 'plan-show-header';
  const title = document.createElement('h2');
  title.className = 'plan-show-title';
  title.textContent = t('plan.show.title');
  const sub = document.createElement('p');
  sub.className = 'plan-show-subtitle';
  sub.textContent = t('plan.show.subtitle');
  header.append(title, sub);
  card.appendChild(header);

  if (fields.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'plan-show-empty';
    empty.textContent = t('plan.show.empty');
    card.appendChild(empty);
  } else {
    const dl = document.createElement('dl');
    dl.className = 'plan-show-dl';
    fields.forEach(f => {
      const dt = document.createElement('dt');
      dt.textContent = f.label;
      const dd = document.createElement('dd');
      dd.textContent = f.value;
      if (f.emphasis) dd.classList.add('emphasis');
      dl.append(dt, dd);
    });
    card.appendChild(dl);
  }

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'plan-show-close';
  closeBtn.textContent = t('plan.show.close');
  closeBtn.addEventListener('click', close);
  card.appendChild(closeBtn);

  overlay.appendChild(card);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  closeBtn.focus();

  escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  window.addEventListener('keydown', escHandler);
}
