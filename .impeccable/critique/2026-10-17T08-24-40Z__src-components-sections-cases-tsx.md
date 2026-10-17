---
target: clinical cases section
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:/Users/its_akbarov/dev/sites/dentist-2/src/components/sections/Cases.tsx"
target_fingerprint: "sha256:6f24c4b47b2cebdeadc21863cf12ab56ab5ed656f5f2bb884e40cb19667b337e"
target_path: /Users/its_akbarov/dev/sites/dentist-2/src/components/sections/Cases.tsx
timestamp: 2026-10-17T08-24-40Z
slug: src-components-sections-cases-tsx
---
# Critique: Clinical cases section (src/components/sections/Cases.tsx + BeforeAfter.tsx), 2026-10-17
Method: dual-agent (A: design review, B: detector + browser)

Heuristics 21/32 (7, 10 n/a). Detector: 0 findings in #cases (CLI clean; page-level Geist banner only).
|1 Status|2|no counter/aria-live on desktop; toggle stays ON after reveal; labels don't follow slider|
|2 Real world|3|"Qo‘llanilgan tizim" implant wording; composite mirror shot unrecognisable|
|3 Control|3|toggle re-blurs, Barchasi resets, Home/End|
|4 Consistency|2|two prev/next pairs on phones; handle turns square on focus|
|5 Error prevention|2|OLDIN/KEYIN wrong at extremes; disabled arrows on 1-case filters|
|6 Recognition|3|case title below photo on phones|
|7|n/a|Persuade|
|8 Minimalism|3|eyebrow label, dead gap, "real result" said twice, divider through hint pill|
|9 Recovery|3|empty state ok; slider image fallback has no label|
|10|n/a|Persuade|

Priority issues:
- [P1] Crops/pairs weaken proof: veneers focus pushes teeth to top 20%; zirconia-renew before has baked letterbox bands; zirconia-full pair mismatched framing; full-rehab smile tiny and under the handle.
- [P1] OLDIN/KEYIN labels stay visible at 0%/100% (wrong state).
- [P1] Phones show two prev/next pairs (~92px apart), announced twice; disabled dead arrows on single-case filters.
- [P2] Divider line paints over the comfort-hint pill (BeforeAfter.tsx:108/122 stacking); global :focus-visible border-radius turns the round handle square; toggle doesn't reflect revealed state.
- [P2] 5 filter chips for 6 cases (4 filters = 1 case); selected chip not scrolled into view; overflow at 375px.
- [P2] No booking step at the section's peak; only action leaves for Instagram.
Minor: no aria-valuetext; "Klinik holat pasporti" eyebrow; ~120px dead gap on desktop; zirconia-renew copy says "yellowed" but before photo shows metal crowns; RU quote marks.
