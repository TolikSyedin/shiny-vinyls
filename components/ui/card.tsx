import Link from 'next/link'
import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

export function Card({
  href,
  flat = false,
  children,
  className,
}: {
  href?: string
  flat?: boolean
  children: ReactNode
  className?: string
}) {
  const classes = cx(
    'flex flex-col gap-4 rounded-[0.3rem] border border-[var(--rule)] p-4 text-[var(--ink)] no-underline',
    flat ? 'bg-transparent' : 'bg-[var(--surface-2)]',
    className,
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return <div className={classes}>{children}</div>
}
