---
target: whole dentist landing page
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
target_identity: "file:/Users/its_akbarov/dev/sites/dentist-2/src/app/page.tsx"
target_fingerprint: "sha256:3b1920c9a3dbef217ec297cd15d2111b916c856eaee98ea50697a2dc80b8e133"
target_path: /Users/its_akbarov/dev/sites/dentist-2/src/app/page.tsx
timestamp: 2026-10-17T00-05-20Z
slug: src-app-page-tsx
---
# Critique: dentist landing (src/app/page.tsx), 2026-10-17
Method: dual-agent (A: design review, B: detector + browser)

Heuristics 23/32 (7, 10 n/a). Audit 14/20.
| H | Score | Key issue |
|1 Status|3|calc result off-screen while choosing; stale nav highlight|
|2 Real world|2|implant jargon + equipment brands for a "painless general dentist"|
|3 Control|3|good modal focus/escape; prefill removable|
|4 Consistency|3|hard-coded EN "Certificate of Completion"; 5 Telegram CTAs behave differently|
|5 Error prevention|3|"booking" is a callback request, no time choice|
|6 Recognition|3|Protocol/Reviews/FAQ not in nav|
|7|n/a|landing page|
|8 Minimalism|3|13.7k/18.7k px long; manifesto/stats repeated in intro modal|
|9 Recovery|3|specific errors, focus to first invalid; only on submit|
|10|n/a|landing page|

Priority issues:
- [P0] Inherited fictional facts shown for a real doctor (99.4% stat, certificates with invented IDs, licence, ESCD/Zeiss, address+map, reviews, demo footer note, drolimov.uz canonical/OG/JSON-LD). Fix: no `...jamshid` spread; render sections only with verified data; isDemo false; real site.url.
- [P1] Positioning mismatch: general painless dentist vs implant-only services/calculator/protocol.
- [P1] Mobile booking CTA lands on ~650px portrait; form a screen further; ~8 competing actions at close.
- [P1] Booking API has no rate limit / honeypot: anyone can flood the doctor's Telegram.
- [P2] "30 daqiqa ichida" shown when closed; no first-visit price/next steps at submit.
- [P2] Cases: stock open-mouth photo, filters with 1 case each.
- [P2] SEO: no robots/sitemap, RU not indexable, lang/title stay uz.
- [P3] Contrast: placeholders 3.66:1, paper/70 on accent ~4.2:1, inactive protocol steps ~2.9:1; FAQ line length ~94ch; RU tile overflow at 375px; 7 font preloads.
Fixed during review: footer mailto:undefined (regression from email made optional).
