import type { ReactNode } from "react";

/** Keeps hyphenated product names ("All-on-4", "E-max") from breaking across lines. */
export function noBreakHyphens(text: string): ReactNode {
  const parts = text.split(/(\S*\w-\w\S*)/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
