"use client";

import { ArrowLeft, ArrowRight, CheckCheck, MapPin, Star } from "lucide-react";
import { useRef } from "react";
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

function Stars({ color }: { color: string }) {
  return (
    <span className="flex gap-0.5" aria-label="5/5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} strokeWidth={0} fill={color} />
      ))}
    </span>
  );
}

/** Google brand mark composed of the four official colours, used only as a source badge. */
function GoogleBadge() {
  return (
    <span className="font-sans text-[13px] font-semibold tracking-tight" aria-label="Google">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const { t, lang, doctor } = useSite();
  const text = r.text[lang].replaceAll("{doctor}", doctor.firstName[lang]);

  if (r.source === "telegram") {
    return (
      <figure className="flex h-full flex-col overflow-hidden rounded-[16px] border border-line bg-[#dfe7df]">
        <figcaption className="flex items-center gap-3 border-b border-black/5 bg-card/90 px-4 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald font-mono text-[12px] text-alabaster">{initials(r.author)}</span>
          <span className="leading-tight">
            <span className="block text-[14px] font-medium text-ink">{r.author}</span>
            <span className="text-[12px] text-[#2a6aa8]">Telegram</span>
          </span>
        </figcaption>
        <div className="flex-1 space-y-2 p-4" style={{ backgroundImage: "radial-gradient(rgb(15 61 62 / 0.06) 1px, transparent 1px)", backgroundSize: "14px 14px" }}>
          <blockquote className="mr-8 rounded-[16px] rounded-bl-[4px] bg-card px-3.5 py-2.5 text-[14.5px] leading-snug text-ink shadow-sm">
            {text}
            <span className="ml-2 inline-block translate-y-1 font-mono text-[12px] text-muted">{r.time}</span>
          </blockquote>
          {r.reply ? (
            <p className="ml-10 rounded-[16px] rounded-br-[4px] bg-[#e1f7cf] px-3.5 py-2.5 text-[14.5px] leading-snug text-ink shadow-sm">
              {r.reply[lang]}
              <span className="ml-2 inline-flex translate-y-1 items-center gap-0.5 font-mono text-[12px] text-[#3a7430]">
                {r.time} <CheckCheck size={13} strokeWidth={2} />
              </span>
            </p>
          ) : null}
        </div>
      </figure>
    );
  }

  const isGoogle = r.source === "google";
  return (
    <figure className="h-full rounded-[16px] border border-line bg-card p-5">
      <figcaption className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <span className={`grid h-9 w-9 place-items-center rounded-full font-mono text-[12px] ${isGoogle ? "bg-[#e8eefb] text-[#3561b8]" : "bg-[#fff3cf] text-[#8a6400]"}`}>{initials(r.author)}</span>
          <span className="leading-tight">
            <span className="block text-[14px] font-medium text-ink">{r.author}</span>
            <span className="text-[12px] text-muted">{t.reviews.ago[r.ago]}</span>
          </span>
        </span>
        {isGoogle ? (
          <GoogleBadge />
        ) : (
          <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink">
            <MapPin size={14} strokeWidth={0} fill="#fc3f1d" /> {lang === "ru" ? "Яндекс Карты" : "Yandex Xarita"}
          </span>
        )}
      </figcaption>
      <div className="mt-3">
        <Stars color={isGoogle ? "#fbbc05" : "#ffcc00"} />
      </div>
      <blockquote className="mt-3 text-[15px] leading-relaxed text-ink-soft">{text}</blockquote>
    </figure>
  );
}

export function Reviews() {
  const { t, lang, doctor } = useSite();
  // The lead quote is attributed with the Google badge and stars, so it must be a Google review.
  const lead = reviews.find((r) => r.source === "google");
  const rest = reviews.filter((r) => r !== lead);
  const strip = useRef<HTMLUListElement>(null);
  const nudge = (dir: number) => {
    const el = strip.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };
  const leadText = lead?.text[lang].replaceAll("{doctor}", doctor.firstName[lang]);

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-[680px]">
          <h2 id="reviews-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
            {t.reviews.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{t.reviews.sub}</p>
        </Reveal>

        {/* One voice, large */}
        {lead ? (
          <Reveal as="figure" className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
            <blockquote className="font-display text-[26px] leading-[1.3] tracking-[-0.01em] text-ink text-pretty sm:text-[34px] lg:col-span-8">
              <span aria-hidden className="mr-1 text-bronze">“</span>
              {leadText}
              <span aria-hidden className="text-bronze">”</span>
            </blockquote>
            <figcaption className="flex items-start gap-3 lg:col-span-4 lg:border-l lg:border-line lg:pt-3 lg:pl-8">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e8eefb] font-mono text-[13px] text-[#3561b8]">{initials(lead.author)}</span>
              <span className="leading-snug">
                <span className="block text-[15px] font-medium text-ink">{lead.author}</span>
                <span className="mt-1 flex items-center gap-2 text-[13px] text-muted">
                  <Stars color="#fbbc05" /> {t.reviews.ago[lead.ago]}
                </span>
                <span className="mt-2 block">
                  <GoogleBadge />
                </span>
              </span>
            </figcaption>
          </Reveal>
        ) : null}

        {/* The rest, as a strip */}
        <div className="mt-14 flex items-center justify-end gap-2">
          <button type="button" onClick={() => nudge(-1)} aria-label={t.reviews.prev} className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition hover:bg-stone">
            <ArrowLeft size={17} strokeWidth={1.6} />
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label={t.reviews.next} className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition hover:bg-stone">
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
