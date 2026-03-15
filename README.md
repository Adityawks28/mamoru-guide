# MAMORU GUIDE 守る

Disaster preparedness guide for international students in Japan. Interactive PWA with earthquake scale, emergency vocabulary, bag packing game, and evacuation planning — in English, Japanese, and Indonesian.

Built by [PPI Kobe](https://github.com/adityawks28) (Perhimpunan Pelajar Indonesia Kobe).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+

### Install & Run

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/mamoru-guide/`

### Build for Production

```bash
npm run build
npm run preview    # preview the built version locally
```

Output goes to `dist/`.

### Type Check

```bash
npx tsc --noEmit
```

## Deployment

Automatically deployed to GitHub Pages on every push to `main` via GitHub Actions.

**Setup:** Go to repo Settings → Pages → Source → select **GitHub Actions**.

Live at: `https://<username>.github.io/mamoru-guide/`

## Project Structure

```
├── index.html           Entry point (Vite)
├── src/                 TypeScript source
│   ├── types.ts         Shared interfaces
│   ├── data.ts          Earthquake scale, vocabulary, bag items
│   ├── main.ts          App init + service worker registration
│   ├── lang.ts          Language switching (EN/JA/ID)
│   ├── theme.ts         Day/night mode
│   ├── earthquake-scale.ts
│   ├── vocab.ts         Emergency vocabulary cards
│   ├── bag-game.ts      Emergency bag packing game
│   ├── emergency-plan.ts  Personal plan form (localStorage)
│   ├── stars.ts         Animated starfield
│   ├── skyline.ts       Procedural city skyline
│   ├── scroll-reveal.ts
│   ├── nav.ts           Mobile navigation
│   └── toast.ts         Notification popups
├── css/                 Stylesheets (10 modular files)
├── public/              Static assets (sw.js, manifest, images)
├── vite.config.ts       Vite configuration
└── tsconfig.json        TypeScript configuration
```

## Tech Stack

- **TypeScript** — strict mode, zero runtime dependencies
- **Vite** — dev server + production bundler
- **PWA** — service worker, offline support, installable
- **CSS** — custom properties, responsive, print-optimized

## License

MIT
