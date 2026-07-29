import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border p-4">
      <nav className="flex gap-4">
        <Link href="/">Головна</Link>
        <Link href="/contacts">Контакти</Link>
        <Link href="/request">Заявка</Link>
      </nav>
      <ThemeToggle />
    </header>
  )
}
