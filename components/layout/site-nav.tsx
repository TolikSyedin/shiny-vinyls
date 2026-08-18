'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from './data/nav-links'
import './site-nav.css'

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav className="nav hidden items-center gap-4 md:flex">
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? 'page' : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
