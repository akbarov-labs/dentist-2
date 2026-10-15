import { Reveal } from "@/components/ui/Reveal";

interface SignatureProps {
  name: string;
  className?: string;
  tone?: "ink" | "light";
}

/** Handwritten signature that draws itself in once scrolled into view. */
export function Signature({ name, className = "h-14 w-auto", tone = "ink" }: SignatureProps) {
  const ink = tone === "ink" ? "var(--color-ink)" : "var(--color-alabaster)";
  return (
    <Reveal bare className="inline-block">
      <svg viewBox="0 0 340 96" className={`signature-reveal ${className}`} role="img" aria-label={name}>
        <text
          x="8"
          y="62"
          textLength="318"
          lengthAdjust="spacingAndGlyphs"
          fill={ink}
          style={{ fontFamily: "var(--font-sign)", fontSize: 58 }}
        >
          {name}
        </text>
        <path
          d="M14 78 C 70 70, 150 88, 236 74 S 318 60, 330 66"
          fill="none"
          stroke="var(--color-bronze)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </Reveal>
  );
}
