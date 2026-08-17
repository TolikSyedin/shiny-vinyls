import Link from 'next/link'
import { BrandLink } from '@/components/brand'
import { ChainToggle } from '@/components/theme'

export function SiteHeader() {
  return (
    <header
      className="relative flex items-center justify-between border-b border-border p-4"
      style={{ clipPath: 'inset(0 0 -100vh 0)' }}
    >
      <BrandLink />
      <nav className="flex gap-4">
        <Link href="/contacts">Контакти</Link>
        <Link href="/request">Заявка</Link>
        <Link href="/reviews">Відгуки</Link>
      </nav>
      <ChainToggle />
    </header>
  )
}
