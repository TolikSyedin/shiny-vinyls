'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useSyncExternalStore } from 'react'
import { primeClickAudio, playClick } from './click-sound'
import {
  ANCHOR_X,
  ANCHOR_Y,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CHAIN_TOP,
  FOB_INDEX,
  GRAB_RADIUS,
  MAX_REACH_X,
  MAX_REACH_Y,
  POINT_COUNT,
  PULL_THRESHOLD,
  SEG_LEN_DARK,
  SEG_LEN_EASE,
  SEG_LEN_LIGHT,
  SUPERSAMPLE,
  type Point,
} from './constants'
import { LampShadeIcon } from './lamp-shade-icon'
import { createPoints, stepChain } from './physics'
import { draw } from './render'

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

      stepChain(points, segLenRef.current, draggingRef.current)
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
