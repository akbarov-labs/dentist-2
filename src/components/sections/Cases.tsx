"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { CaseCategory } from "@/config/doctorConfig";
import { useSite } from "@/context/SiteContext";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { chip } from "@/components/ui/styles";

type Filter = "all" | CaseCategory;

export function Cases() {
  const { t, doctor, lang } = useSite();
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState(0);
  const [comfort, setComfort] = useState(true);

  // Filters come from the doctor's own cases, in order of first appearance; one category needs no filter row.
  const filters = useMemo<Filter[]>(() => ["all", ...new Set(doctor.cases.map((c) => c.category))], [doctor.cases]);
  const activeFilter = filters.includes(filter) ? filter : "all";
  const list = useMemo(
    () => doctor.cases.filter((c) => activeFilter === "all" || c.category === activeFilter),
    [doctor.cases, activeFilter],
  );
  const safeIndex = Math.min(index, list.length - 1);
  const current = list[safeIndex];

  const choose = (f: Filter) => {
    setFilter(f);
    setIndex(0);
  };
  const step = (dir: number) => setIndex((i) => (i + dir + list.length) % list.length);

  return (
    <section id="cases" aria-labelledby="cases-title" className="py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <h2 id="cases-title" className="max-w-[20ch] font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
            {t.cases.title}
          </h2>
          {filters.length > 2 ? (
            <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="group" aria-label={t.cases.title}>
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={activeFilter === f}
                  onClick={() => choose(f)}
                  className={`${chip} h-11 shrink-0 ${activeFilter === f ? "border-accent bg-accent text-paper" : "border-line bg-card text-ink-soft hover:border-ink/30"}`}
                >
                  {t.cases.filters[f]}
                </button>
              ))}
            </div>
          ) : null}
        </Reveal>

        {current ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-7">
              {current.photos ? (
                <>
                  <BeforeAfter
                    key={`${current.id}-${doctor.id}`}
                    before={current.photos.before}
                    after={current.photos.after}
                    focus={current.focus}
                    alt={current.title[lang]}
                    beforeLabel={t.cases.before}
                    afterLabel={t.cases.after}
                    sliderLabel={t.cases.sliderLabel}
                    comfort={comfort}
                    comfortHint={t.cases.comfortHint}
                  />
                  <div className="mt-2">
                    <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-[14px] text-ink-soft">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={comfort}
                        onClick={() => setComfort((c) => !c)}
                        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${comfort ? "bg-accent" : "bg-stone-2"}`}
                      >
                        <span
                          className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-card shadow transition-transform duration-300 ease-[var(--ease-atelier)] ${comfort ? "translate-x-5" : ""}`}
                        />
                      </button>
                      {t.cases.comfort}
                    </label>
                  </div>
                  {current.source ? (
                    <p className="mt-1 flex items-start gap-3 text-[14px] leading-snug text-muted">
                      <BadgeCheck size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent" />
                      <span>
                        <span className="block text-[15px] font-medium text-ink">{t.cases.realTitle}</span>
                        <span className="mt-1 block max-w-[60ch]">{t.cases.realBody}</span>
                      </span>
                    </p>
                  ) : null}
                </>
              ) : (
                <figure key={`${current.id}-${doctor.id}`} className="hud-in">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-stone">
                    <SafeImage
                      src={current.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className={`object-cover ${current.source ? "" : "saturate-[0.85]"}`}
                      style={{ objectPosition: current.focus }}
                    />
                  </div>
                  {current.source ? (
                    <figcaption className="mt-4 flex items-start gap-3">
                      <BadgeCheck size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent" />
                      <span>
                        <span className="block text-[15px] font-medium text-ink">{t.cases.realTitle}</span>
                        <span className="mt-1 block max-w-[60ch] text-[14px] leading-snug text-muted">{t.cases.realBody}</span>
                      </span>
                    </figcaption>
                  ) : (
                    <figcaption className="mt-4 flex items-start gap-3">
                      <ShieldCheck size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent" />
                      <span>
                        <span className="block text-[15px] font-medium text-ink">{t.cases.privacyTitle}</span>
                        <span className="mt-1 block max-w-[60ch] text-[14px] leading-snug text-muted">
                          {t.cases.privacyBody} {t.cases.illustrative}
                        </span>
                      </span>
                    </figcaption>
                  )}
                </figure>
              )}
              {/* Phones: the case switcher sits under the photo, not a screen below it in the passport card */}
              {list.length > 1 ? (
                <div className="mt-3 flex items-center justify-between gap-3 lg:hidden">
                  <p className="tabular-nums text-[14px] text-muted" aria-live="polite">
                    {safeIndex + 1} / {list.length}
                  </p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => step(-1)} aria-label={t.cases.prev} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink transition hover:bg-stone">
                      <ArrowLeft size={17} strokeWidth={1.6} />
                    </button>
                    <button type="button" onClick={() => step(1)} aria-label={t.cases.next} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink transition hover:bg-stone">
                      <ArrowRight size={17} strokeWidth={1.6} />
                    </button>
                  </div>
                </div>
              ) : null}
            </Reveal>

            <Reveal delay={120} className="lg:col-span-5">
              <article key={`${current.id}-${lang}`} className="hud-in flex h-full flex-col rounded-[16px] bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[13px] text-muted">{t.cases.passport}</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => step(-1)} disabled={list.length < 2} aria-label={t.cases.prev} className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition hover:bg-stone disabled:opacity-40">
                      <ArrowLeft size={17} strokeWidth={1.6} />
                    </button>
                    <button type="button" onClick={() => step(1)} disabled={list.length < 2} aria-label={t.cases.next} className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition hover:bg-stone disabled:opacity-40">
                      <ArrowRight size={17} strokeWidth={1.6} />
                    </button>
                  </div>
                </div>

                <h3 className="mt-5 font-display text-[26px] leading-tight text-ink">{current.title[lang]}</h3>

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

                <figure className="mt-auto pt-7">
                  <blockquote className="border-t border-line pt-6 text-[17px] leading-relaxed text-ink-soft">“{current.note[lang]}”</blockquote>
                  <figcaption className="mt-3 text-[13px] text-muted">
                    <span className="font-medium text-ink">{doctor.name[lang]}</span>, {t.cases.note.toLowerCase()}
                  </figcaption>
                </figure>
              </article>
            </Reveal>
          </div>
        ) : (
          <p className="mt-10 rounded-[16px] border border-dashed border-line p-10 text-center text-muted">{t.cases.empty}</p>
        )}
      </div>
    </section>
  );
}
