import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { emptyNeeds, emptyPlan } from '../plan-model';
import { loadPlanV2, savePlanV2 } from '../plan-storage';
import { initEmergencyPlan, clearPlan } from '../emergency-plan';
import { clearNeedsConfirmText } from '../needs-step';
import { closeNeedsCard } from '../needs-card';
import { setLang } from '../lang';
import { t } from '../i18n';

function start() {
  const p = emptyPlan();
  p.profile.name = 'Test Person';
  savePlanV2(p);
  initEmergencyPlan();
}
const dot = (i: number) => document.querySelectorAll<HTMLButtonElement>('.wizard-dot')[i];
const button = (text: string) =>
  [...document.querySelectorAll<HTMLButtonElement>('button')].find(b => b.textContent === text)!;
const field = (name: string) => document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[data-need="${name}"]`)!;
const type = (name: string, value: string) => {
  const f = field(name);
  f.value = value;
  f.dispatchEvent(new Event('input', { bubbles: true }));
};

beforeEach(() => {
  document.body.innerHTML = '<main><div id="plan-wizard"></div></main>';
  document.body.className = '';
  localStorage.clear();
  setLang('en');
});
afterEach(() => {
  closeNeedsCard();
  vi.restoreAllMocks();
  setLang('en');
});

describe('needs step', () => {
  it('is step 7 of 8, and Review is still last', () => {
    start(); dot(6).click();
    expect(document.querySelector('.wizard-step-counter')!.textContent).toBe('7 / 8');
    expect(document.querySelectorAll('fieldset').length).toBeGreaterThanOrEqual(3);
    dot(7).click();
    expect(document.querySelector('.wizard-step-counter')!.textContent).toBe('8 / 8');
  });

  it('has no food need or language ticked for a new plan', () => {
    start(); dot(6).click();
    expect(document.querySelectorAll('input[type=checkbox]:checked').length).toBe(0);
  });

  it('saves a ticked allergen and typed medicines', () => {
    start(); dot(6).click();
    const soba = document.querySelector<HTMLInputElement>('input[data-need="foodAllergies"][value="soba"]')!;
    soba.checked = true;
    soba.dispatchEvent(new Event('change', { bubbles: true }));
    type('medicines', 'Insulin');
    button(t('needs.btn.save')).click();
    const needs = loadPlanV2().needs;
    expect(needs.foodAllergies).toEqual(['soba']);
    expect(needs.medicines).toBe('Insulin');
  });

  it('shows the shared-device note next to Save', () => {
    start(); dot(6).click();
    const save = button(t('needs.btn.save'));
    expect(save.closest('.needs-actions')!.textContent).toContain(t('needs.privacy'));
  });

  it('has every label in Indonesian when the language is id', () => {
    setLang('id'); start(); dot(6).click();
    expect(document.querySelector('legend')!.textContent).toBe(t('needs.food', 'id'));
  });

  it('shows what was just typed', () => {
    start(); dot(6).click();
    type('notes', 'Needs a quiet room');
    button(t('needs.btn.show')).click();
    expect(document.querySelector('.needs-card-overlay')!.textContent).toContain('Needs a quiet room');
  });

  it('keeps typed text out of the wizard text handler', () => {
    start(); dot(6).click();
    type('medicines', 'Insulin');
    expect(loadPlanV2().profile.name).toBe('Test Person');
  });

  it('names every deleted field in the clear confirmation', () => {
    for (const lang of ['en', 'ja', 'id'] as const) {
      const text = t('needs.clear.confirm', lang).toLowerCase();
      for (const k of ['needs.food', 'needs.otherAllergies', 'needs.medicines', 'needs.diet', 'needs.languages', 'needs.contact', 'needs.notes'])
        expect(text, `${lang} ${k}`).toContain(t(k, lang).toLowerCase());
    }
    expect(clearNeedsConfirmText()).toBe(t('needs.clear.confirm'));
  });

  it('clears only the needs after confirmation', () => {
    start(); dot(6).click();
    type('medicines', 'Insulin');
    button(t('needs.btn.save')).click();
    window.confirm = vi.fn(() => true);
    button(t('needs.btn.clear')).click();
    const plan = loadPlanV2();
    expect(plan.needs).toEqual(emptyNeeds());
    expect(plan.profile.name).toBe('Test Person');
    expect(field('medicines').value).toBe('');
  });

  it('keeps the needs when the user cancels', () => {
    start(); dot(6).click();
    type('medicines', 'Insulin');
    button(t('needs.btn.save')).click();
    window.confirm = vi.fn(() => false);
    button(t('needs.btn.clear')).click();
    expect(loadPlanV2().needs.medicines).toBe('Insulin');
    expect(field('medicines').value).toBe('Insulin');
  });

  it('plan clear confirmation names the needs card', () => {
    start();
    const spy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    clearPlan();
    expect(spy.mock.calls[0][0]).toContain('needs card');
  });

  it('adds Show my needs to the Review step', () => {
    start(); dot(7).click();
    button(t('needs.btn.show')).click();
    expect(document.querySelector('.needs-card-overlay')).not.toBeNull();
  });
});
