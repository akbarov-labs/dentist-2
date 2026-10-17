"use client";

import { useEffect, useState } from "react";
import type { DoctorProfile } from "@/config/doctorConfig";
import { isOpenNow } from "@/lib/format";

/** Live "open now" state in Tashkent time, refreshed every minute. `null` until mounted (server render). */
export function useOpenNow(doctor: DoctorProfile): boolean | null {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => setOpen(isOpenNow(doctor));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [doctor]);
  return open;
}

/** "09:00" from the practice's opening hour. */
export const openTime = (doctor: DoctorProfile) => `${String(doctor.hours.openHour).padStart(2, "0")}:00`;
