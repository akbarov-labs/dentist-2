"use client";

import { ArrowLeft, ArrowRight, CheckCheck, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { reviews, type Review } from "@/config/reviews";
import { useSite } from "@/context/SiteContext";
import { Reveal } from "@/components/ui/Reveal";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Stars() {
  return (
    <span className="flex gap-0.5 text-accent" aria-label="5/5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={13} strokeWidth={0} fill="currentColor" />
      ))}
    </span>
  );
}

const SOURCE: Record<Review["source"], Record<"uz" | "ru", string>> = {
  google: { uz: "Google", ru: "Google" },
  yandex: { uz: "Yandex Xarita", ru: "Яндекс Карты" },
  telegram: { uz: "Telegram", ru: "Telegram" },
};

const Avatar = ({ name, size = "h-9 w-9" }: { name: string; size?: string }) => (
  <span className={`grid ${size} shrink-0 place-items-center rounded-full bg-stone text-[12px] font-medium text-ink-soft`}>{initials(name)}</span>
);

function ReviewCard({ r }: { r: Review }) {
  const { t, lang, doctor } = useSite();
  const text = r.text[lang].replaceAll("{doctor}", doctor.firstName[lang]);

  if (r.source === "telegram") {
    return (
      <figure className="flex h-full flex-col overflow-hidden rounded-[16px] border border-line bg-stone">
        <figcaption className="flex items-center gap-3 border-b border-line bg-card px-4 py-3">
          <Avatar name={r.author} />
          <span className="leading-tight">
            <span className="block text-[14px] font-medium text-ink">{r.author}</span>
            <span className="text-[12px] text-muted">{SOURCE.telegram[lang]}</span>
          </span>
        </figcaption>
        <div className="flex-1 space-y-2 p-4">
          <blockquote className="mr-8 rounded-[16px] rounded-bl-[4px] bg-card px-3.5 py-2.5 text-[14.5px] leading-snug text-ink shadow-sm">
            {text}
            <span className="ml-2 inline-block translate-y-1 tabular-nums text-[12px] text-muted">{r.time}</span>
          </blockquote>
          {r.reply ? (
            <p className="ml-10 rounded-[16px] rounded-br-[4px] bg-accent-soft px-3.5 py-2.5 text-[14.5px] leading-snug text-ink shadow-sm">
              {r.reply[lang]}
              <span className="ml-2 inline-flex translate-y-1 items-center gap-0.5 tabular-nums text-[12px] text-accent">
                {r.time} <CheckCheck size={13} strokeWidth={2} />
              </span>
            </p>
          ) : null}
        </div>
      </figure>
    );
  }

  return (
    <figure className="h-full rounded-[16px] border border-line bg-card p-5">
      <figcaption className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <Avatar name={r.author} />
          <span className="leading-tight">
            <span className="block text-[14px] font-medium text-ink">{r.author}</span>
            <span className="text-[12px] text-muted">{t.reviews.ago[r.ago]}</span>
          </span>
        </span>
        <span className="text-[12.5px] text-muted">{SOURCE[r.source][lang]}</span>
      </figcaption>
      <div className="mt-3">
        <Stars />
      </div>
      <blockquote className="mt-3 text-[15px] leading-relaxed text-ink-soft">{text}</blockquote>
    </figure>
  );
}

export function Reviews() {
  const { t, lang, doctor } = useSite();
  // The lead quote is attributed with the Google badge and stars, so it must be a Google review.
  const list = doctor.reviews ?? reviews;
  const lead = list.find((r) => r.source === "google");
  const rest = list.filter((r) => r !== lead);
  const strip = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  // Arrows reflect where the strip is, so a tap at either end never looks like a dead button.
  const syncEdges = useCallback(() => {
    const el = strip.current;
    if (el) setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft > el.scrollWidth - el.clientWidth - 8 });
  }, []);
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  // Step exactly one card (snap-aligned), and land there even where smooth scrolling is throttled or ignored.
  const nudge = (dir: number) => {
    const el = strip.current;
    if (!el) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const lefts = Array.from(el.children, (c) => (c as HTMLElement).offsetLeft - el.offsetLeft - pad);
    const now = el.scrollLeft;
    const target = dir > 0 ? lefts.find((l) => l > now + 4) : [...lefts].reverse().find((l) => l < now - 4);
    if (target === undefined) return;
    const left = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(() => {
      if (Math.abs(el.scrollLeft - now) < 2) el.scrollTo({ left, behavior: "auto" });
      syncEdges();
    }, 450);
  };
  const leadText = lead?.text[lang].replaceAll("{doctor}", doctor.firstName[lang]);

  // No real reviews yet: show nothing rather than examples about a real doctor.
  if (!list.length) return null;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-[680px]">
          <h2 id="reviews-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[40px]">
            {t.reviews.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{t.reviews.sub}</p>
        </Reveal>

        {/* One voice, large */}
        {lead ? (
          <Reveal as="figure" className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
            <blockquote className="font-display text-[26px] leading-[1.3] tracking-[-0.01em] text-ink text-pretty sm:text-[34px] lg:col-span-8">
              <span aria-hidden className="mr-1 text-accent">“</span>
              {leadText}
              <span aria-hidden className="text-accent">”</span>
            </blockquote>
            <figcaption className="flex items-start gap-3 lg:col-span-4 lg:border-l lg:border-line lg:pt-3 lg:pl-8">
              <Avatar name={lead.author} size="h-11 w-11" />
              <span className="leading-snug">
                <span className="block text-[15px] font-medium text-ink">{lead.author}</span>
                <span className="mt-1 flex items-center gap-2 text-[13px] text-muted">
                  <Stars /> {t.reviews.ago[lead.ago]}
                </span>
                <span className="mt-1 block text-[13px] text-muted">{SOURCE[lead.source][lang]}</span>
              </span>
            </figcaption>
          </Reveal>
        ) : null}

        {/* The rest, as a strip */}
        <div className="mt-14 flex items-center justify-end gap-2">
          <button type="button" onClick={() => nudge(-1)} disabled={edges.start} aria-label={t.reviews.prev} className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition hover:bg-stone disabled:opacity-40">
            <ArrowLeft size={17} strokeWidth={1.6} />
          </button>
          <button type="button" onClick={() => nudge(1)} disabled={edges.end} aria-label={t.reviews.next} className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition hover:bg-stone disabled:opacity-40">
            <ArrowRight size={17} strokeWidth={1.6} />
          </button>
        </div>
        <ul ref={strip} className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:scroll-px-0 md:px-0">
          {rest.map((r) => (
            <li key={r.id} className="w-[86%] shrink-0 snap-start sm:w-[360px]">
              <ReviewCard r={r} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
