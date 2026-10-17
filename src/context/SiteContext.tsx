"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  defaultCalcProblems,
  doctorPresets,
  site,
  type DoctorProfile,
  type Lang,
  type MaterialId,
  type PresetId,
  type ProblemId,
} from "@/config/doctorConfig";
import { dictionaries, withCopy, type Dict } from "@/i18n/dictionary";
import { setPref, usePref } from "@/lib/prefs";

export interface CalcSelection {
  problem: ProblemId;
  material: MaterialId;
  hasCt: boolean;
}

/** What the booking form shows as a pre-selected badge. */
export type BookingPrefill =
  | { kind: "calculator"; selection: CalcSelection }
  | { kind: "service"; serviceId: string }
  | null;

export type ModalState = { kind: "intro" } | { kind: "credential"; id: string } | null;

interface SiteState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
  presetId: PresetId;
  setPresetId: (id: PresetId) => void;
  doctor: DoctorProfile;
  calc: CalcSelection;
  setCalc: (patch: Partial<CalcSelection>) => void;
  prefill: BookingPrefill;
  setPrefill: (p: BookingPrefill) => void;
  modal: ModalState;
  setModal: (m: ModalState) => void;
  scrollToId: (id: string) => void;
}

const SiteContext = createContext<SiteState | null>(null);

const LANG_KEY = "practice.lang";
const PRESET_KEY = "practice.preset";

const isLang = (v: string): v is Lang => v === "uz" || v === "ru";
const isPreset = (v: string): v is PresetId => site.showDemoSwitcher && v in doctorPresets;

export function SiteProvider({ children }: { children: ReactNode }) {
  // Language and demo persona survive reloads; `?lang=ru` / `?demo=sardor` let a pitch link open straight into a persona.
  const lang = usePref(LANG_KEY, "lang", site.defaultLang, isLang);
  const presetId = usePref(PRESET_KEY, "demo", site.activePresetId, isPreset);
  const [calc, setCalcState] = useState<CalcSelection>(() => ({
    problem: (doctorPresets[presetId].calcProblems ?? defaultCalcProblems)[0],
    material: "premium",
    hasCt: false,
  }));
  const [prefill, setPrefill] = useState<BookingPrefill>(null);
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => setPref(LANG_KEY, next), []);

  const setPresetId = useCallback((next: PresetId) => {
    setPref(PRESET_KEY, next);
    setPrefill(null);
  }, []);

  const setCalc = useCallback((patch: Partial<CalcSelection>) => {
    setCalcState((prev) => ({ ...prev, ...patch }));
  }, []);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // A section can name the exact spot to land on (its heading); focus follows, so keyboard and screen-reader users arrive too.
    const target = el.querySelector<HTMLElement>("[data-scroll-target]") ?? el;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (target.tabIndex >= -1 && target.hasAttribute("tabindex")) target.focus({ preventScroll: true });
    history.replaceState(null, "", `#${id}`);
  }, []);

  const doctor = doctorPresets[presetId];
  const t = useMemo(() => withCopy(dictionaries[lang], doctor.copy?.[lang]), [lang, doctor]);

  // A doctor only offers some calculator answers; fall back to their first one after a preset switch.
  const problems = doctor.calcProblems ?? defaultCalcProblems;
  const calcFor = useMemo(
    () => (problems.includes(calc.problem) ? calc : { ...calc, problem: problems[0] }),
    [calc, problems],
  );

  useEffect(() => {
    document.title = `${doctor.name[lang]} · ${doctor.title[lang]}`;
  }, [doctor, lang]);

  const value = useMemo<SiteState>(
    () => ({
      lang,
      setLang,
      t,
      presetId,
      setPresetId,
      doctor,
      calc: calcFor,
      setCalc,
      prefill,
      setPrefill,
      modal,
      setModal,
      scrollToId,
    }),
    [lang, setLang, t, presetId, setPresetId, doctor, calcFor, setCalc, prefill, modal, scrollToId],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteState {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
