// Colors are theme tokens (foreground/background/muted-foreground), not
// hardcoded hex: the disc renders dark-on-light and light-on-dark, same as
// body text, so it stays legible in both themes. animation-duration is
// slowed below Tailwind's default animate-spin (1s) to read more like a
// physical record than a UI spinner.
export function VinylSpinnerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-7 animate-spin [animation-duration:1.2s]"
    >
      <circle cx="12" cy="12" r="10" className="fill-foreground" />
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        strokeWidth="0.4"
        className="stroke-background opacity-20"
      />
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="none"
        strokeWidth="0.4"
        className="stroke-background opacity-20"
      />
      <circle
        cx="12"
        cy="12"
        r="5.5"
        fill="none"
        strokeWidth="0.4"
        className="stroke-background opacity-20"
      />
      {/* Label: a small inset disc, like the paper label on a real record —
          also the one asymmetric mark on the icon, so rotation is visible
          (every other shape here is a circle centered on the rotation
          axis, which looks identical at any angle). */}
      <circle
        cx="12"
        cy="12"
        r="4"
        className="fill-background stroke-muted-foreground"
        strokeWidth="0.4"
      />
      <g
        transform="translate(12 12) scale(0.4) translate(-12 -12)"
        className="stroke-foreground"
      >
        <line x1="12" y1="2" x2="12" y2="22" strokeWidth="1" strokeLinecap="butt" />
        <path
          d="M 7.2 7 L 7.2 10 L 12 10"
          fill="none"
          strokeWidth="1"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M 2.2 14 L 7.2 14 L 7.2 17"
          fill="none"
          strokeWidth="1"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        />
        <line x1="17" y1="3.34" x2="17" y2="17" strokeWidth="1" strokeLinecap="butt" />
      </g>
    </svg>
  )
}
