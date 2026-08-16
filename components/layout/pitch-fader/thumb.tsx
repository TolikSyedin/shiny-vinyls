export function PitchFaderThumb() {
  return (
    <>
      <svg
        viewBox="0 0 34 46"
        aria-hidden="true"
        className="pitch-fader__knob pitch-fader__knob--light"
      >
        <rect x="0" y="0" width="34" height="46" rx="2" fill="#b6b6b4" />
        <rect
          x="0.5"
          y="0.5"
          width="33"
          height="45"
          rx="1.5"
          fill="none"
          stroke="#8e8e8c"
          strokeWidth="1"
        />
        <rect x="9.5" y="1" width="1" height="44" fill="#8e8e8c" />
        <rect x="14" y="1" width="6" height="44" fill="#1a1a1a" />
        <rect x="23.5" y="1" width="1" height="44" fill="#8e8e8c" />
      </svg>

      <svg
        viewBox="0 0 34 46"
        aria-hidden="true"
        className="pitch-fader__knob pitch-fader__knob--dark"
      >
        <rect x="0" y="0" width="34" height="46" rx="2" fill="#2a2a2a" />
        <rect
          x="0.5"
          y="0.5"
          width="33"
          height="45"
          rx="1.5"
          fill="none"
          stroke="#4a4a4a"
          strokeWidth="1"
        />
        <rect x="9.5" y="1" width="1" height="44" fill="#6e6e6e" />
        <rect x="14" y="1" width="6" height="44" fill="#e8e8e8" />
        <rect x="23.5" y="1" width="1" height="44" fill="#6e6e6e" />
      </svg>
    </>
  )
}
