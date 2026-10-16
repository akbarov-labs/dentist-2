"use client";

import type { Lang } from "@/config/doctorConfig";
import { useSite } from "@/context/SiteContext";

const OPTIONS: { id: Lang; label: string; full: string }[] = [
  { id: "uz", label: "O‘Z", full: "O‘zbekcha" },
  { id: "ru", label: "РУ", full: "Русский" },
];

export function LangToggle({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const { lang, setLang } = useSite();
  const wrap = tone === "light" ? "border-line bg-card" : "border-night-line bg-night-2";
  return (
    <div role="group" aria-label="Til / Язык" className={`relative inline-flex h-11 items-center rounded-full border p-1 ${wrap} ${className}`}>
      <span
        aria-hidden
        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-accent transition-transform duration-300 ease-[var(--ease-atelier)] ${
          lang === "ru" ? "translate-x-full" : ""
        }`}
      />
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          lang={o.id}
          aria-pressed={lang === o.id}
          aria-label={o.full}
          onClick={() => setLang(o.id)}
          className={`relative z-[1] h-full w-11 rounded-full tabular-nums text-[12px] tracking-[0.06em] transition-colors ${
            lang === o.id ? "text-paper" : tone === "light" ? "text-ink-soft hover:text-ink" : "text-paper/70 hover:text-paper"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
