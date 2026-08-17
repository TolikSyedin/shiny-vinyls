import Link from 'next/link'
import { BrandLink } from '@/components/brand'
import { StrobeToggle } from '@/components/theme'
import { PitchFader } from './pitch-fader'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30">
      <div className="flex items-center justify-between border-b border-border bg-background p-4">
        <BrandLink />
        <nav className="flex gap-4">
          <Link href="/contacts">Контакти</Link>
          <Link href="/request">Заявка</Link>
          <Link href="/reviews">Відгуки</Link>
        </nav>
        <StrobeToggle />
      </div>
      <PitchFader />
    </header>
  )
}
