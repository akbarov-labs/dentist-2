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

  return (
    <section id="services" aria-labelledby="services-title" className="border-t border-line bg-stone/60 py-20 md:py-28">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <h2 id="services-title" data-scroll-target tabIndex={-1} className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink outline-none sm:text-[46px]">
            {t.services.title}
          </h2>
          <p className="mt-4 max-w-[40ch] text-[16px] leading-relaxed text-muted">{t.services.sub}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a href={telegramLink(doctor.contact.telegram, tgText)} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
              <Send size={16} strokeWidth={1.7} className="shrink-0" />
              {t.calc.askTg}
            </a>
            <button type="button" onClick={() => scrollToId("booking")} className={`${btnSecondary} group`}>
              {t.cta.book}
              <ArrowRight size={17} strokeWidth={1.7} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <dl className="border-b border-ink/10 lg:col-span-8">
          {rows.map((r) => (
            <div key={r.label.uz} className="grid gap-x-8 gap-y-1 border-t border-ink/10 py-6 sm:grid-cols-[1fr_auto] sm:items-baseline">
              <dt>
                <span className="block font-display text-[21px] leading-snug text-ink sm:text-[23px]">{r.label[lang]}</span>
                {r.lead ? <span className="mt-1 block max-w-[52ch] text-[15px] leading-relaxed text-muted">{r.lead[lang]}</span> : null}
              </dt>
              <dd className="tabular-nums text-[16px] whitespace-nowrap text-ink-soft sm:text-right">
                {r.from !== undefined ? from(r.from) : r.note?.[lang]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
