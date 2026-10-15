"use client";

import { Clock3, Cpu, HeartPulse } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { useSite } from "@/context/SiteContext";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";

const STEP_IMAGES = ["/images/ct-scan.jpg", "/images/smile-design.jpg", "/images/implant-model.jpg", "/images/microscope.jpg", "/images/cabinet.jpg"];

const pad = (n: number) => String(n).padStart(2, "0");

export function Protocol() {
  const { t, lang } = useSite();
  const steps = t.protocol.steps;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = steps[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (active + keys[e.key] + steps.length) % steps.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = steps.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="protocol" aria-labelledby="protocol-title" className="relative overflow-hidden bg-obsidian py-20 text-alabaster md:py-28">
      <div aria-hidden className="pointer-events-none absolute -top-60 -left-40 h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgb(22_80_79/0.35),transparent)]" />
      <div className="shell relative">
        <Reveal className="max-w-[640px]">
          <h2 id="protocol-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[46px]">
            {t.protocol.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-alabaster/65">{t.protocol.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Steps */}
          <Reveal className="lg:col-span-5">
            <div role="tablist" aria-orientation="vertical" aria-label={t.protocol.title} className="flex flex-col gap-2">
              {steps.map((s, i) => {
                const selected = i === active;
                return (
                  <button
                    key={s.title}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    id={`protocol-tab-${i}`}
                    aria-selected={selected}
                    aria-controls="protocol-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={onKey}
                    className={`group relative flex w-full items-start gap-4 overflow-hidden rounded-[16px] border px-5 py-4 text-left transition duration-300 ${
                      selected
                        ? "border-bronze/45 bg-obsidian-2"
                        : "border-transparent hover:border-obsidian-line hover:bg-obsidian-2/60"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute top-0 left-0 h-full w-[2px] origin-top bg-bronze transition-transform duration-500 ${selected ? "scale-y-100" : "scale-y-0"}`}
                    />
                    <span className={`pt-1 font-mono text-[12px] ${selected ? "text-bronze-light" : "text-alabaster/40"}`}>{pad(i + 1)}</span>
                    <span>
                      <span className={`block text-[16px] leading-snug font-medium ${selected ? "text-alabaster" : "text-alabaster/75"}`}>
                        {s.title}
                      </span>
                      <span className="mt-1 block text-[13.5px] text-alabaster/50">{s.short}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* HUD */}
          <Reveal delay={120} className="lg:col-span-7">
            <div
              id="protocol-panel"
              role="tabpanel"
              aria-labelledby={`protocol-tab-${active}`}
              className="hud-grid overflow-hidden rounded-[20px] border border-obsidian-line bg-obsidian-2"
            >
              <div className="relative aspect-[16/8] overflow-hidden">
                {STEP_IMAGES.map((src, i) => (
                  <SafeImage
                    key={src}
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className={`object-cover grayscale-[35%] transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian-2 via-obsidian/45 to-emerald/25 mix-blend-normal" />
                {/* HUD corner brackets */}
                {["top-4 left-4 border-t border-l", "top-4 right-4 border-t border-r", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((c) => (
                  <span key={c} aria-hidden className={`absolute h-5 w-5 border-bronze-light/70 ${c}`} />
                ))}
                <div key={`idx-${active}`} className="hud-in absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
                  <p className="font-mono text-[12px] tracking-[0.18em] text-bronze-light">
                    {pad(active + 1)} / {t.protocol.stepOf}
                  </p>
                  <p className="mt-2 max-w-[24ch] font-display text-[24px] leading-tight sm:text-[30px]">{step.title}</p>
                </div>
                <p aria-hidden className="absolute top-6 right-8 font-mono text-[11px] text-alabaster/55">
                  {pad(active + 1)}/{pad(steps.length)}
                </p>
              </div>

              <div key={`body-${active}-${lang}`} className="hud-in p-6 sm:p-8">
                <p className="max-w-[60ch] text-[16px] leading-relaxed text-alabaster/75">{step.body}</p>

                <dl className="mt-8 grid gap-6 border-t border-obsidian-line pt-6 sm:grid-cols-3 sm:gap-4">
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-alabaster/50 uppercase">
                      <Clock3 size={14} strokeWidth={1.6} /> {t.protocol.duration}
                    </dt>
                    <dd className="mt-2 font-mono text-[18px] text-alabaster">{step.duration}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-alabaster/50 uppercase">
                      <Cpu size={14} strokeWidth={1.6} /> {t.protocol.equipment}
                    </dt>
                    <dd className="mt-2">
                      <ul className="space-y-1 text-[14px] text-alabaster/85">
                        {step.equipment.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-alabaster/50 uppercase">
                      <HeartPulse size={14} strokeWidth={1.6} /> {t.protocol.comfort}
                    </dt>
                    <dd className="mt-3">
                      <span className="flex gap-1.5" aria-label={`${step.comfort}/5`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`h-1.5 w-6 rounded-full ${i < step.comfort ? "bg-bronze-light" : "bg-alabaster/15"}`} />
                        ))}
                      </span>
                      <span className="mt-2 block text-[14px] text-alabaster/85">{step.comfortText}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
