'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useState } from 'react'
import {
  CENTER_LED_THRESHOLD,
  MAJOR_STEP,
  MAX,
  MIN,
  TICKS,
} from '../data/pitch-fader/constants'
import { PitchFaderThumb } from './thumb'
import './pitch-fader.css'

// How far down the page has been scrolled, 0..1. 0 both at the very top and
// on a page that can't scroll at all — same resting position either way.
// Clamped because the raw division can drift a hair past 0/1 from
// sub-pixel rounding (non-100% zoom, fractional scrollY at the very end).
function computeScrollFraction() {
  const scrollHeight = document.documentElement.scrollHeight
  const viewportHeight = window.innerHeight
  const scrollable = scrollHeight > viewportHeight
  if (!scrollable) return 0
  const raw = window.scrollY / (scrollHeight - viewportHeight)
  return Math.min(1, Math.max(0, raw))
}

// Collapses a burst of calls (raw scroll/resize events) into at most one
// per animation frame.
function rafThrottle(fn: () => void) {
  let rafId = 0
  function throttled() {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      rafId = 0
      fn()
    })
  }
  throttled.cancel = () => {
    if (rafId) cancelAnimationFrame(rafId)
  }
  return throttled
}

// Layout effects don't run during SSR (and React warns if you ask), hence
// the fallback.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function PitchFader() {
  // This component lives in the root layout and never unmounts across
  // client-side navigation, so without `pathname` as a dependency below,
  // the thumb would keep showing the previous page's scroll position until
  // the next scroll/resize on the new page.
  const pathname = usePathname()
  const [fraction, setFraction] = useState(0)

  // Throttled to one measurement per animation frame so raw scroll events
  // don't trigger layout work on every pixel. A layout effect (not a plain
  // effect) so `fraction` lands before the first paint, avoiding a flash of
  // the band's resting state. When the page can't scroll, fraction sits at
  // 0 — same as a real pitch fader left untouched at rest.
  useIsomorphicLayoutEffect(() => {
    const measure = rafThrottle(() => setFraction(computeScrollFraction()))

    setFraction(computeScrollFraction())
    // `document`, not `window`: the root layout sets `overflow-x: hidden` on
    // <html>, which makes the element its own scroll container. Scroll events
    // don't bubble, so they're dispatched to `document` and never reach
    // `window` — a window listener here silently never fires.
    document.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      measure.cancel()
      document.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [pathname])

  const isCentered = Math.abs(fraction - 0.5) <= CENTER_LED_THRESHOLD

  return (
    <div aria-hidden="true" className="pitch-fader">
      <div className="pitch-fader__frame">
        <div className="pitch-fader__groove">
          <div className="pitch-fader__slot" />
        </div>

        <div className="pitch-fader__travel">
          <div
            className="pitch-fader__trail"
            style={{ width: `${fraction * 100}%` }}
          />
          <div
            className="pitch-fader__thumb"
            style={{ left: `${fraction * 100}%` }}
          >
            <PitchFaderThumb />
          </div>
        </div>
      </div>

      <div className="pitch-fader__ticks">
        {TICKS.map((value) => {
          const isMajor = value % MAJOR_STEP === 0
          return (
            <div
              key={value}
              className={`pitch-fader__tick pitch-fader__tick--${isMajor ? 'major' : 'minor'}`}
              style={{ left: `${((value - MIN) / (MAX - MIN)) * 100}%` }}
            >
              {isMajor && value === 0 && (
                <div
                  className={`pitch-fader__led ${isCentered ? 'pitch-fader__led--on' : ''}`}
                />
              )}
              {isMajor && value !== 0 && (
                <span className="pitch-fader__num">
                  {value > 0 ? `+${value}` : value}
                </span>
              )}
              <span className="pitch-fader__mark" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
