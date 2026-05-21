import { describe, it, expect, beforeEach, vi } from 'vitest';

function actorPose(): string | null {
  const actor = document.querySelector('#earthquake-scene .mr-actor svg') as SVGElement | null;
  return actor?.getAttribute('data-pose') ?? null;
}

beforeEach(() => {
  document.body.innerHTML = `
    <section class="section" id="earthquake">
      <div id="earthquake-scene" class="character-scene"></div>
    </section>
  `;
  localStorage.clear();
  (globalThis as any).window.matchMedia = () => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    onchange: null, addListener: () => {}, removeListener: () => {},
    media: '', dispatchEvent: () => false,
  });
  vi.useFakeTimers();
});

describe('earthquake-scene', () => {
  it('returns early when mount is absent', async () => {
    document.body.innerHTML = '';
    const { initEarthquakeScene } = await import('../earthquake-scene');
    expect(() => initEarthquakeScene()).not.toThrow();
  });

  it('mounts the room stage, actor sprite, tip bubble, procedure text', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    expect(document.querySelector('#earthquake-scene.mamoru-room')).toBeTruthy();
    expect(document.querySelector('#earthquake-scene .mr-stage svg.mr-svg')).toBeTruthy();
    expect(document.querySelector('#earthquake-scene .mr-actor svg')).toBeTruthy();
    expect(document.querySelector('#earthquake-scene .tip-bubble')).toBeTruthy();
    expect(document.querySelector('#earthquake-scene .mr-procedure')).toBeTruthy();
  });

  it('builds room hazards: lamp, shelf, doorGlow', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    expect(document.querySelector('#earthquake-scene .mr-lamp')).toBeTruthy();
    expect(document.querySelector('#earthquake-scene .mr-shelf')).toBeTruthy();
    expect(document.querySelector('#earthquake-scene .mr-door-glow')).toBeTruthy();
  });

  it('actor mounts as Mamo (female) in stand', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    const actor = document.querySelector('#earthquake-scene .mr-actor svg') as SVGElement;
    expect(actor.getAttribute('data-gender')).toBe('female');
    expect(actor.getAttribute('data-pose')).toBe('stand');
  });

  it('shindo 4 → eventually brace pose after walk sequence', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 4 } }));
    vi.advanceTimersByTime(800);
    expect(actorPose()).toBe('brace');
  });

  it('shindo 7 → final headcover pose at 2200ms', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 7 } }));
    vi.advanceTimersByTime(2300);
    expect(actorPose()).toBe('headcover');
  });

  it('shindo 6 → actor renders BEFORE table (depth: actor under tabletop)', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 6 } }));
    const actor = document.querySelector('#earthquake-scene .mr-actor') as SVGGElement;
    const table = document.querySelector('#earthquake-scene .mr-table') as SVGGElement;
    expect(actor.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('shindo 0 → actor renders AFTER table (depth: actor in front)', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 6 } }));
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: null } }));
    const actor = document.querySelector('#earthquake-scene .mr-actor') as SVGGElement;
    const table = document.querySelector('#earthquake-scene .mr-table') as SVGGElement;
    expect(actor.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });

  it('shindo 7 → shelf becomes fallen', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 7 } }));
    expect(document.querySelector('#earthquake-scene .mr-shelf.fallen')).toBeTruthy();
  });

  it('shindo 5 → door glow visible', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 5 } }));
    const glow = document.querySelector('#earthquake-scene .mr-door-glow') as SVGGElement;
    expect(glow.style.display).toBe('');
  });

  it('null shindo → resets to intensity 0 (stand)', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 6 } }));
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: null } }));
    vi.advanceTimersByTime(800);
    expect(actorPose()).toBe('stand');
    expect(document.querySelector('#earthquake-scene .mr-shelf.fallen')).toBeFalsy();
  });

  it('procedure text updates per intensity', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    const procEn = () => document.querySelector('#earthquake-scene .mr-procedure [data-lang="en"]')!.textContent;
    expect(procEn()).toContain('stay calm');
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: 5 } }));
    expect(procEn()).toContain('drop, cover');
  });
});
