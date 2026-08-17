'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { StrobeAssembly } from './assembly'
import { playClick, preloadClickAudio, primeClickAudio } from './click-sound'

// mounted-detection only: the value never changes after hydration, so
// there is nothing to subscribe to
function subscribeToNothing() {
  return () => {}
}

export function StrobeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // The server can't know the resolved theme, so both sides render neutral
  // markup — but unlike the old chain toggle there's no single "default"
  // assembly that reads fine in either theme (light is silver-and-lit, dark
  // is matte-black-and-off), so the neutral state here is neither layer
  // rendered at all rather than a guess that flashes wrong half the time.
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  )
  const isDark = mounted && resolvedTheme === 'dark'
  const [anim, setAnim] = useState<'close' | 'open' | null>(null)
  const animatingRef = useRef(false)

  useEffect(() => {
    // constructs the <audio> element and lets it start decoding well ahead
    // of the first click, instead of racing that click's own play() call
    preloadClickAudio()
  }, [])

  useEffect(() => {
    // any tap on the page is a chance to get the clip primed for playback —
    // mobile browsers only unlock <audio> from a genuine gesture, and this
    // toggle's own button is a plain click with no gesture to prime on
    // ahead of time the way the old chain-drag's touchstart did
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

  function handleClick() {
    if (animatingRef.current) return
    playClick()
    const next = isDark ? 'light' : 'dark'

    // reduced motion never plays the keyframe, so animationend would never
    // fire and the lock below would never release — skip it entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(next)
      return
    }

    animatingRef.current = true
    setAnim(next === 'dark' ? 'close' : 'open')
    setTheme(next)
  }

  // both SVG layers carry a .strobe-toggle__moving group and both play the
  // keyframe while crossfading, so this fires twice per click — harmless,
  // clearing the same state twice is a no-op
  function handleAnimationEnd() {
    animatingRef.current = false
    setAnim(null)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
      aria-pressed={isDark}
      suppressHydrationWarning
      className="relative flex size-16 shrink-0 items-center justify-center"
    >
      <span
        aria-hidden="true"
        onAnimationEnd={handleAnimationEnd}
        className={[
          'strobe-toggle',
          mounted ? (isDark ? 'strobe-toggle--dark' : 'strobe-toggle--light') : '',
          anim === 'close' ? 'strobe-toggle--anim-close' : '',
          anim === 'open' ? 'strobe-toggle--anim-open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <StrobeAssembly
          variant="light"
          className="strobe-toggle__layer strobe-toggle__layer-light"
        />
        <StrobeAssembly
          variant="dark"
          className="strobe-toggle__layer strobe-toggle__layer-dark"
        />
      </span>
    </button>
  )
}
