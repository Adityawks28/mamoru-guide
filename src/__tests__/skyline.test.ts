import { buildSkyline } from '../skyline';

describe('skyline', () => {
  it('draws the same city on every load', () => {
    document.body.innerHTML = '<div id="skyline"></div>';
    buildSkyline();
    const first = document.getElementById('skyline')!.innerHTML;
    buildSkyline();
    expect(first.length).toBeGreaterThan(0);
    expect(document.getElementById('skyline')!.innerHTML).toBe(first);
  });
});
