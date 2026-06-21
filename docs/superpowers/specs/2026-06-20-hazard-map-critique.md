# Hazard Map — Adversarial Critique

**Date:** 2026-06-20
**Method:** Ruthless adversarial review of the v1 design spec + implementation plan + design integration, held to a life-safety bar.
**Outcome:** Drove the v2 plan (`docs/superpowers/plans/2026-06-20-hazard-map-implementation.md`).

## Verdict

- **Feature: D+.** Concept legitimate, offline-first instinct right, but data-integrity, legality, and crisis-routing problems were at a level where shipping as specced could plausibly contribute to harm.
- **Design integration: D.** Token-mapping discipline good, but headline choices (Press Start 2P on alerts; CSS `filter` tinting of safety-critical tiles at night; pattern-fill claims Leaflet can't easily deliver) degrade legibility/contrast in exactly the conditions that matter.

> Correction logged after the review: the critique assumed Tier-1 medical fixes + the EARTHQUAKE NOW screen were unfixed (per the evaluation). They had already shipped to `main` (commits `c6d7210`…`5f1ec8f`). The prioritization point is softened accordingly, but every other finding stands.

## Top 10 (ranked)

1. **Sample/placeholder hazard polygons ship to real users** and are indistinguishable from real risk zones; flag defaulted ON. *(Critical)*
2. **Straight-line distance + direction arrows** can guide an evacuee across a flooding river or downhill toward the sea during a tsunami; `elevation` exists in the schema but is unused. *(Critical)*
3. **Bulk pre-caching OSM tiles violates the OSM Tile Usage Policy** (and the code uses OSM, not GSI, as primary). Can't have offline tiles + "no tile server" + policy compliance. *(Critical)*
4. **Lowest-priority item** (eval #26) — though the Tier-1 items it was compared against are now fixed. *(Critical→softened)*
5. **Press Start 2P on the emergency alert banner** — an 8-bit pixel font is a legibility disaster for "TSUNAMI WARNING" read in panic. *(High)*
6. **Night `hue-rotate` tile filter** shifts blues → tsunami/flood fill becomes indistinguishable from water; degrades label contrast; the blanket "AA against any tile" claim is unverifiable. *(High)*
7. **JMA feed hand-waved** — no real endpoint/schema/terms, CORS-blind, and silent failure shows "No active alerts" during a real warning (fatal false-negative). *(High)*
8. **Hand-rolling point-in-polygon + simplification** (to honor zero-deps) on safety-critical geometry is bug-prone exactly where "are you in a danger zone?" must be correct. *(High)*
9. **Indoor GPS error + no accuracy gating** → confidently-wrong "nearest shelter"; mitigation listed in risk table but in no task; bad fix cached 1h. *(High)*
10. **SW unbounded cache + the `activate` handler deletes every non-current cache** — so the "isolated" hazard cache is wiped on the next version bump; no eviction/persist. *(High)*

## Additional findings

- **Privacy:** tile requests leak the viewport (≈street-level location) to GSI/OSM, contradicting "no location sent."
- **Token bug:** `--meriken-amber` has no day-mode override → amber risk markers fail 3:1 on the light map; "theming comes for free" is false here.
- **Fiction:** "reuse the existing pulse treatment" — the current user marker (`shelter-finder.ts:143`) is static; no pulse exists.
- **a11y:** `role="application"` traps screen-reader users; map-pan arrow keys collide with the spec's "arrow keys navigate the list" (double-bound); SVG pattern fills in Leaflet are non-trivial, not free; user "triangle" vs "circle dot" internally inconsistent.
- **Offline math:** "~200 tiles / 1.5 MB" is off by ~an order of magnitude; 2 MB GeoJSON parsed on the main thread janks budget phones; cross-origin Leaflet CDN may not actually cache offline (opaque responses skipped by `sw.js:41`).
- **Data:** MLIT/J-SHIS/GSI licensing + mandatory attribution unverified; "free" ≠ "redistributable simplified in your repo"; simplification toward the safe side silently under-warns.
- **No liability disclaimer** anywhere; stale-but-silent hazard data with no visible "as of" date; dismiss-on-tap alert banner erasable by a panic mis-tap.
- **Plan risk:** Phase 0 rewires `shelter-finder.ts` four times for zero user gain; `declare const L: any` on the riskiest new subsystem; <20 KB gz + <2.5 MB budgets unrealistic; tests mock Leaflet so geometry/rendering (the risky parts) are never exercised.

## Things that are actually fine

Offline-first instinct + dedicated hazard cache; the token-mapping table (where tokens flip); extracting pure evacuation math; trilingual + `mamoru-*` discipline; reuse-don't-rewrite stance; feature-flag + git-revert rollback for the non-emergency path.

## Recommended de-scope (v1) → adopted differently in v2

The critique recommended cutting zone polygons, live JMA, bulk tiles, and educational mode for a "safer v1." **v2 instead keeps scope but makes each piece real** (PMTiles self-hosted tiles, real licensed data first, fail-loud alerts, bundled tested geometry) behind a de-risking spike and a default-OFF flag — accepting a longer (~3–4 week) timeline rather than shipping a watered-down or unsafe version.
