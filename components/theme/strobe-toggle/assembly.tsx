'use client'

import { useId } from 'react'

// Technics SL-1210 strobe illuminator. The lit/extended state has the
// cylinder popped up out of the plate with a warm LED glow around its
// window; the retracted/dark state sinks it flush and drops the glow
// entirely. Both variants share the same plate/cylinder geometry — only
// the colors, the button/cylinder extend-retract coordinates, and the
// glow (light only) differ, so those are the only things that vary here.

type Stop = { offset: string; color: string }

type StrobeVariantData = {
  bodyStops: Stop[]
  topFaceStops: Stop[]
  plateFaceStops: Stop[]
  plateEdgeStops: Stop[]
  pocketStops: Stop[]
  shadowOpacity: number
  highlightOpacity: number
  pocketMidFill: string
  pocketInnerFill: string
  outerRingFill: string
  outerRingStroke: string
  buttonTopY: number
  buttonStroke: string
  buttonRectY: number
  buttonRectHeight: number
  buttonRectOpacityA: number
  buttonRectOpacityB: number
  cylinderTopY: number
  cylinderStroke: string
  cylinderRectY: number
  cylinderRectHeight: number
  cylinderRectOpacityA: number
  cylinderRectOpacityB: number
  glow: { winLitStops: Stop[] } | null
}

const VARIANTS: Record<'light' | 'dark', StrobeVariantData> = {
  light: {
    bodyStops: [
      { offset: '0', color: '#5f6367' },
      { offset: '0.10', color: '#9ba0a3' },
      { offset: '0.22', color: '#e2e4e5' },
      { offset: '0.32', color: '#f4f5f5' },
      { offset: '0.44', color: '#c0c4c6' },
      { offset: '0.56', color: '#8d9195' },
      { offset: '0.70', color: '#c6c9cb' },
      { offset: '0.84', color: '#e8eaea' },
      { offset: '1', color: '#5b5f62' },
    ],
    topFaceStops: [
      { offset: '0', color: '#fafbfb' },
      { offset: '0.5', color: '#cbcfd1' },
      { offset: '1', color: '#8f9498' },
    ],
    plateFaceStops: [
      { offset: '0', color: '#eff0f1' },
      { offset: '0.35', color: '#c8cccd' },
      { offset: '0.6', color: '#e6e8e9' },
      { offset: '1', color: '#a2a6a9' },
    ],
    plateEdgeStops: [
      { offset: '0', color: '#8a8e91' },
      { offset: '1', color: '#4f5356' },
    ],
    pocketStops: [
      { offset: '0', color: '#d9dcdd' },
      { offset: '0.6', color: '#a9adb0' },
      { offset: '1', color: '#7b7f82' },
    ],
    shadowOpacity: 0.22,
    highlightOpacity: 0.35,
    pocketMidFill: '#9ca0a3',
    pocketInnerFill: '#9ea2a5',
    outerRingFill: '#9ea2a5',
    outerRingStroke: '#eceded',
    buttonTopY: 291,
    buttonStroke: '#7d8185',
    buttonRectY: 294,
    buttonRectHeight: 13,
    buttonRectOpacityA: 0.3,
    buttonRectOpacityB: 0.18,
    cylinderTopY: 110,
    cylinderStroke: '#7d8185',
    cylinderRectY: 115,
    cylinderRectHeight: 183,
    cylinderRectOpacityA: 0.3,
    cylinderRectOpacityB: 0.18,
    glow: {
      winLitStops: [
        { offset: '0', color: '#fffdf4' },
        { offset: '0.5', color: '#ffe6a6' },
        { offset: '1', color: '#f0b348' },
      ],
    },
  },
  dark: {
    bodyStops: [
      { offset: '0', color: '#181818' },
      { offset: '0.10', color: '#2e2e2e' },
      { offset: '0.22', color: '#4a4a4a' },
      { offset: '0.32', color: '#525252' },
      { offset: '0.44', color: '#3a3a3a' },
      { offset: '0.56', color: '#242424' },
      { offset: '0.70', color: '#3c3c3c' },
      { offset: '0.84', color: '#484848' },
      { offset: '1', color: '#161616' },
    ],
    topFaceStops: [
      { offset: '0', color: '#4e4e4e' },
      { offset: '0.5', color: '#333333' },
      { offset: '1', color: '#1e1e1e' },
    ],
    plateFaceStops: [
      { offset: '0', color: '#3f3f3f' },
      { offset: '0.35', color: '#2b2b2b' },
      { offset: '0.6', color: '#3a3a3a' },
      { offset: '1', color: '#1f1f1f' },
    ],
    plateEdgeStops: [
      { offset: '0', color: '#1c1c1c' },
      { offset: '1', color: '#0e0e0e' },
    ],
    pocketStops: [
      { offset: '0', color: '#3a3a3a' },
      { offset: '0.6', color: '#282828' },
      { offset: '1', color: '#191919' },
    ],
    shadowOpacity: 0.3,
    highlightOpacity: 0.12,
    pocketMidFill: '#242424',
    pocketInnerFill: '#232323',
    outerRingFill: '#232323',
    outerRingStroke: '#4a4a4a',
    buttonTopY: 279,
    buttonStroke: '#0f0f0f',
    buttonRectY: 282,
    buttonRectHeight: 25,
    buttonRectOpacityA: 0.1,
    buttonRectOpacityB: 0.07,
    cylinderTopY: 264,
    cylinderStroke: '#0f0f0f',
    cylinderRectY: 269,
    cylinderRectHeight: 29,
    cylinderRectOpacityA: 0.1,
    cylinderRectOpacityB: 0.07,
    glow: null,
  },
}

export function StrobeAssembly({
  variant,
  className,
}: {
  variant: 'light' | 'dark'
  className?: string
}) {
  const id = useId()
  const gid = (name: string) => `${name}${id}`
  const ref = (name: string) => `url(#${name}${id})`
  const v = VARIANTS[variant]

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid('body')} x1="0" y1="0" x2="1" y2="0">
          {v.bodyStops.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <linearGradient id={gid('topFace')} x1="0" y1="0" x2="1" y2="1">
          {v.topFaceStops.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <linearGradient id={gid('plateFace')} x1="0.1" y1="0" x2="0.9" y2="1">
          {v.plateFaceStops.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <linearGradient id={gid('plateEdge')} x1="0" y1="0" x2="0" y2="1">
          {v.plateEdgeStops.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <radialGradient id={gid('pocket')} cx="0.35" cy="0.25" r="0.85">
          {v.pocketStops.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </radialGradient>
        {v.glow && (
          <linearGradient id={gid('winLit')} x1="0" y1="0" x2="0" y2="1">
            {v.glow.winLitStops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        )}
        {v.glow && (
          <filter id={gid('blurLight')} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        )}
        <filter id={gid('sh')} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="8"
            floodColor="#000"
            floodOpacity={v.shadowOpacity}
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
          opacity={v.highlightOpacity}
        />

        <ellipse cx="140" cy="310" rx="30" ry="15" fill={ref('pocket')} />
        <ellipse cx="140" cy="312" rx="22" ry="11" fill={v.pocketMidFill} />
        <ellipse cx="140" cy="313" rx="11" ry="6" fill={v.pocketInnerFill} />

        <ellipse cx="243" cy="308" rx="40" ry="18" fill={v.outerRingFill} />
        <ellipse
          cx="243"
          cy="306"
          rx="40"
          ry="18"
          fill="none"
          stroke={v.outerRingStroke}
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* button — no bounce, just crossfades smoothly with the layer */}
        <path
          d={`M 123 306 L 123 ${v.buttonTopY} h 34 L 157 306 a 17 8 0 0 1 -34 0 Z`}
          fill={ref('body')}
        />
        <ellipse cx="140" cy={v.buttonTopY} rx="17" ry="7" fill={ref('topFace')} />
        <ellipse
          cx="140"
          cy={v.buttonTopY}
          rx="17"
          ry="7"
          fill="none"
          stroke={v.buttonStroke}
          strokeWidth="1.2"
          opacity="0.5"
        />
        <rect
          x="127"
          y={v.buttonRectY}
          width="3"
          height={v.buttonRectHeight}
          fill="#ffffff"
          opacity={v.buttonRectOpacityA}
        />
        <rect
          x="151"
          y={v.buttonRectY}
          width="2"
          height={v.buttonRectHeight}
          fill="#ffffff"
          opacity={v.buttonRectOpacityB}
        />

        <g className="strobe-toggle__moving">
          <path
            d={`M 211 302 L 211 ${v.cylinderTopY} h 64 L 275 302 a 32 14 0 0 1 -64 0 Z`}
            fill={ref('body')}
          />
          <ellipse cx="243" cy={v.cylinderTopY} rx="32" ry="13" fill={ref('topFace')} />
          <ellipse
            cx="243"
            cy={v.cylinderTopY}
            rx="32"
            ry="13"
            fill="none"
            stroke={v.cylinderStroke}
            strokeWidth="1.5"
            opacity="0.5"
          />

          {v.glow && (
            <>
              <circle
                cx="243"
                cy="171"
                r="63"
                fill="#ffd98d"
                opacity="0.28"
                filter={ref('blurLight')}
              />
              <circle
                cx="243"
                cy="171"
                r="39"
                fill="#ffe0a0"
                opacity="0.7"
                filter={ref('blurLight')}
              />
              <rect x="230" y="148" width="26" height="46" rx="13" fill="#5d6165" />
              <rect x="233" y="151" width="20" height="40" rx="10" fill={ref('winLit')} />
              <circle cx="243" cy="171" r="8" fill="#fffdf2" opacity="0.95" />
            </>
          )}

          <rect
            x="218"
            y={v.cylinderRectY}
            width="5"
            height={v.cylinderRectHeight}
            fill="#ffffff"
            opacity={v.cylinderRectOpacityA}
          />
          <rect
            x="265"
            y={v.cylinderRectY}
            width="4"
            height={v.cylinderRectHeight}
            fill="#ffffff"
            opacity={v.cylinderRectOpacityB}
          />
        </g>
      </g>
    </svg>
  )
}
