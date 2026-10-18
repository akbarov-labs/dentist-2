"use client";

import { ChevronsLeftRight } from "lucide-react";
import { useCallback, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { SafeImage } from "@/components/ui/SafeImage";

interface BeforeAfterProps {
  /** Real, consented photos of the same patient, framed alike. */
  before: string;
  after: string;
  focus: string;
  alt: string;
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
  /** Spoken value, e.g. "{before} {b}%, {after} {a}%". */
  valueText: string;
  /** Share of the frame showing the "before" photo on load: 0, so the result is what the visitor sees first. */
  start?: number;
}

const START = 0;

/**
 * Drag / touch / keyboard comparison slider. It opens on the result; dragging right reveals where the patient began.
 * The split position lives in a CSS variable written straight to the DOM, so dragging never re-renders React.
 * Each label sits inside its own photo layer, so it is only visible while that photo is.
 */
export function BeforeAfter({ before, after, focus, alt, beforeLabel, afterLabel, sliderLabel, valueText, start = START }: BeforeAfterProps) {
  const frame = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const pos = useRef(start);
  const dragging = useRef(false);

  const spoken = useCallback(
    (v: number) =>
      valueText
        .replace("{before}", beforeLabel)
        .replace("{after}", afterLabel)
        .replace("{b}", String(Math.round(v)))
        .replace("{a}", String(100 - Math.round(v))),
    [valueText, beforeLabel, afterLabel],
  );

  const apply = useCallback(
    (value: number) => {
      const v = Math.min(100, Math.max(0, value));
      pos.current = v;
      frame.current?.style.setProperty("--pos", `${v}%`);
      handle.current?.setAttribute("aria-valuenow", String(Math.round(v)));
      handle.current?.setAttribute("aria-valuetext", spoken(v));
    },
    [spoken],
  );

  const fromPointer = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    apply(((clientX - rect.left) / rect.width) * 100);
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    // Jump to the press first; capture can be refused (e.g. the pointer already ended) and must not cancel the jump.
    fromPointer(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* the drag still follows pointermove on the frame */
    }
    handle.current?.focus({ preventScroll: true });
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) fromPointer(e.clientX);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 4;
    const map: Record<string, number> = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step };
    if (e.key in map) apply(pos.current + map[e.key]);
    else if (e.key === "Home") apply(0);
    else if (e.key === "End") apply(100);
    else return;
    e.preventDefault();
  };

  const chip = "pointer-events-none absolute top-4 rounded-full px-3 py-1 text-[13px] font-medium";

  return (
    <div
      ref={frame}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="relative aspect-[4/3] cursor-ew-resize touch-pan-y overflow-hidden rounded-[16px] bg-stone select-none"
      style={{ "--pos": `${start}%` } as CSSProperties}
    >
      {/* AFTER, with its label: covered as the "before" layer widens */}
      <SafeImage
        src={after}
        alt={`${alt}: ${afterLabel}`}
        fill
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="object-cover"
        style={{ objectPosition: focus }}
        draggable={false}
        fallbackLabel={afterLabel}
      />
      <span className={`${chip} right-4 bg-paper/90 text-accent`}>{afterLabel}</span>

      {/* BEFORE, with its label, clipped to the left of the handle */}
      <div className="absolute inset-0" style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}>
        <SafeImage
          src={before}
          alt={`${alt}: ${beforeLabel}`}
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          draggable={false}
          className="object-cover"
          style={{ objectPosition: focus }}
          fallbackLabel={beforeLabel}
        />
        <span className={`${chip} left-4 bg-night/75 text-paper`}>{beforeLabel}</span>
      </div>

      {/* Divider and handle; the grip never leaves the frame at either end */}
      <div className="pointer-events-none absolute inset-y-0 left-[var(--pos)] w-px -translate-x-1/2 bg-paper shadow-[0_0_0_1px_rgb(18_21_24/0.08)]" />
      <div
        ref={handle}
        role="slider"
        tabIndex={0}
        aria-label={sliderLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={start}
        aria-valuetext={spoken(start)}
        onKeyDown={onKey}
        className="absolute top-1/2 left-[clamp(28px,var(--pos),calc(100%-28px))] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-paper text-accent shadow-[var(--shadow-lift)]"
      >
        <ChevronsLeftRight size={20} strokeWidth={1.6} />
      </div>
    </div>
  );
}
