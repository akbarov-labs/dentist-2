"use client";

import type { CSSProperties, ReactNode } from "react";
import type { DoctorProfile, Lang } from "@/config/doctorConfig";
import { SafeImage } from "@/components/ui/SafeImage";

interface PortraitArchProps {
  doctor: DoctorProfile;
  lang: Lang;
  /** Preload the cut-out (hero only). */
  preload?: boolean;
  sizes: string;
  className?: string;
  /** Extra foreground layer (e.g. the glass ID card) placed above every plane. */
  children?: ReactNode;
}

/**
 * Layered portrait in four planes. Each plane reads the shared `--hp` progress (0 to 1)
 * and moves at its own rate, so depth comes from parallax and occlusion, not from one flat photo:
 *   1. the room, framed by a stone arch (slowest, recedes)
 *   2. the monogram, set BEHIND the doctor's head (typography between planes)
 *   3. the matted doctor, whose head breaks out above the arch
 *   4. a fixed alabaster mist that hides the cut-out's bottom edge (the shared contact line)
 * With no `--hp` set (or reduced motion) every plane rests at 0: a complete static composition.
 */
export function PortraitArch({ doctor, lang, preload = false, sizes, className = "", children }: PortraitArchProps) {
  const t = (rule: string) => ({ transform: rule }) as CSSProperties;

  return (
    // Clip only below the bottom edge: the head and monogram may rise above the frame, nothing may sink below it.
    <div className={`relative isolate aspect-[4/5] w-full [clip-path:inset(-60%_-60%_0_-60%)] ${className}`}>
      {/* 1. Room in an arch */}
      <div
        className="plane absolute inset-x-[7%] top-[15%] bottom-[3%] overflow-hidden rounded-t-[999px] bg-stone-2 shadow-[inset_0_0_0_1px_rgb(154_123_79/0.25)]"
        style={t("translate3d(0, calc(var(--hp, 0) * 42px), 0) scale(calc(1.06 - var(--hp, 0) * 0.06))")}
      >
        <SafeImage
          src="/images/cabinet.jpg"
          alt=""
          fill
          sizes={sizes}
          className="object-cover opacity-70 blur-[2px] saturate-[0.55]"
          style={{ objectPosition: "60% 40%" }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-alabaster/10 via-transparent to-emerald/25" />
      </div>

      {/* 2. Monogram behind the head */}
      <p
        aria-hidden
        className="plane pointer-events-none absolute inset-x-0 top-[-3%] text-center font-display text-[clamp(150px,21vw,300px)] leading-none font-medium tracking-[-0.02em] text-bronze/25 select-none"
        style={t("translate3d(0, calc(var(--hp, 0) * -80px), 0) scale(calc(1 + var(--hp, 0) * 0.08))")}
      >
        {doctor.monogram}
      </p>

      {/* 3. The doctor (bottom-anchored so the contact line never floats) */}
      <div
        className="plane absolute inset-x-[2%] top-[2%] bottom-[3%] origin-bottom"
        style={t("translate3d(0, calc(var(--hp, 0) * -18px), 0) scale(calc(1 + var(--hp, 0) * 0.045))")}
      >
        <SafeImage
          key={doctor.portrait.cutout}
          src={doctor.portrait.cutout}
          alt={doctor.portrait.alt[lang]}
          fill
          preload={preload}
          sizes={sizes}
          className="object-contain object-bottom"
          fallbackLabel={doctor.name[lang]}
        />
      </div>

      {/* 4. Front mist over the contact line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px h-[24%] bg-gradient-to-t from-alabaster via-alabaster/80 to-transparent"
      />

      {children}
    </div>
  );
}
