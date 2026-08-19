'use client'

import { useEffect, useRef } from 'react'
import { ReviewCard } from './review-card'
import type { ApprovedReview } from '@/lib/repositories/reviews'

const AUTO_SCROLL_PX_PER_SECOND = 40
// How long to hold off autoplay after the last scroll we didn't cause
// ourselves — covers touch drag, trackpad, and wheel uniformly.
const RESUME_AFTER_SCROLL_MS = 600
// scrollLeft only ever moves in whole pixels, so a drift check needs a
// little slack to absorb that without mistaking our own rounding for a real
// user scroll (which moves far more than a couple of pixels per frame).
const DRIFT_EPSILON_PX = 2
const COPIES = 3

export function ReviewsSlider({ reviews }: { reviews: ApprovedReview[] }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const oneCopyWidth = outer.scrollWidth / COPIES
    const middleCopyStart = oneCopyWidth * Math.floor(COPIES / 2)

    // The true, fractional scroll position lives here — never re-derived
    // from outer.scrollLeft during normal autoplay, since that getter is
    // whole-pixel-rounded by the browser and would erase the sub-pixel
    // progress made each frame. The whole-pixel part is written to
    // scrollLeft (so native scroll/momentum, and the drift check below,
    // still see a sane integer position); the leftover sub-pixel remainder
    // is painted via a `transform` on the inner track instead, which is
    // compositor-driven and not pixel-snapped — this is what makes the
    // motion look smooth rather than stepping in visible 1px jumps.
    let position = middleCopyStart
    let lastWrittenWhole = Math.floor(position)
    outer.scrollLeft = lastWrittenWhole
    inner.style.transform = `translateX(${lastWrittenWhole - position}px)`

    let frameId: number
    let lastTime: number | null = null
    let userInteractingUntil = 0

    function tick(time: number) {
      if (lastTime === null) lastTime = time
      const deltaSeconds = (time - lastTime) / 1000
      lastTime = time

      if (outer && inner) {
        const observed = outer.scrollLeft
        const driftedByUser =
          Math.abs(observed - lastWrittenWhole) > DRIFT_EPSILON_PX
        if (driftedByUser) {
          position = observed
          userInteractingUntil = time + RESUME_AFTER_SCROLL_MS
        }

        if (!isHoveredRef.current && time > userInteractingUntil) {
          position += AUTO_SCROLL_PX_PER_SECOND * deltaSeconds
        }

        if (position < oneCopyWidth * 0.5) {
          position += oneCopyWidth
        } else if (position > oneCopyWidth * (COPIES - 0.5)) {
          position -= oneCopyWidth
        }

        lastWrittenWhole = Math.floor(position)
        outer.scrollLeft = lastWrittenWhole
        inner.style.transform = `translateX(${lastWrittenWhole - position}px)`
      }

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <div
      ref={outerRef}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') isHoveredRef.current = true
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') isHoveredRef.current = false
      }}
      className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        ref={innerRef}
        className="flex w-max gap-[14px] perspective-[1000px] transform-3d"
      >
        {Array.from({ length: COPIES }, (_, copy) =>
          reviews.map((review, i) => (
            <ReviewCard key={`${review.id}-${copy}-${i}`} review={review} />
          )),
        )}
      </div>
    </div>
  )
}
