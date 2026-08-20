// The knurled ring carries 24 ticks, one every 15°. A vinyl turns it by 9°, so
// a full revolution is 40 vinyls and the whole 1–60 range is a turn and a half.
const TICK_COUNT = 24
const DEGREES_PER_VINYL = 9

const KNOB_CENTRE = 46
const TICK_INNER_RADIUS = 27
const TICK_OUTER_RADIUS = 32

// Tick coordinates are rounded before they reach the DOM. Left at full double
// precision, the server writes one fewer digit into the attribute than React
// sets on the client, and every tick reports a hydration mismatch; three
// decimals is far below a pixel on a 92px dial.
function place(value: number): number {
  return Math.round(value * 1000) / 1000
}

// Ticks are laid out once at module level: the ring never changes shape, only
// the angle it is rotated to.
const TICKS = Array.from({ length: TICK_COUNT }, (_, index) => {
  const radians = ((index * 360) / TICK_COUNT) * (Math.PI / 180)
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return {
    key: index,
    // Every sixth tick lands on a quarter turn and is drawn as a marker.
    isMarker: index % 6 === 0,
    x1: place(KNOB_CENTRE + TICK_INNER_RADIUS * cos),
    y1: place(KNOB_CENTRE + TICK_INNER_RADIUS * sin),
    x2: place(KNOB_CENTRE + TICK_OUTER_RADIUS * cos),
    y2: place(KNOB_CENTRE + TICK_OUTER_RADIUS * sin),
  }
})

export function CounterweightKnobDial({
  value,
  isDragging,
}: {
  value: number
  isDragging: boolean
}) {
  return (
    <>
      <circle cx={KNOB_CENTRE} cy={KNOB_CENTRE} r="34" fill="var(--metal)" />
      <circle
        cx={KNOB_CENTRE}
        cy={KNOB_CENTRE}
        r="34"
        fill="none"
        stroke="var(--rule)"
        strokeWidth="1"
      />

      <g
        className={
          isDragging
            ? 'origin-[46px_46px]'
            : 'origin-[46px_46px] transition-transform duration-[180ms] ease-[cubic-bezier(0.3,1.2,0.5,1)] motion-reduce:transition-none'
        }
        style={{ transform: `rotate(${value * DEGREES_PER_VINYL}deg)` }}
      >
        {TICKS.map(({ key, isMarker, x1, y1, x2, y2 }) => (
          <line
            key={key}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isMarker ? 'var(--stamp)' : 'var(--muted)'}
            strokeWidth={isMarker ? 2 : 1}
          />
        ))}
      </g>

      <circle
        cx={KNOB_CENTRE}
        cy={KNOB_CENTRE}
        r="13"
        fill="var(--surface-2)"
        stroke="var(--metal-edge)"
        strokeWidth="1"
      />
    </>
  )
}
