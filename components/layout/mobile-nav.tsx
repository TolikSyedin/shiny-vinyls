'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { CloseIcon, MenuIcon } from '@/components/icons'
import { NAV_LINKS } from '@/lib/data/layout/nav-links/constants'
import './mobile-nav.css'

export function MobileNav() {
  const pathname = usePathname()
  // Keying on pathname remounts the panel (resetting `open` to false) on
  // every navigation — the panel isn't otherwise unmounted by routing, so
  // a back/forward nav would leave it stuck open over the new page.
  return <MobileNavPanel key={pathname} pathname={pathname} />
}

function MobileNavPanel({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
        className="relative z-50 flex size-10 items-center justify-center"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div id="mobile-nav-panel" className="mobile-nav-panel">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/request"
            aria-current={pathname === '/request' ? 'page' : undefined}
          >
            Замовлення
          </Link>
        </div>
      )}
    </div>
  )
}
