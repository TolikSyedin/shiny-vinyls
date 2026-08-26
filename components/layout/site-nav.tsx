'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/data/layout/nav-links/constants'
import './site-nav.css'

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav className="nav hidden items-center gap-4 md:flex">
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="eyebrow"
          aria-current={pathname === href ? 'page' : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
