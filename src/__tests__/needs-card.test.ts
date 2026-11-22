import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildNeedsCard, showNeedsCard } from '../needs-card';
import { emptyNeeds, emptyPlan, type PlanNeeds } from '../plan-model';
import { savePlanV2 } from '../plan-storage';
import { t } from '../i18n';

const full = (): PlanNeeds => ({ ...emptyNeeds(), foodAllergies: ['soba', 'rakkasei'], otherAllergies: 'Kiwi',
  medicines: 'Insulin 10u', diet: ['halal'], languages: ['id', 'ja-easy'], contactName: 'Budi',
  contactRelation: 'friend', contactPhone: '080-1234-5678', notes: 'Line 1\nLine 2' });

beforeEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
  localStorage.removeItem('mamoru-plan-v2');
});

describe('needs card', () => {
  it('puts Japanese first and the user language below', () => {
    const sec = buildNeedsCard(full(), 'id').querySelector('[data-sec="allergies"]')!;
    const lines = sec.querySelectorAll('.needs-ja, .needs-sub');
    expect(lines[0].getAttribute('lang')).toBe('ja');
    expect(lines[1].textContent).toBe(t('needs.card.allergies', 'id'));
    expect(sec.textContent).toContain('そば');
    expect(sec.textContent).toContain('Kacang tanah');
  });
  it('shows Japanese only when the UI language is Japanese (N-7)', () =>
    expect(buildNeedsCard(full(), 'ja').querySelectorAll('.needs-sub').length).toBe(0));
  it('shows free text exactly as typed', () =>
    expect(buildNeedsCard(full(), 'en').querySelector('[data-sec="notes"] .needs-free')!.textContent).toBe('Line 1\nLine 2'));
  it('shows markup as text', () => {
    const card = buildNeedsCard({ ...emptyNeeds(), notes: '<img src=x onerror=alert(1)>' }, 'en');
    expect(card.querySelector('img')).toBeNull();
    expect(card.textContent).toContain('<img src=x onerror=alert(1)>');
  });
  it('links the phone with digits and plus only (N-8)', () => {
    const a = buildNeedsCard({ ...full(), contactPhone: '+81 80-1234"x' }, 'en').querySelector('a')!;
    expect(a.getAttribute('href')).toBe('tel:+81801234');
    expect(a.textContent).toBe('+81 80-1234"x');
  });
  it('leaves out empty sections and shows the empty note for an empty card', () => {
    expect(buildNeedsCard({ ...emptyNeeds(), medicines: 'X' }, 'en').querySelectorAll('.needs-sec').length).toBe(1);
    expect(buildNeedsCard(emptyNeeds(), 'en').textContent).toContain(t('needs.card.empty', 'en'));
  });
  it('opens as a modal dialog, closes on Escape and gives focus back', () => {
    const plan = emptyPlan();
    plan.needs = full();
    savePlanV2(plan);
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();
    showNeedsCard();
    const overlay = document.querySelector('.needs-card-overlay')!;
    expect(overlay.getAttribute('role')).toBe('dialog');
    expect(overlay.getAttribute('aria-modal')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(overlay.querySelector('.needs-close'));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('.needs-card-overlay')).toBeNull();
    expect(document.activeElement).toBe(opener);
    expect(document.body.style.overflow).toBe('');
  });
  it('never uses innerHTML', () =>
    expect(readFileSync(resolve(__dirname, '../needs-card.ts'), 'utf8')).not.toMatch(/innerHTML|insertAdjacentHTML/));
});
