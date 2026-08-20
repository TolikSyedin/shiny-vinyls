import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

export function Row({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx('flex flex-wrap items-center gap-[14px]', className)}>
      {children}
    </div>
  )
}
