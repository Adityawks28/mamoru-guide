# CLAUDE.md — Project rules for this repo

## Git practices

- Small commits, push often — don't batch everything into one giant push
- Do NOT include "Co-authored-by: Claude" in commit messages
- Commit prefix convention: `feat:` `fix:` `chore:` `docs:`
- Branch naming: `feat/phase-N-name`, `fix/short-description`

## Privacy rules

All user data (emergency plan, location, medical info) must stay local.

Hard rules:
1. Never send plan/location/medical data to any server or external API
2. Never log sensitive fields to `console.log`
3. Never include sensitive fields in URL params or query strings
4. Never push plan data to localStorage keys that a third-party script could read (use namespaced keys like `mamoru-*`)
5. The shelter finder may call OpenStreetMap tile servers and Nominatim — no user data in those requests
6. GPS coordinates are used locally only; never transmitted
7. `[data-i18n-html]` must only be used with strings from locale files, never user input

## Code style

- Minimal comments — only where logic is non-obvious
- No banner-style block comments (`/* ===== SECTION ===== */`)
- No "AI-looking" comment patterns

---

## Pull Request template

Use this format for every PR. Keep it short — bullets, not paragraphs.

```
## What
One sentence describing what this PR ships.

## Why
One sentence on the motivation (feature need, bug, phase goal).

## Changes
- bullet list of key file changes

## Checklist
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] No sensitive data exposed
```
