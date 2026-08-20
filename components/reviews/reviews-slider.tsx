'use client'

import { useEffect, useRef } from 'react'
import { ReviewCard } from './review-card'
import type { ApprovedReview } from '@/lib/repositories/reviews'

const PX_PER_SECOND = 40
const FRICTION_PER_FRAME = 0.94 // share of speed kept per 16ms of coasting
const MIN_COAST_SPEED = 0.02 // px/ms at which a coast is over
const WHEEL_IDLE_MS = 180 // a wheel gesture has no end event; a pause stands in
const MIN_REVIEWS_FOR_LOOP = 5

export function ReviewsSlider({ reviews }: { reviews: ApprovedReview[] }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const loops = reviews.length >= MIN_REVIEWS_FOR_LOOP
  const reviewsList = loops ? [...reviews, ...reviews] : reviews

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Native listeners throughout: React's onWheel/onPointer* are passive,
    // where preventDefault only warns, so a horizontal wheel gesture can't
    // be claimed from JSX.
    const abort = new AbortController()
    const on = <K extends keyof HTMLElementEventMap>(
      type: K,
      handler: (e: HTMLElementEventMap[K]) => void,
    ) =>
      viewport.addEventListener(type, handler, {
        passive: false,
        signal: abort.signal,
      })

    if (!loops) {
      let drag: { id: number; x: number; scrollLeft: number } | null = null

      on('pointerdown', (e) => {
        drag = {
          id: e.pointerId,
          x: e.clientX,
          scrollLeft: viewport.scrollLeft,
        }
        viewport.setPointerCapture(e.pointerId)
      })
      on('pointermove', (e) => {
        if (drag?.id !== e.pointerId) return
        viewport.scrollLeft = drag.scrollLeft - (e.clientX - drag.x)
      })
      on('pointerup', () => (drag = null))
      on('pointercancel', () => (drag = null))

      return () => abort.abort()
    }

    // Until this runs the viewport is a plain scroller, so the list works
    // without JS; from here the transform alone moves it.
    viewport.style.overflow = 'hidden'
    viewport.style.touchAction = 'pan-y'

    const loopWidth = track.scrollWidth / 2
    const duration = loopWidth / PX_PER_SECOND

    let offset = 0
    let frame = 0
    let idle: ReturnType<typeof setTimeout>
    let drag: { id: number; x: number; time: number; speed: number } | null

    // Both copies are identical, so every offset has an equivalent in
    // (-loopWidth, 0] — the range where the viewport is always over content.
    const normalize = (value: number) =>
      -(((-value % loopWidth) + loopWidth) % loopWidth)

    // Moves the track by hand. The animation is detached first so the two
    // never write `transform` in the same frame.
    const move = (by: number) => {
      offset = normalize(offset + by)
      track.style.animationName = 'none'
      track.style.transform = `translateX(${offset}px)`
    }

    // Takes over from the animation, wherever it happens to be right now.
    const grab = () => {
      const { transform } = getComputedStyle(track)
      cancelAnimationFrame(frame)
      offset = transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41
      move(0)
    }

    // Hands `transform` back, entering the cycle at the current offset so
    // the handover is invisible. Longhands, because the `animation`
    // shorthand would also write an inline animation-play-state and so
    // outrank the hover-to-pause rule.
    const release = () => {
      track.style.transform = ''
      track.style.animationName = 'marquee'
      track.style.animationDuration = `${duration}s`
      track.style.animationTimingFunction = 'linear'
      track.style.animationIterationCount = 'infinite'
      track.style.animationDelay = `${(offset / loopWidth) * duration}s`
    }

    const coast = (speed: number) => {
      let previous = performance.now()

      const step = (now: number) => {
        const elapsed = now - previous
        previous = now
        speed *= FRICTION_PER_FRAME ** (elapsed / 16)
        move(speed * elapsed)

        if (Math.abs(speed) < MIN_COAST_SPEED) return release()
        frame = requestAnimationFrame(step)
      }

      frame = requestAnimationFrame(step)
    }

    const endDrag = (e: PointerEvent) => {
      if (drag?.id !== e.pointerId) return
      const { speed } = drag
      drag = null
      coast(speed)
    }

    on('pointerdown', (e) => {
      grab()
      drag = { id: e.pointerId, x: e.clientX, time: e.timeStamp, speed: 0 }
      viewport.setPointerCapture(e.pointerId)
    })

    on('pointermove', (e) => {
      if (drag?.id !== e.pointerId) return
      const distance = e.clientX - drag.x
      drag.speed = distance / Math.max(e.timeStamp - drag.time, 1)
      drag.x = e.clientX
      drag.time = e.timeStamp
      move(distance)
    })

    on('pointerup', endDrag)
    on('pointercancel', endDrag)

    on('wheel', (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      grab()
      move(-e.deltaX)
      clearTimeout(idle)
      idle = setTimeout(release, WHEEL_IDLE_MS)
    })

    release()

    return () => {
      abort.abort()
      clearTimeout(idle)
      cancelAnimationFrame(frame)
    }
  }, [loops])

  return (
    <div
      ref={viewportRef}
      className="overflow-x-auto py-[15px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        ref={trackRef}
        className="flex w-max cursor-grab gap-[14px] perspective-[1000px] transform-3d hover:[animation-play-state:paused] active:cursor-grabbing"
      >
        {reviewsList.map((review, i) => (
          <ReviewCard key={`${review.id}-${i}`} review={review} />
        ))}
      </div>
    </div>
  )
}
