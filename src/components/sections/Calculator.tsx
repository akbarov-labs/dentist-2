"use client";

import { ArrowDown, Check, Send, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { MaterialId, ProblemId } from "@/config/doctorConfig";
import { defaultCalcProblems, site } from "@/config/doctorConfig";
import { useSite } from "@/context/SiteContext";
import { buildTelegramText, computeEstimate } from "@/lib/estimate";
import { formatMillions, formatUSD, formatUZS, telegramLink } from "@/lib/format";
import { noBreakHyphens } from "@/lib/text";
import { Reveal } from "@/components/ui/Reveal";

const MATERIALS: MaterialId[] = ["premium", "swiss"];

function Step({ n, legend, children }: { n: number; legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="flex items-center gap-3 text-[17px] font-medium text-ink">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-accent/45 tabular-nums text-[12px] text-accent">0{n}</span>
        {legend}
      </legend>
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">{children}</div>
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
      className={`group relative flex cursor-pointer items-start gap-2.5 rounded-[14px] border p-3.5 transition duration-200 sm:gap-3 sm:p-4 ${
        checked ? "border-accent bg-accent-soft/70 shadow-[inset_0_0_0_1px_var(--color-accent)]" : "border-line bg-card hover:border-ink/25"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="peer sr-only" />
      <span
        aria-hidden
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
          checked ? "border-accent bg-accent text-paper" : "border-ink/25"
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
  const problems = doctor.calcProblems ?? defaultCalcProblems;
  const est = computeEstimate(doctor, calc, lang);
  // 0% instalments over the practice's plan length, rounded to the nearest thousand so'm
  const months = est.installment ? doctor.installmentMonths : undefined;
  const monthly = months ? Math.round(est.min / months / 1000) * 1000 : 0;
  const tgText = buildTelegramText(doctor, lang, t, { kind: "calculator", selection: calc });

  const fromNote = (p: ProblemId) => {
    const v = formatMillions(doctor.pricing[p][calc.material].min, lang);
    const ct = doctor.pricing[p].needsCt !== false && doctor.ctScanPrice ? ` ${t.services.ctExtra}` : "";
    return lang === "ru" ? `${t.services.from} ${v} ${t.calc.currency}${ct}` : `${v} ${t.calc.currency}${t.services.from}${ct}`;
  };

  const bookWithEstimate = () => {
    setPrefill({ kind: "calculator", selection: { ...calc } });
    scrollToId("booking");
  };

  return (
    <section id="calculator" aria-labelledby="calc-title" className="py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-[680px]">
          <h2 id="calc-title" data-scroll-target tabIndex={-1} className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink outline-none sm:text-[46px]">
            {t.calc.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{t.calc.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="space-y-10 lg:col-span-7">
            <Step n={1} legend={t.calc.q1}>
              {problems.map((p) => (
                <Option key={p} name="problem" checked={calc.problem === p} onSelect={() => setCalc({ problem: p })} title={t.calc.problems[p]} note={fromNote(p)} />
              ))}
            </Step>
            <Step n={2} legend={t.calc.q2}>
              {MATERIALS.map((m) => (
                <Option key={m} name="material" checked={calc.material === m} onSelect={() => setCalc({ material: m })} title={t.calc.materials[m]} note={t.calc.materialNotes[m]} />
              ))}
            </Step>
            {est.needsCt ? (
              <Step n={3} legend={t.calc.q3}>
                <Option name="ct" checked={calc.hasCt} onSelect={() => setCalc({ hasCt: true })} title={t.calc.ct.yes} note={t.calc.ctNotes.yes} />
                <Option name="ct" checked={!calc.hasCt} onSelect={() => setCalc({ hasCt: false })} title={t.calc.ct.no} note={t.calc.ctNotes.no} />
              </Step>
            ) : null}
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="overflow-hidden rounded-[16px] bg-card shadow-[var(--shadow-lift)] lg:sticky lg:top-24">
              <div className="bg-accent px-6 py-6 text-paper sm:px-8 sm:py-7" aria-live="polite">
                <p className="text-[13px] font-medium text-paper/80">{t.calc.result}</p>
                <p key={`${est.min}-${est.max}`} className="hud-in mt-3 tabular-nums text-[26px] leading-tight tracking-[-0.02em] sm:text-[30px]">
                  {formatUZS(est.min)}
                  <span className="text-paper/50"> – </span>
                  <span className="whitespace-nowrap">{formatUZS(est.max)}</span>
                </p>
                <p className="mt-2 text-[13.5px] text-paper/85">
                  {t.calc.currency}
                  {est.unitNote ? ` · ${est.unitNote}` : ""}
                  <span className="tabular-nums"> · {t.calc.usd} {formatUSD(est.min, site.usdRate)}–{formatUSD(est.max, site.usdRate).slice(1)}</span>
                </p>
                {months ? (
                  <p className="mt-2 text-[14px] text-paper/85">
                    {t.calc.installment.replace("{months}", String(months))}{" "}
                    <span className="tabular-nums whitespace-nowrap">
                      {formatUZS(monthly)} {t.calc.currency}
                      {lang === "ru" ? "" : t.services.from}
                    </span>
                  </p>
                ) : null}
                <p className="mt-5 flex items-start gap-2.5 border-t border-paper/15 pt-4 text-[14.5px] leading-snug text-paper">
                  <ShieldCheck size={18} strokeWidth={1.6} className="mt-px shrink-0 text-accent-light" />
                  {t.calc.fixed}
                </p>
              </div>

              <div className="px-6 py-6 sm:px-8">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <div>
                    <dt className="text-[12.5px] text-muted">{t.calc.visits}</dt>
                    <dd className="mt-1 tabular-nums text-[14.5px] text-ink">{est.visits}</dd>
                  </div>
                  <div>
                    <dt className="text-[12.5px] text-muted">{t.calc.surgery}</dt>
                    <dd className="mt-1 tabular-nums text-[14.5px] text-ink">{est.surgeryTime}</dd>
                  </div>
                  {est.needsCt ? (
                    <div className="col-span-2">
                      <dt className="text-[12.5px] text-muted">{t.calc.ctLine}</dt>
                      <dd className="mt-1 tabular-nums text-[14.5px] text-ink">
                        {est.ctCost ? `+${formatUZS(est.ctCost)} ${t.calc.currency} · ${t.calc.ctAdded}` : t.calc.ctIncluded}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-[12.5px] text-muted">{t.calc.included}</p>
                  <ul className="mt-3 space-y-2.5">
                    {est.bonuses.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-ink">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                          <Check size={12} strokeWidth={2.4} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 grid gap-3">
                  <button
                    type="button"
                    onClick={bookWithEstimate}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-center text-[15px] leading-tight font-medium text-paper shadow-[0_10px_24px_-12px_rgb(15_61_62/0.7)] transition hover:bg-accent-2 active:translate-y-px"
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
                    <Send size={16} strokeWidth={1.7} className="shrink-0 text-accent" />
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
