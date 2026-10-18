import { Hand } from "lucide-react";
import type { Callout } from "@/components/ui/ImplantDrawing";

/**
 * The general dentist's version of the protocol drawing: one molar through a painless visit,
 * built on the same windowed scroll engine as the implant drawing (see `applyDrawing`).
 *   01 exam and X-ray, the caries lesion shows up
 *   02 a written plan and price; the planned filling appears as a ghost
 *   03 gel on the gum, then slow computer-controlled anaesthesia: a numb zone spreads
 *   04 treatment: the lesion is cleaned out and filled; a raised hand means "stop"
 *   05 follow-up checks and the written warranty
 */
export const VISIT_CALLOUTS: Callout[] = [
  { n: 1, key: "tooth", step: 0, a: 0.3, b: 0.55, bx: 40, by: 196, ax: 122, ay: 214 },
  { n: 2, key: "xray", step: 0, a: 0.6, b: 0.85, bx: 360, by: 340, ax: 304, ay: 340 },
  { n: 3, key: "lesion", step: 0, a: 0.85, b: 1, oa: 3.0, ob: 3.25, bx: 104, by: 118, ax: 156, ay: 162 },
  { n: 4, key: "plan", step: 1, a: 1.3, b: 1.6, oa: 2.0, ob: 2.2, bx: 262, by: 64, ax: 288, ay: 64 },
  { n: 5, key: "price", step: 1, a: 1.6, b: 1.9, oa: 2.0, ob: 2.2, bx: 262, by: 124, ax: 288, ay: 124 },
  { n: 6, key: "gel", step: 2, a: 2.1, b: 2.3, bx: 36, by: 232, ax: 84, ay: 254 },
  { n: 7, key: "numb", step: 2, a: 2.4, b: 2.6, bx: 48, by: 330, ax: 108, ay: 294 },
  { n: 8, key: "flow", step: 2, a: 2.6, b: 2.85, oa: 3.0, ob: 3.2, bx: 146, by: 62, ax: 124, ay: 84 },
  { n: 9, key: "filling", step: 3, a: 3.5, b: 3.8, bx: 104, by: 118, ax: 156, ay: 162 },
  { n: 10, key: "hand", step: 3, a: 3.3, b: 3.55, bx: 282, by: 46, ax: 308, ay: 70 },
  { n: 11, key: "checks", step: 4, a: 4.3, b: 4.6, bx: 36, by: 506, ax: 60, ay: 506 },
  { n: 12, key: "warranty", step: 4, a: 4.7, b: 4.95, bx: 118, by: 28, ax: 94, ay: 44 },
];

const INK = "rgb(247 245 240 / 0.78)";
// Palette tokens, so the drawing follows the doctor's own colours on the night section.
const SAGE = "var(--color-accent-light)";
const GROUND = "var(--color-night-2)";
const GUM = "rgb(214 150 140 / 0.75)";
const LESION = "rgb(196 150 108 / 0.6)";

const MOLAR =
  "M128 252 C 118 214 120 170 136 152 C 148 138 166 146 176 140 C 188 132 212 132 224 140 C 234 146 252 138 264 152 C 280 170 282 214 272 252 C 266 300 262 350 252 404 C 248 420 232 420 230 404 C 224 362 214 322 200 300 C 186 322 176 362 170 404 C 168 420 152 420 148 404 C 138 350 134 300 128 252 Z";
const PULP = "M172 230 C 176 212 224 212 228 230 C 226 260 218 300 210 352 M190 352 C 182 300 174 260 172 230";
const LESION_SHAPE = "M150 160 C 152 150 166 146 176 152 C 182 162 178 176 166 178 C 156 178 149 170 150 160 Z";
const FILLING = "M144 158 C 148 146 170 142 184 150 C 192 164 186 184 170 188 C 156 190 142 178 144 158 Z";
const BONE_AREA = "M8 292 C 80 286 120 300 140 300 L 260 300 C 280 300 320 286 392 292 L 392 486 L 8 486 Z";

const draw = (a: number, b: number, extra: Record<string, number> = {}) => ({
  pathLength: 1,
  className: "draw-path",
  "data-mode": "draw",
  "data-a": a,
  "data-b": b,
  ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [`data-${k}`, v])),
});
const fade = (a: number, b: number, extra: Record<string, number> = {}) => ({
  "data-mode": "fade",
  "data-a": a,
  "data-b": b,
  ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [`data-${k}`, v])),
});

export function VisitDrawing({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 400 520" role="img" aria-label={title} className="h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <pattern id="visit-bone-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="rgb(201 173 131 / 0.16)" strokeWidth="1" />
        </pattern>
        <clipPath id="visit-bone-clip">
          <path d={BONE_AREA} />
        </clipPath>
      </defs>

      {/* 01: the tooth, the X-ray, the lesion it reveals */}
      <rect x="0" y="0" width="400" height="520" fill="url(#visit-bone-hatch)" clipPath="url(#visit-bone-clip)" {...fade(0.35, 0.7)} />
      <path d="M8 262 C 60 254 110 246 128 252 M272 252 C 290 246 340 254 392 262" stroke={GUM} strokeWidth="1.4" {...draw(0.05, 0.4)} />
      <path d="M8 292 C 80 286 120 300 140 300 M260 300 C 280 300 320 286 392 292" stroke={INK} strokeWidth="1.2" {...draw(0.1, 0.45)} />
      <path d={MOLAR} fill={GROUND} stroke={INK} strokeWidth="1.5" {...draw(0, 0.5)} />
      <path d={PULP} stroke="rgb(247 245 240 / 0.3)" strokeWidth="1" strokeDasharray="3 4" {...fade(0.4, 0.6)} />
      {[180, 228, 276, 324, 372].map((y, i) => (
        <line key={y} x1="112" y1={y} x2="288" y2={y} stroke={SAGE} strokeWidth="1" strokeDasharray="3 4" {...fade(0.45 + i * 0.07, 0.55 + i * 0.07, { oa: 1.1, ob: 1.3 })} />
      ))}
      <path d="M96 128 L 96 112 L 112 112 M288 112 L 304 112 L 304 128 M304 420 L 304 436 L 288 436 M112 436 L 96 436 L 96 420" stroke={SAGE} strokeWidth="1.3" {...draw(0.55, 0.85, { oa: 1.1, ob: 1.3 })} />
      <path d={LESION_SHAPE} fill={LESION} {...fade(0.7, 0.9, { oa: 3.0, ob: 3.25 })} />

      {/* 02: the written plan and price; the planned filling as a ghost */}
      <g {...fade(1.2, 1.45, { oa: 2.0, ob: 2.2 })}>
        <rect x="290" y="40" width="92" height="110" rx="10" fill={GROUND} stroke={INK} strokeWidth="1.2" />
        <path d="M304 62 L 360 62 M304 78 L 348 78 M304 94 L 364 94" stroke="rgb(247 245 240 / 0.45)" strokeWidth="1.2" />
      </g>
      <path d="M304 124 L 340 124" stroke={SAGE} strokeWidth="2.2" {...draw(1.55, 1.8, { oa: 2.0, ob: 2.2 })} />
      <path d="M350 120 L 356 127 L 368 113" stroke={SAGE} strokeWidth="1.8" {...draw(1.7, 1.9, { oa: 2.0, ob: 2.2 })} />
      <path d={FILLING} stroke={SAGE} strokeWidth="1.2" strokeDasharray="4 4" {...fade(1.35, 1.6, { oa: 3.3, ob: 3.5 })} />

      {/* 03: gel first, then a slow, even anaesthetic; the numb zone spreads from the gum */}
      <path d="M64 258 C 90 252 112 248 126 251 M274 251 C 288 248 310 252 336 258" stroke="rgb(169 197 187 / 0.4)" strokeWidth="7" {...draw(2.0, 2.25)} />
      {[22, 36, 50].map((r, i) => (
        <circle key={r} cx="132" cy="270" r={r} stroke={SAGE} strokeWidth="1" strokeDasharray="2 5" {...fade(2.3 + i * 0.1, 2.45 + i * 0.1, { oa: 4.0, ob: 4.3 })} />
      ))}
      <path d="M92 214 L 124 262" stroke={INK} strokeWidth="1" {...draw(2.35, 2.55, { oa: 2.8, ob: 2.95 })} />
      <g {...fade(2.5, 2.7, { oa: 3.0, ob: 3.2 })}>
        <rect x="20" y="58" width="104" height="52" rx="10" fill={GROUND} stroke="rgb(247 245 240 / 0.35)" strokeWidth="1" />
      </g>
      <path d="M30 86 C 44 74 56 98 70 86 C 84 74 96 98 112 86" stroke={SAGE} strokeWidth="1.5" {...draw(2.55, 2.85, { oa: 3.0, ob: 3.2 })} />

      {/* 04: cleaned and filled; a raised hand stops everything */}
      <path d={FILLING} fill="rgb(169 197 187 / 0.3)" {...fade(3.45, 3.75)} />
      <path d={FILLING} stroke="rgb(247 245 240 / 0.95)" strokeWidth="1.8" {...draw(3.3, 3.7)} />
      <circle cx="334" cy="92" r="32" stroke={SAGE} strokeWidth="1.2" {...draw(3.2, 3.45)} />
      <g {...fade(3.3, 3.55)}>
        <Hand x={316} y={74} width={36} height={36} stroke={SAGE} strokeWidth={1.6} />
      </g>

      {/* 05: follow-up line and warranty seal */}
      <path d="M60 506 L 340 506" stroke={INK} strokeWidth="1.2" {...draw(4.05, 4.45)} />
      {[120, 200, 280].map((x, i) => (
        <circle key={x} cx={x} cy="506" r="4.5" fill={SAGE} {...fade(4.3 + i * 0.1, 4.4 + i * 0.1)} />
      ))}
      <circle cx="66" cy="60" r="30" stroke={SAGE} strokeWidth="1.3" {...draw(4.45, 4.75)} />
      <circle cx="66" cy="60" r="24" stroke={SAGE} strokeWidth="0.8" strokeDasharray="1 3" {...fade(4.6, 4.8)} />
      <path d="M53 61 L 62 70 L 80 50" stroke={SAGE} strokeWidth="2" {...draw(4.7, 4.95)} />

      {/* Numbered balloons */}
      {VISIT_CALLOUTS.map((c) => (
        <g key={c.n} {...fade(c.a, c.b, c.oa !== undefined ? { oa: c.oa, ob: c.ob! } : {})}>
          <line x1={c.ax} y1={c.ay} x2={c.bx} y2={c.by} stroke="rgb(201 173 131 / 0.6)" strokeWidth="0.8" />
          <circle cx={c.ax} cy={c.ay} r="2" fill={SAGE} />
          <circle cx={c.bx} cy={c.by} r="10.5" fill={GROUND} stroke={SAGE} strokeWidth="1" />
          <text x={c.bx} y={c.by + 3.6} textAnchor="middle" fill="#f5f6f3" style={{ fontFamily: "var(--font-sans)", fontSize: 10.5 }}>
            {c.n}
          </text>
        </g>
      ))}
    </svg>
  );
}
