/** Shared class recipes so every CTA on the page looks and behaves the same. */

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition duration-300 ease-[var(--ease-atelier)] active:translate-y-px active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60";

export const btnPrimary = `${base} h-12 px-6 text-[15px] bg-emerald text-alabaster shadow-[0_10px_24px_-12px_rgb(15_61_62/0.7)] hover:bg-emerald-2`;

export const btnSecondary = `${base} h-12 px-6 text-[15px] border border-ink/15 bg-card text-ink hover:border-ink/35`;

export const btnDark = `${base} h-12 px-6 text-[15px] bg-alabaster text-obsidian hover:bg-white`;

export const btnSmall = `${base} h-10 px-4 text-sm`;

export const chip =
  "inline-flex items-center gap-2 rounded-full border px-4 h-10 text-sm whitespace-nowrap transition duration-200";
