import { emptyPlan } from '../plan-model';
import { savePlanV2 } from '../plan-storage';
import { initEmergencyPlan, printPlan } from '../emergency-plan';

function demoPlan() {
  const p = emptyPlan();
  p.profile.name = 'Test Person';
  p.profile.bloodType = 'O+';
  p.profile.residenceCard = 'AB12345678CD';
  p.profile.insurance = 'NHI 1234567';
  p.medical.conditions = 'Peanut allergy';
  return p;
}

const sheet = () => document.getElementById('plan-print');
const sheetText = () => sheet()!.textContent ?? '';

function start(plan = demoPlan()) {
  savePlanV2(plan);
  initEmergencyPlan();
}

beforeEach(() => {
  document.body.innerHTML = '<main><div id="plan-wizard"></div></main>';
  document.body.className = '';
  document.body.dataset.route = 'plan';
  document.title = 'MAMORU GUIDE 守る';
  localStorage.clear();
  window.print = vi.fn();
  window.dispatchEvent(new Event('afterprint'));
});

describe('printed worksheet', () => {
  it('prints only the worksheet, then puts the page back', () => {
    start();
    printPlan();
    expect(document.body.classList.contains('print-plan-only')).toBe(true);
    expect(sheet()!.parentElement).toBe(document.body);
    expect(window.print).toHaveBeenCalled();
    window.dispatchEvent(new Event('afterprint'));
    expect(sheet()).toBeNull();
    expect(document.body.classList.contains('print-plan-only')).toBe(false);
    expect(document.title).toBe('MAMORU GUIDE 守る');
  });

  it('puts the name at the top and medical info in its own block', () => {
    start();
    printPlan();
    expect(sheet()!.querySelector('h1')!.textContent).toBe('Test Person');
    expect(sheet()!.querySelector('.ws-medical')!.textContent).toContain('Peanut allergy');
  });

  it('hides ID numbers except the last four unless asked', () => {
    start();
    printPlan();
    expect(sheetText()).not.toContain('AB12345678CD');
    expect(sheetText()).toContain('78CD');
    expect(sheetText()).not.toContain('1234567');
    expect(sheetText()).toContain('4567');
  });

  it('prints full ID numbers when the box on the review step is ticked', () => {
    start();
    const dots = document.querySelectorAll<HTMLButtonElement>('.wizard-dot');
    dots[dots.length - 1].click();
    const box = document.querySelector<HTMLInputElement>('input[name="print-full-ids"]')!;
    expect(box.checked).toBe(false);
    box.click();
    printPlan();
    expect(sheetText()).toContain('AB12345678CD');
  });

  it('leaves a write-in line for anything not filled in', () => {
    start(emptyPlan());
    printPlan();
    expect(sheet()!.querySelectorAll('.ws-blank').length).toBeGreaterThan(10);
    expect(sheetText()).not.toMatch(/undefined|null/);
  });

  it('treats typed text as text, never markup', () => {
    const p = demoPlan();
    p.profile.name = '<img src=x onerror=alert(1)>';
    start(p);
    printPlan();
    expect(sheet()!.querySelector('img')).toBeNull();
    expect(sheet()!.querySelector('h1')!.textContent).toBe('<img src=x onerror=alert(1)>');
  });

  it('lists the emergency numbers, including the disaster message dial', () => {
    start();
    printPlan();
    const numbers = sheet()!.querySelector('.ws-numbers')!.textContent!;
    ['119', '110', '118', '171'].forEach(n => expect(numbers).toContain(n));
  });

  it('keeps the name out of the print title, which becomes the PDF file name', () => {
    start();
    printPlan();
    expect(document.title).not.toContain('Test Person');
    expect(document.title).toMatch(/worksheet/i);
  });

  it('Ctrl+P on the plan page prints the worksheet too', () => {
    start();
    window.dispatchEvent(new Event('beforeprint'));
    expect(sheet()).not.toBeNull();
    expect(document.body.classList.contains('print-plan-only')).toBe(true);
  });

  it('Ctrl+P on any other page prints that page', () => {
    start();
    document.body.dataset.route = 'prepare';
    window.dispatchEvent(new Event('beforeprint'));
    expect(sheet()).toBeNull();
  });
});
