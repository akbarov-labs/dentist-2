import type { Dict } from "@/i18n/dictionary";

/**
 * Signature move: a technical drawing of an implant that builds itself as the visitor scrolls
 * through the five protocol steps. Every element carries a window in step units (0 to 5):
 *   data-a / data-b    when it draws in (stroke-dashoffset for data-mode="draw", opacity for "fade")
 *   data-oa / data-ob  optional window in which it fades back out (the guide is removed after surgery)
 * `applyDrawing` writes those values imperatively, once per animation frame, outside React.
 */

export type CalloutKey = keyof Dict["protocol"]["callouts"];

export interface Callout {
  n: number;
  key: CalloutKey;
  step: number;
  a: number;
  b: number;
  oa?: number;
  ob?: number;
  /** balloon centre and leader anchor, in viewBox units */
  bx: number;
  by: number;
  ax: number;
  ay: number;
}

export const CALLOUTS: Callout[] = [
  { n: 1, key: "gum", step: 0, a: 0.25, b: 0.5, bx: 22, by: 182, ax: 40, ay: 210 },
  { n: 2, key: "bone", step: 0, a: 0.3, b: 0.55, bx: 24, by: 462, ax: 48, ay: 448 },
  { n: 3, key: "scan", step: 0, a: 0.55, b: 0.8, bx: 378, by: 292, ax: 250, ay: 310 },
  { n: 4, key: "height", step: 0, a: 0.75, b: 1, bx: 378, by: 348, ax: 252, ay: 348 },
  { n: 5, key: "plan", step: 1, a: 1.35, b: 1.7, bx: 262, by: 66, ax: 224, ay: 128 },
  { n: 6, key: "guide", step: 2, a: 2.05, b: 2.3, oa: 2.9, ob: 3.1, bx: 378, by: 116, ax: 352, ay: 116 },
  { n: 7, key: "axis", step: 2, a: 2.15, b: 2.4, bx: 236, by: 480, ax: 200, ay: 470 },
  { n: 8, key: "implant", step: 2, a: 2.7, b: 2.95, bx: 156, by: 330, ax: 186, ay: 330 },
  { n: 9, key: "abutment", step: 3, a: 3.15, b: 3.4, bx: 158, by: 234, ax: 192, ay: 232 },
  { n: 10, key: "crown", step: 3, a: 3.5, b: 3.8, bx: 162, by: 84, ax: 182, ay: 126 },
  { n: 11, key: "zoom", step: 3, a: 3.7, b: 3.95, bx: 288, by: 22, ax: 310, ay: 42 },
  { n: 12, key: "checks", step: 4, a: 4.3, b: 4.6, bx: 36, by: 506, ax: 60, ay: 506 },
  { n: 13, key: "warranty", step: 4, a: 4.7, b: 4.95, bx: 118, by: 28, ax: 94, ay: 44 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface Windowed {
  el: SVGElement | HTMLElement;
  a: number;
  b: number;
  oa?: number;
  ob?: number;
  mode?: string;
}

// Parsed windows per stage root, so a scroll frame does no DOM query or dataset parsing.
const windowCache = new WeakMap<HTMLElement, Windowed[]>();

function windowsOf(root: HTMLElement): Windowed[] {
  const cached = windowCache.get(root);
  if (cached && cached.every((w) => w.el.isConnected)) return cached;
  const list = Array.from(root.querySelectorAll<SVGElement | HTMLElement>("[data-a]"), (el) => {
    const { a, b, oa, ob, mode } = el.dataset;
    return { el, a: Number(a), b: Number(b), oa: oa ? Number(oa) : undefined, ob: ob ? Number(ob) : undefined, mode };
  });
  windowCache.set(root, list);
  return list;
}

/** Write the drawing state for progress `p` (0 to 5) into every windowed element inside `root`. */
export function applyDrawing(root: HTMLElement | null, p: number) {
  if (!root) return;
  windowsOf(root).forEach(({ el, a, b, oa, ob, mode }) => {
    const tin = clamp01((p - a) / (b - a));
    const out = oa !== undefined && ob !== undefined ? clamp01((p - oa) / (ob - oa)) : 0;
    if (mode === "draw") {
      el.style.strokeDashoffset = String(1 - tin);
      el.style.opacity = out ? String(1 - out) : "";
    } else {
      el.style.opacity = String(tin * (1 - out));
    }
  });
}

const INK = "rgb(247 245 240 / 0.78)";
const BRONZE = "#c9ad83";
const GROUND = "#1a1e22";

const TOOTH =
  "M58 212 C 50 172 54 134 76 120 C 94 108 124 110 138 124 C 152 140 150 180 142 212 L 136 212 C 130 272 120 336 114 390 C 112 402 100 404 94 392 C 80 350 70 280 66 212 Z";
const CROWN = "M162 214 C 154 174 158 134 180 122 C 194 114 210 114 222 122 C 244 136 246 176 238 214";
const IMPLANT = "M184 246 L 216 246 L 213 418 C 210 436 190 436 187 418 Z";
const BONE_AREA = "M8 238 C 70 230 140 248 200 246 C 260 248 330 230 392 238 L 392 486 L 8 486 Z";

/** Windowed draw/fade helpers so the markup below stays readable. */
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

export function ImplantDrawing({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 400 520" role="img" aria-label={title} className="h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <pattern id="bone-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="rgb(201 173 131 / 0.18)" strokeWidth="1" />
        </pattern>
        <clipPath id="bone-clip">
          <path d={BONE_AREA} />
        </clipPath>
      </defs>

      {/* 01: anatomy and scan */}
      <rect x="0" y="0" width="400" height="520" fill="url(#bone-hatch)" clipPath="url(#bone-clip)" {...fade(0.35, 0.7)} />
      <path d={TOOTH} fill={GROUND} stroke={INK} strokeWidth="1.4" {...draw(0, 0.45)} />
      <g transform="translate(400 0) scale(-1 1)">
        <path d={TOOTH} fill={GROUND} stroke={INK} strokeWidth="1.4" {...draw(0.05, 0.5)} />
      </g>
      <path d="M8 214 C 70 204 130 224 200 222 C 270 224 330 204 392 214" stroke="rgb(214 150 140 / 0.75)" strokeWidth="1.4" {...draw(0.05, 0.4)} />
      <path d="M8 238 C 70 230 140 248 200 246 C 260 248 330 230 392 238" stroke={INK} strokeWidth="1.4" {...draw(0.1, 0.5)} />
      <path d="M8 238 L 8 486 L 392 486 L 392 238" stroke="rgb(247 245 240 / 0.35)" strokeWidth="1" {...draw(0.15, 0.55)} />
      {[270, 310, 350, 390, 430].map((y, i) => (
        <line key={y} x1="150" y1={y} x2="250" y2={y} stroke={BRONZE} strokeWidth="1" strokeDasharray="3 4" {...fade(0.3 + i * 0.1, 0.45 + i * 0.1)} />
      ))}
      <path d="M252 250 L 252 446 M246 250 L 258 250 M246 446 L 258 446" stroke={BRONZE} strokeWidth="1.2" {...draw(0.6, 0.95)} />

      {/* 02: virtual wax-up, the planned crown as a ghost */}
      <path d={CROWN} stroke={BRONZE} strokeWidth="1.3" strokeDasharray="4 5" {...fade(1.2, 1.6, { oa: 3.3, ob: 3.6 })} />

      {/* 03: guide, planned axis, implant */}
      <g {...fade(2.0, 2.25, { oa: 2.85, ob: 3.1 })}>
        <path d="M48 104 L 352 104 L 352 128 L 48 128 Z" fill="rgb(15 61 62 / 0.55)" stroke={BRONZE} strokeWidth="1.2" />
        <path d="M186 92 L 214 92 L 214 136 L 186 136 Z" fill={GROUND} stroke={BRONZE} strokeWidth="1.4" />
      </g>
      <line x1="200" y1="80" x2="200" y2="470" stroke={BRONZE} strokeWidth="1" strokeDasharray="6 5" {...fade(2.1, 2.4)} />
      <path d={IMPLANT} fill={GROUND} {...fade(2.3, 2.45)} />
      <path d={IMPLANT} fill="rgb(201 173 131 / 0.16)" {...fade(2.8, 3.05)} />
      <path d={IMPLANT} stroke={BRONZE} strokeWidth="1.6" {...draw(2.35, 2.75)} />
      <path
        d="M184 262 L 216 270 M184 280 L 216 288 M185 298 L 215 306 M185 316 L 215 324 M186 334 L 214 342 M186 352 L 214 360 M187 370 L 213 378 M187 388 L 213 396"
        stroke={BRONZE}
        strokeWidth="1.2"
        {...draw(2.55, 2.95)}
      />

      {/* 04: abutment, final crown, microscope view */}
      <path d="M190 246 L 210 246 L 207 214 L 193 214 Z" fill={GROUND} stroke={INK} strokeWidth="1.3" {...draw(3.05, 3.35)} />
      <path d={`${CROWN} Z`} fill="rgb(247 245 240 / 0.12)" {...fade(3.65, 4)} />
      <path d={CROWN} stroke="rgb(247 245 240 / 0.95)" strokeWidth="1.8" {...draw(3.3, 3.75)} />
      <circle cx="334" cy="64" r="30" stroke={BRONZE} strokeWidth="1.2" {...draw(3.6, 3.85)} />
      <path d="M318 88 L 240 206" stroke={BRONZE} strokeWidth="0.9" strokeDasharray="2 4" {...fade(3.7, 3.9)} />
      <text x="334" y="69" textAnchor="middle" fill={BRONZE} style={{ fontFamily: "var(--font-mono)", fontSize: 15 }} {...fade(3.75, 3.95)}>
        25×
      </text>

      {/* 05: follow-up line and warranty seal */}
      <path d="M60 506 L 340 506" stroke={INK} strokeWidth="1.2" {...draw(4.05, 4.45)} />
      {[120, 200, 280].map((x, i) => (
        <circle key={x} cx={x} cy="506" r="4.5" fill={BRONZE} {...fade(4.3 + i * 0.1, 4.4 + i * 0.1)} />
      ))}
      <circle cx="66" cy="60" r="30" stroke={BRONZE} strokeWidth="1.3" {...draw(4.45, 4.75)} />
      <circle cx="66" cy="60" r="24" stroke={BRONZE} strokeWidth="0.8" strokeDasharray="1 3" {...fade(4.6, 4.8)} />
      <path d="M53 61 L 62 70 L 80 50" stroke={BRONZE} strokeWidth="2" {...draw(4.7, 4.95)} />

      {/* Numbered balloons */}
      {CALLOUTS.map((c) => (
        <g key={c.n} {...fade(c.a, c.b, c.oa !== undefined ? { oa: c.oa, ob: c.ob! } : {})}>
          <line x1={c.ax} y1={c.ay} x2={c.bx} y2={c.by} stroke="rgb(201 173 131 / 0.6)" strokeWidth="0.8" />
          <circle cx={c.ax} cy={c.ay} r="2" fill={BRONZE} />
          <circle cx={c.bx} cy={c.by} r="10.5" fill={GROUND} stroke={BRONZE} strokeWidth="1" />
          <text x={c.bx} y={c.by + 3.6} textAnchor="middle" fill="#f7f5f0" style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}>
            {c.n}
          </text>
        </g>
      ))}
    </svg>
  );
}
