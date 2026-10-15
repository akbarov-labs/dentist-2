"use client";

import { ArrowUpRight } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { Reveal } from "@/components/ui/Reveal";

export function Credentials() {
  const { t, doctor, lang, setModal } = useSite();
  const timeline = [...doctor.credentials].sort((a, b) => a.year - b.year);

  return (
    <section id="credentials" aria-labelledby="cred-title" className="border-t border-line bg-stone/60 py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-[680px]">
          <h2 id="cred-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
            {t.credentials.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{t.credentials.sub}</p>
        </Reveal>

        <Reveal className="relative mt-14">
          {/* The rail the years sit on */}
          <div aria-hidden className="absolute top-[52px] right-0 left-0 h-px bg-gradient-to-r from-line via-bronze/50 to-bronze" />

          <ol className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
            {timeline.map((c, i) => {
              const last = i === timeline.length - 1;
              return (
                <li key={c.id} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-auto">
                  <button
                    type="button"
                    onClick={() => setModal({ kind: "credential", id: c.id })}
                    className="group flex h-full w-full flex-col text-left"
                  >
                    <span className="font-mono text-[26px] leading-none tracking-[-0.02em] text-ink">{c.year}</span>
                    <span
                      aria-hidden
                      className={`relative mt-4 mb-6 block h-3 w-3 rounded-full border ${last ? "border-bronze bg-bronze" : "border-bronze bg-alabaster"}`}
                    />
                    <span className="flex h-full flex-col rounded-[16px] bg-card p-6 transition duration-300 group-hover:shadow-[var(--shadow-soft)]">
                      <span className="flex flex-wrap items-baseline gap-x-2.5">
                        <span className="font-display text-[30px] leading-none tracking-[-0.02em] text-ink">{c.city[lang]}</span>
                        <span className="text-[13px] text-muted">{c.country[lang]}</span>
                      </span>
                      <span className="mt-4 block text-[15px] leading-snug font-medium text-ink">{c.institution}</span>
                      <span className="mt-1.5 block text-[14px] leading-snug text-muted">{c.program[lang]}</span>
                      <span aria-hidden className="block min-h-6 flex-1" />
                      <span className="flex items-center justify-between gap-3 border-t border-line pt-2 font-mono text-[12px] text-muted">
                        <span>
                          {c.hours} {t.credentials.hours}
                        </span>
                        <span className="inline-flex min-h-11 items-center gap-1.5 font-sans text-[14px] text-ink transition-colors group-hover:text-emerald">
                          {t.credentials.view}
                          <ArrowUpRight size={15} strokeWidth={1.7} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
