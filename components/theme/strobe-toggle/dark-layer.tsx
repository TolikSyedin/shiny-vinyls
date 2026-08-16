'use client'

import { useId } from 'react'

// Same assembly, retracted state: cylinder sunk flush into the plate,
// matte-black metal, no window and no glow.
export function DarkLayer({ className }: { className?: string }) {
  const id = useId()
  const gid = (name: string) => `${name}${id}`
  const ref = (name: string) => `url(#${name}${id})`

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid('body')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#181818" />
          <stop offset="0.10" stopColor="#2e2e2e" />
          <stop offset="0.22" stopColor="#4a4a4a" />
          <stop offset="0.32" stopColor="#525252" />
          <stop offset="0.44" stopColor="#3a3a3a" />
          <stop offset="0.56" stopColor="#242424" />
          <stop offset="0.70" stopColor="#3c3c3c" />
          <stop offset="0.84" stopColor="#484848" />
          <stop offset="1" stopColor="#161616" />
        </linearGradient>
        <linearGradient id={gid('topFace')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4e4e4e" />
          <stop offset="0.5" stopColor="#333333" />
          <stop offset="1" stopColor="#1e1e1e" />
        </linearGradient>
        <linearGradient id={gid('plateFace')} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#3f3f3f" />
          <stop offset="0.35" stopColor="#2b2b2b" />
          <stop offset="0.6" stopColor="#3a3a3a" />
          <stop offset="1" stopColor="#1f1f1f" />
        </linearGradient>
        <linearGradient id={gid('plateEdge')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1c1c" />
          <stop offset="1" stopColor="#0e0e0e" />
        </linearGradient>
        <radialGradient id={gid('pocket')} cx="0.35" cy="0.25" r="0.85">
          <stop offset="0" stopColor="#3a3a3a" />
          <stop offset="0.6" stopColor="#282828" />
          <stop offset="1" stopColor="#191919" />
        </radialGradient>
        <filter id={gid('sh')} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="8"
            floodColor="#000"
            floodOpacity="0.3"
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
          opacity="0.12"
        />

        <ellipse cx="140" cy="310" rx="30" ry="15" fill={ref('pocket')} />
        <ellipse cx="140" cy="312" rx="22" ry="11" fill="#242424" />
        <ellipse cx="140" cy="313" rx="11" ry="6" fill="#232323" />

        <ellipse cx="243" cy="308" rx="40" ry="18" fill="#232323" />
        <ellipse
          cx="243"
          cy="306"
          rx="40"
          ry="18"
          fill="none"
          stroke="#4a4a4a"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* button — no bounce, just crossfades smoothly with the layer */}
        <path
          d="M 123 306 L 123 279 h 34 L 157 306 a 17 8 0 0 1 -34 0 Z"
          fill={ref('body')}
        />
        <ellipse cx="140" cy="279" rx="17" ry="7" fill={ref('topFace')} />
        <ellipse
          cx="140"
          cy="279"
          rx="17"
          ry="7"
          fill="none"
          stroke="#0f0f0f"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <rect x="127" y="282" width="3" height="25" fill="#ffffff" opacity="0.1" />
        <rect x="151" y="282" width="2" height="25" fill="#ffffff" opacity="0.07" />

        <g className="strobe-toggle__moving">
          <path
            d="M 211 302 L 211 264 h 64 L 275 302 a 32 14 0 0 1 -64 0 Z"
            fill={ref('body')}
          />
          <ellipse cx="243" cy="264" rx="32" ry="13" fill={ref('topFace')} />
          <ellipse
            cx="243"
            cy="264"
            rx="32"
            ry="13"
            fill="none"
            stroke="#0f0f0f"
            strokeWidth="1.5"
            opacity="0.5"
          />

          <rect x="218" y="269" width="5" height="29" fill="#ffffff" opacity="0.1" />
          <rect x="265" y="269" width="4" height="29" fill="#ffffff" opacity="0.07" />
        </g>
      </g>
    </svg>
  )
}
