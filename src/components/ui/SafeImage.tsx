"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SafeImageProps = Omit<ImageProps, "onError"> & {
  /** Text shown on the fallback surface if the image cannot load. */
  fallbackLabel?: string;
};

/**
 * next/image with a designed fallback: if a photo is missing or blocked,
 * an accent-to-stone surface with a label takes its place instead of a broken icon.
 */
export function SafeImage({ fallbackLabel, className = "", alt, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`absolute inset-0 flex items-end bg-[radial-gradient(120%_90%_at_20%_10%,#eceeea_0%,#c9d8d1_45%,#355e54_100%)] p-5 ${className}`}
      >
        {fallbackLabel ? (
          <span className="tabular-nums text-[12px] tracking-[0.14em] text-paper/90 uppercase">{fallbackLabel}</span>
        ) : null}
      </div>
    );
  }

  return <Image alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
