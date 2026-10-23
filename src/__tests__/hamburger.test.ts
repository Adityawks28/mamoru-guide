import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// On mobile .hamburger is a 44px flex column with 8px padding, leaving 24px
// for three 2px bars. Vertical margins on the bars overflow that box, and flex
// shrinks the bars to 0px — the menu button renders blank. jsdom has no
// layout, so guard the rule itself.
describe('hamburger icon', () => {
  const css = readFileSync(resolve(process.cwd(), 'css/layout.css'), 'utf8');
  const rule = css.match(/\.hamburger span\s*\{([^}]*)\}/)![1];

  it('bars never shrink inside the flex column', () => {
    expect(rule).toMatch(/flex-shrink:\s*0/);
  });

  it('bars are spaced by gap, not margins that overflow the button', () => {
    expect(rule).not.toMatch(/margin/);
  });
});
