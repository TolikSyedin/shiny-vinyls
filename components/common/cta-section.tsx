import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

export function CtaSection({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx('flex flex-wrap items-center gap-4 mt-8', className)}>
      {children}
    </div>
  )
}
