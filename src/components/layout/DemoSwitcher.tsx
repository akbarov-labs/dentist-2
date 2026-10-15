"use client";

import { Check, Settings2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { doctorPresets, site, type PresetId } from "@/config/doctorConfig";
import { useSite } from "@/context/SiteContext";
import { LangToggle } from "@/components/ui/LangToggle";
import { SafeImage } from "@/components/ui/SafeImage";

/**
 * Presenter-only control: swap the demo persona live during a sales pitch.
 * Hidden entirely when `site.showDemoSwitcher` is false.
 */
export function DemoSwitcher() {
  const { t, lang, presetId, setPresetId } = useSite();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  if (!site.showDemoSwitcher) return null;

  return (
    <div ref={wrap} className="fixed bottom-[92px] left-3 z-[55] md:bottom-5 md:left-5">
      {open ? (
        <div id="demo-panel" className="enter mb-3 w-[min(320px,calc(100vw-24px))] rounded-[20px] border border-obsidian-line bg-obsidian p-4 text-alabaster shadow-[var(--shadow-lift)]" style={{ animationDuration: "0.35s" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[14px] font-medium">{t.demo.title}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-alabaster/60">{t.demo.sub}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={t.modal.close} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-alabaster/70 hover:bg-obsidian-2 hover:text-alabaster">
              <X size={16} strokeWidth={1.7} />
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {(Object.keys(doctorPresets) as PresetId[]).map((id) => {
              const p = doctorPresets[id];
              const active = id === presetId;
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPresetId(id)}
                    className={`flex w-full items-center gap-3 rounded-[14px] border p-2.5 text-left transition ${
                      active ? "border-bronze/60 bg-obsidian-2" : "border-obsidian-line hover:bg-obsidian-2/70"
                    }`}
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-obsidian-2">
                      <SafeImage src={p.portrait.src} alt="" fill sizes="44px" className="object-cover" style={{ objectPosition: p.portrait.position }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium">{p.name[lang]}</span>
                      <span className="block truncate text-[12px] text-alabaster/55">{p.presetLabel[lang]}</span>
                    </span>
                    {active ? <Check size={16} strokeWidth={2} className="shrink-0 text-bronze-light" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-obsidian-line pt-4">
            <span className="text-[12.5px] text-alabaster/60">{t.demo.lang}</span>
            <LangToggle tone="dark" />
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="demo-panel"
        aria-label={t.demo.toggle}
        className="group inline-flex h-10 items-center rounded-full border border-obsidian-line bg-obsidian/90 px-[11px] font-mono text-[11.5px] tracking-[0.04em] text-alabaster/85 shadow-[var(--shadow-soft)] backdrop-blur transition hover:text-alabaster"
      >
        <Settings2 size={16} strokeWidth={1.6} className={`shrink-0 transition-transform duration-500 ${open ? "rotate-90" : ""}`} />
        <span
          aria-hidden
          className={`overflow-hidden whitespace-nowrap transition-[max-width,margin] duration-500 ease-[var(--ease-atelier)] group-hover:ml-2 group-hover:max-w-[140px] group-focus-visible:ml-2 group-focus-visible:max-w-[140px] ${
            open ? "ml-2 max-w-[140px]" : "max-w-0"
          }`}
        >
          {t.demo.toggle}
        </span>
      </button>
    </div>
  );
}
