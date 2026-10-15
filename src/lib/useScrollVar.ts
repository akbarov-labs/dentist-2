"use client";

import { useEffect, type RefObject } from "react";

/**
 * Writes a scroll-derived number into a CSS custom property on `ref`, once per animation frame,
 * only while the element is near the viewport. React never re-renders on scroll.
 * `compute` receives the element's bounding rect and the viewport height and returns the value.
 * Under prefers-reduced-motion nothing is attached and the property stays unset (static layout).
 */
export function useScrollVar(
  ref: RefObject<HTMLElement | null>,
  name: string,
  compute: (rect: DOMRect, vh: number) => number,
  onFrame?: (value: number) => void,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    let active = false;
    let last = Number.NaN;

    const update = () => {
      frame = 0;
      const value = compute(el.getBoundingClientRect(), window.innerHeight);
      if (Math.abs(value - last) < 0.0005) return;
      last = value;
      el.style.setProperty(name, value.toFixed(4));
      onFrame?.(value);
    };
    const schedule = () => {
      if (active && !frame) frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) schedule();
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
    // compute/onFrame are expected to be stable (module-level or memoised by the caller)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, name]);
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
