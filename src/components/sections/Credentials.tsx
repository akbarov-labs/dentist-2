"use client";

import { ArrowUpRight, GraduationCap } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { Reveal } from "@/components/ui/Reveal";

export function Credentials() {
  const { t, doctor, lang, setModal } = useSite();
  const [lead, ...others] = doctor.credentials;

  return (
    <section id="credentials" aria-labelledby="cred-title" className="border-t border-line bg-stone/60 py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-[680px]">
          <h2 id="cred-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
            {t.credentials.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{t.credentials.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Lead credential */}
          <Reveal className="lg:col-span-5">
            <button
              type="button"
              onClick={() => setModal({ kind: "credential", id: lead.id })}
              className="group relative flex h-full min-h-[360px] w-full flex-col overflow-hidden rounded-[20px] bg-obsidian p-7 text-left text-alabaster transition hover:shadow-[var(--shadow-lift)] sm:p-9"
            >
              <div aria-hidden className="absolute inset-0 opacity-70" style={{ background: "radial-gradient(90% 70% at 100% 0%, rgb(22 80 79 / 0.65), transparent 70%)" }} />
              <div className="relative flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.16em] text-bronze-light uppercase">{lead.country[lang]}</span>
                <span className="font-mono text-[13px] text-alabaster/60">{lead.year}</span>
              </div>
              <p className="relative mt-auto pt-16 font-display text-[64px] leading-none tracking-[-0.03em] sm:text-[80px]">{lead.city[lang]}</p>
              <p className="relative mt-5 text-[17px] font-medium">{lead.institution}</p>
              <p className="relative mt-1 text-[14.5px] leading-relaxed text-alabaster/70">{lead.program[lang]}</p>
              <div className="relative mt-7 flex items-center justify-between border-t border-obsidian-line pt-5">
                <span className="font-mono text-[11.5px] text-alabaster/55">
                  {lead.certificateId} · {lead.hours} {t.credentials.hours}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[14px] text-alabaster">
                  {t.credentials.view}
                  <ArrowUpRight size={16} strokeWidth={1.7} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </button>
          </Reveal>

          {/* Other credentials as ledger rows */}
          <Reveal delay={120} className="lg:col-span-7">
            <ul className="flex h-full flex-col gap-3">
              {others.map((c) => (
                <li key={c.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setModal({ kind: "credential", id: c.id })}
                    className="group grid h-full w-full grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[20px] border border-line bg-card p-5 text-left transition hover:border-ink/25 hover:shadow-[var(--shadow-soft)] sm:gap-6 sm:p-6"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-bronze-soft text-bronze-deep">
                      <GraduationCap size={20} strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-display text-[22px] leading-tight text-ink">{c.city[lang]}</span>
                        <span className="text-[13px] text-muted">{c.country[lang]}</span>
                      </span>
                      <span className="mt-1 block text-[14.5px] leading-snug text-ink-soft">{c.institution}</span>
                      <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{c.program[lang]}</span>
                    </span>
                    <span className="flex flex-col items-end gap-2">
                      <span className="font-mono text-[15px] text-ink">{c.year}</span>
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition group-hover:border-emerald group-hover:bg-emerald group-hover:text-alabaster">
                        <ArrowUpRight size={16} strokeWidth={1.7} />
                        <span className="sr-only">{t.credentials.view}</span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
