# CLAUDE.md — Mamoru Guide

## Git Practices

- **Commit small and often.** Prefer many small, focused commits over one large push. Each commit should cover one logical change — a single feature, a single fix, a single refactor.
- **Push frequently.** Push after each meaningful commit rather than batching up a lot of work before pushing. This keeps the remote up to date and makes it easy to roll back or review.
- **No "Co-authored by Claude" in commit messages.** Do not add any `Co-authored-by` trailer to commits in this project.

## Commit Message Format

Use a short prefix followed by a concise description:

```
feat: add hash router with view groups
fix: shelter type filter not resetting on route change
chore: bump version to 2.0.0-alpha
docs: update README with v2 what's new section
```

Prefixes: `feat:`, `fix:`, `chore:`, `docs:` — nothing more formal needed.

## Branch Naming

```
feat/phase-N-<short-name>    e.g. feat/phase-1-router
fix/<short-description>      e.g. fix/emergency-back-button
```

Cut from `main`, open a PR, merge, delete the branch.

---

## Privacy Rules

### What data this app handles

| Data | Where stored | Sent to network? |
|------|-------------|-----------------|
| Emergency plan (name, medical, contacts) | `localStorage` only | Never |
| Geolocation coordinates | Not stored — used once for distance calc then discarded | Never (but OSM tile requests reveal the approximate map viewport to OpenStreetMap's CDN) |
| Language / theme / scores | `localStorage` | Never |

### Hard rules for all contributors

1. **Never `console.log` plan fields or location coordinates.** Visible to browser extensions and DevTools recordings. Gate any debug output behind a build-time flag.

2. **Never send plan data over the network.** No `fetch`, XHR, beacon, or `postMessage` to any external origin with plan fields. Local-only, period.

3. **Never put sensitive data in URLs.** No query params, hash fragments, or path segments containing plan fields, medical info, or coordinates. URLs are logged by servers, browsers, and proxies.

4. **Never cache plan data in the service worker.** Plan data lives in `localStorage`, outside `CacheStorage`. Keep it that way.

5. **Geolocation is request-on-demand only.** Only call `getCurrentPosition()` when the user explicitly triggers the shelter finder. Never on page load, route change, or in the background.

6. **Always provide a clear data deletion path.** The "Clear plan" button must always be reachable and require one confirmation. Never silently delete or auto-expire plan data.

7. **New features default to local-only.** If a new feature needs to store or transmit user data, document the justification in the PR. The default answer is local storage.

### Known third-party data exposure (document to users in-app)

- **OpenStreetMap CDN** — tile requests reveal the approximate map viewport (not exact GPS) to OSM tile servers. Standard for any web map.
- **Google Fonts CDN** — page load requests `fonts.googleapis.com`, exposing the user's IP to Google.
- **Leaflet CDN** — Leaflet JS loads from a CDN on shelter finder init, exposing IP.

These should be noted in a short Privacy notice near the shelter finder and in the About section.
