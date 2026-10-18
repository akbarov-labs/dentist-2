"use client";

import { ArrowRight, BadgeCheck, CirclePlay, Send } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import { useSite } from "@/context/SiteContext";
import { telegramLink } from "@/lib/format";
import { clamp01, useScrollVar } from "@/lib/useScrollVar";
import { PortraitArch } from "@/components/ui/PortraitArch";
import { SafeImage } from "@/components/ui/SafeImage";
import { btnPrimary, btnSecondary } from "@/components/ui/styles";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

// 0 while the hero top is at the viewport top, 1 once 85% of the hero has scrolled past.
const heroProgress = (rect: DOMRect) => clamp01(-rect.top / (rect.height * 0.85));

export function Hero() {
  const { t, doctor, lang, scrollToId, setModal } = useSite();
  const sectionRef = useRef<HTMLElement>(null);
  useScrollVar(sectionRef, "--hp", heroProgress);
  const long = doctor.heroLead[lang].length > 32;
  // His own photo is a field, not a framed card: it runs to the screen edge and the sentence leads.
  const field = doctor.portrait.style === "photo";

  return (
    <>
      <section ref={sectionRef} id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
        <div id="top-sentinel" className="absolute top-0 h-px w-px" aria-hidden />

        <div
          className={`shell grid items-center lg:min-h-[calc(100dvh-76px)] lg:grid-cols-12 lg:gap-8 ${
            field ? "gap-8 pb-14 lg:py-16" : "relative gap-10 pt-6 pb-16 md:pt-12 lg:py-10"
          }`}
        >
          {/* Copy: headline, one line of promise, one sentence, two actions */}
          <div className={field ? "lg:col-span-6 lg:pr-6 xl:pr-10" : "lg:col-span-6 xl:pr-8"}>
            <h1 id="hero-title" className="text-balance">
              {/* A full sentence in the doctor's own words sets smaller than a two-word slogan would */}
              <span
                className={`enter block font-display font-medium text-ink ${
                  field
                    ? "text-[38px] leading-[1.06] tracking-[-0.03em] sm:text-[54px] lg:text-[56px] xl:text-[72px]"
                    : long
                    ? "text-[36px] leading-[1.08] tracking-[-0.025em] sm:text-[50px] xl:text-[62px]"
                    : "text-[40px] leading-[1.05] tracking-[-0.035em] sm:text-[54px] xl:text-[64px]"
                }`}
                style={delay(80)}
              >
                {doctor.heroLead[lang]}
              </span>
              {t.hero.tail ? (
                <span
                  className="enter mt-4 block pb-1 font-display text-[21px] leading-[1.35] font-normal tracking-[-0.015em] text-accent sm:text-[25px] xl:text-[27px]"
                  style={delay(160)}
                >
                  {t.hero.tail}
                </span>
              ) : null}
            </h1>

            <p className="enter mt-6 max-w-[52ch] text-[16px] leading-relaxed text-muted sm:text-[17px]" style={delay(240)}>
              {doctor.heroSub[lang]}
            </p>

            <div data-hero-actions className="enter mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={delay(320)}>
              <button type="button" onClick={() => scrollToId("booking")} className={`${btnPrimary} group`}>
                {t.cta.book}
                <ArrowRight size={17} strokeWidth={1.7} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              {doctor.urgentCta ? (
                // The visitor in pain skips the whole story: one tap opens Telegram with the request already written.
                <a
                  href={telegramLink(doctor.contact.telegram, `${t.tg.hello} ${doctor.firstName[lang]}!\n${t.tg.urgent}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btnSecondary}
                >
                  <Send size={17} strokeWidth={1.6} className="text-accent" />
                  {t.cta.urgent}
                </a>
              ) : (
                <button type="button" onClick={() => setModal({ kind: "intro" })} className={btnSecondary}>
                  {doctor.introVideoUrl ? (
                    <CirclePlay size={17} strokeWidth={1.6} className="text-accent" />
                  ) : (
                    <BadgeCheck size={17} strokeWidth={1.6} className="text-accent" />
                  )}
                  {t.cta.intro}
                </button>
              )}
            </div>
          </div>

          {/* Portrait. Desktop: as large as the column allows, but never taller than the screen below the header */}
          {field ? (
            // The real photo in his own surgery, as taken. Phones: edge to edge above the sentence.
            // Desktop: a full-height field from the header to the fold, bleeding off the right edge of the screen.
            <div className="enter relative order-first -mx-4 aspect-[4/3] overflow-hidden bg-stone sm:aspect-[16/10] md:-mx-8 lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:aspect-auto lg:w-[42vw] xl:w-[min(44vw,880px)]" style={delay(120)}>
              <SafeImage
                src={doctor.portrait.src}
                alt={doctor.portrait.alt[lang]}
                fill
                preload
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
                // Phones crop the 4:5 photo to a wide band: keep the top of his head in it.
                style={{ objectPosition: "50% 12%" }}
                fallbackLabel={doctor.name[lang]}
              />
            </div>
          ) : (
            <div className="relative order-first mx-auto w-full max-w-[290px] sm:max-w-[400px] lg:order-none lg:col-span-6 lg:max-w-[min(540px,calc((100dvh-9rem)*0.8))] xl:max-w-[min(600px,calc((100dvh-9rem)*0.8))]">
              <div className="enter" style={delay(120)}>
                <PortraitArch doctor={doctor} lang={lang} preload sizes="(min-width: 1024px) 40vw, 92vw" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Key facts sit under the hero, not inside it (only for a doctor who has figures beyond the hero sentence) */}
      {doctor.stats.length ? (
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
      ) : null}
    </>
  );
}
