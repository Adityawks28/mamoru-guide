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

  // `shindo` is the row index on the 10-step scale: 0 1 2 3 4 5- 5+ 6- 6+ 7.
  const shindo = (i: number) =>
    document.dispatchEvent(new CustomEvent('mamoru:shindo', { detail: { shindo: i } }));
  const actorX = () => Number(document.querySelector('#earthquake-scene .mr-actor')!
    .getAttribute('transform')!.match(/translate\((-?\d+)/)![1]);

  it('shindo 4 → braces once she gets there', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    shindo(4);
    vi.advanceTimersByTime(1500);
    expect(actorPose()).toBe('brace');
  });

  it('walks to the table in whole steps instead of sliding', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    shindo(7);
    const seen = new Set<number>();
    for (let t = 0; t < 2000; t += 30) { vi.advanceTimersByTime(30); seen.add(actorX()); }
    expect(seen.size).toBeGreaterThan(4);
    expect([...seen].every(Number.isInteger)).toBe(true);
    expect(actorX()).toBe(210);
    expect(actorPose()).toBe('cower');
  });

  it('6- and up → hides under the table (actor drawn before it)', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    shindo(7);
    vi.advanceTimersByTime(3000);
    const actor = document.querySelector('#earthquake-scene .mr-actor') as SVGGElement;
    const table = document.querySelector('#earthquake-scene .mr-table') as SVGGElement;
    expect(actor.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('shindo 0 calms the room back down', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    shindo(9);
    vi.advanceTimersByTime(8000);
    shindo(0);
    vi.advanceTimersByTime(3000);
    expect(actorPose()).toBe('stand');
    expect(document.querySelector('#earthquake-scene .mr-shelf.fallen')).toBeFalsy();
    const actor = document.querySelector('#earthquake-scene .mr-actor') as SVGGElement;
    const table = document.querySelector('#earthquake-scene .mr-table') as SVGGElement;
    expect(actor.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });

  it('furniture falls at the height of the shaking, not on the first jolt', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    shindo(9);
    expect(document.querySelector('#earthquake-scene .mr-shelf.fallen')).toBeFalsy();
    vi.advanceTimersByTime(3000);
    expect(document.querySelector('#earthquake-scene .mr-shelf.fallen')).toBeTruthy();
  });

  it('5+ (hard to stand) can topple the shelf; 5- only drops small things', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    shindo(5);
    vi.advanceTimersByTime(5000);
    expect(document.querySelector('#earthquake-scene .mr-shelf.fallen')).toBeFalsy();
    expect((document.querySelector('#earthquake-scene .mr-vase-fall') as SVGGElement).style.display).toBe('');
    shindo(6);
    vi.advanceTimersByTime(5000);
    expect(document.querySelector('#earthquake-scene .mr-shelf.fallen')).toBeTruthy();
  });

  it('the lamp only swings while the room shakes, then settles', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    const room = document.getElementById('earthquake-scene')!;
    expect(room.classList.contains('quaking')).toBe(false);
    shindo(4);
    expect(room.classList.contains('quaking')).toBe(true);
    vi.advanceTimersByTime(10000);
    expect(room.classList.contains('quaking')).toBe(false);
  });

  it('every row gets its own advice, up to shindo 7', async () => {
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    const procEn = () => document.querySelector('#earthquake-scene .mr-procedure [data-lang="en"]')!.textContent;
    expect(procEn()).toContain('stay calm');
    shindo(5);
    expect(procEn()).toContain('drop, cover');
    shindo(8);
    expect(procEn()).toContain('sturdy table');
    shindo(9);
    expect(procEn()).toContain('protect head');
  });

  it('with reduced motion the room still shows the result, without moving', async () => {
    (globalThis as any).window.matchMedia = () => ({
      matches: true, addEventListener: () => {}, removeEventListener: () => {},
      onchange: null, addListener: () => {}, removeListener: () => {},
      media: '', dispatchEvent: () => false,
    });
    const { initEarthquakeScene } = await import('../earthquake-scene');
    initEarthquakeScene();
    shindo(9);
    expect(document.querySelector('#earthquake-scene .mr-shelf.fallen')).toBeTruthy();
    expect(actorPose()).toBe('cower');
    expect(document.getElementById('earthquake-scene')!.classList.contains('quaking')).toBe(false);
  });
});
