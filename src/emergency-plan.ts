import { showToast } from './toast';
import { t } from './i18n';
import { currentLang } from './lang';
import { removeItem } from './storage';
import { EmergencyPlan, emptyPlan } from './plan-model';
import { loadPlanV2, savePlanV2, clearPlanV2, migrateV1ToV2 } from './plan-storage';
import { showPlan } from './show-plan';

type FieldType = 'text' | 'textarea' | 'select';
interface FieldOption { value: string; label: string }
interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];
  full?: boolean;
  autocomplete?: string;
}
interface StepDef { icon: string; title: string; fields: FieldDef[] }

function lang3(en: string, ja: string, id: string): string {
  return currentLang === 'ja' ? ja : currentLang === 'id' ? id : en;
}

const BLOOD_TYPES: FieldOption[] = [
  { value: '',    label: 'Select ・ 選択' },
  { value: 'A+',  label: 'A+'  }, { value: 'A-',  label: 'A−'  },
  { value: 'B+',  label: 'B+'  }, { value: 'B-',  label: 'B−'  },
  { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB−' },
  { value: 'O+',  label: 'O+'  }, { value: 'O-',  label: 'O−'  },
];

const SUPPLY_DAYS: FieldOption[] = [
  { value: '',  label: 'Select ・ 選択' },
  { value: '0', label: 'None yet' },
  { value: '1', label: '1 day' },
  { value: '2', label: '2 days' },
  { value: '3', label: '3 days (minimum)' },
  { value: '5', label: '5 days' },
  { value: '7', label: '7 days (ideal)' },
];

const DOC_OPTIONS: FieldOption[] = [
  { value: '',         label: 'Select ・ 選択' },
  { value: 'none',     label: 'Not yet' },
  { value: 'physical', label: 'Paper copies in the bag' },
  { value: 'digital',  label: 'Digital copies (phone or cloud)' },
  { value: 'both',     label: 'Paper and digital copies' },
];

const STEPS: StepDef[] = [
  {
    icon: '👤', title: 'Identity ・ 身元',
    fields: [
      { key: 'profile.name',         label: 'Full Name ・ 氏名',           type: 'text', placeholder: 'e.g. Aditya Wirayutha', autocomplete: 'name' },
      { key: 'profile.nameKana',     label: 'Name in Katakana ・ 氏名（カタカナ）', type: 'text', placeholder: 'e.g. アディティヤ' },
      { key: 'profile.nationality',  label: 'Nationality ・ 国籍',          type: 'text', placeholder: 'e.g. Indonesia / インドネシア' },
      { key: 'profile.languages',    label: 'Languages Spoken ・ 話せる言語', type: 'text', placeholder: 'e.g. English, Indonesian, basic Japanese' },
      { key: 'profile.bloodType',    label: 'Blood Type ・ 血液型',         type: 'select', options: BLOOD_TYPES },
      { key: 'profile.dob',          label: 'Date of Birth ・ 生年月日',     type: 'text', placeholder: 'e.g. 1998/05/12', autocomplete: 'bday' },
    ],
  },
  {
    icon: '💊', title: 'Medical ・ 医療情報',
    fields: [
      { key: 'medical.conditions',  label: 'Medical Conditions / Allergies ・ 持病・アレルギー', type: 'textarea', placeholder: 'e.g. Peanut allergy (ピーナッツアレルギー), Asthma', full: true },
      { key: 'medical.medications', label: 'Current Medications ・ 服用中の薬',                  type: 'textarea', placeholder: 'e.g. Insulin (インスリン), Ventolin inhaler', full: true },
    ],
  },
  {
    icon: '📍', title: 'Location & ID ・ 住所・身分証',
    fields: [
      { key: 'profile.address',       label: 'Address ・ 住所',                       type: 'text', placeholder: 'e.g. 神戸市中央区... / Kobe-shi, Chuo-ku', full: true, autocomplete: 'street-address' },
      { key: 'profile.university',    label: 'School / University ・ 学校名',         type: 'text', placeholder: 'e.g. Kobe University / 神戸大学', autocomplete: 'organization' },
      { key: 'profile.residenceCard', label: 'Residence Card # ・ 在留カード番号',     type: 'text', placeholder: 'e.g. AB12345678CD' },
      { key: 'profile.insurance',     label: 'Insurance # ・ 保険証番号',              type: 'text', placeholder: 'e.g. National Health Insurance number' },
    ],
  },
  {
    icon: '🏃', title: 'Shelters ・ 避難場所',
    fields: [
      { key: 'shelters.primary',      label: 'Primary Shelter ・ 第1避難場所',  type: 'text', placeholder: 'e.g. Higashi Yuenchi Park (500m)' },
      { key: 'shelters.backup',       label: 'Secondary Shelter ・ 第2避難場所', type: 'text', placeholder: 'e.g. Ward Community Center (1.2km)' },
      { key: 'shelters.highGround',   label: 'High Ground (Tsunami) ・ 高台（津波）', type: 'text', placeholder: 'e.g. Kitano-cho hillside (800m)' },
      { key: 'shelters.meetingPoint', label: 'Meeting Point ・ 集合場所',       type: 'text', placeholder: 'e.g. Front gate of Kobe University' },
      { key: 'shelters.walkTime',     label: 'Walking Time ・ 徒歩時間',        type: 'text', placeholder: 'e.g. 10 minute walk' },
      { key: 'shelters.routeNotes',   label: 'Evacuation Route Notes ・ 避難ルート', type: 'textarea', placeholder: 'e.g. Go north on Flower Road. Turn right at City Hall.', full: true },
    ],
  },
  {
    icon: '📞', title: 'Contacts ・ 緊急連絡先',
    fields: [
      { key: 'contacts.contact1',     label: 'Contact 1 ・ 連絡先1',              type: 'text', placeholder: 'e.g. Budi, 080-1234-5678' },
      { key: 'contacts.contact2',     label: 'Contact 2 ・ 連絡先2',              type: 'text', placeholder: 'e.g. University office, 078-XXX-XXXX' },
      { key: 'contacts.familyAbroad', label: 'Family Back Home ・ 母国の家族',    type: 'text', placeholder: 'e.g. Mom, +62-812-XXX-XXXX' },
      { key: 'contacts.embassy',      label: 'Embassy / Consulate ・ 大使館・領事館', type: 'text', placeholder: 'e.g. KJRI Osaka, 06-6449-9898' },
    ],
  },
  {
    icon: '🎒', title: 'Supplies & Bag ・ 備蓄・防災袋',
    fields: [
      { key: 'supplies.supplyDays',   label: 'Days Prepared ・ 備蓄日数',  type: 'select', options: SUPPLY_DAYS },
      { key: 'supplies.waterLiters',  label: 'Water Stored ・ 水の備蓄量', type: 'text', placeholder: 'e.g. 6L (2L/day × 3 days)' },
      { key: 'supplies.foodList',     label: 'Food List ・ 非常食リスト',  type: 'textarea', placeholder: 'e.g. Canned tuna × 4, instant rice × 6', full: true },
      { key: 'supplies.toolsList',    label: 'Equipment List ・ 装備リスト', type: 'textarea', placeholder: 'e.g. Flashlight, radio, first aid kit, whistle', full: true },
      { key: 'supplies.bagLocation',  label: 'Bag Location ・ 非常持ち出し袋の場所', type: 'text', placeholder: 'e.g. Genkan (entrance), next to the shoes' },
      { key: 'documents.copiedDocs',  label: 'Document Copies ・ 書類のコピー', type: 'select', options: DOC_OPTIONS },
    ],
  },
];

const REVIEW_STEP = STEPS.length; // index 6
const TOTAL_STEPS = STEPS.length + 1;

// Printed worksheet: medical right after identity, since that is what a
// rescuer reads first. ID numbers print as their last 4 characters unless the
// user ticks the box: a lost sheet should not hand out a full card number.
const MEDICAL_STEP = 1;
const WORKSHEET_ORDER = [0, MEDICAL_STEP, 4, 2, 3, 5];
const MASKED_IDS = new Set(['profile.residenceCard', 'profile.insurance']);
const EMERGENCY_NUMBERS: [string, string, string][] = [
  ['119', 'Fire · Ambulance', '消防・救急'],
  ['110', 'Police', '警察'],
  ['118', 'Sea emergency', '海上保安庁'],
  ['171', 'Disaster message dial', '災害用伝言ダイヤル'],
];
// Browsers use the title as the PDF file name and page header.
const PRINT_TITLE = 'Mamoru emergency worksheet';

let plan: EmergencyPlan = emptyPlan();
let currentStep = 0;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
let printFullIds = false;
let titleBeforePrint = '';

function getVal(p: EmergencyPlan, path: string): string {
  const [section, field] = path.split('.') as [keyof EmergencyPlan, string];
  const sub = p[section];
  if (sub && typeof sub === 'object' && field in (sub as object)) {
    return ((sub as Record<string, string>)[field]) ?? '';
  }
  return '';
}

function setVal(p: EmergencyPlan, path: string, value: string): void {
  const [section, field] = path.split('.') as [keyof EmergencyPlan, string];
  const sub = p[section];
  if (sub && typeof sub === 'object') {
    (sub as Record<string, string>)[field] = value;
  }
}

function shownValue(f: FieldDef): string {
  const value = getVal(plan, f.key).trim();
  if (!value) return '';
  return f.options?.find(o => o.value === value)?.label ?? value;
}

function lastFour(value: string): string {
  const s = value.replace(/\s/g, '');
  return '•'.repeat(Math.max(0, s.length - 4)) + s.slice(-4);
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K, attrs: Record<string, string> = {}, text?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  }
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderProgress(): HTMLElement {
  const wrap = el('div', { class: 'wizard-progress' });
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const dot = el('button', {
      class: 'wizard-dot' + (i === currentStep ? ' active' : i < currentStep ? ' completed' : ''),
      type: 'button',
      'aria-label': `Step ${i + 1}`,
    });
    dot.addEventListener('click', () => goToStep(i));
    wrap.appendChild(dot);
  }
  return wrap;
}

function renderField(f: FieldDef): HTMLElement {
  const wrap = el('div', { class: 'wizard-field' + (f.full ? ' full' : '') });
  wrap.appendChild(el('label', {}, f.label));

  let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  if (f.type === 'textarea') {
    input = el('textarea', { rows: '3' });
  } else if (f.type === 'select') {
    input = el('select');
    (f.options ?? []).forEach(opt => {
      input.appendChild(el('option', { value: opt.value }, opt.label));
    });
  } else {
    input = el('input', { type: 'text' });
  }
  input.dataset.path = f.key;
  if (f.placeholder && f.type !== 'select') {
    input.setAttribute('placeholder', f.placeholder);
  }
  if (f.autocomplete) input.setAttribute('autocomplete', f.autocomplete);
  input.value = getVal(plan, f.key);
  wrap.appendChild(input);
  return wrap;
}

function renderStepCard(step: StepDef): HTMLElement {
  const card = el('div', { class: 'wizard-step' });
  card.appendChild(el('div', { class: 'wizard-step-header' }, `${step.icon}  ${step.title}`));
  const grid = el('div', { class: 'wizard-grid' });
  step.fields.forEach(f => grid.appendChild(renderField(f)));
  card.appendChild(grid);
  return card;
}

function renderReview(): HTMLElement {
  const card = el('div', { class: 'wizard-step' });
  card.appendChild(el('div', { class: 'wizard-step-header' }, '✅  Review & Print ・ 確認・印刷'));

  const review = el('div', { class: 'wizard-review' });
  STEPS.forEach(step => {
    const filled = step.fields.filter(f => shownValue(f) !== '');
    if (filled.length === 0) return;

    const group = el('div', { class: 'wizard-review-group' });
    group.appendChild(el('div', { class: 'wizard-review-group-title' }, `${step.icon}  ${step.title}`));
    const dl = el('dl', { class: 'wizard-review-dl' });
    filled.forEach(f => {
      dl.appendChild(el('dt', {}, f.label));
      dl.appendChild(el('dd', {}, shownValue(f)));
    });
    group.appendChild(dl);
    review.appendChild(group);
  });

  if (review.children.length === 0) {
    review.appendChild(el('p', { class: 'wizard-review-empty' }, 'You have not added any information yet. Use the Back button to add it.'));
  }
  card.appendChild(review);

  const idsOption = el('label', { class: 'wizard-print-option' });
  const idsBox = el('input', { type: 'checkbox', name: 'print-full-ids' });
  idsBox.checked = printFullIds;
  idsBox.addEventListener('change', () => { printFullIds = idsBox.checked; });
  idsOption.append(idsBox, t('plan.print.fullIds'));
  card.appendChild(idsOption);

  const actions = el('div', { class: 'wizard-review-actions' });
  const saveBtn  = el('button', { type: 'button', class: 'wizard-nav-btn wizard-btn-next' }, t('plan.btn.save'));
  const showBtn  = el('button', { type: 'button', class: 'wizard-nav-btn wizard-btn-show' }, t('plan.btn.show'));
  const printBtn = el('button', { type: 'button', class: 'wizard-nav-btn wizard-btn-prev' }, t('plan.btn.print'));
  const clearBtn = el('button', { type: 'button', class: 'wizard-nav-btn wizard-btn-clear' }, t('plan.btn.clear'));
  saveBtn.addEventListener('click',  () => savePlan());
  showBtn.addEventListener('click',  () => showPlan());
  printBtn.addEventListener('click', () => printPlan());
  clearBtn.addEventListener('click', () => clearPlan());
  actions.append(saveBtn, showBtn, printBtn, clearBtn);
  card.appendChild(actions);

  return card;
}

function renderNav(): HTMLElement {
  const nav = el('div', { class: 'wizard-nav' });

  const prev = el('button', { type: 'button', class: 'wizard-nav-btn wizard-btn-prev' }, t('plan.btn.prev'));
  if (currentStep === 0) prev.setAttribute('disabled', 'disabled');
  prev.addEventListener('click', () => goToStep(currentStep - 1));

  const counter = el('span', { class: 'wizard-step-counter' }, `${currentStep + 1} / ${TOTAL_STEPS}`);

  const next = el('button', { type: 'button', class: 'wizard-nav-btn wizard-btn-next' }, t('plan.btn.next'));
  if (currentStep === REVIEW_STEP) next.setAttribute('disabled', 'disabled');
  next.addEventListener('click', () => goToStep(currentStep + 1));

  nav.append(prev, counter, next);
  return nav;
}

function goToStep(n: number): void {
  if (n < 0 || n >= TOTAL_STEPS) return;
  currentStep = n;
  const wizard = document.getElementById('plan-wizard');
  if (!wizard) return;
  wizard.replaceChildren();
  wizard.appendChild(renderProgress());
  wizard.appendChild(currentStep === REVIEW_STEP ? renderReview() : renderStepCard(STEPS[currentStep]));
  wizard.appendChild(renderNav());
}

function handleInput(e: Event): void {
  const target = e.target as HTMLElement;
  const path = target.dataset?.path;
  if (!path) return;
  const value = (target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
  setVal(plan, path, value);
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => savePlanV2(plan), 1000);
}

export function savePlan(): void {
  if (saveTimer) clearTimeout(saveTimer);
  savePlanV2(plan);
  showToast(lang3('Plan saved', '計画を保存しました', 'Rencana disimpan'), 'success');
}

export function clearPlan(): void {
  if (!confirm('Clear your emergency plan? You cannot undo this.\n避難計画を消しますか？元に戻せません。\nHapus rencana darurat Anda? Ini tidak bisa dibatalkan.')) return;
  clearPlanV2();
  plan = emptyPlan();
  goToStep(0);
  showToast(lang3('Plan cleared', '計画を消しました', 'Rencana dihapus'), 'success');
}

// A clean, ink-light sheet built from the plan with textContent only; empty
// fields become write-in lines so a blank print works as a paper form.
function buildWorksheet(): HTMLElement {
  const ws = el('article', { id: 'plan-print', class: 'ws' });

  const head = el('header', { class: 'ws-head' });
  const who = el('div');
  const name = getVal(plan, 'profile.name').trim();
  who.append(
    el('div', { class: 'ws-kicker' }, 'Full Name ・ 氏名'),
    el('h1', name ? {} : { class: 'ws-blank' }, name),
  );
  head.append(who, el('p', { class: 'ws-ask' }, '救助・医療関係者の方へ：私の緊急時の情報です。\nTo rescuers and medical staff: this is my emergency information.'));
  ws.append(head);

  const numbers = el('ul', { class: 'ws-numbers' });
  for (const [n, en, ja] of EMERGENCY_NUMBERS) {
    const li = el('li');
    const what = el('span');
    what.append(el('span', {}, en), el('span', {}, ja));
    li.append(el('strong', {}, n), what);
    numbers.append(li);
  }
  ws.append(numbers);

  let masked = false;
  for (const i of WORKSHEET_ORDER) {
    const step = STEPS[i];
    const sec = el('section', { class: 'ws-sec' + (i === MEDICAL_STEP ? ' ws-medical' : '') });
    const dl = el('dl');
    for (const f of step.fields) {
      if (f.key === 'profile.name') continue;
      let value = shownValue(f);
      if (value && MASKED_IDS.has(f.key) && !printFullIds) { value = lastFour(value); masked = true; }
      // Medical notes and the address get a whole row; lists share one, so the sheet fits a page.
      const wide = f.full && (f.type !== 'textarea' || i === MEDICAL_STEP);
      const row = el('div', { class: 'ws-field' + (wide ? ' full' : '') });
      const blank = 'ws-blank' + (f.type === 'textarea' ? ' tall' : '');
      row.append(el('dt', {}, f.label), el('dd', value ? {} : { class: blank }, value));
      dl.append(row);
    }
    sec.append(el('h2', {}, step.title), dl);
    ws.append(sec);
  }

  ws.append(el('footer', { class: 'ws-foot' }, [
    `Printed ${new Date().toLocaleDateString('en-CA')}.`,
    'This sheet has personal information. Keep it in a safe place. Shred old copies. 個人情報が書いてあります。安全な場所に保管してください。古い紙は細かく破って捨ててください。',
    masked ? 'ID numbers show only the last 4 characters. 番号は最後の4文字だけを表示しています。' : '',
    'Made on this device with Mamoru Guide. Nothing was uploaded.',
  ].filter(Boolean).join(' ')));
  return ws;
}

function preparePrint(): void {
  document.getElementById('plan-print')?.remove();
  document.body.append(buildWorksheet());
  document.body.classList.add('print-plan-only');
  if (document.title !== PRINT_TITLE) {
    titleBeforePrint = document.title;
    document.title = PRINT_TITLE;
  }
}

function endPrint(): void {
  const ws = document.getElementById('plan-print');
  if (!ws) return;
  ws.remove();
  document.body.classList.remove('print-plan-only');
  document.title = titleBeforePrint;
}

export function printPlan(): void {
  preparePrint();
  window.print();
}

export function initEmergencyPlan(): void {
  const wizard = document.getElementById('plan-wizard');
  if (!wizard) return;

  const migrated = migrateV1ToV2();
  if (migrated) {
    plan = migrated;
    savePlanV2(plan);
    removeItem('mamoru-emergency-plan');
    showToast(lang3('Plan updated to the new format ✓', '計画を新しい形式に更新しました ✓', 'Rencana diperbarui ke format baru ✓'), 'success');
  } else {
    plan = loadPlanV2();
  }

  wizard.addEventListener('input', handleInput);
  wizard.addEventListener('change', handleInput);
  printFullIds = false;
  // Ctrl+P / the browser menu on the plan page prints the worksheet too.
  window.addEventListener('beforeprint', () => {
    if (document.body.dataset.route === 'plan') preparePrint();
  });
  window.addEventListener('afterprint', endPrint);
  goToStep(0);
}
