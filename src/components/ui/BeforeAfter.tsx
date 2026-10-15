"use client";

import { ChevronsLeftRight, EyeOff } from "lucide-react";
import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { SafeImage } from "@/components/ui/SafeImage";

interface BeforeAfterProps {
  /** Real, consented photos of the same patient. */
  before: string;
  after: string;
  focus: string;
  alt: string;
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
  comfort: boolean;
  comfortHint: string;
}

/**
 * Drag / touch / keyboard comparison slider.
 * The split position lives in a CSS variable written straight to the DOM, so dragging never re-renders React.
 */
export function BeforeAfter({ before, after, focus, alt, beforeLabel, afterLabel, sliderLabel, comfort, comfortHint }: BeforeAfterProps) {
  const frame = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const pos = useRef(50);
  const dragging = useRef(false);
  const [revealed, setRevealed] = useState(false);

  // Turning comfort mode back on re-blurs the "before" photo.
  const [seenComfort, setSeenComfort] = useState(comfort);
  if (comfort !== seenComfort) {
    setSeenComfort(comfort);
    if (comfort) setRevealed(false);
  }

  const apply = useCallback((value: number) => {
    const v = Math.min(100, Math.max(0, value));
    pos.current = v;
    frame.current?.style.setProperty("--pos", `${v}%`);
    handle.current?.setAttribute("aria-valuenow", String(Math.round(v)));
  }, []);

  const fromPointer = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    apply(((clientX - rect.left) / rect.width) * 100);
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    fromPointer(e.clientX);
    setRevealed(true);
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
    setRevealed(true);
  };

  const blurred = comfort && !revealed;

  return (
    <div
      ref={frame}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="relative aspect-[4/3] cursor-ew-resize touch-pan-y overflow-hidden rounded-[16px] bg-stone select-none"
      style={{ "--pos": "50%" } as CSSProperties}
    >
      {/* AFTER */}
      <SafeImage src={after} alt={`${alt}: ${afterLabel}`} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" style={{ objectPosition: focus }} draggable={false} />

      {/* BEFORE, clipped to the left of the handle */}
      <div className="absolute inset-0" style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}>
        <SafeImage
          src={before}
          alt={`${alt}: ${beforeLabel}`}
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          draggable={false}
          className="object-cover transition-[filter] duration-700"
          style={{
            objectPosition: focus,
            filter: blurred ? "blur(18px)" : undefined,
          }}
        />
      </div>

      {blurred ? (
        <p className="glass pointer-events-none absolute bottom-4 left-1/2 inline-flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full px-3.5 py-2 text-[12px] leading-snug text-ink">
          <EyeOff size={14} strokeWidth={1.7} className="shrink-0" /> {comfortHint}
        </p>
      ) : null}

      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-obsidian/70 px-3 py-1.5 font-mono text-[12px] tracking-[0.1em] text-alabaster backdrop-blur">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-alabaster/85 px-3 py-1.5 font-mono text-[12px] tracking-[0.1em] text-emerald backdrop-blur">
        {afterLabel}
      </span>

      {/* Handle */}
      <div className="pointer-events-none absolute inset-y-0 left-[var(--pos)] w-px -translate-x-1/2 bg-alabaster shadow-[0_0_0_1px_rgb(18_21_24/0.08)]" />
      <div
        ref={handle}
        role="slider"
        tabIndex={0}
        aria-label={sliderLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        onKeyDown={onKey}
        className="absolute top-1/2 left-[var(--pos)] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-alabaster text-emerald shadow-[var(--shadow-lift)] focus-visible:outline-2"
      >
        <ChevronsLeftRight size={20} strokeWidth={1.6} />
      </div>
    </div>
  );
}
