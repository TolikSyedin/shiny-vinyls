import { BrandLink } from '@/components/brand'
import { StrobeToggle } from '@/components/theme'
import { CtaLink } from '@/components/ui'
import { MobileNav } from './mobile-nav'
import { PitchFader } from './pitch-fader'
import { SiteNav } from './site-nav'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30">
      <div className="relative flex items-center justify-between border-b border-border bg-background p-4">
        <BrandLink />
        <SiteNav />
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <CtaLink href="/request" size="sm">
              Заявка
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
