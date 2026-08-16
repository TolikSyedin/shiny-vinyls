'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CENTER_LED_THRESHOLD, MAJOR_STEP, MAX, MIN, TICKS } from './constants'
import { PitchFaderThumb } from './thumb'
import './pitch-fader.css'

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

// The spacer below stands in for two elements that `fixed` took out of flow,
// and its height comes from a measurement — so the measurement has to land
// before the browser paints, or the page renders once with a 0px spacer and
// visibly drops when the real height arrives. Layout effects don't run during
// SSR (and React warns if you ask), hence the fallback.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function PitchFader() {
  const bandRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [bandHeight, setBandHeight] = useState(0)
  const [fraction, setFraction] = useState(0)
  const [canScroll, setCanScroll] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const header = document.querySelector('header')
    const band = bandRef.current
    if (!header || !band) return

    function measure() {
      setHeaderHeight(header!.getBoundingClientRect().height)
      setBandHeight(band!.getBoundingClientRect().height)
    }
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(header)
    observer.observe(band)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Throttled to one measurement per animation frame so raw scroll events
  // don't trigger layout work on every pixel. A layout effect for the same
  // reason as above: `canScroll` decides whether the spacer reserves the
  // band's height.
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
    <>
      <div style={{ height: headerHeight + (canScroll ? bandHeight : 0) }} />

      <div
        ref={bandRef}
        aria-hidden="true"
        className="pitch-fader"
        style={{
          top: headerHeight,
          visibility: canScroll ? 'visible' : 'hidden',
        }}
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
                {isMajor && (
                  <span className="pitch-fader__num">
                    {value > 0 ? `+${value}` : value}
                  </span>
                )}
                <span className="pitch-fader__mark" />
              </div>
            )
          })}
        </div>

        <div className="pitch-fader__led-row">
          <div
            className={`pitch-fader__led ${isCentered ? 'pitch-fader__led--on' : ''}`}
          />
        </div>
      </div>
    </>
  )
}
