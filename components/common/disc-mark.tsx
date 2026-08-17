export type DiscMarkColors = {
  body: string
  ring: string
  ringStroke: string
  glyph: string
}

type DiscMarkProps = {
  size: number
  colors: DiscMarkColors
  className?: string
}

// Vinyl-record mark shared by the brand logo (DiscLogo) and the form
// loading spinner (VinylSpinnerIcon) — same shape, different colors and
// animation per caller. The tonearm glyph on the label is the only
// asymmetric detail, so rotation reads as motion instead of a static circle.
export function DiscMark({ size, colors, className }: DiscMarkProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill={colors.body} />
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke={colors.ring}
        strokeOpacity=".2"
        strokeWidth="0.4"
      />
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="none"
        stroke={colors.ring}
        strokeOpacity=".2"
        strokeWidth="0.4"
      />
      <circle
        cx="12"
        cy="12"
        r="5.5"
        fill="none"
        stroke={colors.ring}
        strokeOpacity=".2"
        strokeWidth="0.4"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill={colors.ring}
        stroke={colors.ringStroke}
        strokeWidth="0.4"
      />
      <g
        transform="translate(12 12) scale(0.4) translate(-12 -12)"
        stroke={colors.glyph}
        fill="none"
        strokeWidth="1"
      >
        <line x1="12" y1="2" x2="12" y2="22" />
        <path d="M 7.2 7 L 7.2 10 L 12 10" strokeLinecap="square" />
        <path d="M 2.2 14 L 7.2 14 L 7.2 17" />
        <line x1="17" y1="3.34" x2="17" y2="17" />
      </g>
    </svg>
  )
}
