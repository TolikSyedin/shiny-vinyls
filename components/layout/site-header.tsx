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
  const brandRef = useRef<HTMLAnchorElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
    brandRef.current?.focus()
  }, [pathname])

  return (
    <header className="sticky top-0 z-30">
      <div className="relative flex items-center justify-between border-b border-border bg-background p-4">
        <BrandLink ref={brandRef} />
        <SiteNav />
        <div className="flex items-center gap-4">
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
