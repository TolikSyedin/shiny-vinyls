import { SvGlyph } from './sv-glyph'

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
        <SvGlyph />
      </g>
    </svg>
  )
}
