'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { BrandLink } from '@/components/brand'
import { StrobeToggle } from '@/components/theme'
import { CtaLink } from '@/components/ui'
import { MobileNav } from './mobile-nav'
import { PitchFader } from './pitch-fader'
import { SiteNav } from './site-nav'

export function SiteHeader() {
  const pathname = usePathname()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    const target =
      document.getElementById('main-content') ?? document.querySelector('main')
    if (target instanceof HTMLElement) {
      target.focus({ preventScroll: true })
    }
  }, [pathname])

  return (
    <header className="sticky top-0 z-30">
      <div className="relative flex items-center justify-between border-b border-[var(--rule)] bg-[var(--surface)] p-4">
        <BrandLink />
        <SiteNav />
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <CtaLink href="/request" size="sm">
              Замовлення
            </CtaLink>
          </div>
          <StrobeToggle />
          <MobileNav />
        </div>
      </div>
      <PitchFader />
    </header>
  )
}
