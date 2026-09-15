import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

beforeEach(() => {
  document.body.innerHTML = `<div id="mascot"></div>`;
  localStorage.clear();
  (globalThis as any).window.matchMedia = () => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
  vi.useFakeTimers();
});

describe('mascot accessibility', () => {
  it('does not mark the mascot host aria-hidden in index.html', () => {
    const html = readFileSync(resolve(__dirname, '../../../index.html'), 'utf8');
    const tag = html.match(/<div[^>]*id="mascot"[^>]*>/);
    expect(tag).not.toBeNull();
    expect(tag![0]).not.toMatch(/aria-hidden\s*=\s*"true"/);
  });

  it('exposes the fact control as a labelled, focusable button', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const btn = document.querySelector('#mascot [role="button"]') as HTMLElement | null;
    expect(btn).not.toBeNull();
    expect(btn!.getAttribute('tabindex')).toBe('0');
    expect(btn!.getAttribute('aria-label')).toBeTruthy();
  });

  it('never leaves a focusable element inside an aria-hidden subtree', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const focusable = document.querySelectorAll('#mascot [tabindex], #mascot button, #mascot a[href]');
    expect(focusable.length).toBeGreaterThan(0);
    focusable.forEach((el) => {
      expect(el.closest('[aria-hidden="true"]')).toBeNull();
    });
  });

  it('marks the decorative sprite aria-hidden', async () => {
    const { initMascot } = await import('../mascot');
    initMascot();
    const svg = document.querySelector('#mascot svg');
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute('aria-hidden')).toBe('true');
  });
});
