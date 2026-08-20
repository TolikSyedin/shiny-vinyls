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
    'flex flex-col gap-[0.5rem] rounded-[0.3rem] border border-[var(--rule)] p-[clamp(1rem,2.5vw,1.5rem)] text-[var(--ink)] no-underline',
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
