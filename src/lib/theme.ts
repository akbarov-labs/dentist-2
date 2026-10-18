import type { CSSProperties } from "react";
import type { DoctorProfile } from "@/config/doctorConfig";

/** A doctor's colour tokens as CSS custom properties ("accent" → "--color-accent"), overriding the shared theme. */
export function themeStyle(theme: DoctorProfile["theme"]): CSSProperties {
  return Object.fromEntries(Object.entries(theme ?? {}).map(([k, v]) => [`--color-${k}`, v])) as CSSProperties;
}
