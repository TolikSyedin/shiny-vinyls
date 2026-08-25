export function PitchFaderCompact({ fraction }: { fraction: number }) {
  return (
    <div aria-hidden="true" className="pitch-fader-compact">
      <div
        className="pitch-fader-compact__fill"
        style={{ width: `${fraction * 100}%` }}
      />
    </div>
  )
}
