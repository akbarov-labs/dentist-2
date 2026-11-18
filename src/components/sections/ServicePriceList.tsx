"use client";

import { ArrowRight, Send } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { formatMillions, telegramLink } from "@/lib/format";
import { btnPrimary, btnSecondary } from "@/components/ui/styles";

/**
 * Services and prices as one list: each treatment, how he does it in one line, and its "from" price.
 * Used instead of the services grid and the calculator when the doctor has a price list.
 */
export function ServicePriceList() {
  const { t, doctor, lang, scrollToId } = useSite();
  const rows = doctor.priceList ?? [];
  const from = (v: number) =>
    lang === "ru" ? `${t.services.from} ${formatMillions(v, lang)} ${t.calc.currency}` : `${formatMillions(v, lang)} ${t.calc.currency}${t.services.from}`;
  const tgText = `${t.tg.hello} ${doctor.firstName[lang]}!\n${t.calc.askTgText}`;

  // Set as the one object it is in his surgery: a price sheet, read top to bottom, name to price along a dotted leader.
  return (
    <section id="services" aria-labelledby="services-title" className="border-t border-line py-20 md:py-28">
      <div className="shell">
        <div className="mx-auto max-w-[920px] rounded-[16px] border border-line bg-card px-5 py-10 sm:px-12 sm:py-14">
          <div className="sm:flex sm:items-end sm:justify-between sm:gap-10">
            <h2 id="services-title" data-scroll-target tabIndex={-1} className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink outline-none sm:text-[40px]">
              {t.services.title}
            </h2>
            <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-muted sm:mt-0 sm:text-right">{t.services.sub}</p>
          </div>

          <dl className="mt-10 border-b border-line">
            {rows.map((r) => (
              <div key={r.label.uz} className="grid items-baseline gap-x-4 border-t border-line py-5 sm:grid-cols-[1fr_auto]">
                <dt className="flex min-w-0 items-baseline gap-4 font-display text-[20px] leading-snug text-ink after:hidden after:h-px after:min-w-6 after:flex-1 after:translate-y-[-0.3em] after:border-b after:border-dotted after:border-ink/35 after:content-[''] sm:text-[23px] sm:after:block">
                  <span className="min-w-0">{r.label[lang]}</span>
                </dt>
                <dd className="mt-1 tabular-nums text-[16px] whitespace-nowrap text-accent sm:mt-0 sm:text-ink">{r.from !== undefined ? from(r.from) : r.note?.[lang]}</dd>
                {r.lead ? <dd className="mt-1.5 max-w-[60ch] sm:col-span-2 text-[14.5px] leading-relaxed text-muted">{r.lead[lang]}</dd> : null}
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => scrollToId("booking")} className={`${btnPrimary} group`}>
              {t.cta.book}
              <ArrowRight size={17} strokeWidth={1.7} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <a href={telegramLink(doctor.contact.telegram, tgText)} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
              <Send size={16} strokeWidth={1.7} className="shrink-0 text-accent" />
              {t.calc.askTg}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
