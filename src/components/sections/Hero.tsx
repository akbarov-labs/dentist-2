"use client";

import { ArrowRight, Award, BadgeCheck, CirclePlay, Microscope, ShieldCheck } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import { useSite } from "@/context/SiteContext";
import { clamp01, useScrollVar } from "@/lib/useScrollVar";
import { Monogram } from "@/components/ui/Monogram";
import { PortraitArch } from "@/components/ui/PortraitArch";
import { Signature } from "@/components/ui/Signature";
import { btnPrimary, btnSecondary } from "@/components/ui/styles";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

// 0 while the hero top is at the viewport top, 1 once 85% of the hero has scrolled past.
const heroProgress = (rect: DOMRect) => clamp01(-rect.top / (rect.height * 0.85));

export function Hero() {
  const { t, doctor, lang, scrollToId, setModal } = useSite();
  const sectionRef = useRef<HTMLElement>(null);
  useScrollVar(sectionRef, "--hp", heroProgress);
  const lineIcons = [Award, Microscope];

  // Digital ID card: a foreground parallax plane on desktop, a calm card after the stats on phones.
  const idCard = (parallax: boolean) => (
    <aside
      aria-label={t.hero.idCard}
      className="glass plane rounded-[16px] p-5"
      style={parallax ? { transform: "translate3d(0, calc(var(--hp, 0) * -110px), 0)" } : undefined}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Monogram letters={doctor.monogram} className="h-8 w-8" />
          <span className="text-[12px] font-medium tracking-[0.02em] whitespace-nowrap text-ink-soft">{t.hero.idCard}</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2 py-1 text-[12px] font-medium text-emerald">
          <BadgeCheck size={13} strokeWidth={1.8} /> {t.hero.verified}
        </span>
      </div>
      <p className="mt-4 font-display text-[19px] leading-tight text-ink">{doctor.name[lang]}</p>
      <p className="mt-1 text-[13px] leading-snug text-muted">{doctor.title[lang]}</p>
      <ul className="mt-4 space-y-2.5 border-t border-ink/10 pt-4">
        {doctor.idCard.lines.map((line, i) => {
          const Icon = lineIcons[i % lineIcons.length];
          return (
            <li key={line.uz} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-soft">
              <Icon size={15} strokeWidth={1.6} className="mt-px shrink-0 text-bronze-deep" />
              {line[lang]}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-end justify-between gap-3">
        <Signature name={doctor.signature} className="h-10 w-auto" />
        <span className="pb-2 text-right font-mono text-[12px] leading-tight whitespace-nowrap text-muted">
          {t.hero.license}
          <br />
          {doctor.idCard.licenseId}
        </span>
      </div>
    </aside>
  );

  return (
    <section ref={sectionRef} id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div id="top-sentinel" className="absolute top-0 h-px w-px" aria-hidden />

      <div className="shell relative grid items-center gap-8 pt-6 pb-16 md:pt-12 lg:min-h-[calc(100dvh-76px)] lg:grid-cols-12 lg:gap-8 lg:pt-6 lg:pb-10">
        {/* Copy */}
        <div className="lg:col-span-6 xl:col-span-7 xl:pr-8">
          <p
            className="enter inline-flex items-center gap-2 rounded-full border border-bronze/35 bg-bronze-soft/70 px-3.5 py-2 font-mono text-[12px] leading-snug tracking-[0.06em] text-bronze-deep"
            style={delay(0)}
          >
            <ShieldCheck size={14} strokeWidth={1.6} className="shrink-0" />
            {t.hero.pill}
          </p>

          <h1 id="hero-title" className="mt-7 text-balance">
            <span
              className="enter block font-display text-[42px] leading-[1.04] font-medium tracking-[-0.025em] text-ink sm:text-[56px] lg:text-[58px] xl:text-[68px]"
              style={delay(80)}
            >
              {doctor.heroLead[lang]}
            </span>
            <span
              className="enter mt-3 block pb-1 font-display text-[23px] leading-[1.28] font-normal tracking-[-0.01em] text-emerald italic sm:text-[28px] xl:text-[31px]"
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
              <div key={s.label.uz} className={`flex flex-col-reverse justify-end pr-3 ${i > 0 ? "border-l border-line pl-3 sm:pl-6" : ""}`}>
                <dt className="mt-1.5 text-[12px] leading-snug break-words text-muted sm:text-[13px]">{s.label[lang]}</dt>
                <dd className="font-mono text-[19px] font-medium tracking-[-0.02em] text-ink sm:text-[26px]">{s.value[lang]}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 lg:hidden">{idCard(false)}</div>
        </div>

        {/* Layered portrait + Digital ID */}
        <div className="relative order-first mx-auto w-full max-w-[290px] sm:max-w-[400px] lg:order-none lg:col-span-6 lg:max-w-[540px] xl:col-span-5">
          <div className="enter" style={delay(120)}>
            <PortraitArch doctor={doctor} lang={lang} preload sizes="(min-width: 1024px) 40vw, 92vw" />
          </div>

          <div
            className="enter z-[2] hidden lg:absolute lg:bottom-[9%] lg:-left-14 lg:block lg:w-[340px] xl:-left-24"
            style={delay(520)}
          >
            {idCard(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
