import { ICON_RING_Y } from './constants'

// `bulbOut` rather than `isDark` so the pre-hydration state is "tucked
// away": the bulb only ever animates outwards, once the resolved theme is
// actually known to be light. Keying it off isDark instead would show the
// bulb on the server, then visibly retract it on a dark-themed device.
export function LampShadeIcon({ bulbOut }: { bulbOut: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="relative z-10 size-12"
    >
      <circle
        cx="12"
        cy={bulbOut ? 6 : 9}
        r="3"
        fill={bulbOut ? '#ffe066' : '#4a4a4a'}
        opacity={bulbOut ? 1 : 0}
        style={{
          transition:
            'cy 500ms ease-out, opacity 500ms ease-out, fill 500ms ease-out',
        }}
      />
      <path d="M9 6h6l5 7H4z" fill="#7a4a24" />
      <line
        x1="12"
        y1="13"
        x2="12"
        y2={ICON_RING_Y - 1}
        stroke="#6b4423"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <circle cx="12" cy={ICON_RING_Y} r="1" fill="#6b4423" />
    </svg>
  )
}
