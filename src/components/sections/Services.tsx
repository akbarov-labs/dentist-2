"use client";

import { ArrowRight, ArrowUpRight, Microscope } from "lucide-react";
import type { ServiceItem } from "@/config/doctorConfig";
import { useSite } from "@/context/SiteContext";
import { formatMillions } from "@/lib/format";
import { noBreakHyphens } from "@/lib/text";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { btnPrimary } from "@/components/ui/styles";

export function Services() {
  const { t, doctor, lang, setCalc, setPrefill, scrollToId } = useSite();
  const [featured, second, third, fourth] = doctor.services;

  const act = (s: ServiceItem) => {
    if (s.calcProblem) {
      setCalc({ problem: s.calcProblem });
      scrollToId("calculator");
    } else {
      setPrefill({ kind: "service", serviceId: s.id });
      scrollToId("booking");
    }
  };
  const actionLabel = (s: ServiceItem) => (s.calcProblem ? t.services.calc : t.services.book);
  const from = (s: ServiceItem) => (
    <span className="font-mono text-[13px] whitespace-nowrap">
      {lang === "ru" ? `${t.services.from} ${formatMillions(s.priceFrom, lang)} ${t.calc.currency}` : `${formatMillions(s.priceFrom, lang)} ${t.calc.currency}${t.services.from}`}
    </span>
  );

  return (
    <section id="services" aria-labelledby="services-title" className="border-t border-line bg-stone/60 py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-[680px]">
          <h2 id="services-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
            {t.services.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{t.services.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[minmax(300px,auto)_minmax(300px,auto)] lg:gap-5">
          {/* Featured: 2 cols x 2 rows */}
          <Reveal className="group flex flex-col overflow-hidden rounded-[20px] border border-line bg-card shadow-[var(--shadow-soft)] md:col-span-2 lg:row-span-2">
            <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:flex-1 lg:min-h-[260px]">
              {featured.image ? (
                <SafeImage src={featured.image} alt={featured.title[lang]} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-atelier)] group-hover:scale-[1.03]" fallbackLabel={featured.title[lang]} />
              ) : null}
              <span className="absolute top-4 left-4 rounded-full bg-alabaster/90 px-3 py-1.5 font-mono text-[10.5px] tracking-[0.14em] text-emerald uppercase backdrop-blur">
                {t.services.featured}
              </span>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink sm:text-[30px]">{noBreakHyphens(featured.title[lang])}</h3>
              <p className="mt-3 max-w-[54ch] text-[15.5px] leading-relaxed text-muted">{featured.lead[lang]}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {featured.specs.map((s) => (
                  <li key={s.uz} className="rounded-[12px] border border-line bg-alabaster px-3.5 py-3 font-mono text-[12.5px] leading-snug text-ink-soft">
                    {s[lang]}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <span className="text-ink">{from(featured)}</span>
                <button type="button" onClick={() => act(featured)} className={`${btnPrimary} group/btn`}>
                  {actionLabel(featured)}
                  <ArrowRight size={17} strokeWidth={1.7} className="transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </div>
          </Reveal>

          {/* Second: emerald, 2 cols */}
          <Reveal delay={80} className="relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-emerald p-6 text-alabaster sm:p-8 md:col-span-2">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full opacity-60"
              style={{ background: "repeating-radial-gradient(circle, transparent 0 22px, rgb(201 173 131 / 0.22) 22px 23px)" }}
            />
            <div className="relative">
              <h3 className="max-w-[22ch] font-display text-[24px] leading-tight sm:text-[28px]">{noBreakHyphens(second.title[lang])}</h3>
              <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-alabaster/75">{second.lead[lang]}</p>
            </div>
            <div className="relative mt-8 flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                {second.specs.map((s) => (
                  <p key={s.uz} className="font-mono text-[12.5px] text-bronze-light">{s[lang]}</p>
                ))}
                <p className="text-alabaster/90">{from(second)}</p>
              </div>
              <button type="button" onClick={() => act(second)} className="inline-flex h-11 items-center gap-2 rounded-full bg-alabaster px-5 text-[14.5px] font-medium text-emerald transition hover:bg-white active:scale-[0.99]">
                {actionLabel(second)} <ArrowUpRight size={16} strokeWidth={1.7} />
              </button>
            </div>
          </Reveal>

          {/* Third: full-bleed photo */}
          <Reveal delay={140} className="group relative min-h-[300px] overflow-hidden rounded-[20px] bg-obsidian text-alabaster">
            {third.image ? (
              <SafeImage src={third.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover opacity-80 transition-transform duration-[1.2s] ease-[var(--ease-atelier)] group-hover:scale-[1.04]" style={{ objectPosition: "50% 60%" }} />
            ) : null}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/55 to-obsidian/5" />
            <div className="relative flex h-full flex-col justify-end p-6">
              <h3 className="font-display text-[21px] leading-tight">{noBreakHyphens(third.title[lang])}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-alabaster/75">{third.lead[lang]}</p>
              <button type="button" onClick={() => act(third)} className="mt-5 inline-flex items-center gap-1.5 self-start border-b border-bronze-light/70 pb-0.5 text-[14px] text-alabaster transition hover:border-alabaster">
                {actionLabel(third)} <ArrowUpRight size={15} strokeWidth={1.7} />
              </button>
            </div>
          </Reveal>

          {/* Fourth: stone with microscope motif */}
          <Reveal delay={200} className="relative flex min-h-[300px] flex-col overflow-hidden rounded-[20px] border border-line bg-bronze-soft p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-bronze/40 text-bronze-deep">
                <Microscope size={22} strokeWidth={1.4} />
              </span>
              {fourth.image ? (
                <span className="relative h-16 w-16 overflow-hidden rounded-full border border-white shadow-[var(--shadow-soft)]">
                  <SafeImage src={fourth.image} alt="" fill sizes="64px" className="object-cover" />
                </span>
              ) : null}
            </div>
            <h3 className="mt-6 font-display text-[21px] leading-tight text-ink">{noBreakHyphens(fourth.title[lang])}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{fourth.lead[lang]}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
              <span className="text-ink">{from(fourth)}</span>
              <button type="button" onClick={() => act(fourth)} className="inline-flex items-center gap-1.5 border-b border-bronze/60 pb-0.5 text-[14px] whitespace-nowrap text-ink transition hover:border-ink">
                {actionLabel(fourth)} <ArrowUpRight size={15} strokeWidth={1.7} />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
