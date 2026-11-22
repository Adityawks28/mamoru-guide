import type { PlanNeeds } from './plan-model';
import { t } from './i18n';
import { currentLang } from './lang';
import { CONTACT_RELATIONS, DIET_NEEDS, FOOD_ALLERGENS, NEED_LANGUAGES, type NeedOption } from './data/needs';

export interface NeedsStepActions {
  change(): void;
  save(): void;
  show(): void;
  print(): void;
  clear(): void;
}

type TextField = 'otherAllergies' | 'medicines' | 'dietOther' | 'languagesOther' | 'contactName' | 'contactPhone' | 'notes';
type GroupField = 'foodAllergies' | 'diet' | 'languages';

export function clearNeedsConfirmText(): string {
  return t('needs.clear.confirm');
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function i18n<K extends keyof HTMLElementTagNameMap>(tag: K, key: string, className?: string): HTMLElementTagNameMap[K] {
  const node = el(tag, className, t(key));
  node.dataset.i18n = key;
  return node;
}

const optionLabel = (o: NeedOption): string =>
  currentLang === 'ja' ? o.label_ja : currentLang === 'id' ? o.label_id : o.label_en;

function group(
  needs: PlanNeeds, on: NeedsStepActions, field: GroupField, legendKey: string,
  options: readonly NeedOption[], hintKey?: string,
): HTMLElement {
  const set = el('fieldset', 'needs-group');
  set.append(i18n('legend', legendKey));
  if (hintKey) set.append(i18n('p', hintKey, 'needs-hint'));
  const grid = el('div', 'needs-checks');
  for (const o of options) {
    const label = el('label', 'needs-check');
    const box = el('input');
    box.type = 'checkbox';
    box.value = o.key;
    box.dataset.need = field;
    box.checked = (needs[field] as string[]).includes(o.key);
    box.addEventListener('change', () => {
      const list = needs[field] as string[];
      const next = box.checked ? [...list, o.key] : list.filter(k => k !== o.key);
      // Keep the list order of the preset table so the card reads the same each time.
      (needs[field] as string[]) = options.map(x => x.key).filter(k => next.includes(k));
      on.change();
    });
    label.append(box);
    for (const [lang, text] of [['en', o.label_en], ['ja', o.label_ja], ['id', o.label_id]] as const) {
      const span = el('span', undefined, text);
      span.dataset.lang = lang;
      label.append(span);
    }
    grid.append(label);
  }
  set.append(grid);
  return set;
}

function textField(needs: PlanNeeds, on: NeedsStepActions, field: TextField, labelKey: string, multiline: boolean): HTMLElement {
  const wrap = el('div', 'wizard-field' + (multiline ? ' full' : ''));
  const id = `need-${field}`;
  const label = i18n('label', labelKey);
  label.htmlFor = id;
  const input = multiline ? el('textarea') : el('input');
  if (input instanceof HTMLTextAreaElement) input.rows = 3;
  else input.type = field === 'contactPhone' ? 'tel' : 'text';
  input.id = id;
  input.dataset.need = field;
  input.autocomplete = 'off';
  input.value = needs[field];
  input.addEventListener('input', () => { needs[field] = input.value; on.change(); });
  wrap.append(label, input);
  return wrap;
}

function relationField(needs: PlanNeeds, on: NeedsStepActions): HTMLElement {
  const wrap = el('div', 'wizard-field');
  const label = i18n('label', 'needs.contactRelation');
  label.htmlFor = 'need-contactRelation';
  const select = el('select');
  select.id = 'need-contactRelation';
  select.dataset.need = 'contactRelation';
  select.append(el('option', undefined, ''));
  for (const o of CONTACT_RELATIONS) {
    const opt = el('option', undefined, optionLabel(o));
    opt.value = o.key;
    select.append(opt);
  }
  select.value = needs.contactRelation;
  select.addEventListener('change', () => { needs.contactRelation = select.value; on.change(); });
  wrap.append(label, select);
  return wrap;
}

// Edits go straight into `needs`; the caller owns saving.
export function renderNeedsStep(needs: PlanNeeds, on: NeedsStepActions): HTMLElement {
  const card = el('div', 'wizard-step needs-step');
  const header = i18n('div', 'needs.step.title', 'wizard-step-header');
  card.append(header, i18n('p', 'needs.step.intro', 'needs-intro'));

  card.append(group(needs, on, 'foodAllergies', 'needs.food', FOOD_ALLERGENS, 'needs.food.hint'));
  const allergyRest = el('div', 'wizard-grid needs-fields');
  allergyRest.append(textField(needs, on, 'otherAllergies', 'needs.otherAllergies', true));
  card.append(allergyRest);

  const meds = el('div', 'wizard-grid needs-fields');
  meds.append(textField(needs, on, 'medicines', 'needs.medicines', true));
  card.append(meds);

  card.append(group(needs, on, 'diet', 'needs.diet', DIET_NEEDS));
  const diet = el('div', 'wizard-grid needs-fields');
  diet.append(textField(needs, on, 'dietOther', 'needs.dietOther', false));
  card.append(diet);

  card.append(group(needs, on, 'languages', 'needs.languages', NEED_LANGUAGES));
  const langs = el('div', 'wizard-grid needs-fields');
  langs.append(textField(needs, on, 'languagesOther', 'needs.languagesOther', false));
  card.append(langs);

  const contact = el('fieldset', 'needs-group');
  contact.append(i18n('legend', 'needs.contact'));
  const contactGrid = el('div', 'wizard-grid needs-fields');
  contactGrid.append(
    textField(needs, on, 'contactName', 'needs.contactName', false),
    relationField(needs, on),
    textField(needs, on, 'contactPhone', 'needs.contactPhone', false),
  );
  contact.append(contactGrid);
  card.append(contact);

  const notes = el('div', 'wizard-grid needs-fields');
  notes.append(textField(needs, on, 'notes', 'needs.notes', true));
  card.append(notes);

  const actions = el('div', 'needs-actions');
  actions.append(i18n('p', 'needs.privacy', 'needs-privacy'));
  const buttons = el('div', 'wizard-review-actions');
  const make = (key: string, cls: string, fn: () => void) => {
    const b = i18n('button', key, `wizard-nav-btn ${cls}`);
    b.type = 'button';
    b.addEventListener('click', fn);
    return b;
  };
  buttons.append(
    make('needs.btn.save', 'wizard-btn-next', on.save),
    make('needs.btn.show', 'wizard-btn-show', on.show),
    make('needs.btn.print', 'wizard-btn-prev', on.print),
    make('needs.btn.clear', 'wizard-btn-clear', on.clear),
  );
  actions.append(buttons);
  card.append(actions);
  return card;
}
