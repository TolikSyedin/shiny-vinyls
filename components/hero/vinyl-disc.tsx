'use client'

import { useEffect, useRef } from 'react'

export function VinylDisc() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const stateRef = useRef({
    angle: 0,
    vel: 0,
    dragging: false,
    lastA: 0,
    lastT: 0,
  })

  useEffect(() => {
    const el = svgRef.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const BASE = reduce ? 0 : 13.8
    stateRef.current.vel = BASE

    let prev = performance.now()
    let rafId: number

    function loop(t: number) {
      const dt = Math.min(0.05, (t - prev) / 1000)
      prev = t

      if (!stateRef.current.dragging) {
        stateRef.current.vel +=
          (BASE - stateRef.current.vel) * Math.min(1, dt * 2.1)
        stateRef.current.angle += stateRef.current.vel * dt
      }

      if (el) {
        el.style.transform = `rotate(${stateRef.current.angle.toFixed(2)}deg)`
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(rafId)
  }, [])

  function pointAngle(e: React.PointerEvent<SVGSVGElement>) {
    if (!svgRef.current) return 0
    const r = svgRef.current.getBoundingClientRect()
    return (
      Math.atan2(
        e.clientY - (r.top + r.height / 2),
        e.clientX - (r.left + r.width / 2),
      ) *
      (180 / Math.PI)
    )
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    stateRef.current.dragging = true
    stateRef.current.vel = 0
    stateRef.current.lastA = pointAngle(e)
    stateRef.current.lastT = performance.now()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Safari can throw if the pointer was already released by the time
      // this runs — the drag still works fine without capture, so ignore it.
    }
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!stateRef.current.dragging) return
    const a = pointAngle(e)
    const now = performance.now()
    let d = a - stateRef.current.lastA

    if (d > 180) d -= 360
    else if (d < -180) d += 360

    stateRef.current.angle += d
    const dt = (now - stateRef.current.lastT) / 1000
    if (dt > 0.004) {
      stateRef.current.vel = Math.max(-1400, Math.min(1400, d / dt))
    }

    stateRef.current.lastA = a
    stateRef.current.lastT = now
  }

  function handleRelease() {
    stateRef.current.dragging = false
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 240 240"
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        touchAction: 'none',
        userSelect: 'none',
        cursor: 'grab',
        willChange: 'transform',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handleRelease}
      onPointerCancel={handleRelease}
      onLostPointerCapture={handleRelease}
    >
      <g>
        <circle cx="120" cy="120" r="112" fill="var(--disc)" />
        <circle
          cx="120"
          cy="120"
          r="103"
          fill="none"
          stroke="var(--groove)"
          strokeWidth="1.5"
        />
        <circle
          cx="120"
          cy="120"
          r="96"
          fill="none"
          stroke="var(--groove)"
          strokeWidth="1.5"
        />
        <circle
          cx="120"
          cy="120"
          r="89"
          fill="none"
          stroke="var(--groove)"
          strokeWidth="1.5"
        />
        <circle
          cx="120"
          cy="120"
          r="82"
          fill="none"
          stroke="var(--groove)"
          strokeWidth="1.5"
        />
        <circle
          cx="120"
          cy="120"
          r="75"
          fill="none"
          stroke="var(--groove)"
          strokeWidth="1.5"
        />
        <circle
          cx="120"
          cy="120"
          r="68"
          fill="none"
          stroke="var(--groove)"
          strokeWidth="1.5"
        />
        <circle
          cx="120"
          cy="120"
          r="61"
          fill="none"
          stroke="var(--groove)"
          strokeWidth="1.5"
        />
        <circle
          cx="120"
          cy="120"
          r="54"
          fill="none"
          stroke="var(--groove)"
          strokeWidth="1.5"
        />
        <circle
          cx="120"
          cy="120"
          r="40"
          fill="var(--surface)"
          stroke="var(--muted)"
          strokeWidth="1.2"
        />
        <g
          transform="translate(120 120) scale(4) translate(-12 -12)"
          stroke="var(--stamp)"
          fill="none"
          strokeWidth="1"
          strokeLinejoin="miter"
        >
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M 7.2 7 L 7.2 10 L 12 10" strokeLinecap="square" />
          <path d="M 2.2 14 L 7.2 14 L 7.2 17" />
          <line x1="17" y1="3.34" x2="17" y2="17" />
        </g>
      </g>
    </svg>
  )
}
