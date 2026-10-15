"use client";

import { Clock3, Cpu, HeartPulse } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSite } from "@/context/SiteContext";
import { useScrollVar } from "@/lib/useScrollVar";
import { CALLOUTS, ImplantDrawing, applyDrawing } from "@/components/ui/ImplantDrawing";

const pad = (n: number) => String(n).padStart(2, "0");

// Below lg the blueprint stage is sticky ABOVE the step texts and covers roughly the top 55-58% of the viewport,
// so the "reading line" sits just below it, and step content is top-aligned so its title is what crosses that line.
const LG = "(min-width: 1024px)";
const subscribeLg = (cb: () => void) => {
  const mq = window.matchMedia(LG);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useIsLg = () =>
  useSyncExternalStore(
    subscribeLg,
    () => window.matchMedia(LG).matches,
    () => true,
  );

function ComfortPips({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex gap-1.5" role="img" aria-label={`${label}: ${value}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`h-1.5 w-6 rounded-full ${i < value ? "bg-bronze-light" : "bg-alabaster/15"}`} />
      ))}
    </span>
  );
}

export function Protocol() {
  const { t } = useSite();
  const steps = t.protocol.steps;
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const isLg = useIsLg();
  // Fraction of the viewport height where the step being read sits (mid-screen on desktop, below the sticky stage on phones).
  const readLine = isLg ? 0.5 : 0.66;
  const readLineRef = useRef(readLine);
  useEffect(() => {
    readLineRef.current = readLine;
  }, [readLine]);

  // Continuous drawing progress 0..5: how far the reading line (+5% of the viewport) has travelled through the steps,
  // led by 0.4 of a step so the step being read is essentially complete while it sits on the reading line.
  useScrollVar(
    stepsRef,
    "--pp",
    (rect, vh) => Math.min(5, Math.max(0, ((vh * (readLineRef.current + 0.05) - rect.top) / rect.height) * 5 + 0.4)),
    (p) => applyDrawing(stageRef.current, p),
  );

  // The active step follows whichever step text crosses the reading line.
  useEffect(() => {
    const items = stepsRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: `-${Math.round((readLine - 0.05) * 100)}% 0px -${Math.round((1 - readLine) * 100)}% 0px` },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [readLine]);

  // Reduced motion: no scrubbing, the drawing jumps to the end of the active step.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) applyDrawing(stageRef.current, active + 1);
  }, [active]);

  const goTo = (i: number) => {
    const el = document.getElementById(`protocol-step-${i}`);
    if (!el) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (isLg) {
      el.scrollIntoView({ behavior, block: "center" });
    } else {
      // Phones: park the step's top just under the sticky stage, inside the reading band.
      const top = window.scrollY + el.getBoundingClientRect().top - window.innerHeight * (readLine - 0.03);
      window.scrollTo({ top, behavior });
    }
  };

  const step = steps[active];
  const activeCallouts = CALLOUTS.filter((c) => c.step === active).map((c) => t.protocol.callouts[c.key]);

  return (
    <section id="protocol" aria-labelledby="protocol-title" className="relative bg-obsidian py-20 text-alabaster md:py-28">
      <div className="shell">
        <div className="max-w-[640px]">
          <h2 id="protocol-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[46px]">
            {t.protocol.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-alabaster/70">{t.protocol.sub}</p>
        </div>

        <div className="mt-10 grid lg:mt-14 lg:grid-cols-12 lg:gap-10">
          {/* Sticky blueprint stage */}
          <div className="sticky top-[68px] z-[3] -mx-4 bg-obsidian px-4 pt-2 pb-3 lg:top-24 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:mx-0 lg:h-[calc(100dvh-8rem)] lg:self-start lg:p-0">
            <div ref={stageRef} className="blueprint flex h-[46vh] min-h-[300px] flex-col overflow-hidden rounded-[16px] border border-obsidian-line lg:h-full">
              <div className="flex items-center justify-between gap-3 border-b border-obsidian-line px-4 py-2.5 sm:px-5">
                <p className="font-mono text-[12px] tracking-[0.1em] text-bronze-light">
                  {pad(active + 1)} / {t.protocol.stepOf}
                </p>
                <div className="flex gap-1" role="group" aria-label={t.protocol.title}>
                  {steps.map((s, i) => (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`${pad(i + 1)}. ${s.title}`}
                      aria-current={i === active ? "step" : undefined}
                      className={`grid h-9 w-9 place-items-center rounded-full font-mono text-[12px] transition-colors lg:h-10 lg:w-10 ${
                        i === active ? "bg-bronze-light text-obsidian" : i < active ? "text-bronze-light hover:bg-obsidian-line" : "text-alabaster/60 hover:bg-obsidian-line"
                      }`}
                    >
                      {pad(i + 1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative min-h-0 flex-1 px-3 py-2 lg:px-8 lg:py-5">
                <ImplantDrawing title={t.protocol.drawingLabel} />
              </div>

              {/* Desktop legend: a record that fills in as the drawing does */}
              <ol className="hidden grid-cols-2 gap-x-6 gap-y-1.5 border-t border-obsidian-line px-6 py-4 lg:grid xl:grid-cols-3">
                {CALLOUTS.map((c) => (
                  <li
                    key={c.n}
                    data-mode="fade"
                    data-a={c.a}
                    data-b={c.b}
                    className={`flex items-baseline gap-2 text-[12.5px] leading-snug transition-colors ${c.step === active ? "text-alabaster" : "text-alabaster/60"}`}
                  >
                    <span className="font-mono text-[12px] text-bronze-light">{c.n}</span>
                    {t.protocol.callouts[c.key]}
                  </li>
                ))}
              </ol>

              {/* Phone caption: just this step's parts */}
              <p className="border-t border-obsidian-line px-4 py-2 text-[12.5px] leading-snug text-alabaster/75 lg:hidden">{activeCallouts.join(" · ")}</p>
            </div>
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-full h-8 bg-gradient-to-b from-obsidian to-transparent lg:hidden" />
          </div>

          {/* Step texts */}
          <ol ref={stepsRef} className="relative lg:col-span-5 lg:col-start-1 lg:row-start-1">
            {steps.map((s, i) => {
              const isActive = i === active;
              return (
                <li
                  key={s.title}
                  id={`protocol-step-${i}`}
                  data-step={i}
                  className={`flex min-h-[72vh] flex-col justify-start pt-4 pb-10 transition-opacity lg:justify-center lg:py-10 duration-500 lg:min-h-[80vh] ${isActive ? "opacity-100" : "opacity-45"}`}
                >
                  <p className="font-mono text-[12px] tracking-[0.12em] text-bronze-light">
                    {pad(i + 1)} / {t.protocol.stepOf}
                  </p>
                  <h3 className="mt-3 font-display text-[28px] leading-[1.15] tracking-[-0.015em] text-balance sm:text-[34px]">{s.title}</h3>
                  <p className="mt-2 text-[15px] text-bronze-light/90">{s.short}</p>
                  <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-alabaster/75">{s.body}</p>

                  <dl className="mt-7 grid gap-5 border-t border-obsidian-line pt-6 sm:grid-cols-3 sm:gap-4">
                    <div>
                      <dt className="flex items-center gap-2 text-[12.5px] text-alabaster/60">
                        <Clock3 size={14} strokeWidth={1.6} /> {t.protocol.duration}
                      </dt>
                      <dd className="mt-1.5 font-mono text-[15px]">{s.duration}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-[12.5px] text-alabaster/60">
                        <Cpu size={14} strokeWidth={1.6} /> {t.protocol.equipment}
                      </dt>
                      <dd className="mt-1.5">
                        <ul className="space-y-0.5 text-[14px] text-alabaster/85">
                          {s.equipment.map((e) => (
                            <li key={e}>{e}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-[12.5px] text-alabaster/60">
                        <HeartPulse size={14} strokeWidth={1.6} /> {t.protocol.comfort}
                      </dt>
                      <dd className="mt-2.5">
                        <ComfortPips value={s.comfort} label={t.protocol.comfort} />
                        <span className="mt-2 block text-[14px] text-alabaster/85">{s.comfortText}</span>
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Screen-reader summary of the current step for the sticky stage */}
        <p className="sr-only" aria-live="polite">
          {pad(active + 1)}. {step.title}. {step.duration}.
        </p>
      </div>
    </section>
  );
}
