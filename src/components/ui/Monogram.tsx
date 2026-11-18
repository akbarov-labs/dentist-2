interface MonogramProps {
  letters: string;
  className?: string;
  /** "light" for paper backgrounds, "dark" for night. */
  tone?: "light" | "dark";
}

/** Personal mark: one thin ring around the initials. */
export function Monogram({ letters, className = "h-11 w-11", tone = "light" }: MonogramProps) {
  if (!letters) return null;
  const ink = tone === "light" ? "var(--color-accent)" : "var(--color-paper)";
  const ring = tone === "light" ? "var(--color-line)" : "var(--color-night-line)";
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={letters}>
      <circle cx="32" cy="32" r="30.5" fill="none" stroke={ring} strokeWidth="1.5" />
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
    </svg>
  );
}
