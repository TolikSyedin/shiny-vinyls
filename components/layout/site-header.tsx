import Link from 'next/link'
import { ChainToggle } from '@/components/theme'

export function SiteHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-border bg-background p-4"
      style={{ clipPath: 'inset(0 0 -100vh 0)' }}
    >
      <nav className="flex gap-4">
        <Link href="/">Головна</Link>
        <Link href="/contacts">Контакти</Link>
        <Link href="/request">Заявка</Link>
        <Link href="/reviews">Відгуки</Link>
      </nav>
      <ChainToggle />
    </header>
  )
}
