// Every color here is a theme token (foreground/background/muted-foreground),
// not a hardcoded hex: the disc renders dark-on-light and light-on-dark, same
// as body text, so it stays legible in both themes without hand-picking
// per-theme colors. animation-duration is slowed below Tailwind's default
// animate-spin (1s) to read more like a physical record than a UI spinner.
export function VinylSpinnerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 animate-spin [animation-duration:1.2s]"
    >
      <circle cx="12" cy="12" r="10" className="fill-foreground" />
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        strokeWidth="0.5"
        className="stroke-background opacity-20"
      />
      <circle
        cx="12"
        cy="12"
        r="6.5"
        fill="none"
        strokeWidth="0.5"
        className="stroke-background opacity-20"
      />
      <circle
        cx="12"
        cy="12"
        r="5"
        fill="none"
        strokeWidth="0.5"
        className="stroke-background opacity-20"
      />
      <circle cx="12" cy="12" r="3.5" className="fill-muted-foreground" />
      <circle cx="12" cy="12" r="1" className="fill-background" />
    </svg>
  )
}
