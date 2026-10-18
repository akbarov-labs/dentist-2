"use client";

import { ArrowUpRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { useSite } from "@/context/SiteContext";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";

export function Cases() {
  const { t, doctor, lang } = useSite();
  const [index, setIndex] = useState(0);
  const strip = useRef<HTMLUListElement>(null);

  const list = doctor.cases;
  const safeIndex = Math.min(index, list.length - 1);
  const current = list[safeIndex];
  const quote = lang === "ru" ? ["«", "»"] : ["“", "”"];

  // The strip is the switcher: every case is one tap away, and the chosen one is kept in view on phones.
  const choose = (i: number) => {
    setIndex(i);
    const el = strip.current;
    const item = el?.children[i] as HTMLElement | undefined;
    if (!el || !item) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const left = item.offsetLeft - el.offsetLeft - (el.clientWidth - item.clientWidth) / 2;
    const target = Math.max(0, Math.min(left, el.scrollWidth - el.clientWidth));
    const from = el.scrollLeft;
    el.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
    // Land there even where smooth scrolling is throttled or ignored.
    window.setTimeout(() => {
      if (Math.abs(el.scrollLeft - from) < 2 && Math.abs(target - from) >= 2) el.scrollTo({ left: target, behavior: "auto" });
    }, 450);
  };

  if (!current) {
    return (
      <section id="cases" aria-labelledby="cases-title" className="py-20 md:py-28">
        <div className="shell">
          <h2 id="cases-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
            {t.cases.title}
          </h2>
          <p className="mt-10 rounded-[16px] border border-dashed border-line p-10 text-center text-muted">{t.cases.empty}</p>
        </div>
      </section>
    );
  }

  const photos = current.photos;

  return (
    <section id="cases" aria-labelledby="cases-title" className="py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <h2 id="cases-title" className="max-w-[20ch] font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
            {t.cases.title}
          </h2>
        </Reveal>

        {list.length > 1 ? (
          <Reveal className="mt-8">
            <ul
              ref={strip}
              aria-label={t.cases.pick}
              className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pt-1 pb-1 md:mx-0 md:px-1 lg:grid lg:grid-cols-6 lg:overflow-visible"
            >
              {list.map((c, i) => {
                const active = i === safeIndex;
                return (
                  <li key={c.id} className="w-[38%] shrink-0 sm:w-[28%] lg:w-auto">
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => choose(i)}
                      className="group block w-full rounded-[14px] text-left"
                    >
                      <span
                        className={`relative block aspect-[4/3] overflow-hidden rounded-[12px] bg-stone transition ${
                          active ? "ring-2 ring-accent ring-offset-2 ring-offset-paper" : "opacity-80 group-hover:opacity-100"
                        }`}
                      >
                        <SafeImage
                          src={c.photos?.after ?? c.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 16vw, 38vw"
                          className="object-cover"
                          style={{ objectPosition: c.focus }}
                        />
                      </span>
                      <span className={`mt-2 line-clamp-3 block text-[13px] leading-snug ${active ? "font-medium text-ink" : "text-ink-soft"}`}>
                        {c.title[lang]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            {photos && photos.aligned !== false ? (
              <BeforeAfter
                key={`${current.id}-${doctor.id}`}
                before={photos.before}
                after={photos.after}
                focus={current.focus}
                alt={current.title[lang]}
                beforeLabel={t.cases.before}
                afterLabel={t.cases.after}
                sliderLabel={t.cases.sliderLabel}
                valueText={t.cases.sliderValue}
              />
            ) : photos ? (
              // Shots framed differently can't share a slider honestly, so they stand side by side.
              <div key={`${current.id}-${doctor.id}`} className="hud-in grid grid-cols-2 gap-2">
                {[
                  { src: photos.before, label: t.cases.before, chip: "bg-night/70 text-paper" },
                  { src: photos.after, label: t.cases.after, chip: "bg-paper/85 text-accent" },
                ].map((p) => (
                  <figure key={p.label} className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-stone">
                    <SafeImage
                      src={p.src}
                      alt={`${current.title[lang]}: ${p.label}`}
                      fill
                      sizes="(min-width: 1024px) 29vw, 50vw"
                      className="object-cover"
                      style={{ objectPosition: current.focus }}
                      fallbackLabel={p.label}
                    />
                    <figcaption className={`pointer-events-none absolute top-3 left-3 rounded-full px-2.5 py-1 tabular-nums text-[11.5px] tracking-[0.1em] backdrop-blur ${p.chip}`}>
                      {p.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div key={`${current.id}-${doctor.id}`} className="hud-in relative aspect-[4/3] overflow-hidden rounded-[16px] bg-stone">
                <SafeImage
                  src={current.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className={`object-cover ${current.source ? "" : "saturate-[0.85]"}`}
                  style={{ objectPosition: current.focus }}
                />
              </div>
            )}

            {current.source ? (
              <p className="mt-4 flex items-start gap-3 text-[14px] leading-snug text-muted">
                <BadgeCheck size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="font-medium text-ink">{t.cases.realTitle}.</span> {t.cases.realBody}
                  {photos && photos.aligned !== false ? <span className="mt-1 block">{t.cases.dragHint}</span> : null}
                </span>
              </p>
            ) : (
              <p className="mt-4 flex items-start gap-3">
                <ShieldCheck size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="block text-[15px] font-medium text-ink">{t.cases.privacyTitle}</span>
                  <span className="mt-1 block max-w-[60ch] text-[14px] leading-snug text-muted">
                    {t.cases.privacyBody} {t.cases.illustrative}
                  </span>
                </span>
              </p>
            )}
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <article key={`${current.id}-${lang}`} className="hud-in rounded-[16px] bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <h3 className="font-display text-[26px] leading-tight text-ink text-balance">{current.title[lang]}</h3>

              <dl className="mt-6 space-y-5">
                {(
                  [
                    [t.cases.problem, current.problem[lang]],
                    [t.cases.system, current.system[lang]],
                    current.duration ? [t.cases.duration, current.duration[lang]] : null,
                  ].filter(Boolean) as [string, string][]
                ).map(([k, v], i) => (
                  <div key={k} className={i > 0 ? "border-t border-line pt-5" : ""}>
                    <dt className="text-[13px] text-muted">{k}</dt>
                    <dd className={`mt-1 leading-snug text-ink ${i > 0 ? "tabular-nums text-[14.5px]" : "text-[15.5px]"}`}>{v}</dd>
                  </div>
                ))}
                {current.source ? (
                  <div className="border-t border-line pt-5">
                    <dt className="text-[13px] text-muted">{t.cases.source}</dt>
                    <dd className="mt-1">
                      <a
                        href={current.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-1.5 text-[14.5px] text-ink underline decoration-accent/40 underline-offset-4 transition hover:text-accent"
                      >
                        {t.cases.viewPost} · <span className="tabular-nums">{current.source.date[lang]}</span>
                        <ArrowUpRight size={15} strokeWidth={1.7} />
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>

              <figure className="mt-7 border-t border-line pt-6">
                <blockquote className="text-[17px] leading-relaxed text-ink-soft">
                  {quote[0]}
                  {current.note[lang]}
                  {quote[1]}
                </blockquote>
                <figcaption className="mt-3 text-[13px] font-medium text-ink">{doctor.name[lang]}</figcaption>
              </figure>
            </article>
          </Reveal>
        </div>

        {/* Announces the chosen case on every screen size */}
        <p className="sr-only" aria-live="polite">
          {safeIndex + 1} / {list.length}: {current.title[lang]}
        </p>
      </div>
    </section>
  );
}
