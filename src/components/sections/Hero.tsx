"use client";

import { ArrowRight, Award, BadgeCheck, CirclePlay, Microscope, ShieldCheck } from "lucide-react";
import type { CSSProperties } from "react";
import { useSite } from "@/context/SiteContext";
import { Monogram } from "@/components/ui/Monogram";
import { SafeImage } from "@/components/ui/SafeImage";
import { Signature } from "@/components/ui/Signature";
import { btnPrimary, btnSecondary } from "@/components/ui/styles";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const { t, doctor, lang, scrollToId, setModal } = useSite();
  const lineIcons = [Award, Microscope];

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div id="top-sentinel" className="absolute top-0 h-px w-px" aria-hidden />
      {/* soft emerald light behind the portrait */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(closest-side,rgb(15_61_62/0.10),transparent)]"
      />

      <div className="shell relative grid items-center gap-12 pt-8 pb-16 md:pt-12 lg:min-h-[calc(100dvh-76px)] lg:grid-cols-12 lg:gap-10 lg:pt-10 lg:pb-14">
        {/* Copy */}
        <div className="lg:col-span-7 xl:pr-6">
          <p
            className="enter inline-flex items-center gap-2 rounded-full border border-bronze/35 bg-bronze-soft/70 px-3.5 py-2 font-mono text-[10.5px] leading-tight tracking-[0.1em] text-bronze-deep sm:text-[11px]"
            style={delay(0)}
          >
            <ShieldCheck size={14} strokeWidth={1.6} className="shrink-0" />
            {t.hero.pill}
          </p>

          <h1 id="hero-title" className="mt-7 text-balance">
            <span
              className="enter block font-display text-[42px] leading-[1.04] font-medium tracking-[-0.025em] text-ink sm:text-[56px] lg:text-[60px] xl:text-[68px]"
              style={delay(80)}
            >
              {doctor.heroLead[lang]}
            </span>
            <span
              className="enter mt-3 block pb-1 font-display text-[23px] leading-[1.25] font-normal tracking-[-0.01em] text-emerald italic sm:text-[28px] xl:text-[31px]"
              style={delay(160)}
            >
              {t.hero.tail}
            </span>
          </h1>

          <p className="enter mt-6 max-w-[58ch] text-[16px] leading-relaxed text-muted sm:text-[17px]" style={delay(240)}>
            {doctor.heroSub[lang]}
          </p>

          <div className="enter mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={delay(320)}>
            <button type="button" onClick={() => scrollToId("calculator")} className={`${btnPrimary} group`}>
              {t.cta.consult}
              <ArrowRight size={17} strokeWidth={1.7} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <button type="button" onClick={() => setModal({ kind: "intro" })} className={btnSecondary}>
              {doctor.introVideoUrl ? (
                <CirclePlay size={17} strokeWidth={1.6} className="text-emerald" />
              ) : (
                <BadgeCheck size={17} strokeWidth={1.6} className="text-emerald" />
              )}
              <span className="sm:hidden">{t.cta.introShort}</span>
              <span className="hidden sm:inline">{t.cta.intro}</span>
            </button>
          </div>

          <dl className="enter mt-11 grid grid-cols-3 border-t border-line pt-6" style={delay(420)}>
            {doctor.stats.map((s, i) => (
              <div key={s.label.uz} className={`pr-3 ${i > 0 ? "border-l border-line pl-3 sm:pl-6" : ""}`}>
                <dt className="sr-only">{s.label[lang]}</dt>
                <dd className="font-mono text-[19px] font-medium tracking-[-0.02em] text-ink sm:text-[26px]">{s.value[lang]}</dd>
                <dd className="mt-1.5 text-[11.5px] leading-snug break-words text-muted sm:text-[13px]" aria-hidden>
                  {s.label[lang]}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Portrait + Digital ID */}
        <div className="relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:max-w-none">
          <div className="enter relative" style={delay(200)}>
            <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-[20px] border border-bronze/45 sm:translate-x-4 sm:translate-y-4" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-stone shadow-[var(--shadow-lift)] lg:max-h-[calc(100dvh-150px)] lg:w-full">
              <SafeImage
                key={doctor.portrait.src}
                src={doctor.portrait.src}
                alt={doctor.portrait.alt[lang]}
                fill
                preload
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="object-cover"
                style={{ objectPosition: doctor.portrait.position }}
                fallbackLabel={doctor.name[lang]}
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian/35 to-transparent" />
            </div>
          </div>

          <aside
            aria-label={t.hero.idCard}
            className="glass enter relative z-[2] mx-4 -mt-24 rounded-[20px] p-5 sm:mx-8 lg:absolute lg:bottom-10 lg:-left-20 lg:mx-0 lg:mt-0 lg:w-[330px]"
            style={delay(520)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Monogram letters={doctor.monogram} className="h-8 w-8" />
                <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink-soft uppercase">{t.hero.idCard}</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2 py-1 text-[11px] font-medium text-emerald">
                <BadgeCheck size={13} strokeWidth={1.8} /> {t.hero.verified}
              </span>
            </div>
            <p className="mt-4 font-display text-[19px] leading-tight text-ink">{doctor.name[lang]}</p>
            <p className="mt-1 text-[12.5px] leading-snug text-muted">{doctor.title[lang]}</p>
            <ul className="mt-4 space-y-2.5 border-t border-ink/10 pt-4">
              {doctor.idCard.lines.map((line, i) => {
                const Icon = lineIcons[i % lineIcons.length];
                return (
                  <li key={line.uz} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-ink-soft">
                    <Icon size={15} strokeWidth={1.6} className="mt-px shrink-0 text-bronze-deep" />
                    {line[lang]}
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex items-end justify-between gap-3">
              <Signature name={doctor.signature} className="h-11 w-auto" />
              <span className="pb-2 text-right font-mono text-[10px] leading-tight text-muted">
                {t.hero.license}
                <br />
                {doctor.idCard.licenseId}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
