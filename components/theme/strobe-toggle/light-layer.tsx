'use client'

import { useId } from 'react'

// Technics SL-1210 strobe illuminator, lit/extended state: tall metal
// cylinder popped up out of the plate, warm LED glow around the window.
export function LightLayer({ className }: { className?: string }) {
  const id = useId()
  const gid = (name: string) => `${name}${id}`
  const ref = (name: string) => `url(#${name}${id})`

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid('body')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5f6367" />
          <stop offset="0.10" stopColor="#9ba0a3" />
          <stop offset="0.22" stopColor="#e2e4e5" />
          <stop offset="0.32" stopColor="#f4f5f5" />
          <stop offset="0.44" stopColor="#c0c4c6" />
          <stop offset="0.56" stopColor="#8d9195" />
          <stop offset="0.70" stopColor="#c6c9cb" />
          <stop offset="0.84" stopColor="#e8eaea" />
          <stop offset="1" stopColor="#5b5f62" />
        </linearGradient>
        <linearGradient id={gid('topFace')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fafbfb" />
          <stop offset="0.5" stopColor="#cbcfd1" />
          <stop offset="1" stopColor="#8f9498" />
        </linearGradient>
        <linearGradient id={gid('plateFace')} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#eff0f1" />
          <stop offset="0.35" stopColor="#c8cccd" />
          <stop offset="0.6" stopColor="#e6e8e9" />
          <stop offset="1" stopColor="#a2a6a9" />
        </linearGradient>
        <linearGradient id={gid('plateEdge')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a8e91" />
          <stop offset="1" stopColor="#4f5356" />
        </linearGradient>
        <radialGradient id={gid('pocket')} cx="0.35" cy="0.25" r="0.85">
          <stop offset="0" stopColor="#d9dcdd" />
          <stop offset="0.6" stopColor="#a9adb0" />
          <stop offset="1" stopColor="#7b7f82" />
        </radialGradient>
        <linearGradient id={gid('winLit')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf4" />
          <stop offset="0.5" stopColor="#ffe6a6" />
          <stop offset="1" stopColor="#f0b348" />
        </linearGradient>
        <filter
          id={gid('blurLight')}
          x="-80%"
          y="-80%"
          width="260%"
          height="260%"
        >
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id={gid('sh')} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="8"
            floodColor="#000"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      <g filter={ref('sh')}>
        <path
          d="M 118 300 a 42 20 0 0 0 0 40 h 164 a 42 20 0 0 0 0 -40 z"
          fill={ref('plateEdge')}
        />
        <path
          d="M 118 288 h 164 a 42 20 0 0 1 0 40 h -164 a 42 20 0 0 1 0 -40 z"
          fill={ref('plateFace')}
        />
        <path
          d="M 122 292 h 156 a 38 12 0 0 1 0 10 h -156 a 38 12 0 0 1 0 -10 z"
          fill="#ffffff"
          opacity="0.35"
        />

        <ellipse cx="140" cy="310" rx="30" ry="15" fill={ref('pocket')} />
        <ellipse cx="140" cy="312" rx="22" ry="11" fill="#9ca0a3" />
        <ellipse cx="140" cy="313" rx="11" ry="6" fill="#9ea2a5" />

        <ellipse cx="243" cy="308" rx="40" ry="18" fill="#9ea2a5" />
        <ellipse
          cx="243"
          cy="306"
          rx="40"
          ry="18"
          fill="none"
          stroke="#eceded"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* button — no bounce, just crossfades smoothly with the layer */}
        <path
          d="M 123 306 L 123 291 h 34 L 157 306 a 17 8 0 0 1 -34 0 Z"
          fill={ref('body')}
        />
        <ellipse cx="140" cy="291" rx="17" ry="7" fill={ref('topFace')} />
        <ellipse
          cx="140"
          cy="291"
          rx="17"
          ry="7"
          fill="none"
          stroke="#7d8185"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <rect x="127" y="294" width="3" height="13" fill="#ffffff" opacity="0.3" />
        <rect x="151" y="294" width="2" height="13" fill="#ffffff" opacity="0.18" />

        <g className="strobe-toggle__moving">
          <path
            d="M 211 302 L 211 110 h 64 L 275 302 a 32 14 0 0 1 -64 0 Z"
            fill={ref('body')}
          />
          <ellipse cx="243" cy="110" rx="32" ry="13" fill={ref('topFace')} />
          <ellipse
            cx="243"
            cy="110"
            rx="32"
            ry="13"
            fill="none"
            stroke="#7d8185"
            strokeWidth="1.5"
            opacity="0.5"
          />

          <circle cx="243" cy="171" r="63" fill="#ffd98d" opacity="0.28" filter={ref('blurLight')} />
          <circle cx="243" cy="171" r="39" fill="#ffe0a0" opacity="0.7" filter={ref('blurLight')} />

          <rect x="230" y="148" width="26" height="46" rx="13" fill="#5d6165" />
          <rect x="233" y="151" width="20" height="40" rx="10" fill={ref('winLit')} />
          <circle cx="243" cy="171" r="8" fill="#fffdf2" opacity="0.95" />

          <rect x="218" y="115" width="5" height="183" fill="#ffffff" opacity="0.3" />
          <rect x="265" y="115" width="4" height="183" fill="#ffffff" opacity="0.18" />
        </g>
      </g>
    </svg>
  )
}
