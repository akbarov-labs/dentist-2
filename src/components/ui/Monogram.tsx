interface MonogramProps {
  letters: string;
  className?: string;
  /** "light" for alabaster backgrounds, "dark" for obsidian. */
  tone?: "light" | "dark";
}

/** Personal crest: double ring, serif initials and a bronze lozenge. */
export function Monogram({ letters, className = "h-11 w-11", tone = "light" }: MonogramProps) {
  const ink = tone === "light" ? "var(--color-emerald)" : "var(--color-alabaster)";
  const gap = tone === "light" ? "var(--color-alabaster)" : "var(--color-obsidian)";
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={letters}>
      <circle cx="32" cy="32" r="30" fill="none" stroke="var(--color-bronze)" strokeWidth="1.1" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="var(--color-bronze)" strokeWidth="0.6" strokeDasharray="0.6 2.2" />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fill={ink}
        style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 19, letterSpacing: "0.5px" }}
      >
        {letters}
      </text>
      <rect x="29.6" y="59.6" width="4.8" height="4.8" transform="rotate(45 32 62)" fill={gap} stroke="var(--color-bronze)" strokeWidth="1" />
      <rect x="30.4" y="-0.4" width="3.2" height="3.2" transform="rotate(45 32 1.2)" fill="var(--color-bronze)" />
    </svg>
  );
}
