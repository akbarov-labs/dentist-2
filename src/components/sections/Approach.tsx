"use client";

import { Check, X } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { Reveal } from "@/components/ui/Reveal";
import { Signature } from "@/components/ui/Signature";

export function Approach() {
  const { t, doctor, lang } = useSite();
  const [first, ...rest] = doctor.manifesto[lang];
  // Without the clinic comparison the manifesto stands alone: the protocol right below already shows how he works.
  const standalone = doctor.compareClinics === false;

  return (
    <section
      id="approach"
      {...(standalone ? { "aria-label": doctor.name[lang] } : { "aria-labelledby": "approach-title" })}
      className="border-t border-line bg-stone/60 py-20 md:py-28"
    >
      <div className="shell">
        {/* Personal manifesto */}
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-9 lg:col-start-4">
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

        {standalone ? null : (
          <>
            {/* Clinic chain vs. private practice (only where the doctor stands behind those claims) */}
            <Reveal className="mt-24 md:mt-32">
              <h2 id="approach-title" className="max-w-[18ch] font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
                {t.approach.title}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 lg:grid-cols-12 lg:gap-6">
              <Reveal className="flex flex-col rounded-[16px] border border-line bg-paper/70 p-6 sm:p-8 lg:col-span-4">
                <h3 className="text-[15px] font-medium text-muted">{t.approach.clinicsTitle}</h3>
                <ul className="mt-6 space-y-5">
                  {t.approach.clinics.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-[16px] leading-snug text-muted">
                      <X size={15} strokeWidth={1.6} className="mt-[3px] shrink-0 text-ink/40" />
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 lg:mt-auto">
                  {t.approach.clinicStats.map((s) => (
                    <div key={s.l}>
                      <p className="tabular-nums text-[20px] text-ink-soft">{s.v}</p>
                      <p className="mt-1 text-[12.5px] leading-snug text-muted">{s.l}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
    
              <Reveal delay={120} className="rounded-[16px] bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:col-span-8 lg:p-10">
                <h3 className="font-display text-[22px] leading-tight tracking-[-0.015em] text-ink sm:text-[24px]">
                  {doctor.name[lang]}, <span className="text-accent">{t.approach.privateTitle}</span>
                </h3>
                <ol className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                  {t.approach.points.map((p) => (
                    <li key={p.k} className="border-t border-line pt-5">
                      <p className="flex items-center gap-2 text-[16px] font-medium text-ink">
                        <Check size={14} strokeWidth={2} className="text-accent" />
                        {p.k}
                      </p>
                      <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{p.v}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
