"use client";

import { Send } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { telegramLink } from "@/lib/format";
import { SafeImage } from "@/components/ui/SafeImage";
import { btnPrimary } from "@/components/ui/styles";

/**
 * The questions as he actually gets them: a Telegram thread seen from the patient's side.
 * The patient's question sits on the right, his answer on the left under his photo, and the thread ends
 * where the visitor's own question would go. Every answer is visible: five short replies need no accordion.
 */
export function Faq() {
  const { t, doctor, lang } = useSite();

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-stone/60 py-20 md:py-28">
      <div className="shell">
        <div className="mx-auto max-w-[760px]">
          <h2 id="faq-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[40px]">
            {t.faq.title}
          </h2>

          <ul className="mt-10 space-y-8">
            {t.faq.items.map((item) => (
              <li key={item.q} className="space-y-2">
                <h3 className="ml-auto w-fit max-w-[85%] rounded-[18px] rounded-br-[4px] bg-accent text-[15px] sm:text-[16px] leading-snug font-medium text-paper sm:max-w-[75%]">
                  <span className="block px-4 py-3">{item.q}</span>
                </h3>
                <div className="flex items-end gap-2.5">
                  <span aria-hidden className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-stone">
                    <SafeImage src={doctor.portrait.src} alt="" fill sizes="32px" className="object-cover" style={{ objectPosition: "50% 22%" }} />
                  </span>
                  <p className="max-w-[calc(100%-2.5rem)] rounded-[18px] rounded-bl-[4px] bg-card px-4 py-3 text-[15px] leading-relaxed sm:text-[16px] text-ink-soft shadow-[0_1px_0_rgb(28_36_33/0.05)] sm:max-w-[80%]">
                    <span className="sr-only">{doctor.name[lang]}: </span>
                    {item.a}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Where the visitor's own question goes */}
          <div className="mt-12 flex flex-col gap-4 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[40ch] text-[16px] leading-relaxed text-ink-soft">{t.faq.sub}</p>
            <a href={telegramLink(doctor.contact.telegram)} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} shrink-0`}>
              <Send size={16} strokeWidth={1.7} /> @{doctor.contact.telegram}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
