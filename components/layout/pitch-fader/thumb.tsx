type KnobVariantData = {
  bodyFill: string
  strokeColor: string
  sideMarkFill: string
  centerMarkFill: string
}

const KNOB_VARIANTS: Record<'light' | 'dark', KnobVariantData> = {
  light: {
    bodyFill: '#b6b6b4',
    strokeColor: '#8e8e8c',
    sideMarkFill: '#8e8e8c',
    centerMarkFill: '#1a1a1a',
  },
  dark: {
    bodyFill: '#2a2a2a',
    strokeColor: '#4a4a4a',
    sideMarkFill: '#6e6e6e',
    centerMarkFill: '#e8e8e8',
  },
}

function Knob({
  variant,
  className,
}: {
  variant: 'light' | 'dark'
  className: string
}) {
  const v = KNOB_VARIANTS[variant]
  return (
    <svg viewBox="0 0 34 46" aria-hidden="true" className={className}>
      <rect x="0" y="0" width="34" height="46" rx="2" fill={v.bodyFill} />
      <rect
        x="0.5"
        y="0.5"
        width="33"
        height="45"
        rx="1.5"
        fill="none"
        stroke={v.strokeColor}
        strokeWidth="1"
      />
      <rect x="9.5" y="1" width="1" height="44" fill={v.sideMarkFill} />
      <rect x="14" y="1" width="6" height="44" fill={v.centerMarkFill} />
      <rect x="23.5" y="1" width="1" height="44" fill={v.sideMarkFill} />
    </svg>
  )
}

export function PitchFaderThumb() {
  return (
    <>
      <Knob variant="light" className="pitch-fader__knob pitch-fader__knob--light" />
      <Knob variant="dark" className="pitch-fader__knob pitch-fader__knob--dark" />
    </>
  )
}
