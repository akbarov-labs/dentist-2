"use client";

import { CalendarCheck, Phone, Send } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { phoneHref, telegramLink } from "@/lib/format";

/** Fixed thumb-reach action bar for phones (< 768px). */
export function MobileBar() {
  const { t, doctor, scrollToId } = useSite();
  const item = "flex h-12 flex-col items-center justify-center gap-0.5 rounded-full text-[11.5px] font-medium";

  return (
    <nav
      aria-label={t.cta.bookShort}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-alabaster/90 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-[1fr_1fr_1.6fr] gap-2">
        <a href={phoneHref(doctor.contact.phone)} className={`${item} text-ink`}>
          <Phone size={18} strokeWidth={1.6} className="text-emerald" />
          {t.cta.call}
        </a>
        <a href={telegramLink(doctor.contact.telegram)} target="_blank" rel="noopener noreferrer" className={`${item} text-ink`}>
          <Send size={18} strokeWidth={1.6} className="text-emerald" />
          {t.cta.telegram}
        </a>
        <button type="button" onClick={() => scrollToId("booking")} className={`${item} flex-row gap-2 bg-emerald text-[14px] text-alabaster active:scale-[0.98]`}>
          <CalendarCheck size={17} strokeWidth={1.6} />
          {t.cta.bookShort}
        </button>
      </div>
    </nav>
  );
}
