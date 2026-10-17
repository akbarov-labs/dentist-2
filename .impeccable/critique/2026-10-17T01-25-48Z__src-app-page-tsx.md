---
target: whole dentist landing page
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
target_identity: "file:/Users/its_akbarov/dev/sites/dentist-2/src/app/page.tsx"
target_fingerprint: "sha256:3b1920c9a3dbef217ec297cd15d2111b916c856eaee98ea50697a2dc80b8e133"
target_path: /Users/its_akbarov/dev/sites/dentist-2/src/app/page.tsx
timestamp: 2026-10-17T01-25-48Z
slug: src-app-page-tsx
---
# Critique: dentist landing (src/app/page.tsx), 2026-10-17 post-fix run
Method: dual-agent (A: design review, B: detector + browser). Demo placeholder content is intentional (owner decision) and not ranked.

Heuristics 24/32 (7, 10 n/a). Audit 15/20.
|1 Status|3|mobile calculator price hidden behind mobile bar while answering|
|2 Real world|3|residual jargon: Abatment, 3D KT kesimi, osteointegratsiya, "Tanlangan konfiguratsiya"|
|3 Control|3|Esc/menu/modals fine; prefill removable|
|4 Consistency|3|mixed service CTA styles; calc buttons re-implement primary with off-token teal shadow|
|5 Error prevention|3|implant card 7.9 mln vs default calc 8.35 mln (CT added)|
|6 Recognition|3|estimate carried into form|
|7|n/a|landing|
|8 Minimalism|3|manifesto/stats/credentials repeated in intro modal; page ~17.7k px mobile|
|9 Recovery|3|send-failure says "write in Telegram" without a link|
|10|n/a|landing|

Detector: codex-grid-background x1 (FP, blueprint); low-contrast 16 (FP scroll-state: inactive protocol steps at opacity-60, ~3.2-4.1:1; active passes); nested-cards x1 (FP chat bubble); overused-font Geist 100% (real signal).

Priority issues:
- [P1] Page order serves an implant surgeon: first filling price ~7.5 screens down (desktop), 4-screen implant Protocol before Services. Move Services+Calculator up; turn Protocol into a short "painless visit" story or an implant deep-dive.
- [P2] No fast path for acute pain; hero second CTA "1 daqiqalik tanishuv" opens a text modal that repeats page content.
- [P2] Mobile calculator gives no visible feedback (result card below options, behind mobile bar).
- [P2] Implant-surgeon residue: manifesto paragraph 2, protocol callouts, Straumann material note for fillings, procedure-time label/value mismatch.
- [P3] Header: 6 links + 3 controls; nav "Yozilish" duplicates CTA; open status only >=1440px.
Minor: inactive protocol steps ~3.2-3.9:1; services CTAs all go to calculator; hard-coded case filters (Cases.tsx:13); case filter chips overflow on mobile without cue; footer demo note wording.
