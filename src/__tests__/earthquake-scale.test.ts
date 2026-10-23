import { initEarthquakeScale } from '../earthquake-scale';

describe('earthquake scale rows', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="scaleVertical"></div>';
    (window as any).matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
    initEarthquakeScale();
  });

  const rows = () => [...document.querySelectorAll<HTMLElement>('#scaleVertical .scale-row')];

  it('marks the tapped level as pressed and sends its row index', () => {
    const sent: number[] = [];
    document.addEventListener('mamoru:shindo', e => sent.push((e as CustomEvent).detail.shindo));
    rows()[8].click();
    rows()[2].click();
    expect(sent).toEqual([8, 2]);
    expect(rows().map(r => r.getAttribute('aria-pressed'))).toEqual(
      rows().map((_, i) => String(i === 2)));
  });

  it('tapping the same level again replays it instead of switching it off', () => {
    const sent: number[] = [];
    document.addEventListener('mamoru:shindo', e => sent.push((e as CustomEvent).detail.shindo));
    rows()[9].click();
    rows()[9].click();
    expect(sent).toEqual([9, 9]);
    expect(rows()[9].getAttribute('aria-pressed')).toBe('true');
  });

  it('never shakes the row itself, so its text stays readable', () => {
    rows()[9].click();
    expect(rows()[9].className).not.toMatch(/shaking/);
  });
});
