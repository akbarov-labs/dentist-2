"use client";

import { ArrowRight, BadgeCheck, CirclePlay } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import { useSite } from "@/context/SiteContext";
import { clamp01, useScrollVar } from "@/lib/useScrollVar";
import { PortraitArch } from "@/components/ui/PortraitArch";
import { btnPrimary, btnSecondary } from "@/components/ui/styles";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

// 0 while the hero top is at the viewport top, 1 once 85% of the hero has scrolled past.
const heroProgress = (rect: DOMRect) => clamp01(-rect.top / (rect.height * 0.85));

export function Hero() {
  const { t, doctor, lang, scrollToId, setModal } = useSite();
  const sectionRef = useRef<HTMLElement>(null);
  useScrollVar(sectionRef, "--hp", heroProgress);

  return (
    <>
      <section ref={sectionRef} id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
        <div id="top-sentinel" className="absolute top-0 h-px w-px" aria-hidden />

        <div className="shell relative grid items-center gap-10 pt-6 pb-16 md:pt-12 lg:min-h-[calc(100dvh-76px)] lg:grid-cols-12 lg:gap-8 lg:py-10">
          {/* Copy: headline, one line of promise, one sentence, two actions */}
          <div className="lg:col-span-6 xl:col-span-7 xl:pr-8">
            <h1 id="hero-title" className="text-balance">
              <span
                className="enter block font-display text-[40px] leading-[1.05] font-medium tracking-[-0.035em] text-ink sm:text-[54px] xl:text-[64px]"
                style={delay(80)}
              >
                {doctor.heroLead[lang]}
              </span>
              <span
                className="enter mt-4 block pb-1 font-display text-[21px] leading-[1.35] font-normal tracking-[-0.015em] text-accent sm:text-[25px] xl:text-[27px]"
                style={delay(160)}
              >
                {t.hero.tail}
              </span>
            </h1>

            <p className="enter mt-6 max-w-[52ch] text-[16px] leading-relaxed text-muted sm:text-[17px]" style={delay(240)}>
              {doctor.heroSub[lang]}
            </p>

            <div className="enter mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={delay(320)}>
              <button type="button" onClick={() => scrollToId("booking")} className={`${btnPrimary} group`}>
                {t.cta.book}
                <ArrowRight size={17} strokeWidth={1.7} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              <button type="button" onClick={() => setModal({ kind: "intro" })} className={btnSecondary}>
                {doctor.introVideoUrl ? (
                  <CirclePlay size={17} strokeWidth={1.6} className="text-accent" />
                ) : (
                  <BadgeCheck size={17} strokeWidth={1.6} className="text-accent" />
                )}
                {t.cta.intro}
              </button>
            </div>
          </div>

          {/* Layered portrait */}
          <div className="relative order-first mx-auto w-full max-w-[290px] sm:max-w-[400px] lg:order-none lg:col-span-6 lg:max-w-[520px] xl:col-span-5">
            <div className="enter" style={delay(120)}>
              <PortraitArch doctor={doctor} lang={lang} preload sizes="(min-width: 1024px) 40vw, 92vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Key facts sit under the hero, not inside it */}
      <section aria-label={t.intro.facts} className="border-t border-line">
        <dl className="shell grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {doctor.stats.map((s) => (
            <div key={s.label.uz} className="flex flex-col-reverse py-6 sm:px-8 sm:py-10 sm:first:pl-0">
              <dt className="mt-1 text-[14px] leading-snug text-muted">{s.label[lang]}</dt>
              <dd className="text-[30px] leading-none font-medium tracking-[-0.03em] text-ink tabular-nums sm:text-[36px]">{s.value[lang]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
