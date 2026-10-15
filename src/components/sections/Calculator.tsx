"use client";

import { ArrowDown, Check, Send } from "lucide-react";
import type { ReactNode } from "react";
import type { MaterialId, ProblemId } from "@/config/doctorConfig";
import { site } from "@/config/doctorConfig";
import { useSite } from "@/context/SiteContext";
import { buildTelegramText, computeEstimate } from "@/lib/estimate";
import { formatMillions, formatUSD, formatUZS, telegramLink } from "@/lib/format";
import { noBreakHyphens } from "@/lib/text";
import { Reveal } from "@/components/ui/Reveal";

const PROBLEMS: ProblemId[] = ["single", "multiple", "fullArch", "aesthetic"];
const MATERIALS: MaterialId[] = ["premium", "swiss"];

function Step({ n, legend, children }: { n: number; legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="flex items-center gap-3 text-[17px] font-medium text-ink">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-bronze/45 font-mono text-[12px] text-bronze-deep">0{n}</span>
        {legend}
      </legend>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Option({
  name,
  checked,
  onSelect,
  title,
  note,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  title: string;
  note: string;
}) {
  return (
    <label
      className={`group relative flex cursor-pointer items-start gap-3 rounded-[16px] border p-4 transition duration-200 ${
        checked ? "border-emerald bg-emerald-soft/70 shadow-[inset_0_0_0_1px_var(--color-emerald)]" : "border-line bg-card hover:border-ink/25"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="peer sr-only" />
      <span
        aria-hidden
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze ${
          checked ? "border-emerald bg-emerald text-alabaster" : "border-ink/25"
        }`}
      >
        {checked ? <Check size={12} strokeWidth={2.4} /> : null}
      </span>
      <span>
        <span className="block text-[15px] leading-snug font-medium text-ink">{noBreakHyphens(title)}</span>
        <span className="mt-1 block text-[13px] leading-snug text-muted">{note}</span>
      </span>
    </label>
  );
}

export function Calculator() {
  const { t, doctor, lang, calc, setCalc, setPrefill, scrollToId } = useSite();
  const est = computeEstimate(doctor, calc, lang);
  const tgText = buildTelegramText(doctor, lang, t, { kind: "calculator", selection: calc });

  const fromNote = (p: ProblemId) => {
    const v = formatMillions(doctor.pricing[p][calc.material].min, lang);
    return lang === "ru" ? `${t.services.from} ${v} ${t.calc.currency}` : `${v} ${t.calc.currency}${t.services.from}`;
  };

  const bookWithEstimate = () => {
    setPrefill({ kind: "calculator", selection: { ...calc } });
    scrollToId("booking");
  };

  return (
    <section id="calculator" aria-labelledby="calc-title" className="py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-[680px]">
          <h2 id="calc-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
            {t.calc.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{t.calc.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="space-y-10 lg:col-span-7">
            <Step n={1} legend={t.calc.q1}>
              {PROBLEMS.map((p) => (
                <Option key={p} name="problem" checked={calc.problem === p} onSelect={() => setCalc({ problem: p })} title={t.calc.problems[p]} note={fromNote(p)} />
              ))}
            </Step>
            <Step n={2} legend={t.calc.q2}>
              {MATERIALS.map((m) => (
                <Option key={m} name="material" checked={calc.material === m} onSelect={() => setCalc({ material: m })} title={t.calc.materials[m]} note={t.calc.materialNotes[m]} />
              ))}
            </Step>
            <Step n={3} legend={t.calc.q3}>
              <Option name="ct" checked={calc.hasCt} onSelect={() => setCalc({ hasCt: true })} title={t.calc.ct.yes} note={t.calc.ctNotes.yes} />
              <Option name="ct" checked={!calc.hasCt} onSelect={() => setCalc({ hasCt: false })} title={t.calc.ct.no} note={t.calc.ctNotes.no} />
            </Step>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="overflow-hidden rounded-[20px] border border-line bg-card shadow-[var(--shadow-lift)] lg:sticky lg:top-24">
              <div className="bg-emerald px-6 py-6 text-alabaster sm:px-8 sm:py-7" aria-live="polite">
                <p className="font-mono text-[11px] tracking-[0.16em] text-bronze-light uppercase">{t.calc.result}</p>
                <p key={`${est.min}-${est.max}`} className="hud-in mt-3 font-mono text-[26px] leading-tight tracking-[-0.02em] sm:text-[30px]">
                  {formatUZS(est.min)}
                  <span className="text-alabaster/50"> – </span>
                  <span className="whitespace-nowrap">{formatUZS(est.max)}</span>
                </p>
                <p className="mt-2 text-[13.5px] text-alabaster/70">
                  {t.calc.currency}
                  {est.unitNote ? ` · ${est.unitNote}` : ""}
                  <span className="font-mono"> · {t.calc.usd} {formatUSD(est.min, site.usdRate)}–{formatUSD(est.max, site.usdRate).slice(1)}</span>
                </p>
              </div>

              <div className="px-6 py-6 sm:px-8">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <div>
                    <dt className="text-[12.5px] text-muted">{t.calc.visits}</dt>
                    <dd className="mt-1 font-mono text-[14.5px] text-ink">{est.visits}</dd>
                  </div>
                  <div>
                    <dt className="text-[12.5px] text-muted">{t.calc.surgery}</dt>
                    <dd className="mt-1 font-mono text-[14.5px] text-ink">{est.surgeryTime}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[12.5px] text-muted">{t.calc.ctLine}</dt>
                    <dd className="mt-1 font-mono text-[14.5px] text-ink">
                      {est.ctCost ? `+${formatUZS(est.ctCost)} ${t.calc.currency} · ${t.calc.ctAdded}` : t.calc.ctIncluded}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-[12.5px] text-muted">{t.calc.included}</p>
                  <ul className="mt-3 space-y-2.5">
                    {est.bonuses.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-ink">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-soft text-emerald">
                          <Check size={12} strokeWidth={2.4} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-6 text-[12.5px] leading-relaxed text-muted">{t.calc.disclaimer}</p>

                <div className="mt-6 grid gap-3">
                  <button
                    type="button"
                    onClick={bookWithEstimate}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald px-6 py-3 text-center text-[15px] leading-tight font-medium text-alabaster shadow-[0_10px_24px_-12px_rgb(15_61_62/0.7)] transition hover:bg-emerald-2 active:translate-y-px"
                  >
                    {t.calc.bookWith}
                    <ArrowDown size={16} strokeWidth={1.8} className="shrink-0" />
                  </button>
                  <a
                    href={telegramLink(doctor.contact.telegram, tgText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 bg-card px-6 py-3 text-center text-[15px] leading-tight font-medium text-ink transition hover:border-ink/35 active:translate-y-px"
                  >
                    <Send size={16} strokeWidth={1.7} className="shrink-0 text-emerald" />
                    {t.calc.sendTg}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
