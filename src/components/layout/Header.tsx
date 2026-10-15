"use client";

import { Menu, Phone, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSite } from "@/context/SiteContext";
import { isOpenNow, phoneHref, telegramLink } from "@/lib/format";
import { Monogram } from "@/components/ui/Monogram";
import { LangToggle } from "@/components/ui/LangToggle";
import { btnPrimary, btnSmall } from "@/components/ui/styles";

export const NAV_IDS = ["approach", "cases", "services", "calculator", "credentials", "booking"] as const;

export function Header() {
  const { t, doctor, lang, scrollToId } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<boolean | null>(null);

  const labels: Record<(typeof NAV_IDS)[number], string> = {
    approach: t.nav.approach,
    cases: t.nav.cases,
    services: t.nav.services,
    calculator: t.nav.calculator,
    credentials: t.nav.credentials,
    booking: t.nav.location,
  };

  // Header gets its hairline once the hero top leaves the viewport (sentinel, no scroll listener).
  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Highlight the section currently in the middle band of the viewport.
  useEffect(() => {
    const sections = NAV_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Live "open now" state in Tashkent time, refreshed every minute.
  useEffect(() => {
    const tick = () => setOpen(isOpenNow(doctor));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [doctor]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  const status = (compact: boolean) => (
    <span title={`${doctor.hours.days[lang]}, ${doctor.hours.time}`} className="inline-flex items-center gap-2 text-[13px] whitespace-nowrap text-ink-soft">
      <span
        className={`live-dot relative h-2 w-2 rounded-full ${open === false ? "bg-bronze text-bronze" : "bg-[#2f8f5b] text-[#2f8f5b]"}`}
        aria-hidden
      />
      <span>
        {t.status.label}: <span className={compact ? "" : "hidden"}>{doctor.hours.daysShort[lang]}</span>
        <span className={compact ? "hidden" : ""}>{doctor.hours.days[lang]}</span>
        <span className="sr-only">. {open ? t.status.openNow : t.status.closedNow}</span>
      </span>
    </span>
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[80] rounded-full bg-emerald px-4 py-2 text-alabaster focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t.nav.skip}
      </a>
      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
          scrolled ? "border-b border-line/80 bg-alabaster/85 backdrop-blur-xl" : "border-b border-transparent bg-alabaster"
        }`}
      >
        <div className="shell flex h-[68px] items-center gap-4 lg:h-[76px]">
          <a href="#top" onClick={(e) => (e.preventDefault(), go("top"))} className="flex min-w-0 items-center gap-3 xl:shrink-0">
            <Monogram letters={doctor.monogram} className="h-10 w-10 shrink-0 lg:h-11 lg:w-11" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-[17px] font-medium tracking-[-0.01em] text-ink lg:text-[18px] xl:overflow-visible">
                {doctor.name[lang]}
              </span>
              <span className="hidden truncate text-[12px] text-muted sm:block xl:hidden">{doctor.practice[lang]}</span>
            </span>
          </a>

          <nav aria-label={t.nav.menu} className="mx-auto hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {NAV_IDS.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => (e.preventDefault(), go(id))}
                    aria-current={active === id ? "true" : undefined}
                    className={`relative rounded-full px-2 py-2 text-[13.5px] whitespace-nowrap transition-colors ${
                      active === id ? "text-emerald" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {labels[id]}
                    <span
                      className={`absolute inset-x-2 -bottom-0.5 h-px origin-left bg-bronze transition-transform duration-500 ${
                        active === id ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-3 xl:ml-0">
            <div className="hidden min-[1440px]:block">{status(true)}</div>
            <div className="hidden sm:block">
              <LangToggle />
            </div>
            <div className="hidden md:block">
              <button type="button" onClick={() => go("booking")} className={`${btnPrimary} h-11`}>
                <span className="xl:hidden">{t.cta.book}</span>
                <span className="hidden xl:inline">{t.cta.bookShort}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.nav.menu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink xl:hidden"
            >
              <Menu size={20} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div id="mobile-menu" className="fixed inset-0 z-[60] xl:hidden" role="dialog" aria-modal="true" aria-label={t.nav.menu}>
          <button
            type="button"
            tabIndex={-1}
            aria-label={t.nav.close}
            className="absolute inset-0 bg-obsidian/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="enter absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col bg-alabaster px-6 pt-5 pb-8 shadow-[var(--shadow-lift)]" style={{ animationDuration: "0.4s" }}>
            <div className="flex items-center justify-between">
              <LangToggle />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t.nav.close}
                autoFocus
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card"
              >
                <X size={20} strokeWidth={1.6} />
              </button>
            </div>
            <ul className="mt-10 space-y-1">
              {NAV_IDS.map((id, i) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => (e.preventDefault(), go(id))}
                    className="flex items-baseline gap-4 py-3 font-display text-[28px] tracking-[-0.01em] text-ink"
                  >
                    <span className="font-mono text-[11px] text-bronze-deep">0{i + 1}</span>
                    {labels[id]}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto space-y-4">
              {status(false)}
              <div className="grid grid-cols-2 gap-3">
                <a href={phoneHref(doctor.contact.phone)} className={`${btnSmall} border border-line bg-card text-ink`}>
                  <Phone size={16} strokeWidth={1.6} /> {t.cta.call}
                </a>
                <a href={telegramLink(doctor.contact.telegram)} target="_blank" rel="noopener noreferrer" className={`${btnSmall} border border-line bg-card text-ink`}>
                  <Send size={16} strokeWidth={1.6} /> {t.cta.telegram}
                </a>
              </div>
              <button type="button" onClick={() => go("booking")} className={`${btnPrimary} w-full`}>
                {t.cta.book}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
