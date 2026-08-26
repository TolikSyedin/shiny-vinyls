import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

export function Lead({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <p className={cx('max-w-[52ch]', className)}>{children}</p>
}
