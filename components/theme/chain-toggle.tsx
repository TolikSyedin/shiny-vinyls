'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useSyncExternalStore } from 'react'

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

const CLICK_SAMPLE_RATE = 44100
const CLICK_DURATION = 0.06
const CLICK_GAP = 0.018 // seconds between the "click" and the "clack"

function writeAscii(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i))
  }
}

// Cheap state-variable bandpass filter (Chamberlin design) run over raw
// white noise — this is what gives the tick its narrow, "crisp" timbre
// instead of a flat hiss. Same role BiquadFilterNode played back when this
// used Web Audio.
function bandpassNoise(
  length: number,
  sampleRate: number,
  freq: number,
  q: number,
): Float32Array {
  const out = new Float32Array(length)
  const f = 2 * Math.sin((Math.PI * freq) / sampleRate)
  const qInv = 1 / q
  let low = 0
  let band = 0
  let peak = 0
  for (let i = 0; i < length; i++) {
    const x = Math.random() * 2 - 1
    const high = x - low - qInv * band
    band += f * high
    low += f * band
    out[i] = band
    peak = Math.max(peak, Math.abs(band))
  }
  const norm = peak > 0 ? 1 / peak : 1
  for (let i = 0; i < length; i++) out[i] *= norm
  return out
}

// Synthesises the click as a plain 16-bit WAV so it can be played through an
// <audio> element. Web Audio needs its context unlocked by a "clean" user
// gesture, and on iOS a touch that blocks page scrolling — which the chain
// drag must do — never qualifies, leaving resume() hanging forever. Media
// elements go through a different, far more permissive path.
function buildClickWavUrl(): string {
  const length = Math.floor(CLICK_SAMPLE_RATE * CLICK_DURATION)
  const bytes = new ArrayBuffer(44 + length * 2)
  const view = new DataView(bytes)

  writeAscii(view, 0, 'RIFF')
  view.setUint32(4, 36 + length * 2, true)
  writeAscii(view, 8, 'WAVE')
  writeAscii(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, CLICK_SAMPLE_RATE, true)
  view.setUint32(28, CLICK_SAMPLE_RATE * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeAscii(view, 36, 'data')
  view.setUint32(40, length * 2, true)

  // two independent noise sources — the "clack" is pitched a touch lower
  // and quieter, like a switch mechanism's contact followed by its settle
  const clickNoise = bandpassNoise(length, CLICK_SAMPLE_RATE, 3200, 2.2)
  const clackNoise = bandpassNoise(length, CLICK_SAMPLE_RATE, 2400, 2.2)
  const gapSamples = Math.floor(CLICK_GAP * CLICK_SAMPLE_RATE)

  for (let i = 0; i < length; i++) {
    const t = i / CLICK_SAMPLE_RATE
    const click = clickNoise[i] * Math.exp(-t * 650)

    let clack = 0
    if (i >= gapSamples) {
      const t2 = (i - gapSamples) / CLICK_SAMPLE_RATE
      clack = clackNoise[i - gapSamples] * Math.exp(-t2 * 650) * 0.8
    }

    const sample = Math.max(-1, Math.min(1, click + clack))
    view.setInt16(44 + i * 2, sample * 0x7fff, true)
  }

  return URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' }))
}

// `bulbOut` rather than `isDark` so the pre-hydration state is "tucked
// away": the bulb only ever animates outwards, once the resolved theme is
// actually known to be light. Keying it off isDark instead would show the
// bulb on the server, then visibly retract it on a dark-themed device.
function LampShadeIcon({ bulbOut }: { bulbOut: boolean }) {
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

let clickAudio: HTMLAudioElement | null = null

function getClickAudio(): HTMLAudioElement {
  if (!clickAudio) {
    clickAudio = new Audio(buildClickWavUrl())
    clickAudio.preload = 'auto'
  }
  return clickAudio
}

// Playing the element once inside a user gesture is what makes iOS willing
// to replay it programmatically later, so this is called on every plausible
// gesture rather than only when the theme actually flips.
function primeClickAudio() {
  const audio = getClickAudio()
  if (!audio.paused) return
  const restoreVolume = audio.volume
  audio.volume = 0
  void audio
    .play()
    .then(() => {
      audio.pause()
      audio.currentTime = 0
      audio.volume = restoreVolume
    })
    .catch(() => {
      audio.volume = restoreVolume
    })
}

function playClick() {
  const audio = getClickAudio()
  audio.currentTime = 0
  void audio.play().catch(() => {})
}

// mounted-detection only: the value never changes after hydration, so
// there is nothing to subscribe to
function subscribeToNothing() {
  return () => {}
}

export function ChainToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // The server has no idea which theme will resolve, and React explicitly
  // does not patch up attribute mismatches it finds while hydrating — which
  // once left the bulb frozen in its light-theme position under a dark page.
  // Both sides render the same neutral markup, and the theme-dependent bits
  // only diverge from it after mount, when the resolved theme is known.
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  )
  const isDark = mounted && resolvedTheme === 'dark'
  const bulbOut = mounted && resolvedTheme !== 'dark'
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<Point[]>(createPoints())
  const segLenRef = useRef((SEG_LEN_DARK + SEG_LEN_LIGHT) / 2)
  const draggingRef = useRef(false)
  const isDarkRef = useRef(isDark)
  const toggleThemeRef = useRef(() => {})

  useEffect(() => {
    // any tap on the page is a chance to get the clip primed for playback
    function handleFirstInteraction() {
      primeClickAudio()
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchend', handleFirstInteraction)
    }
    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('touchend', handleFirstInteraction)
    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchend', handleFirstInteraction)
    }
  }, [])

  useEffect(() => {
    isDarkRef.current = isDark
    toggleThemeRef.current = () => {
      playClick()
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

    // Unlock audio and block the page scroll in one go, from a classic
    // non-passive touchstart. preventDefault() here stops Safari panning
    // the page for this gesture without disqualifying it as an unlock
    // gesture the way `touch-action: none` or a touchmove handler would.
    // React's synthetic onTouchStart can't do this — it binds passively.
    function handleNativeTouchStart(e: TouchEvent) {
      primeClickAudio()

      const touch = e.touches[0]
      if (!touch) return
      const rect = canvas!.getBoundingClientRect()
      const x = ((touch.clientX - rect.left) / rect.width) * CANVAS_WIDTH
      const y = ((touch.clientY - rect.top) / rect.height) * CANVAS_HEIGHT
      const fob = pointsRef.current[FOB_INDEX]
      if (Math.hypot(x - fob.x, y - fob.y) <= GRAB_RADIUS) {
        e.preventDefault()
      }
    }
    canvas.addEventListener('touchstart', handleNativeTouchStart, {
      passive: false,
    })

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
    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('touchstart', handleNativeTouchStart)
    }
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
    primeClickAudio()
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
        <LampShadeIcon bulbOut={bulbOut} />
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
        className="absolute left-1/2 -translate-x-1/2 cursor-grab select-none active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={handleKeyDown}
        onMouseDown={() => primeClickAudio()}
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
