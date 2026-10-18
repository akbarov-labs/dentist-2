"use client";

import { CalendarCheck, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useSite } from "@/context/SiteContext";
import { phoneHref, telegramLink } from "@/lib/format";

/** Fixed thumb-reach action bar for phones (< 768px). */
export function MobileBar() {
  const { t, doctor, lang, scrollToId } = useSite();
  // A neutral greeting: not everyone tapping Telegram is in pain (the hero has its own urgent button).
  const tgText = `${t.tg.hello} ${doctor.firstName[lang]}!\n${t.tg.generic}`;
  const [hidden, setHidden] = useState(false);

  // Step aside while the booking form itself is on screen, so the bar never covers its fields.
  useEffect(() => {
    // Observe the form card itself: the whole #booking section is several viewports tall on phones,
    // so a ratio threshold on it would never be reached.
    const target = document.querySelector("#booking [data-booking-card]");
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting));
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const item = "flex h-12 flex-col items-center justify-center gap-0.5 rounded-full text-[12px] font-medium";

  return (
    <nav
      aria-label={t.cta.bookShort}
      aria-hidden={hidden || undefined}
      inert={hidden}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-paper/90 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-500 ease-[var(--ease-atelier)] md:hidden ${hidden ? "translate-y-full" : ""}`}
    >
      <div className="grid grid-cols-[1fr_1fr_1.6fr] gap-2">
        <a href={phoneHref(doctor.contact.phone)} className={`${item} text-ink`}>
          <Phone size={18} strokeWidth={1.6} className="text-accent" />
          {t.cta.call}
        </a>
        <a href={telegramLink(doctor.contact.telegram, tgText)} target="_blank" rel="noopener noreferrer" className={`${item} text-ink`}>
          <Send size={18} strokeWidth={1.6} className="text-accent" />
          {t.cta.telegram}
        </a>
        <button type="button" onClick={() => scrollToId("booking")} className={`${item} flex-row gap-2 bg-accent text-[14px] text-paper active:scale-[0.98]`}>
          <CalendarCheck size={17} strokeWidth={1.6} />
          {t.cta.bookShort}
        </button>
      </div>
    </nav>
  );
}
