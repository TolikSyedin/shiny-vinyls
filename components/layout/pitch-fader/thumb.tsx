export function PitchFaderThumb() {
  return (
    <svg viewBox="0 0 34 46" aria-hidden="true" className="pitch-fader__knob">
      <rect x="0" y="0" width="34" height="46" rx="2" fill="var(--metal)" />
      <rect
        x="0.5"
        y="0.5"
        width="33"
        height="45"
        rx="1.5"
        fill="none"
        stroke="var(--metal-edge)"
        strokeWidth="1"
      />
      <rect x="9.5" y="1" width="1" height="44" fill="var(--metal-edge)" />
      <rect x="14" y="1" width="6" height="44" fill="var(--ink)" />
      <rect x="23.5" y="1" width="1" height="44" fill="var(--metal-edge)" />
    </svg>
  )
}
