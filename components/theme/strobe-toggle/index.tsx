'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { StrobeAssembly } from './assembly'
import { playClick, preloadClickAudio, primeClickAudio } from './click-sound'
import './strobe-toggle.css'

export function StrobeToggle() {
  // Which layer is opaque is decided by the `.dark` ancestor selector in
  // CSS, not by this value — next-themes sets that class synchronously
  // before first paint, so CSS never needs to wait for hydration the way
  // `resolvedTheme` does. `isDark` only drives a11y attributes and which
  // theme a click switches to; `suppressHydrationWarning` on the button
  // covers the brief server/client mismatch on those.
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
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
