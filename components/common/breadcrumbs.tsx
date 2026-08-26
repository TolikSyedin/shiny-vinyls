import Link from 'next/link'
import { EYEBROW_CLASS, Eyebrow } from '@/components/ui'
import { cx } from '@/lib/utils/cx'

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[]
  className?: string
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cx('flex flex-wrap items-center gap-2', className)}
    >
      {items.map(({ label, href }) =>
        href ? (
          <Link
            key={label}
            href={href}
            className={cx(EYEBROW_CLASS, 'hover:text-[var(--stamp)]')}
          >
            {label}
          </Link>
        ) : (
          <Eyebrow key={label} className="text-[var(--ink)]">
            / {label}
          </Eyebrow>
        ),
      )}
    </nav>
  )
}
