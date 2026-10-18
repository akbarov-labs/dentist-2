"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { useSite } from "@/context/SiteContext";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
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
          <h2 id="cases-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[40px]">
            {t.cases.title}
          </h2>
          <p className="mt-10 rounded-[16px] border border-dashed border-line p-10 text-center text-muted">{t.cases.empty}</p>
        </div>
      </section>
    );
  }

  const photos = current.photos;

  // The result leads: on desktop the photo takes the wide column at full height and everything that explains it
  // (title, the other cases, what was done) reads down the narrow column beside it. Phones keep the DOM order.
  return (
    <section id="cases" aria-labelledby="cases-title" className="py-20 md:py-28">
      <div className="shell grid gap-x-12 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr]">
        <h2
          id="cases-title"
          className="max-w-[20ch] font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[40px] lg:col-span-4 lg:col-start-9 lg:row-start-1"
        >
          {t.cases.title}
        </h2>

        <div className="mt-8 lg:sticky lg:top-24 lg:col-span-8 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:self-start">
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
                { src: photos.before, label: t.cases.before, chip: "bg-night/75 text-paper" },
                { src: photos.after, label: t.cases.after, chip: "bg-paper/90 text-accent" },
              ].map((p) => (
                <figure key={p.label} className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-stone">
                  <SafeImage
                    src={p.src}
                    alt={`${current.title[lang]}: ${p.label}`}
                    fill
                    sizes="(min-width: 1024px) 32vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: current.focus }}
                    fallbackLabel={p.label}
                  />
                  <figcaption className={`pointer-events-none absolute top-3 left-3 rounded-full px-3 py-1 text-[13px] font-medium ${p.chip}`}>
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
                sizes="(min-width: 1024px) 64vw, 100vw"
                className={`object-cover ${current.source ? "" : "saturate-[0.85]"}`}
                style={{ objectPosition: current.focus }}
              />
            </div>
          )}

          <p className="mt-4 max-w-[64ch] text-[14px] leading-snug text-muted">
            {current.source ? (
              <>
                <span className="font-medium text-ink">{t.cases.realTitle}.</span> {t.cases.realBody}
                {photos && photos.aligned !== false ? ` ${t.cases.dragHint}` : null}
              </>
            ) : (
              <>
                <span className="font-medium text-ink">{t.cases.privacyTitle}.</span> {t.cases.privacyBody} {t.cases.illustrative}
              </>
            )}
          </p>
        </div>

        {list.length > 1 ? (
          <ul
            ref={strip}
            aria-label={t.cases.pick}
            className="no-scrollbar -mx-4 mt-8 flex gap-3 overflow-x-auto px-4 pt-1 pb-1 md:mx-0 md:px-1 lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:grid lg:grid-cols-3 lg:gap-x-3 lg:gap-y-4 lg:overflow-visible lg:px-0"
          >
            {list.map((c, i) => {
              const active = i === safeIndex;
              return (
                <li key={c.id} className="w-[38%] shrink-0 sm:w-[28%] lg:w-auto">
                  <button type="button" aria-pressed={active} onClick={() => choose(i)} className="group block w-full rounded-[12px] text-left">
                    <span
                      className={`relative block aspect-[4/3] overflow-hidden rounded-[10px] bg-stone transition ${
                        active ? "ring-2 ring-accent ring-offset-2 ring-offset-paper" : "opacity-80 group-hover:opacity-100"
                      }`}
                    >
                      <SafeImage
                        src={c.photos?.after ?? c.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 9vw, 38vw"
                        className="object-cover"
                        style={{ objectPosition: c.focus }}
                      />
                    </span>
                    <span className={`mt-2 line-clamp-2 text-[13px] leading-snug ${active ? "font-medium text-ink" : "text-ink-soft"}`}>
                      {c.title[lang]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {/* What was done, set as plain text beside the photo: no card, the photo is the object */}
        <article key={`${current.id}-${lang}`} className="hud-in mt-10 border-t border-line pt-8 lg:col-span-4 lg:col-start-9 lg:row-start-3 lg:mt-10">
          <h3 className="font-display text-[26px] leading-tight text-ink text-balance">{current.title[lang]}</h3>

          <dl className="mt-5 space-y-4">
            {(
              [
                [t.cases.problem, current.problem[lang]],
                [t.cases.system, current.system[lang]],
                current.duration ? [t.cases.duration, current.duration[lang]] : null,
              ].filter(Boolean) as [string, string][]
            ).map(([k, v], i) => (
              <div key={k}>
                <dt className="text-[13px] text-muted">{k}</dt>
                <dd className={`mt-1 leading-snug text-ink ${i > 0 ? "tabular-nums text-[14.5px]" : "text-[15.5px]"}`}>{v}</dd>
              </div>
            ))}
          </dl>

          <figure className="mt-6">
            <blockquote className="font-display text-[19px] leading-relaxed text-ink-soft italic">
              {quote[0]}
              {current.note[lang]}
              {quote[1]}
            </blockquote>
            <figcaption className="mt-2 text-[13px] text-muted">{doctor.name[lang]}</figcaption>
          </figure>

          {current.source ? (
            <a
              href={current.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[14.5px] text-ink underline decoration-accent/40 underline-offset-4 transition hover:text-accent"
            >
              {t.cases.viewPost} · <span className="tabular-nums">{current.source.date[lang]}</span>
              <ArrowUpRight size={15} strokeWidth={1.7} />
            </a>
          ) : null}
        </article>

        {/* Announces the chosen case on every screen size */}
        <p className="sr-only" aria-live="polite">
          {safeIndex + 1} / {list.length}: {current.title[lang]}
        </p>
      </div>
    </section>
  );
}
