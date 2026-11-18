---
target: whole dentist landing page
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
target_identity: "file:/Users/its_akbarov/dev/sites/dentist-2/src/app/page.tsx"
target_fingerprint: "sha256:3b1920c9a3dbef217ec297cd15d2111b916c856eaee98ea50697a2dc80b8e133"
target_path: /Users/its_akbarov/dev/sites/dentist-2/src/app/page.tsx
timestamp: 2026-10-17T00-38-51Z
slug: src-app-page-tsx
---
# Critique: dentist landing (src/app/page.tsx), 2026-10-17 rerun (Impeccable v4.6.0)
Method: dual-agent (A: design review, B: detector + browser)

Heuristics 22/32 (7, 10 n/a). Audit 14/20. Code unchanged since previous run except footer email fix.
|1 Status|3|stale active nav (Sertifikatlar lit through Reviews/FAQ)|
|2 Real world|2|implant jargon; calculator has no toothache/filling/cleaning option|
|3 Control|3|modals good; mobile menu aria-modal without focus trap|
|4 Consistency|3|service card 3 no price; EN certificate modal; "Aloqa" goes to booking|
|5 Error prevention|3|no preferred-time choice|
|6 Recognition|3|calc prefill chip|
|7|n/a|landing|
|8 Minimalism|2|13.2k/17.5k px; Protocol 4k px; repeated portrait/manifesto; ~5 Telegram CTAs|
|9 Recovery|3|inline specific errors, Telegram fallback|
|10|n/a|landing|

Detector: codex-grid-background x1 (FP, blueprint surface); overused-font (Geist 100%, real signal); low-contrast 33 (29 FP: dimmed inactive protocol steps at opacity-45; real: calc paper/70 4.2:1, placeholders ~3.6:1); nested-cards x1 (FP chat bubble).

Priority issues:
- [P0] Fabricated trust signals attributed to a real doctor (certificates w/ invented IDs, Google/Yandex reviews, first-person case notes, 99.4%, licence, address/map/taxi, drolimov.uz in OG/JSON-LD, demo footer note).
- [P1] Offer mismatch: painless general dentist vs inherited implant hero/services/calculator/protocol/FAQ.
- [P1] Booking far away; mobile CTA lands on portrait (form 919px below), focus not moved.
- [P1] Booking API: no rate limit/honeypot (Telegram spam).
- [P2] Page length / undisclosed Protocol; intro modal dead end.
- [P2] Stale nav; "30 min" promise while closed; no next-steps/first-visit price.
- [P2] SEO: no robots/sitemap; RU not indexable; title stays uz.
- [P3] Calc 4.2:1, placeholders 3.6:1, lang toggle hidden <640px, hero stats below fold, X-Powered-By.
