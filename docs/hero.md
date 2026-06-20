# Hero Section

The hero section is the landing view of Mamoru Guide. It features a pixel-art Kobe harbor scene with animated landmarks, the mascot character Moru, and the main navigation entry points.

## Structure

- **Kobe scene** (`css/hero-arcade.css`): 14 animated SVG landmarks including Port Tower, Meriken Park, ships, and harbor buildings. Background animates day/night based on theme.
- **Mascot** (`src/character/mascot.ts`): Moru stands in the hero area. Cursor-tracking pupils, blink loop, click emote cycle, disaster fact rotator. All motion gated by `motionAllowed()`.
- **Hero content** (`index.html #hero`): Title, subtitle, and CTA buttons leading to mode selector.

## Files

| File | Purpose |
|------|---------|
| `css/hero.css` | Hero layout, title animations, scroll hint |
| `css/hero-arcade.css` | Kobe harbor scene, pixel typography, arcade styling |
| `src/stars.ts` | Animated starfield canvas in background |
| `src/skyline.ts` | Generates the harbor skyline SVG elements |
| `src/character/mascot.ts` | Moru character with facts and interactions |

## Accessibility

- All SVG landmarks have `aria-hidden="true"` (decorative)
- Hero title animations respect `prefers-reduced-motion`
- Mascot facts are in `data-lang` spans for i18n
- Skip link available to bypass hero content

## Theme

- Night mode: dark harbor gradient, glowing landmarks, stars visible
- Day mode: light sky gradient, daylight landmarks, stars hidden
