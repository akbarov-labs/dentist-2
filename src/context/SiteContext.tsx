"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  doctorPresets,
  site,
  type DoctorProfile,
  type Lang,
  type MaterialId,
  type PresetId,
  type ProblemId,
} from "@/config/doctorConfig";
import { dictionaries, type Dict } from "@/i18n/dictionary";
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
  const [calc, setCalcState] = useState<CalcSelection>({ problem: "single", material: "premium", hasCt: false });
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }, []);

  const doctor = doctorPresets[presetId];

  const value = useMemo<SiteState>(
    () => ({
      lang,
      setLang,
      t: dictionaries[lang],
      presetId,
      setPresetId,
      doctor,
      calc,
      setCalc,
      prefill,
      setPrefill,
      modal,
      setModal,
      scrollToId,
    }),
    [lang, setLang, presetId, setPresetId, doctor, calc, setCalc, prefill, modal, scrollToId],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteState {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
