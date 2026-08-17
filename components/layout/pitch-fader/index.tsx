'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { CENTER_LED_THRESHOLD, MAJOR_STEP, MAX, MIN, TICKS } from './constants'
import { PitchFaderThumb } from './thumb'
import './pitch-fader.css'

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

// Layout effects don't run during SSR (and React warns if you ask), hence
// the fallback.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function PitchFader() {
  const [fraction, setFraction] = useState(0)
  const [canScroll, setCanScroll] = useState(false)

  // Throttled to one measurement per animation frame so raw scroll events
  // don't trigger layout work on every pixel. A layout effect (not a plain
  // effect) so `canScroll`/`fraction` land before the first paint, avoiding
  // a flash of the band's resting state.
  useIsomorphicLayoutEffect(() => {
    let rafId = 0

    function measure() {
      rafId = 0
      const scrollHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const scrollable = scrollHeight > viewportHeight
      setCanScroll(scrollable)
      if (!scrollable) return
      setFraction(clamp01(window.scrollY / (scrollHeight - viewportHeight)))
    }

    function onScrollOrResize() {
      if (rafId) return
      rafId = requestAnimationFrame(measure)
    }

    measure()
    // `document`, not `window`: the root layout sets `overflow-x: hidden` on
    // <html>, which makes the element its own scroll container. Scroll events
    // don't bubble, so they're dispatched to `document` and never reach
    // `window` — a window listener here silently never fires.
    document.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      document.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [])

  const isCentered = Math.abs(fraction - 0.5) <= CENTER_LED_THRESHOLD

  return (
    <div
      aria-hidden="true"
      className="pitch-fader"
      style={{ visibility: canScroll ? 'visible' : 'hidden' }}
    >
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
