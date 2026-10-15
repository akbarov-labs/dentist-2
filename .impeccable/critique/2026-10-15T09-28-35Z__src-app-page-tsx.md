---
target: the landing page
total_score: 28
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:/home/algo/Documents/projects/dentist-with-skills/src/app/page.tsx"
target_fingerprint: "sha256:3b1920c9a3dbef217ec297cd15d2111b916c856eaee98ea50697a2dc80b8e133"
target_path: /home/algo/Documents/projects/dentist-with-skills/src/app/page.tsx
timestamp: 2026-10-15T09-28-35Z
slug: src-app-page-tsx
closed: true
---
# Critique: src/app/page.tsx (solo dental specialist landing, Tashkent)

Method: dual-agent (A: design review sub-agent, B: detector + browser sub-agent)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Mobile: tapping a Protocol step updates a panel ~600px below, off-screen |
| 2 | Match System / Real World | 3 | "Taxminiy investitsiya", "Estetik fiksatsiya" read as sales jargon to patients |
| 3 | User Control and Freedom | 3 | Demo pill always on screen, not dismissible |
| 4 | Consistency and Standards | 2 | Service CTAs in 3 styles; same thin-border + soft-shadow card on 13 surfaces |
| 5 | Error Prevention | 3 | +998 mask, CT question, "taxminiy" labelling all solid |
| 6 | Recognition Rather Than Recall | 3 | Estimate only reaches the form via one specific button |
| 7 | Flexibility and Efficiency | 3 | Calculator -> Telegram prefill is a real shortcut |
| 8 | Aesthetic and Minimalist Design | 3 | Calm, but 19 tiny mono labels and repeated two-column card skeleton |
| 9 | Error Recovery | 3 | Inline errors + Telegram fallback in error copy |
| 10 | Help and Documentation | 2 | FAQ thin: no visit-1, anaesthesia type, brand differences |
| **Total** | | **28/40** | **Good, not yet flagship** |

## Design Specificity Verdict
Details are authored (ID card + licence + signature, 4-patients/day, chain-vs-solo, comfort mode, Telegram bubbles, Yandex Go/2GIS). Skeleton is generic: five light sections share H2-left + subline + content/white-card split. Bracketed mono eyebrow and mono stat row are category tropes. Detector: CLI 1 advisory (hud-grid); overlay 46 elements / 59 findings, about half false positives (crossfade images, chat-UI nesting, kicker tracking, teal read as cyan).

## Priority Issues
1. [P0] Before/after is simulated: same photo with sepia filter, blurred by default. Trust/regulatory risk; pitched doctor will spot it. Fix: real beforeImage/afterImage per case; honest state until provided. (harden/clarify)
2. [P1] Price reassurance buried (12px muted "fixed in writing" line); booking copy "yoki uning shaxsiy koordinatori" contradicts the one-doctor promise; no installment figure at the price. (clarify/typeset)
3. [P1] Protocol on mobile: tab list stacks above panel; content changes off-screen. Fix: inline panel per step below lg, or scroll-driven sequence. (adapt)
4. [P2] Monotonous section rhythm and weak ending: footer + demo disclaimer is the last thing seen; no closing signature moment. (layout/delight)
5. [P2] Legibility and touch: 10-11px mono labels (licence 10px), 4 contrast failures (protocol step numbers 3.62, Telegram label 3.55, timestamps 2.46, footer demo note 3.76), 23 real sub-44px targets (service text links 24px, footer links 17-22px, comfort switch 28px tall). (audit/polish)

## Persona Red Flags
- Anxious first-time implant patient: slider shows only blur; voice-note card has mic + 0:38 but cannot play (false affordance); "investitsiya" sounds salesy.
- Older Russian-speaking patient on phone: portrait/ID card three screens down; 10-11px labels; ~2000px of calculator before the price.
- The doctor being pitched: fake before/after, cloned Google/Yandex styling without links, "99.4% rasmiy tasdiqlangan" claim he must back up, "koordinatori" line, demo pill visible.

## Minor Observations
- Hero ID card covers chest/arms of portrait; service images mismatch labels (veneers card shows X-ray scene).
- Decorative glows (hero 720px, protocol 640px), image hover-scale, repeating radial rings, hud-grid: decorative noise.
- Mono used for display stats reads dashboard, not editorial.

## Questions to Consider
- Why does the page never show his day, hands, room, instead of stock CT screens?
- Should proof (credentials, reviews) come before price for an anxious premium patient?
- What closes the page as strongly as the Protocol peak opens its middle?
