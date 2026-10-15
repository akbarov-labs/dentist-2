import type { DoctorProfile, Lang } from "@/config/doctorConfig";
import type { BookingPrefill, CalcSelection } from "@/context/SiteContext";
import type { Dict } from "@/i18n/dictionary";
import { formatUZS } from "@/lib/format";

export interface Estimate {
  min: number;
  max: number;
  ctCost: number;
  unitNote?: string;
  visits: string;
  surgeryTime: string;
  bonuses: string[];
}

export function computeEstimate(doctor: DoctorProfile, sel: CalcSelection, lang: Lang): Estimate {
  const p = doctor.pricing[sel.problem];
  const tier = p[sel.material];
  const ctCost = sel.hasCt ? 0 : doctor.ctScanPrice;
  return {
    min: tier.min + ctCost,
    max: tier.max + ctCost,
    ctCost,
    unitNote: p.unitNote?.[lang],
    visits: p.visits[lang],
    surgeryTime: p.surgeryTime[lang],
    bonuses: p.bonuses.map((b) => b[lang]),
  };
}

export function priceRange(e: Pick<Estimate, "min" | "max">, t: Dict): string {
  return `${formatUZS(e.min)} – ${formatUZS(e.max)} ${t.calc.currency}`;
}

export function selectionLines(sel: CalcSelection, t: Dict) {
  return {
    problem: t.calc.problems[sel.problem],
    material: t.calc.materials[sel.material],
    ct: sel.hasCt ? t.calc.ct.yes : t.calc.ct.no,
  };
}

/** Polite, pre-filled Telegram message describing what the visitor picked. */
export function buildTelegramText(doctor: DoctorProfile, lang: Lang, t: Dict, prefill: BookingPrefill): string {
  const hello = `${t.tg.hello} ${doctor.firstName[lang]}!`;

  if (prefill?.kind === "calculator") {
    const lines = selectionLines(prefill.selection, t);
    const est = computeEstimate(doctor, prefill.selection, lang);
    return [
      hello,
      t.tg.calcIntro,
      `• ${t.tg.problem}: ${lines.problem}`,
      `• ${t.tg.material}: ${lines.material}`,
      `• ${t.tg.ct}: ${lines.ct}`,
      `• ${t.tg.price}: ${priceRange(est, t)}${est.unitNote ? ` (${est.unitNote})` : ""}`,
      "",
      t.tg.ask,
      t.tg.thanks,
    ].join("\n");
  }

  if (prefill?.kind === "service") {
    const service = doctor.services.find((s) => s.id === prefill.serviceId);
    if (service) {
      return [hello, t.tg.serviceIntro, `• ${service.title[lang]}`, "", t.tg.ask, t.tg.thanks].join("\n");
    }
  }

  return [hello, t.tg.generic, t.tg.thanks].join("\n");
}
