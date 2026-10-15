"use client";

import { Check, X } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";
import { Signature } from "@/components/ui/Signature";
import { monoLabel } from "@/components/ui/styles";

export function Approach() {
  const { t, doctor, lang } = useSite();
  const [first, ...rest] = doctor.manifesto[lang];

  return (
    <section id="approach" aria-labelledby="approach-title" className="border-t border-line bg-stone/60 py-20 md:py-28">
      <div className="shell">
        {/* Personal manifesto */}
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <p className={`${monoLabel} text-bronze-deep lg:col-span-3 lg:pt-3`}>{t.approach.manifestoLabel}</p>
          <div className="lg:col-span-9">
            <blockquote>
              <p className="font-display text-[26px] leading-[1.32] tracking-[-0.012em] text-ink text-pretty sm:text-[32px] lg:text-[36px]">
                {first}
              </p>
              {rest.map((p) => (
                <p key={p} className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </blockquote>
            <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-2">
              <Signature name={doctor.signature} className="h-16 w-auto sm:h-20" />
              <p className="pb-3 text-[13px] leading-snug text-muted">
                <span className="block font-medium text-ink">{doctor.name[lang]}</span>
                {doctor.title[lang]}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Clinic chain vs. private practice */}
        <Reveal className="mt-24 md:mt-32">
          <h2 id="approach-title" className="max-w-[18ch] font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
            {t.approach.title}
          </h2>
        </Reveal>

        <div className="relative mt-10 grid gap-5 lg:grid-cols-12 lg:gap-6">
          <Reveal className="flex flex-col rounded-[20px] border border-line bg-alabaster/70 p-6 sm:p-8 lg:col-span-4">
            <h3 className="text-[15px] font-medium text-muted">{t.approach.clinicsTitle}</h3>
            <ul className="mt-6 space-y-5">
              {t.approach.clinics.map((c) => (
                <li key={c} className="flex items-start gap-3 text-[16px] leading-snug text-muted">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink/12 text-ink/45">
                    <X size={13} strokeWidth={1.8} />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 lg:mt-auto">
              {t.approach.clinicStats.map((s) => (
                <div key={s.l}>
                  <p className="font-mono text-[20px] text-ink-soft">{s.v}</p>
                  <p className="mt-1 text-[12.5px] leading-snug text-muted">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <span
            aria-hidden
            className="absolute top-1/2 left-[33.3%] z-[2] hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-alabaster font-mono text-[11px] text-bronze-deep lg:grid"
          >
            VS
          </span>

          <Reveal delay={120} className="relative overflow-hidden rounded-[20px] border border-emerald/15 bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:col-span-8 lg:p-10">
            <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald via-emerald-2 to-bronze" />
            <div className="flex items-center gap-3">
              <Monogram letters={doctor.monogram} className="h-10 w-10" />
              <h3 className="font-display text-[22px] leading-tight text-ink sm:text-[24px]">
                {doctor.name[lang]} <span className="text-emerald italic">{t.approach.privateTitle}</span>
              </h3>
            </div>
            <ol className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {t.approach.points.map((p) => (
                <li key={p.k} className="border-t border-line pt-5">
                  <p className="flex items-center gap-2 font-mono text-[11.5px] tracking-[0.08em] text-bronze-deep">
                    <Check size={14} strokeWidth={2} className="text-emerald" />
                    {p.k}
                  </p>
                  <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{p.v}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
