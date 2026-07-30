'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

const SEGMENTS = 9
const SEGMENT_LENGTH = 14
const FOB_RADIUS = 11
const GRAVITY = 0.6
const DAMPING = 0.985
const CONSTRAINT_ITERATIONS = 6
const PULL_THRESHOLD = 46
const MAX_REACH = SEGMENT_LENGTH * SEGMENTS * 1.35
const GRAB_RADIUS = 26

const POINT_COUNT = SEGMENTS + 2 // anchor + links + fob
const ANCHOR_INDEX = 0
const FOB_INDEX = POINT_COUNT - 1

const CANVAS_WIDTH = 70
const CANVAS_HEIGHT = 200
const ANCHOR_Y = 8
const ANCHOR_X = CANVAS_WIDTH / 2

type Point = { x: number; y: number; oldX: number; oldY: number }

function createPoints(): Point[] {
  const points: Point[] = []
  for (let i = 0; i < POINT_COUNT; i++) {
    const y = ANCHOR_Y + i * SEGMENT_LENGTH
    points.push({ x: ANCHOR_X, y, oldX: ANCHOR_X, oldY: y })
  }
  return points
}

export function ChainToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<Point[]>(createPoints())
  const draggingRef = useRef(false)
  const isDarkRef = useRef(isDark)
  const toggleThemeRef = useRef(() => {})

  useEffect(() => {
    isDarkRef.current = isDark
    toggleThemeRef.current = () =>
      setTheme(isDarkRef.current ? 'light' : 'dark')
  }, [isDark, setTheme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = CANVAS_WIDTH * dpr
    canvas.height = CANVAS_HEIGHT * dpr
    canvas.style.width = `${CANVAS_WIDTH}px`
    canvas.style.height = `${CANVAS_HEIGHT}px`

    const points = pointsRef.current
    let rafId = 0

    function step() {
      const fob = points[FOB_INDEX]

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
          const diff = (dist - SEGMENT_LENGTH) / dist
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
      rafId = requestAnimationFrame(step)
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

    const dx = x - ANCHOR_X
    const dy = y - ANCHOR_Y
    const reach = Math.hypot(dx, dy)
    if (reach > MAX_REACH) {
      const scale = MAX_REACH / reach
      fob.x = ANCHOR_X + dx * scale
      fob.y = ANCHOR_Y + dy * scale
    } else {
      fob.x = x
      fob.y = y
    }
  }

  function endDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!draggingRef.current) return
    draggingRef.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)

    const fob = pointsRef.current[FOB_INDEX]
    const restY = ANCHOR_Y + SEGMENT_LENGTH * (POINT_COUNT - 1)
    const pulled = fob.y - restY
    if (pulled > PULL_THRESHOLD) {
      toggleThemeRef.current()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    const fob = pointsRef.current[FOB_INDEX]
    fob.y += 34
    toggleThemeRef.current()
  }

  return (
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
      className="absolute right-2 top-0 cursor-grab touch-none select-none active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
    />
  )
}

function draw(ctx: CanvasRenderingContext2D, points: Point[], isDark: boolean) {
  const dpr = window.devicePixelRatio || 1
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // mounting eyelet
  const anchor = points[ANCHOR_INDEX]
  ctx.strokeStyle = '#5a5d63'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(anchor.x, anchor.y, 4, 0, Math.PI * 2)
  ctx.stroke()

  // chain links
  for (let i = 0; i < POINT_COUNT - 2; i++) {
    const a = points[i]
    const b = points[i + 1]
    const midX = (a.x + b.x) / 2
    const midY = (a.y + b.y) / 2
    const angle = Math.atan2(b.y - a.y, b.x - a.x)

    ctx.save()
    ctx.translate(midX, midY)
    ctx.rotate(angle + (i % 2 === 0 ? Math.PI / 2 : 0))

    const gradient = ctx.createLinearGradient(-4, 0, 4, 0)
    gradient.addColorStop(0, '#c7cad0')
    gradient.addColorStop(0.5, '#8b8f96')
    gradient.addColorStop(1, '#5f6268')

    ctx.strokeStyle = gradient
    ctx.lineWidth = 3.4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.ellipse(0, 0, 3.2, SEGMENT_LENGTH / 2 - 1, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
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
  ctx.roundRect(-3.5, -FOB_RADIUS - 4, 7, 8, 3)
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
  ctx.lineWidth = 0.8
  for (const gy of [-4, 0, 5]) {
    ctx.beginPath()
    ctx.moveTo(-FOB_RADIUS + 3, gy)
    ctx.quadraticCurveTo(0, gy + 2, FOB_RADIUS - 3, gy)
    ctx.stroke()
  }

  ctx.restore()
}
