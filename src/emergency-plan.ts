import { showToast } from './toast';
import { t } from './i18n';
import { currentLang } from './lang';
import { removeItem } from './storage';
import { EmergencyPlan, emptyPlan, emptyNeeds } from './plan-model';
import { loadPlanV2, savePlanV2, clearPlanV2, migrateV1ToV2 } from './plan-storage';
import { showPlan } from './show-plan';
import { showNeedsCard, printNeedsCard } from './needs-card';
import { renderNeedsStep, clearNeedsConfirmText } from './needs-step';

type FieldType = 'text' | 'textarea' | 'select';
interface Triple { label_en: string; label_ja: string; label_id: string }
interface FieldOption extends Triple { value: string }
interface FieldDef extends Triple {
  key: string;
  type: FieldType;
  placeholder_en?: string;
  placeholder_ja?: string;
  placeholder_id?: string;
  options?: FieldOption[];
  full?: boolean;
  autocomplete?: string;
}
interface StepDef extends Triple { icon: string; fields: FieldDef[] }

function lang3(en: string, ja: string, id: string): string {
  return currentLang === 'ja' ? ja : currentLang === 'id' ? id : en;
}

const pick = (x: Triple): string => lang3(x.label_en, x.label_ja, x.label_id);
// The form shows the user's language next to Japanese; Japanese users see Japanese only.
function formLabel(x: Triple): string {
  return currentLang === 'ja' ? x.label_ja : `${pick(x)} ・ ${x.label_ja}`;
}
// Rescuers read the printed sheet, so it stays in English and Japanese.
function sheetLabel(x: Triple): string {
  return `${x.label_en} ・ ${x.label_ja.replace(/（[ぁ-ゖー]+）/g, '')}`;
}
const placeholderOf = (f: FieldDef): string | undefined =>
  lang3(f.placeholder_en ?? '', f.placeholder_ja ?? '', f.placeholder_id ?? '') || undefined;

const SELECT_OPTION: FieldOption = { value: '', label_en: 'Select', label_ja: '選択', label_id: 'Pilih' };
const same = (value: string, label: string, shown = label): FieldOption =>
  ({ value, label_en: shown, label_ja: shown, label_id: shown });

const BLOOD_TYPES: FieldOption[] = [
  SELECT_OPTION,
  same('A+', 'A+'), same('A-', 'A-', 'A−'),
  same('B+', 'B+'), same('B-', 'B-', 'B−'),
  same('AB+', 'AB+'), same('AB-', 'AB-', 'AB−'),
  same('O+', 'O+'), same('O-', 'O-', 'O−'),
];

const SUPPLY_DAYS: FieldOption[] = [
  SELECT_OPTION,
  { value: '0', label_en: 'None yet', label_ja: 'まだない', label_id: 'Belum ada' },
  { value: '1', label_en: '1 day', label_ja: '1日', label_id: '1 hari' },
  { value: '2', label_en: '2 days', label_ja: '2日', label_id: '2 hari' },
  { value: '3', label_en: '3 days (minimum)', label_ja: '3日（最低限（さいていげん））', label_id: '3 hari (minimum)' },
  { value: '5', label_en: '5 days', label_ja: '5日', label_id: '5 hari' },
  { value: '7', label_en: '7 days (ideal)', label_ja: '7日（理想（りそう））', label_id: '7 hari (ideal)' },
];

const DOC_OPTIONS: FieldOption[] = [
  SELECT_OPTION,
  { value: 'none', label_en: 'Not yet', label_ja: 'まだ', label_id: 'Belum' },
  { value: 'physical', label_en: 'Paper copies in the bag', label_ja: '紙のコピーを袋に入れた', label_id: 'Salinan kertas di dalam tas' },
  { value: 'digital', label_en: 'Digital copies (phone or cloud)', label_ja: 'データのコピー（スマホ・クラウド）', label_id: 'Salinan digital (ponsel atau cloud)' },
  { value: 'both', label_en: 'Paper and digital copies', label_ja: '紙とデータのコピー', label_id: 'Salinan kertas dan digital' },
];

const STEPS: StepDef[] = [
  {
    icon: '👤', label_en: 'Identity', label_ja: '身元（みもと）', label_id: 'Identitas',
    fields: [
      { key: 'profile.name', label_en: 'Full Name', label_ja: '氏名（しめい）', label_id: 'Nama Lengkap', type: 'text', placeholder_en: 'e.g. Aditya Wirayutha', placeholder_ja: '例：Aditya Wirayutha', placeholder_id: 'mis. Aditya Wirayutha', autocomplete: 'name' },
      { key: 'profile.nameKana', label_en: 'Name in Katakana', label_ja: '氏名（しめい）（カタカナ）', label_id: 'Nama dalam Katakana', type: 'text', placeholder_en: 'e.g. アディティヤ', placeholder_ja: '例：アディティヤ', placeholder_id: 'mis. アディティヤ' },
      { key: 'profile.nationality', label_en: 'Nationality', label_ja: '国籍（こくせき）', label_id: 'Kewarganegaraan', type: 'text', placeholder_en: 'e.g. Indonesia / インドネシア', placeholder_ja: '例：インドネシア', placeholder_id: 'mis. Indonesia / インドネシア' },
      { key: 'profile.languages', label_en: 'Languages Spoken', label_ja: '話せる言語（げんご）', label_id: 'Bahasa yang Saya Kuasai', type: 'text', placeholder_en: 'e.g. English, Indonesian, basic Japanese', placeholder_ja: '例：英語（えいご）、インドネシア語、少しの日本語（にほんご）', placeholder_id: 'mis. Inggris, Indonesia, sedikit bahasa Jepang' },
      { key: 'profile.bloodType', label_en: 'Blood Type', label_ja: '血液型（けつえきがた）', label_id: 'Golongan Darah', type: 'select', options: BLOOD_TYPES },
      { key: 'profile.dob', label_en: 'Date of Birth', label_ja: '生年月日（せいねんがっぴ）', label_id: 'Tanggal Lahir', type: 'text', placeholder_en: 'e.g. 1998/05/12', placeholder_ja: '例：1998/05/12', placeholder_id: 'mis. 1998/05/12', autocomplete: 'bday' },
    ],
  },
  {
    icon: '💊', label_en: 'Medical', label_ja: '医療情報（いりょうじょうほう）', label_id: 'Info Medis',
    fields: [
      { key: 'medical.conditions', label_en: 'Medical Conditions / Allergies', label_ja: '持病（じびょう）・アレルギー', label_id: 'Penyakit / Alergi Saya', type: 'textarea', placeholder_en: 'e.g. Peanut allergy (ピーナッツアレルギー), Asthma', placeholder_ja: '例：ピーナッツアレルギー、ぜんそく', placeholder_id: 'mis. Alergi kacang (ピーナッツアレルギー), asma', full: true },
      { key: 'medical.medications', label_en: 'Current Medications', label_ja: '服用中（ふくようちゅう）の薬', label_id: 'Obat yang Saya Minum', type: 'textarea', placeholder_en: 'e.g. Insulin (インスリン), Ventolin inhaler', placeholder_ja: '例：インスリン、吸入薬（きゅうにゅうやく）', placeholder_id: 'mis. Insulin (インスリン), inhaler Ventolin', full: true },
    ],
  },
  {
    icon: '📍', label_en: 'Address and ID', label_ja: '住所（じゅうしょ）・身分証（みぶんしょう）', label_id: 'Alamat dan Identitas',
    fields: [
      { key: 'profile.address', label_en: 'Address', label_ja: '住所（じゅうしょ）', label_id: 'Alamat', type: 'text', placeholder_en: 'e.g. 神戸市中央区... / Kobe-shi, Chuo-ku', placeholder_ja: '例：神戸市（こうべし）中央区（ちゅうおうく）...', placeholder_id: 'mis. 神戸市中央区... / Kobe-shi, Chuo-ku', full: true, autocomplete: 'street-address' },
      { key: 'profile.university', label_en: 'School / University', label_ja: '学校名（がっこうめい）', label_id: 'Sekolah / Universitas', type: 'text', placeholder_en: 'e.g. Kobe University / 神戸大学', placeholder_ja: '例：神戸大学（こうべだいがく）', placeholder_id: 'mis. Universitas Kobe / 神戸大学', autocomplete: 'organization' },
      { key: 'profile.residenceCard', label_en: 'Residence Card #', label_ja: '在留（ざいりゅう）カード番号', label_id: 'Nomor Kartu Izin Tinggal', type: 'text', placeholder_en: 'e.g. AB12345678CD', placeholder_ja: '例：AB12345678CD', placeholder_id: 'mis. AB12345678CD' },
      { key: 'profile.insurance', label_en: 'Insurance #', label_ja: '保険証番号（ほけんしょうばんごう）', label_id: 'Nomor Kartu Asuransi', type: 'text', placeholder_en: 'e.g. National Health Insurance number', placeholder_ja: '例：国民健康保険（こくみんけんこうほけん）の番号', placeholder_id: 'mis. Nomor asuransi kesehatan nasional' },
    ],
  },
  {
    icon: '🏃', label_en: 'Evacuation Sites', label_ja: '避難場所（ひなんばしょ）', label_id: 'Tempat Evakuasi',
    fields: [
      { key: 'shelters.primary', label_en: 'First Evacuation Site', label_ja: '第1避難場所（ひなんばしょ）', label_id: 'Tempat Evakuasi Pertama', type: 'text', placeholder_en: 'e.g. Higashi Yuenchi Park (500 m)', placeholder_ja: '例：東遊園地（ひがしゆうえんち）（500m）', placeholder_id: 'mis. Taman Higashi Yuenchi (500 m)' },
      { key: 'shelters.backup', label_en: 'Second Evacuation Site', label_ja: '第2避難場所（ひなんばしょ）', label_id: 'Tempat Evakuasi Kedua', type: 'text', placeholder_en: 'e.g. Ward Community Center (1.2 km)', placeholder_ja: '例：区民（くみん）センター（1.2km）', placeholder_id: 'mis. Balai warga kecamatan (1,2 km)' },
      { key: 'shelters.highGround', label_en: 'High Ground (Tsunami)', label_ja: '高台（たかだい）（津波（つなみ））', label_id: 'Dataran Tinggi (Tsunami)', type: 'text', placeholder_en: 'e.g. Kitano-cho hillside (800 m)', placeholder_ja: '例：北野町（きたのちょう）の丘（おか）（800m）', placeholder_id: 'mis. Lereng bukit Kitano-cho (800 m)' },
      { key: 'shelters.meetingPoint', label_en: 'Meeting Point', label_ja: '集合場所（しゅうごうばしょ）', label_id: 'Titik Kumpul', type: 'text', placeholder_en: 'e.g. Front gate of Kobe University', placeholder_ja: '例：神戸大学（こうべだいがく）の正門（せいもん）', placeholder_id: 'mis. Gerbang depan Universitas Kobe' },
      { key: 'shelters.walkTime', label_en: 'Walking Time', label_ja: '徒歩時間（とほじかん）', label_id: 'Waktu Jalan Kaki', type: 'text', placeholder_en: 'e.g. 10 minute walk', placeholder_ja: '例：歩いて10分', placeholder_id: 'mis. Jalan kaki 10 menit' },
      { key: 'shelters.routeNotes', label_en: 'Evacuation Route Notes', label_ja: '避難（ひなん）ルート', label_id: 'Catatan Jalur Evakuasi', type: 'textarea', placeholder_en: 'e.g. Go north on Flower Road. Turn right at City Hall.', placeholder_ja: '例：フラワーロードを北（きた）へ。市役所（しやくしょ）で右（みぎ）に曲（ま）がる。', placeholder_id: 'mis. Jalan ke utara di Flower Road. Belok kanan di Balai Kota.', full: true },
    ],
  },
  {
    icon: '📞', label_en: 'Contacts', label_ja: '緊急連絡先（きんきゅうれんらくさき）', label_id: 'Kontak Darurat',
    fields: [
      { key: 'contacts.contact1', label_en: 'Contact 1', label_ja: '連絡先（れんらくさき）1', label_id: 'Kontak 1', type: 'text', placeholder_en: 'e.g. Budi, 080-1234-5678', placeholder_ja: '例：Budi、080-1234-5678', placeholder_id: 'mis. Budi, 080-1234-5678' },
      { key: 'contacts.contact2', label_en: 'Contact 2', label_ja: '連絡先2', label_id: 'Kontak 2', type: 'text', placeholder_en: 'e.g. University office, 078-XXX-XXXX', placeholder_ja: '例：大学の事務室（じむしつ）、078-XXX-XXXX', placeholder_id: 'mis. Kantor universitas, 078-XXX-XXXX' },
      { key: 'contacts.familyAbroad', label_en: 'Family in Your Home Country', label_ja: '母国（ぼこく）の家族（かぞく）', label_id: 'Keluarga di Negara Asal Saya', type: 'text', placeholder_en: 'e.g. Mom, +62-812-XXX-XXXX', placeholder_ja: '例：母（はは）、+62-812-XXX-XXXX', placeholder_id: 'mis. Ibu, +62-812-XXX-XXXX' },
      { key: 'contacts.embassy', label_en: 'Embassy / Consulate', label_ja: '大使館（たいしかん）・領事館（りょうじかん）', label_id: 'Kedutaan / Konsulat', type: 'text', placeholder_en: 'e.g. KJRI Osaka, 06-6449-9898', placeholder_ja: '例：KJRI大阪（おおさか）、06-6449-9898', placeholder_id: 'mis. KJRI Osaka, 06-6449-9898' },
    ],
  },
  {
    icon: '🎒', label_en: 'Supplies and Bag', label_ja: '備蓄（びちく）・防災袋（ぼうさいぶくろ）', label_id: 'Persediaan dan Tas',
    fields: [
      { key: 'supplies.supplyDays', label_en: 'Days of Supplies', label_ja: '備蓄日数（びちくにっすう）', label_id: 'Persediaan untuk Berapa Hari', type: 'select', options: SUPPLY_DAYS },
      { key: 'supplies.waterLiters', label_en: 'Stored Water', label_ja: '水の備蓄（びちく）量', label_id: 'Air yang Disimpan', type: 'text', placeholder_en: 'e.g. 9 L (3 L/day × 3 days)', placeholder_ja: '例：9L（1日3L × 3日）', placeholder_id: 'mis. 9 L (3 L/hari × 3 hari)' },
      { key: 'supplies.foodList', label_en: 'Food List', label_ja: '非常食（ひじょうしょく）リスト', label_id: 'Daftar Makanan', type: 'textarea', placeholder_en: 'e.g. Canned tuna × 4, instant rice × 6', placeholder_ja: '例：ツナ缶（かん） × 4、インスタントのごはん × 6', placeholder_id: 'mis. Tuna kaleng × 4, nasi instan × 6', full: true },
      { key: 'supplies.toolsList', label_en: 'Equipment List', label_ja: '装備（そうび）リスト', label_id: 'Daftar Perlengkapan', type: 'textarea', placeholder_en: 'e.g. Flashlight, radio, first aid kit, whistle', placeholder_ja: '例：懐中電灯（かいちゅうでんとう）、ラジオ、救急（きゅうきゅう）セット、笛', placeholder_id: 'mis. Senter, radio, kotak P3K, peluit', full: true },
      { key: 'supplies.bagLocation', label_en: 'Bag Location', label_ja: '非常持ち出し袋（ひじょうもちだしぶくろ）の場所', label_id: 'Lokasi Tas Darurat', type: 'text', placeholder_en: 'e.g. Genkan (entrance), next to the shoes', placeholder_ja: '例：玄関（げんかん）、くつの横（よこ）', placeholder_id: 'mis. Genkan (pintu masuk), di samping sepatu' },
      { key: 'documents.copiedDocs', label_en: 'Document Copies', label_ja: '書類（しょるい）のコピー', label_id: 'Salinan Dokumen', type: 'select', options: DOC_OPTIONS },
    ],
  },
];

const NEEDS_STEP = STEPS.length; // index 6
const REVIEW_STEP = STEPS.length + 1;
const TOTAL_STEPS = STEPS.length + 2;

// Printed worksheet: medical right after identity, since that is what a
// rescuer reads first. ID numbers print as their last 4 characters unless the
// user ticks the box: a lost sheet should not hand out a full card number.
const MEDICAL_STEP = 1;
const WORKSHEET_ORDER = [0, MEDICAL_STEP, 4, 2, 3, 5];
const MASKED_IDS = new Set(['profile.residenceCard', 'profile.insurance']);
const EMERGENCY_NUMBERS: [string, string, string][] = [
  ['119', 'Fire / Ambulance', '消防・救急'],
  ['110', 'Police', '警察'],
  ['118', 'Coast Guard', '海上保安庁'],
  ['171', 'Disaster Emergency Message Dial', '災害用伝言ダイヤル'],
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

// The worksheet prints option names in English; the review shows the user's language.
function shownValue(f: FieldDef, forSheet = false): string {
  const value = getVal(plan, f.key).trim();
  if (!value) return '';
  const opt = f.options?.find(o => o.value === value);
  if (!opt) return value;
  return forSheet ? opt.label_en : pick(opt);
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
  wrap.appendChild(el('label', {}, formLabel(f)));

  let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  if (f.type === 'textarea') {
    input = el('textarea', { rows: '3' });
  } else if (f.type === 'select') {
    input = el('select');
    (f.options ?? []).forEach(opt => {
      input.appendChild(el('option', { value: opt.value }, formLabel(opt)));
    });
  } else {
    input = el('input', { type: 'text' });
  }
  input.dataset.path = f.key;
  const placeholder = placeholderOf(f);
  if (placeholder && f.type !== 'select') input.setAttribute('placeholder', placeholder);
  if (f.autocomplete) input.setAttribute('autocomplete', f.autocomplete);
  input.value = getVal(plan, f.key);
  wrap.appendChild(input);
  return wrap;
}

function renderStepCard(step: StepDef): HTMLElement {
  const card = el('div', { class: 'wizard-step' });
  card.appendChild(el('div', { class: 'wizard-step-header' }, `${step.icon}  ${formLabel(step)}`));
  const grid = el('div', { class: 'wizard-grid' });
  step.fields.forEach(f => grid.appendChild(renderField(f)));
  card.appendChild(grid);
  return card;
}

function renderReview(): HTMLElement {
  const card = el('div', { class: 'wizard-step' });
  card.appendChild(el('div', { class: 'wizard-step-header' }, `✅  ${formLabel({ label_en: 'Review & Print', label_ja: '確認（かくにん）・印刷（いんさつ）', label_id: 'Tinjau dan Cetak' })}`));

  const review = el('div', { class: 'wizard-review' });
  STEPS.forEach(step => {
    const filled = step.fields.filter(f => shownValue(f) !== '');
    if (filled.length === 0) return;

    const group = el('div', { class: 'wizard-review-group' });
    group.appendChild(el('div', { class: 'wizard-review-group-title' }, `${step.icon}  ${formLabel(step)}`));
    const dl = el('dl', { class: 'wizard-review-dl' });
    filled.forEach(f => {
      dl.appendChild(el('dt', {}, formLabel(f)));
      dl.appendChild(el('dd', {}, shownValue(f)));
    });
    group.appendChild(dl);
    review.appendChild(group);
  });

  if (review.children.length === 0) {
    review.appendChild(el('p', { class: 'wizard-review-empty' }, lang3(
      'There is no information yet. Use the Back button to add it.',
      '情報がまだありません。「戻る」ボタンで追加してください。',
      'Belum ada informasi. Pakai tombol Kembali untuk menambahkannya.')));
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
  const needsBtn = el('button', { type: 'button', class: 'wizard-nav-btn wizard-btn-show' }, t('needs.btn.show'));
  const printBtn = el('button', { type: 'button', class: 'wizard-nav-btn wizard-btn-prev' }, t('plan.btn.print'));
  const clearBtn = el('button', { type: 'button', class: 'wizard-nav-btn wizard-btn-clear' }, t('plan.btn.clear'));
  saveBtn.addEventListener('click',  () => savePlan());
  showBtn.addEventListener('click',  () => showPlan());
  needsBtn.addEventListener('click', () => { flushSave(); showNeedsCard(); });
  printBtn.addEventListener('click', () => printPlan());
  clearBtn.addEventListener('click', () => clearPlan());
  actions.append(saveBtn, showBtn, needsBtn, printBtn, clearBtn);
  card.appendChild(actions);

  return card;
}

function flushSave(): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = undefined;
  savePlanV2(plan);
}

function renderNeeds(): HTMLElement {
  return renderNeedsStep(plan.needs, {
    change: scheduleSave,
    save() { flushSave(); showToast(t('needs.toast.saved'), 'success'); },
    show() { flushSave(); showNeedsCard(); },
    print() { flushSave(); printNeedsCard(); },
    clear() {
      if (!confirm(clearNeedsConfirmText())) return;
      plan.needs = emptyNeeds();
      flushSave();
      goToStep(NEEDS_STEP);
      document.querySelector<HTMLElement>('.needs-step .wizard-step-header')?.focus();
      showToast(t('needs.toast.cleared'), 'success');
    },
  });
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
  wizard.appendChild(
    currentStep === REVIEW_STEP ? renderReview()
    : currentStep === NEEDS_STEP ? renderNeeds()
    : renderStepCard(STEPS[currentStep]));
  wizard.appendChild(renderNav());
}

// Registered once at load; goToStep does nothing while the wizard is not on the page.
document.addEventListener('mamoru:langchange', () => goToStep(currentStep));

function handleInput(e: Event): void {
  const target = e.target as HTMLElement;
  const path = target.dataset?.path;
  if (!path) return;
  const value = (target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
  setVal(plan, path, value);
  scheduleSave();
}

function scheduleSave(): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => savePlanV2(plan), 1000);
}

export function savePlan(): void {
  if (saveTimer) clearTimeout(saveTimer);
  savePlanV2(plan);
  showToast(lang3('Plan saved', '計画を保存しました', 'Rencana disimpan'), 'success');
}

export function clearPlan(): void {
  if (!confirm([
    'Clear your emergency plan? You cannot undo this. This also deletes your needs card.',
    'あなたの計画を消しますか？元に戻せません。必要（ひつよう）なことカードも消（き）えます。',
    'Hapus rencana daruratmu? Ini tidak bisa dibatalkan. Kartu kebutuhanmu juga dihapus.',
  ].join('\n'))) return;
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
      let value = shownValue(f, true);
      if (value && MASKED_IDS.has(f.key) && !printFullIds) { value = lastFour(value); masked = true; }
      // Medical notes and the address get a whole row; lists share one, so the sheet fits a page.
      const wide = f.full && (f.type !== 'textarea' || i === MEDICAL_STEP);
      const row = el('div', { class: 'ws-field' + (wide ? ' full' : '') });
      const blank = 'ws-blank' + (f.type === 'textarea' ? ' tall' : '');
      row.append(el('dt', {}, sheetLabel(f)), el('dd', value ? {} : { class: blank }, value));
      dl.append(row);
    }
    sec.append(el('h2', {}, sheetLabel(step)), dl);
    ws.append(sec);
  }

  ws.append(el('footer', { class: 'ws-foot' }, [
    `Printed ${new Date().toLocaleDateString('en-CA')}.`,
    'This sheet has personal information. Keep it in a safe place. Shred old copies. 個人情報が書いてあります。安全な場所に置いてください。古い紙は細かく破って捨ててください。',
    masked ? 'ID numbers show only the last 4 characters. 番号は最後の4文字だけを表示しています。' : '',
    'Mamoru Guide made this sheet on this device. It did not send your data to a server.',
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
    showToast(lang3('Plan updated to the new format ✓', '計画を新しい形にしました ✓', 'Rencana diperbarui ke format baru ✓'), 'success');
  } else {
    plan = loadPlanV2();
  }

  wizard.addEventListener('input', handleInput);
  wizard.addEventListener('change', handleInput);
  printFullIds = false;
  // Ctrl+P / the browser menu on the plan page prints the worksheet too.
  window.addEventListener('beforeprint', () => {
    if (document.querySelector('.needs-card-overlay')) return;
    if (document.body.dataset.route === 'plan') preparePrint();
  });
  window.addEventListener('afterprint', endPrint);
  goToStep(0);
}
