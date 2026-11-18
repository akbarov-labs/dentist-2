---
target: whole dentist landing page
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/its_akbarov/dev/sites/dentist-2/src/app/page.tsx"
target_fingerprint: "sha256:3b1920c9a3dbef217ec297cd15d2111b916c856eaee98ea50697a2dc80b8e133"
target_path: /Users/its_akbarov/dev/sites/dentist-2/src/app/page.tsx
timestamp: 2026-10-17T06-34-18Z
slug: src-app-page-tsx
---
# Critique: dentist landing (src/app/page.tsx), 2026-10-17, commit 61f092b (painless-visit protocol)
Method: dual-agent (A: design review, B: detector + browser). Demo placeholder content intentional, not ranked.

Heuristics 24/32 (7, 10 n/a). Audit 15/20.
|1 Status|3|desktop protocol step pills slide under header at step 5|
|2 Real world|3|"3D KT", "Kompyuterli sekin oqim", material tiers for a cleaning|
|3 Control|3|prefill removable, Esc everywhere|
|4 Consistency|3|4 Telegram entry points with different prefills; mixed service CTA styles|
|5 Error prevention|3|CT question only when relevant; honeypot|
|6 Recognition|3|4-item nav|
|7|n/a|landing|
|8 Minimalism|3|10 sections, overlapping trust sections|
|9 Recovery|3|Telegram fallback drops typed name/phone|
|10|n/a|landing|

Detector: grid-background x1 (FP); low-contrast 16 (scroll-state: inactive protocol steps 3.2-4.2:1, real but low); nested-cards x1 (FP chat bubble); overused-font Geist (intentional).

Priority issues:
- [P1] "Tishim og'riyapti" path weak on phones: hero urgent CTA below fold (portrait first), bar Telegram opens blank chat, form has no urgency option.
- [P1] Template structure vs positioning: hard-coded implant case filters (Cases.tsx:13), material step for every treatment, clinical open-mouth case imagery.
- [P2] Booking buried (~12-17 screens); reviews late; no CTA after the protocol peak.
- [P2] Featured service photo shows another man (xray-review.jpg); no first-visit price near the form.
- [P3] Booking close: form + concierge card + phone + 4 map chips compete.
Strengths: VisitDrawing protocol (raised-hand step), calculator->booking handoff, careful mobile plumbing.
