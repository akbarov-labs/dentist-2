"use client";

import { Plus, Send } from "lucide-react";
import { useState } from "react";
import { useSite } from "@/context/SiteContext";
import { telegramLink } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { btnSecondary } from "@/components/ui/styles";

export function Faq() {
  const { t, doctor } = useSite();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-line py-20 md:py-28">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="faq-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
              {t.faq.title}
            </h2>
            <p className="mt-4 max-w-[34ch] text-[16px] leading-relaxed text-muted">{t.faq.sub}</p>
            <a href={telegramLink(doctor.contact.telegram)} target="_blank" rel="noopener noreferrer" className={`${btnSecondary} mt-7`}>
              <Send size={16} strokeWidth={1.7} className="text-accent" /> @{doctor.contact.telegram}
            </a>
          </div>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-8">
          <ul className="divide-y divide-line border-y border-line">
            {t.faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q}>
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="text-[18px] leading-snug font-medium text-ink sm:text-[19px]">{item.q}</span>
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition duration-300 ${
                          isOpen ? "rotate-45 border-accent bg-accent text-paper" : "border-line text-ink"
                        }`}
                      >
                        <Plus size={16} strokeWidth={1.7} />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-atelier)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden" inert={!isOpen}>
                      <p className="max-w-[58ch] pb-7 text-[16px] leading-relaxed text-muted">{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
