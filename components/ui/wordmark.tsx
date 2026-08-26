import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

export function Wordmark({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <span className={cx('wordmark', className)}>{children}</span>
}
