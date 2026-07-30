'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

const SEGMENTS = 6
const SEG_LEN_DARK = 11
const SEG_LEN_LIGHT = 15
const SEG_LEN_EASE = 0.06
const FOB_RADIUS = 9
const GRAVITY = 0.5
const DAMPING = 0.993
const CONSTRAINT_ITERATIONS = 6
const PULL_THRESHOLD = 30
const MAX_REACH_X = 36
const GRAB_RADIUS = 20

const POINT_COUNT = SEGMENTS + 2 // anchor + links + fob
const ANCHOR_INDEX = 0
const FOB_INDEX = POINT_COUNT - 1

// must clear the longest resting length (light theme) plus threshold + slack,
// otherwise the drag ceiling sits above where the chain already hangs at rest
const MAX_REACH_Y = SEG_LEN_LIGHT * (POINT_COUNT - 1) + PULL_THRESHOLD + 40

const CANVAS_WIDTH = 140
const CANVAS_HEIGHT = 220
const ANCHOR_Y = 4
const ANCHOR_X = CANVAS_WIDTH / 2

// extra internal resolution beyond the display's own DPR, so the tiny beads
// and fob get properly anti-aliased instead of looking chunky next to the SVG
const SUPERSAMPLE = 2

const WRAPPER_SIZE = 64
const ICON_SIZE = 48
const ICON_VIEWBOX = 24
const ICON_RING_Y = 16.5 // viewBox units — where the mounting ring sits

// lines the chain's anchor up with the icon's ring, minus a couple px so the
// wire visually continues straight out of the ring with no dead gap
const CHAIN_TOP =
  (WRAPPER_SIZE - ICON_SIZE) / 2 + (ICON_RING_Y / ICON_VIEWBOX) * ICON_SIZE - 2

type Point = { x: number; y: number; oldX: number; oldY: number }

function createPoints(): Point[] {
  const startLen = (SEG_LEN_DARK + SEG_LEN_LIGHT) / 2
  const points: Point[] = []
  for (let i = 0; i < POINT_COUNT; i++) {
    const y = ANCHOR_Y + i * startLen
    points.push({ x: ANCHOR_X, y, oldX: ANCHOR_X, oldY: y })
  }
  return points
}

function createAudioContext(): AudioContext | null {
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  return Ctor ? new Ctor() : null
}

function LampShadeIcon({ isDark }: { isDark: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="relative z-10 size-12"
    >
      <circle
        cx="12"
        cy={isDark ? 9 : 6}
        r="3"
        fill={isDark ? '#4a4a4a' : '#ffe066'}
        opacity={isDark ? 0 : 1}
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

function playNoiseBurst(
  ctx: AudioContext,
  startAt: number,
  duration: number,
  filterType: BiquadFilterType,
  frequency: number,
  q: number,
  peakGain: number,
) {
  const bufferSize = Math.ceil(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = filterType
  filter.frequency.value = frequency
  filter.Q.value = q
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(peakGain, startAt)
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start(startAt)
  source.stop(startAt + duration)
}

function playClick(audioCtxRef: React.RefObject<AudioContext | null>) {
  if (!audioCtxRef.current) {
    audioCtxRef.current = createAudioContext()
  }
  const ctx = audioCtxRef.current
  if (!ctx) return
  if (ctx.state === 'suspended') void ctx.resume()

  const now = ctx.currentTime
  // a crisp high tick immediately followed by a soft low thunk —
  // mimics a real pull-chain switch's contact engaging, not a tone sweep
  playNoiseBurst(ctx, now, 0.02, 'bandpass', 3200, 1.5, 0.5)
  playNoiseBurst(ctx, now + 0.008, 0.035, 'lowpass', 350, 0.9, 0.22)
}

export function ChainToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<Point[]>(createPoints())
  const segLenRef = useRef((SEG_LEN_DARK + SEG_LEN_LIGHT) / 2)
  const draggingRef = useRef(false)
  const isDarkRef = useRef(isDark)
  const toggleThemeRef = useRef(() => {})
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    isDarkRef.current = isDark
    toggleThemeRef.current = () => {
      playClick(audioCtxRef)
      setTheme(isDarkRef.current ? 'light' : 'dark')
    }
  }, [isDark, setTheme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scale = (window.devicePixelRatio || 1) * SUPERSAMPLE
    canvas.width = CANVAS_WIDTH * scale
    canvas.height = CANVAS_HEIGHT * scale
    canvas.style.width = `${CANVAS_WIDTH}px`
    canvas.style.height = `${CANVAS_HEIGHT}px`

    const points = pointsRef.current
    let rafId = 0

    function step() {
      // scheduled first so one bad frame can't silently kill the whole loop
      rafId = requestAnimationFrame(step)
      try {
        tick()
      } catch (err) {
        console.error('[ChainToggle] render error', err)
      }
    }

    function tick() {
      const target = isDarkRef.current ? SEG_LEN_DARK : SEG_LEN_LIGHT
      segLenRef.current += (target - segLenRef.current) * SEG_LEN_EASE
      const segLen = segLenRef.current

      if (!draggingRef.current) {
        for (let i = 1; i < POINT_COUNT; i++) {
          const p = points[i]
          const vx = (p.x - p.oldX) * DAMPING
          const vy = (p.y - p.oldY) * DAMPING
          p.oldX = p.x
          p.oldY = p.y
          p.x += vx
          p.y += vy + GRAVITY
        }
      } else {
        for (let i = 1; i < FOB_INDEX; i++) {
          const p = points[i]
          const vx = (p.x - p.oldX) * DAMPING
          const vy = (p.y - p.oldY) * DAMPING
          p.oldX = p.x
          p.oldY = p.y
          p.x += vx
          p.y += vy + GRAVITY
        }
      }

      for (let iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
        for (let i = 0; i < POINT_COUNT - 1; i++) {
          const a = points[i]
          const b = points[i + 1]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001
          const diff = (dist - segLen) / dist
          const aFixed = i === ANCHOR_INDEX
          const bFixed = draggingRef.current && i + 1 === FOB_INDEX

          if (aFixed && bFixed) continue
          if (aFixed) {
            b.x -= dx * diff
            b.y -= dy * diff
          } else if (bFixed) {
            a.x += dx * diff
            a.y += dy * diff
          } else {
            a.x += dx * diff * 0.5
            a.y += dy * diff * 0.5
            b.x -= dx * diff * 0.5
            b.y -= dy * diff * 0.5
          }
        }
        points[ANCHOR_INDEX].x = ANCHOR_X
        points[ANCHOR_INDEX].y = ANCHOR_Y
      }

      draw(ctx!, points, isDarkRef.current)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [])

  function localCoords(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const { x, y } = localCoords(e)
    const fob = pointsRef.current[FOB_INDEX]
    const dist = Math.hypot(x - fob.x, y - fob.y)
    if (dist > GRAB_RADIUS) return
    e.currentTarget.setPointerCapture(e.pointerId)
    draggingRef.current = true
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!draggingRef.current) return
    const { x, y } = localCoords(e)
    const fob = pointsRef.current[FOB_INDEX]
    fob.oldX = fob.x
    fob.oldY = fob.y

    const dx = Math.max(-MAX_REACH_X, Math.min(MAX_REACH_X, x - ANCHOR_X))
    const dy = Math.max(0, Math.min(MAX_REACH_Y, y - ANCHOR_Y))
    fob.x = ANCHOR_X + dx
    fob.y = ANCHOR_Y + dy
  }

  function endDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!draggingRef.current) return
    draggingRef.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)

    const fob = pointsRef.current[FOB_INDEX]
    const restY = ANCHOR_Y + segLenRef.current * (POINT_COUNT - 1)
    const pulled = fob.y - restY
    if (pulled > PULL_THRESHOLD) {
      toggleThemeRef.current()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    const fob = pointsRef.current[FOB_INDEX]
    fob.y += 22
    toggleThemeRef.current()
  }

  return (
    <div className="relative flex size-16 shrink-0 items-center justify-center">
      <button
        type="button"
        onClick={() => toggleThemeRef.current()}
        aria-label={
          isDark
            ? 'Клікнути на торшер, щоб увімкнути світлу тему'
            : 'Клікнути на торшер, щоб увімкнути темну тему'
        }
        aria-pressed={isDark}
        className="relative z-10 flex size-16 items-center justify-center"
      >
        <LampShadeIcon isDark={isDark} />
      </button>
      <canvas
        ref={canvasRef}
        role="button"
        tabIndex={0}
        aria-label={
          isDark
            ? 'Смикнути ланцюжок, щоб увімкнути світлу тему'
            : 'Смикнути ланцюжок, щоб увімкнути темну тему'
        }
        aria-pressed={isDark}
        suppressHydrationWarning
        style={{ top: `${CHAIN_TOP}px` }}
        className="absolute left-1/2 -translate-x-1/2 cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

// manual rounded-rect path — CanvasRenderingContext2D.roundRect() only
// shipped in Safari 16.4 (2023), so older iPhones don't have it at all
function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function draw(ctx: CanvasRenderingContext2D, points: Point[], isDark: boolean) {
  const scale = (window.devicePixelRatio || 1) * SUPERSAMPLE
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // thin wire running through every link up to the fob
  ctx.strokeStyle = '#75787f'
  ctx.lineWidth = 1.3
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < POINT_COUNT; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.stroke()

  // ball-chain beads
  for (let i = 1; i < POINT_COUNT - 1; i++) {
    const p = points[i]
    const gradient = ctx.createRadialGradient(
      p.x - 1,
      p.y - 1,
      0.4,
      p.x,
      p.y,
      3.4,
    )
    gradient.addColorStop(0, '#e4e6ea')
    gradient.addColorStop(1, '#787c83')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // wooden fob
  const capPoint = points[POINT_COUNT - 2]
  const fob = points[FOB_INDEX]
  const angle = Math.atan2(fob.y - capPoint.y, fob.x - capPoint.x)

  ctx.save()
  ctx.translate(fob.x, fob.y)
  ctx.rotate(angle - Math.PI / 2)

  // small metal cap connecting chain to wood
  ctx.fillStyle = '#7d8087'
  ctx.beginPath()
  roundedRectPath(ctx, -3.2, -FOB_RADIUS - 4, 6.4, 7, 3)
  ctx.fill()

  // wood body (acorn-ish teardrop)
  const woodGradient = ctx.createRadialGradient(-3, -3, 2, 0, 0, FOB_RADIUS + 2)
  if (isDark) {
    woodGradient.addColorStop(0, '#9c6a3e')
    woodGradient.addColorStop(1, '#4a2e18')
  } else {
    woodGradient.addColorStop(0, '#c68a4e')
    woodGradient.addColorStop(1, '#7a4a24')
  }
  ctx.fillStyle = woodGradient
  ctx.beginPath()
  ctx.moveTo(0, -FOB_RADIUS)
  ctx.bezierCurveTo(
    FOB_RADIUS,
    -FOB_RADIUS,
    FOB_RADIUS,
    FOB_RADIUS,
    0,
    FOB_RADIUS + 3,
  )
  ctx.bezierCurveTo(
    -FOB_RADIUS,
    FOB_RADIUS,
    -FOB_RADIUS,
    -FOB_RADIUS,
    0,
    -FOB_RADIUS,
  )
  ctx.closePath()
  ctx.fill()

  // grain lines
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth = 0.7
  for (const gy of [-3, 0, 4]) {
    ctx.beginPath()
    ctx.moveTo(-FOB_RADIUS + 2, gy)
    ctx.quadraticCurveTo(0, gy + 2, FOB_RADIUS - 2, gy)
    ctx.stroke()
  }

  ctx.restore()
}
