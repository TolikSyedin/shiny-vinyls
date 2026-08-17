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
  // No assembly reads fine in both themes, so the neutral pre-hydration
  // state renders neither layer rather than guessing wrong half the time.
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
    // primes on the first tap anywhere — mobile only unlocks <audio> from a
    // genuine gesture, and there's no earlier one to prime on
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
